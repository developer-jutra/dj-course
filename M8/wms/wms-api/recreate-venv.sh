#!/bin/bash

echo "🔄 Removing old virtual environment..."
rm -rf .venv

echo "📦 Creating new virtual environment..."
python3 -m venv .venv

echo "📥 Installing dependencies..."
.venv/bin/pip install -e . --root-user-action=ignore

echo "✅ Virtual environment recreated successfully!"
