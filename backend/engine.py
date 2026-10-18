"""Game engine: state machine, timer, puzzle validation and hints.

Independent from FastAPI and MQTT so it can be unit tested: the API, the MQTT client
and the USB watcher call these methods, then broadcast full_state().

TODO:
- modules 1 (Xbox controller sequence) and 3 (USB keys + coded message)
- message fragments and password clues revealed when a module is repaired
- save the game in the database (current_game) to survive a backend restart
"""

import time
from enum import Enum
from typing import Callable

import config

Clock = Callable[[], float]


class Phase(str, Enum):
    HOME = "home"
    MODULE_1 = "module_1"  # controls: color sequence on the Xbox controller
    MODULE_2 = "module_2"  # sensors: right weight on the scale (ESP32)
    MODULE_3 = "module_3"  # data: USB keys + coded message
    MODULE_4 = "module_4"  # system: component cards + final password
    CHOICE = "choice"
    END_FREE = "end_free"
    END_CLOSED = "end_closed"
    END_DEFEAT = "end_defeat"
    HOPPER = "hopper"


MODULES = (Phase.MODULE_1, Phase.MODULE_2, Phase.MODULE_3, Phase.MODULE_4)
ENDINGS = (Phase.END_FREE, Phase.END_CLOSED, Phase.END_DEFEAT)


class InvalidTransition(Exception):
    pass


class NoAnswersLeft(Exception):
    pass


class Timer:
    """The timer is an end time (ends_at), not a counter."""

    def __init__(self, duration: float, clock: Clock) -> None:
        self.duration = duration
        self.clock = clock
        self.ends_at: float | None = None
        self.frozen: float | None = None

    def start(self) -> None:
        self.ends_at = self.clock() + self.duration
        self.frozen = None

    def stop(self) -> None:
        self.frozen = self.remaining()
        self.ends_at = None

    def remaining(self) -> float:
        if self.frozen is not None:
            return self.frozen
        if self.ends_at is None:
            return self.duration
        return max(0.0, self.ends_at - self.clock())

    def expired(self) -> bool:
        return self.ends_at is not None and self.clock() >= self.ends_at


class WeightValidator:
    """Module 2: the weight must stay within tolerance and stable for a minimum time."""

    def __init__(self, target: float, tolerance: float, stable_seconds: float) -> None:
        self.target = target
        self.tolerance = tolerance
        self.stable_seconds = stable_seconds
        self.correct_since: float | None = None

    def measure(self, grams: float, stable: bool, now: float) -> bool:
        if not stable or abs(grams - self.target) > self.tolerance:
            self.correct_since = None
            return False
        if self.correct_since is None:
            self.correct_since = now
        return now - self.correct_since >= self.stable_seconds


class Hints:
    """Per module: light hint (1), precise hint (2), then the answer (3), limited per game."""

    def __init__(self, texts: dict[int, list[str]], max_answers: int) -> None:
        self.texts = texts
        self.max_answers = max_answers
        self.reset()

    def reset(self) -> None:
        self.levels: dict[int, int] = {}
        self.answers_used = 0

    def answers_left(self) -> int:
        return self.max_answers - self.answers_used

    def next(self, module: int) -> dict:
        current = self.levels.get(module, 0)
        level = min(current + 1, 3)
        if level == 3 and current < 3:
            if self.answers_left() == 0:
                raise NoAnswersLeft
            self.answers_used += 1
        self.levels[module] = level
        return {
            "level": level,
            "text": self.texts[module][level - 1],
            "answers_left": self.answers_left(),
        }


def check_password(value: str, password: str = config.PASSWORD) -> bool:
    """Module 4: ignores case and spaces."""
    return "".join(value.split()).upper() == password.upper()


class GameEngine:
    def __init__(
        self,
        active_modules: tuple[str, ...] = config.ACTIVE_MODULES,
        clock: Clock = time.time,
    ) -> None:
        self.active_modules = tuple(Phase(m) for m in active_modules)
        self.clock = clock
        self.hints = Hints(config.HINT_TEXTS, config.MAX_ANSWERS)
        self.reset()

    def reset(self) -> None:
        self.phase = Phase.HOME
        self.repaired: list[Phase] = []
        self.timer = Timer(config.TIMER_SECONDS, self.clock)
        self.hints.reset()
        self.weight = WeightValidator(
            config.TARGET_WEIGHT_G, config.WEIGHT_TOLERANCE_G, config.STABLE_SECONDS
        )

    def _require(self, *phases: Phase) -> None:
        if self.phase not in phases:
            raise InvalidTransition(f"not allowed in phase {self.phase.value}")

    def start(self) -> None:
        self._require(Phase.HOME)
        self.timer.start()
        self.phase = self.active_modules[0]

    def repair_current_module(self) -> None:
        self._require(*MODULES)
        self.repaired.append(self.phase)
        index = self.active_modules.index(self.phase)
        if index + 1 < len(self.active_modules):
            self.phase = self.active_modules[index + 1]
        else:
            # Last module repaired: the forced update is stopped
            self.timer.stop()
            self.phase = Phase.CHOICE

    def check_time(self) -> bool:
        """Called every second: switches to defeat when the timer has expired."""
        if self.phase in MODULES and self.timer.expired():
            self.phase = Phase.END_DEFEAT
            return True
        return False

    def on_weight(self, grams: float, stable: bool) -> bool:
        """Scale measurement (from MQTT). Returns True when module 2 has just been repaired."""
        if self.check_time() or self.phase != Phase.MODULE_2:
            return False
        if self.weight.measure(grams, stable, self.clock()):
            self.repair_current_module()
            return True
        return False

    def on_password(self, value: str) -> bool:
        self._require(Phase.MODULE_4)
        if check_password(value):
            self.repair_current_module()
            return True
        return False

    def ask_hint(self) -> dict:
        self._require(*MODULES)
        return self.hints.next(MODULES.index(self.phase) + 1)

    def choose(self, accept: bool) -> None:
        self._require(Phase.CHOICE)
        self.phase = Phase.END_CLOSED if accept else Phase.END_FREE

    def go_to_hopper(self) -> None:
        self._require(*ENDINGS)
        self.phase = Phase.HOPPER

    def full_state(self) -> dict:
        """State sent to the frontend (REST and WebSocket)."""
        modules = {}
        for i, module in enumerate(MODULES, start=1):
            if module in self.repaired:
                modules[str(i)] = "repaired"
            elif module == self.phase:
                modules[str(i)] = "active"
            else:
                modules[str(i)] = "locked"
        return {
            "phase": self.phase.value,
            "remaining_s": round(self.timer.remaining(), 1),
            "modules": modules,
            "answers_left": self.hints.answers_left(),
        }
