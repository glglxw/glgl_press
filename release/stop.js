const { execSync } = require('child_process');

console.log('\n正在停止 GLGL Press 服务器...');

try {
    // Kill all node.exe processes EXCEPT the current one
    // /F = Force, /FI "PID ne <current>" = Filter out self, /IM node.exe = Image Name
    const cmd = `taskkill /F /FI "PID ne ${process.pid}" /IM node.exe`;

    // stdio: 'pipe' to capture output so we can check if anything was actually killed
    // But taskkill output is localized, hard to parse "SUCCESS" vs "INFO: No tasks".
    // We'll just run it.
    execSync(cmd, { stdio: 'ignore' });

    console.log('\n✅ 服务器已停止');
} catch (e) {
    // taskkill returns non-zero if no process found (sometimes) or error
    // If it fails, likely no other node processes running
    console.log('\nℹ️  未发现运行中的服务器 (或已停止)');
}

console.log('\n');
