import pytest

from engine import GameEngine, InvalidTransition, NoAnswersLeft, Phase, check_password


class FakeClock:
    def __init__(self) -> None:
        self.now = 1000.0

    def __call__(self) -> float:
        return self.now


@pytest.fixture
def clock():
    return FakeClock()


@pytest.fixture
def game(clock):
    g = GameEngine(active_modules=("module_2",), clock=clock)
    g.start()
    return g


def hold_weight(game, clock, grams, seconds, stable=True):
    repaired = False
    for _ in range(int(seconds * 5) + 1):
        repaired = game.on_weight(grams, stable) or repaired
        clock.now += 0.2
    return repaired


def test_game_starts_at_home_then_first_active_module(clock):
    g = GameEngine(active_modules=("module_2",), clock=clock)
    assert g.phase == Phase.HOME
    g.start()
    assert g.phase == Phase.MODULE_2


def test_cannot_start_twice(game):
    with pytest.raises(InvalidTransition):
        game.start()


def test_right_weight_held_long_enough_repairs_module_2(game, clock):
    assert hold_weight(game, clock, 12.4, 2.0)
    assert game.phase == Phase.CHOICE
    assert game.full_state()["modules"]["2"] == "repaired"


def test_right_weight_too_briefly_does_not_repair(game, clock):
    assert not hold_weight(game, clock, 12.0, 1.0)
    assert game.phase == Phase.MODULE_2


def test_wrong_or_unstable_weight_does_not_repair(game, clock):
    assert not hold_weight(game, clock, 15.0, 3.0)
    assert not hold_weight(game, clock, 12.0, 3.0, stable=False)


def test_leaving_the_target_resets_the_stability_window(game, clock):
    hold_weight(game, clock, 12.0, 1.5)
    game.on_weight(20.0, True)
    assert not hold_weight(game, clock, 12.0, 1.0)


def test_timer_expiry_means_defeat(game, clock):
    clock.now += 20 * 60
    assert game.check_time()
    assert game.phase == Phase.END_DEFEAT


def test_weight_ignored_after_defeat(game, clock):
    clock.now += 20 * 60
    assert not hold_weight(game, clock, 12.0, 3.0)
    assert game.phase == Phase.END_DEFEAT


def test_timer_stops_when_last_module_is_repaired(game, clock):
    hold_weight(game, clock, 12.0, 2.0)
    remaining = game.timer.remaining()
    clock.now += 60 * 60
    assert game.timer.remaining() == remaining
    assert not game.check_time()


def test_modules_follow_the_fixed_order(clock):
    g = GameEngine(active_modules=("module_2", "module_4"), clock=clock)
    g.start()
    hold_weight(g, clock, 12.0, 2.0)
    assert g.phase == Phase.MODULE_4
    assert not g.on_password("GRACE")
    assert g.on_password(" hopper ")
    assert g.phase == Phase.CHOICE


def test_ethical_choice_and_hopper_screen(game, clock):
    hold_weight(game, clock, 12.0, 2.0)
    game.choose(accept=False)
    assert game.phase == Phase.END_FREE
    game.go_to_hopper()
    assert game.phase == Phase.HOPPER


def test_accepting_the_update_closes_the_deck(game, clock):
    hold_weight(game, clock, 12.0, 2.0)
    game.choose(accept=True)
    assert game.phase == Phase.END_CLOSED


def test_choice_not_allowed_during_a_module(game):
    with pytest.raises(InvalidTransition):
        game.choose(accept=False)


def test_hints_go_light_precise_answer(game):
    assert [game.ask_hint()["level"] for _ in range(4)] == [1, 2, 3, 3]
    assert game.hints.answers_left() == 1


def test_only_two_answers_per_game(clock):
    g = GameEngine(active_modules=("module_2", "module_4"), clock=clock)
    g.start()
    g.hints.next(1), g.hints.next(1), g.hints.next(1)
    g.hints.next(3), g.hints.next(3), g.hints.next(3)
    assert g.hints.answers_left() == 0
    g.ask_hint(), g.ask_hint()
    with pytest.raises(NoAnswersLeft):
        g.ask_hint()


def test_reset_goes_back_home(game, clock):
    game.ask_hint()
    hold_weight(game, clock, 12.0, 2.0)
    game.reset()
    assert game.phase == Phase.HOME
    assert game.full_state()["answers_left"] == 2
    assert game.full_state()["remaining_s"] == 20 * 60


def test_password_ignores_case_and_spaces():
    assert check_password("h o p p e r")
    assert not check_password("HOPPE")
