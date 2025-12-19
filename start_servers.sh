#!/bin/bash

# Ojasritu Wellness - Start Development Servers
# This script starts both backend and frontend servers

echo "🚀 Starting Ojasritu Wellness Development Servers..."
echo ""

# Kill any existing processes
echo "🧹 Cleaning up existing processes..."
pkill -f "manage.py runserver" 2>/dev/null
pkill -f "vite" 2>/dev/null
sleep 2

# Start Backend (Django)
echo "🔧 Starting Backend (Django) on port 8000..."
cd /workspaces/wellness
nohup python manage.py runserver 0.0.0.0:8000 > /tmp/django.log 2>&1 &
BACKEND_PID=$!
sleep 3

# Check if backend started successfully
if curl -s http://localhost:8000/healthz/ > /dev/null 2>&1; then
    echo "✅ Backend started successfully (PID: $BACKEND_PID)"
else
    echo "❌ Backend failed to start. Check /tmp/django.log"
    exit 1
fi

# Start Frontend (Vite)
echo "🎨 Starting Frontend (Vite + React) on port 5173..."
cd /workspaces/wellness/frontend
nohup npm run dev -- --host 0.0.0.0 > /tmp/vite.log 2>&1 &
FRONTEND_PID=$!
sleep 5

# Check if frontend started successfully
if lsof -i :5173 > /dev/null 2>&1; then
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
