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

# Copy Claude settings from repo root to home directory
# This makes settings available to Claude CLI globally
if [ -f "../.claude/settings.json" ]; then
    mkdir -p "$HOME/.claude"
    cp "../.claude/settings.json" "$HOME/.claude/settings.json"
    echo "✅ Claude settings copied to ~/.claude/settings.json"
else
    echo "⚠️  Claude settings not found at ../.claude/settings.json"
fi

echo "🔧 Configuring Claude CLI..."
# Install Claude CLI dependencies
./bin/claude install

# Add MCP servers
echo "📡 Adding MCP servers..."
# Vercel MCP (ignore if already exists)
./bin/claude mcp add --transport http vercel https://mcp.vercel.com || echo "✅ Vercel MCP already configured"

# Render MCP (requires RENDER_API_KEY env var)
if [ -n "$RENDER_API_KEY" ]; then
    ./bin/claude mcp add --transport http render https://mcp.render.com/mcp --header "Authorization: Bearer $RENDER_API_KEY" || echo "✅ Render MCP already configured"
else
    echo "⚠️  RENDER_API_KEY not set, skipping Render MCP"
fi

echo "📦 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "✅ Build complete"
