@echo off
rem Cyberdeck launcher: double-click to start Mosquitto, backend, frontend and the Arduino simulator
setlocal
cd /d "%~dp0"
title Cyberdeck - launcher

where python >nul 2>&1 || (echo [x] Python not found. Install it from https://www.python.org & pause & exit /b 1)
where npm >nul 2>&1 || (echo [x] Node.js not found. Install it from https://nodejs.org & pause & exit /b 1)

echo [1/5] Backend dependencies...
python -c "import fastapi, uvicorn, paho.mqtt" >nul 2>&1 || python -m pip install -r backend\requirements.txt || (pause & exit /b 1)

echo [2/5] Frontend dependencies...
if not exist frontend\node_modules (
    pushd frontend
    call npm install || (popd & pause & exit /b 1)
    popd
)

rem Mosquitto must be up before the backend, otherwise the backend does not connect to MQTT
echo [3/5] Mosquitto...
set "SIMULATOR=1"
set "MOSQUITTO=%ProgramFiles%\mosquitto\mosquitto.exe"
netstat -an | find ":1883 " | find "LISTENING" >nul
if errorlevel 1 (
    if exist "%MOSQUITTO%" (
        start "Mosquitto" "%MOSQUITTO%" -v
        timeout /t 2 /nobreak >nul
    ) else (
        echo     Mosquitto is not installed: the game runs without the simulator.
        echo     To install it: winget install EclipseFoundation.Mosquitto
        set "SIMULATOR=0"
    )
)

echo [4/5] Backend and frontend...
start "Backend (FastAPI)" /d "%~dp0backend" cmd /k python -m uvicorn main:app --port 8000
start "Frontend (Vite)" /d "%~dp0frontend" cmd /k npm run dev -- --port 5173 --strictPort

echo [5/5] Arduino simulator...
if "%SIMULATOR%"=="1" start "Arduino simulator" /d "%~dp0backend" cmd /k "chcp 65001 >nul & python simulator.py"

timeout /t 5 /nobreak >nul
start "" http://localhost:5173

echo.
echo Cyberdeck is running: http://localhost:5173  (API: http://localhost:8000/docs)
echo Close the windows to stop it.
timeout /t 5 >nul
