#!/bin/bash
set -e

echo "📦 Installing Claude CLI..."
curl -fsSL https://claude.ai/install.sh | bash

echo "📦 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "✅ Build complete"
