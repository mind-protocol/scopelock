#!/bin/bash
set -e

echo "📦 Installing Claude CLI..."
curl -fsSL https://claude.ai/install.sh | bash

echo "📦 Installing npm dependencies..."
npm install

echo "✅ Build complete"
