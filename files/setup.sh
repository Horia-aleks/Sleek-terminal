#!/bin/bash

echo "🚀 Sleek Terminal - Quick Setup"
echo "================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed."
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Installation complete!"
    echo ""
    echo "To run the terminal:"
    echo "  npm start"
    echo ""
    echo "To build standalone app:"
    echo "  npm run build"
    echo ""
    echo "Keyboard shortcuts:"
    echo "  Cmd+T - New tab"
    echo "  Cmd+W - Close tab"
    echo "  Cmd+K - Clear terminal"
    echo ""
else
    echo ""
    echo "❌ Installation failed. Please check errors above."
    exit 1
fi
