#!/bin/bash
set -e

echo "📦 Installing Claude CLI to project directory..."
# Create bin directory in project (persists to runtime)
mkdir -p ./bin

# Determine architecture
ARCH=$(uname -m)
if [ "$ARCH" = "x86_64" ]; then
    CLAUDE_URL="https://storage.googleapis.com/osprey-downloads-c02f6a0d-347c-492b-a752-3e0651722e97/nest-cli-2.0.31-linux-x64.tar.gz"
elif [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then
    CLAUDE_URL="https://storage.googleapis.com/osprey-downloads-c02f6a0d-347c-492b-a752-3e0651722e97/nest-cli-2.0.31-linux-arm64.tar.gz"
else
    echo "❌ Unsupported architecture: $ARCH"
    exit 1
fi

echo "Downloading Claude CLI for $ARCH..."
curl -fsSL "$CLAUDE_URL" | tar -xz -C ./bin

# Verify installation
if [ -f "./bin/claude" ]; then
    echo "✅ Claude CLI installed successfully to ./bin/claude"
    chmod +x ./bin/claude
    ./bin/claude --version || echo "Warning: version check failed but binary exists"
else
    echo "❌ Claude CLI binary not found after extraction"
    ls -la ./bin/
    exit 1
fi

echo "📦 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "✅ Build complete"
