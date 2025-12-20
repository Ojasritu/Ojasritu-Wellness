#!/bin/bash

# Ojasritu Wellness - Start Development Servers (fixed for current workspace)
# Starts both backend (Django) and frontend (Vite) reliably with logs

set -e

echo "🚀 Starting Ojasritu Wellness Development Servers..."
echo ""

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "manage.py runserver" 2>/dev/null || true
pkill -f "vite" 2>/dev/null || true
sleep 2

# Ensure Python venv exists
cd /workspaces/Ojasritu-Wellness
if [ ! -d .venv ]; then
    echo "🐍 Creating Python virtualenv..."
    python3 -m venv .venv
    ./.venv/bin/python -m pip install -U pip wheel setuptools --break-system-packages
    ./.venv/bin/python -m pip install -r requirements.txt --break-system-packages
fi

echo "🔧 Applying migrations..."
./.venv/bin/python manage.py migrate --noinput || true

# Start Backend (Django)
echo "🔧 Starting Backend (Django) on port 8000..."
nohup ./.venv/bin/python manage.py runserver 0.0.0.0:8000 > /tmp/django.log 2>&1 &
BACKEND_PID=$!
sleep 3

# Check if backend started successfully (simple root check)
if curl -s -I http://localhost:8000/ >/dev/null 2>&1; then
    echo "✅ Backend started successfully (PID: $BACKEND_PID)"
else
    echo "❌ Backend failed to start. Check /tmp/django.log"
    exit 1
fi

# Start Frontend (Vite)
echo "🎨 Starting Frontend (Vite + React) on port 5173..."
cd /workspaces/Ojasritu-Wellness/frontend
# Use local HOME to avoid /home/codespace permission issues
HOME=$PWD nohup npm run dev -- --host 0.0.0.0 > /tmp/vite.log 2>&1 &
FRONTEND_PID=$!
sleep 5

# Check if frontend started successfully
if curl -s -I http://localhost:5173/ >/dev/null 2>&1; then
    echo "✅ Frontend started successfully (PID: $FRONTEND_PID)"
else
    echo "❌ Frontend failed to start. Check /tmp/vite.log"
    exit 1
fi

echo ""
echo "========================================="
echo "✅ ALL SERVERS RUNNING SUCCESSFULLY"
echo "========================================="
echo ""
echo "🔧 Backend (Django):"
echo "   URL: http://localhost:8000"
echo "   API: http://localhost:8000/api/products/"
echo "   Logs: /tmp/django.log"
echo ""
echo "🎨 Frontend (Vite):"
echo "   URL: http://localhost:5173"
echo "   Logs: /tmp/vite.log"
echo ""
echo "💡 To stop servers:"
echo "   ./stop_servers.sh"
echo "   or"
echo "   pkill -f 'manage.py runserver' && pkill -f 'vite'"
echo ""
