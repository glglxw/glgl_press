@echo off
title GLGL Press
:: --------------------------------------------------------------------------
:: Launcher Script
:: --------------------------------------------------------------------------
pushd "%~dp0"

:: 1. Check for Node.js executable
if not exist "node\node.exe" (
    echo.
    echo [ERROR] node\node.exe not found!
    echo Please make sure you unzipped the entire package properly.
    echo.
    pause
    exit /b 1
)

:: 2. Check for start.js script
if not exist "start.js" (
    echo.
    echo [ERROR] start.js not found!
    echo Please ensure all files including start.js are present in the folder.
    echo.
    pause
    exit /b 1
)

:: 3. Run the main Node.js script using absolute path
"node\node.exe" "%~dp0start.js"

:: 4. Error Handling
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Application exited with error code %errorlevel%
    pause
)
