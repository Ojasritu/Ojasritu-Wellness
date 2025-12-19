#!/bin/bash

echo "Creating directories..."
mkdir -p dist
mkdir -p src

echo "Moving files to correct locations..."
mv index.html ./ 2>/dev/null || true
mv src/* src/ 2>/dev/null || true

echo "Building project..."
npm run build