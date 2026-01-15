#!/bin/bash
# GLGL Press Windows Release 打包脚本
# 在 Linux/macOS 上运行，生成 Windows 发布包

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
RELEASE_DIR="$PROJECT_DIR/release"
BUILD_DIR="$PROJECT_DIR/dist/glgl_press_windows"
NODE_VERSION="24.13.0"
NODE_DOWNLOAD_URL="https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-win-x64.zip"

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║           GLGL Press Windows Release Builder                 ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# 检查依赖
check_dependencies() {
    echo "[1/5] 检查依赖..."
    
    if ! command -v npm &> /dev/null; then
        echo "❌ 错误: 未安装 npm"
        exit 1
    fi
    
    if ! command -v curl &> /dev/null && ! command -v wget &> /dev/null; then
        echo "❌ 错误: 需要 curl 或 wget"
        exit 1
    fi
    
    if ! command -v unzip &> /dev/null; then
        echo "❌ 错误: 未安装 unzip"
        exit 1
    fi
    
    echo "✅ 依赖检查通过"
}

# 构建 Nuxt 应用
build_nuxt() {
    echo ""
    echo "[2/5] 构建 Nuxt 应用..."
    cd "$PROJECT_DIR"
    npm run build
    echo "✅ 构建完成"
}

# 下载 Node.js Windows 版
download_node() {
    echo ""
    echo "[3/5] 下载 Node.js v${NODE_VERSION} Windows 版..."
    
    TEMP_DIR=$(mktemp -d)
    NODE_ZIP="$TEMP_DIR/node.zip"
    
    if command -v curl &> /dev/null; then
        curl -L -o "$NODE_ZIP" "$NODE_DOWNLOAD_URL"
    else
        wget -O "$NODE_ZIP" "$NODE_DOWNLOAD_URL"
    fi
    
    echo "解压 Node.js..."
    unzip -q "$NODE_ZIP" -d "$TEMP_DIR"
    
    # 仅保留 node.exe
    mkdir -p "$BUILD_DIR/node"
    cp "$TEMP_DIR/node-v${NODE_VERSION}-win-x64/node.exe" "$BUILD_DIR/node/"
    
    rm -rf "$TEMP_DIR"
    echo "✅ Node.js 下载完成"
}

# 组装发布包
assemble_package() {
    echo ""
    echo "[4/5] 组装发布包..."
    
    # 清理并创建目录
    rm -rf "$BUILD_DIR"
    mkdir -p "$BUILD_DIR"
    
    # 复制 Nuxt 构建产物
    cp -r "$PROJECT_DIR/.output" "$BUILD_DIR/"
    
    # 复制数据目录结构
    mkdir -p "$BUILD_DIR/server/data"
    # 不复制已有数据，生成纯净版
    # if [ -d "$PROJECT_DIR/server/data" ]; then
    #     cp -r "$PROJECT_DIR/server/data/"* "$BUILD_DIR/server/data/" 2>/dev/null || true
    # fi
    
    # 复制 release 文件
    cp "$RELEASE_DIR/启动.bat" "$BUILD_DIR/"
    cp "$RELEASE_DIR/停止.bat" "$BUILD_DIR/"
    cp "$RELEASE_DIR/.env.example" "$BUILD_DIR/"
    cp "$RELEASE_DIR/使用说明.html" "$BUILD_DIR/"
    
    echo "✅ 发布包组装完成"
}

# 创建 ZIP 压缩包
create_zip() {
    echo ""
    echo "[5/5] 创建压缩包..."
    
    cd "$PROJECT_DIR/dist"
    
    ZIP_NAME="glgl_press_windows_$(date +%Y%m%d).zip"
    rm -f "$ZIP_NAME"
    
    zip -r "$ZIP_NAME" "glgl_press_windows"
    
    echo ""
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║  ✅ 打包完成！                                               ║"
    echo "╠══════════════════════════════════════════════════════════════╣"
    echo "║  发布包: dist/$ZIP_NAME"
    echo "║  大小: $(du -h "$ZIP_NAME" | cut -f1)"
    echo "╚══════════════════════════════════════════════════════════════╝"
}

# 主流程
main() {
    check_dependencies
    build_nuxt
    assemble_package
    download_node
    create_zip
}

main "$@"
