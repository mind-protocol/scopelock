#!/bin/bash
set -e

echo "📦 Installing Claude CLI to project directory..."
# Install to project-local bin directory that persists to runtime
mkdir -p ./bin
export CLAUDE_INSTALL_DIR="$PWD/bin"
curl -fsSL https://claude.ai/install.sh | bash -s -- --install-dir "$PWD/bin"

# Verify installation
if [ -f "./bin/claude" ]; then
    echo "✅ Claude CLI installed successfully to ./bin/claude"
    chmod +x ./bin/claude
else
    echo "❌ Claude CLI installation failed"
    exit 1
fi

echo "📦 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "✅ Build complete"
