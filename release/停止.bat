@echo off
chcp 65001 >nul
title 停止 GLGL Press

echo.
echo 正在停止 GLGL Press 服务器...
echo.

:: 查找并终止 node 进程
tasklist | findstr /i "node.exe" >nul
if %errorlevel%==0 (
    taskkill /f /im node.exe >nul 2>&1
    echo ✅ 服务器已停止
) else (
    echo ℹ️ 未发现运行中的服务器
)

echo.
pause
