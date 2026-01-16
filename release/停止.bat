@echo off
title GLGL Press - Stop
:: Wrapper to run the stop script
pushd "%~dp0"

if not exist "stop.js" (
    echo.
    echo [ERROR] stop.js not found!
    echo.
    pause
    exit /b 1
)

"node\node.exe" "%~dp0stop.js"

pause
