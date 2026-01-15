@echo off
chcp 65001 >nul
title GLGL Press - 三角时报生成器

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║           🔺 GLGL Press - 三角时报生成器                     ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

:: 检查 .env 文件
if not exist ".env" (
    echo [错误] 未找到配置文件 .env
    echo.
    echo 请按以下步骤操作：
    echo   1. 复制 .env.example 为 .env
    echo   2. 编辑 .env 文件，填入您的 API Key
    echo.
    echo 详细说明请参阅「使用说明.html」
    echo.
    pause
    exit /b 1
)

:: 检查 Node.js
if not exist "node\node.exe" (
    echo [错误] 未找到 Node.js 运行环境
    echo 请确保 node\node.exe 文件存在
    pause
    exit /b 1
)

:: 检查端口 3000 是否被占用
netstat -ano | findstr ":3000 " | findstr "LISTENING" >nul
if %errorlevel%==0 (
    echo [警告] 端口 3000 已被占用
    echo 可能应用已在运行，或者其他程序占用了该端口
    echo.
    echo 请先运行「停止.bat」或关闭占用端口的程序
    pause
    exit /b 1
)

echo [启动] 正在启动服务器...
echo.

:: 设置环境变量
set NODE_ENV=production
set HOST=localhost
set PORT=3000

:: 启动服务器（后台运行）
start /b "" "node\node.exe" ".output\server\index.mjs"

:: 等待服务器启动
echo 等待服务器启动中...
timeout /t 3 /nobreak >nul

:: 检查服务器是否启动成功
netstat -ano | findstr ":3000 " | findstr "LISTENING" >nul
if %errorlevel% neq 0 (
    echo [错误] 服务器启动失败
    echo 请检查错误信息或联系技术支持
    pause
    exit /b 1
)

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║  ✅ 服务器已启动！                                           ║
echo ║                                                              ║
echo ║  浏览器将自动打开，如未打开请手动访问：                       ║
echo ║  👉 http://localhost:3000                                    ║
echo ║                                                              ║
echo ║  关闭此窗口将停止服务器                                       ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

:: 自动打开浏览器
start "" "http://localhost:3000"

:: 保持窗口打开
echo 按任意键停止服务器...
pause >nul

:: 停止服务器
taskkill /f /im node.exe >nul 2>&1
echo 服务器已停止
