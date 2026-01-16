const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');

// Configuration
const PORT = 3000;
const NODE_EXE = path.join(__dirname, 'node', 'node.exe');
const SERVER_SCRIPT = path.join(__dirname, '.output', 'server', 'index.mjs');
const ENV_FILE = path.join(__dirname, '.env');

// Helper for logging with borders
function logBox(lines) {
    const width = 60;
    console.log('\n' + '+'.padEnd(width + 1, '=') + '+');
    lines.forEach(line => {
        // Simple padding calculation (assuming mostly ASCII/single-width for spacing, but Chinese is wide)
        // For simplicity in mixed envs, we just tab/space manually or let it be left-aligned.
        // We'll just print cleaner lines without a right border to avoid alignment issues with Chinese.
        console.log('|  ' + line);
    });
    console.log('+'.padEnd(width + 1, '=') + '+' + '\n');
}

// 1. Check .env
if (!fs.existsSync(ENV_FILE)) {
    console.error('\n[错误] 未找到配置文件 .env');
    console.log('请按以下步骤操作：');
    console.log('  1. 复制 .env.example 为 .env');
    console.log('  2. 编辑 .env 文件，填入您的 API Key');
    console.log('\n详细说明请参阅「使用说明.html」\n');
    process.exit(1);
}

// 2. Check Node.js (Self-check essentially, but good validation)
if (!fs.existsSync(NODE_EXE)) {
    console.error('\n[错误] 未找到 Node.js 运行环境');
    console.error(`请确保 ${NODE_EXE} 文件存在`);
    process.exit(1);
}

// 3. Check Port 3000
try {
    // Windows specific port check using netstat
    const stdout = execSync('netstat -ano').toString();
    const portRegex = new RegExp(`:${PORT}\\s+.*LISTENING`);
    if (portRegex.test(stdout)) {
        console.warn(`\n[警告] 端口 ${PORT} 已被占用`);
        console.warn('可能应用已在运行，或者其他程序占用了该端口');
        console.log('请先运行「停止.bat」或关闭占用端口的程序\n');
        process.exit(1);
    }
} catch (e) {
    // Ignore error if netstat fails, proceed cautiously
}

console.log('[启动] 正在启动服务器...\n');

const envVars = {};
if (fs.existsSync(ENV_FILE)) {
    try {
        const envContent = fs.readFileSync(ENV_FILE, 'utf8');
        envContent.split('\n').forEach(line => {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                const parts = trimmed.split('=');
                if (parts.length >= 2) {
                    const key = parts[0].trim();
                    const val = parts.slice(1).join('=').trim();
                    envVars[key] = val;
                }
            }
        });
        console.log('[启动] 已加载 .env 配置');
    } catch (e) {
        console.warn('[警告] 读取 .env 文件失败:', e.message);
    }
}

// 4. Set Env & Start Server
const env = {
    ...process.env,
    ...envVars,
    NODE_ENV: 'production',
    HOST: 'localhost',
    PORT: PORT.toString()
};

const server = spawn(NODE_EXE, [SERVER_SCRIPT], {
    env: env,
    cwd: __dirname,
    stdio: 'inherit' // Pipe output to console
});

// 5. Wait and Open Browser (Optimistic)
setTimeout(() => {
    // Check if server is still alive
    if (server.exitCode !== null) {
        console.error('\n[错误] 服务器启动失败');
        process.exit(1);
    }

    logBox([
        '✅ 服务器已启动！',
        '',
        '浏览器将自动打开，如未打开请手动访问：',
        `👉 http://localhost:${PORT}`,
        '',
        '关闭此窗口将停止服务器'
    ]);

    // Open URL
    require('child_process').exec(`start http://localhost:${PORT}`);

    console.log('按任意键停止服务器...');
}, 3000);


// 6. Handle Shutdown
// Helper to read a single key press
const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) process.stdin.setRawMode(true);

process.stdin.on('keypress', (str, key) => {
    if (key.ctrl && key.name === 'c') {
        cleanup();
    } else {
        cleanup();
    }
});

function cleanup() {
    console.log('\n正在停止服务器...');
    server.kill();
    // Also try to kill any orphaned node processes just in case
    try {
        execSync('taskkill /f /im node.exe', { stdio: 'ignore' });
    } catch (e) { }
    console.log('服务器已停止');
    process.exit(0);
}

// Prevent immediate exit
setInterval(() => { }, 1000);
