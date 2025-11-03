#!/bin/bash
set -e

echo "📦 Installing Claude CLI..."
# Run official installer (installs to ~/.local/bin)
curl -fsSL https://claude.ai/install.sh | bash

# Copy to project bin directory (persists from build to runtime)
mkdir -p ./bin
if [ -f "$HOME/.local/bin/claude" ]; then
    cp "$HOME/.local/bin/claude" ./bin/claude
    chmod +x ./bin/claude
    echo "✅ Claude CLI copied to ./bin/claude"
else
    echo "❌ Claude CLI not found at ~/.local/bin/claude"
    exit 1
fi

echo "📦 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "✅ Build complete"
