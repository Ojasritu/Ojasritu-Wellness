#!/bin/bash

# Ojasritu Wellness - Stop Development Servers
# This script stops both backend and frontend servers

echo "🛑 Stopping Ojasritu Wellness Development Servers..."
echo ""

# Stop Backend
echo "🔧 Stopping Backend (Django)..."
pkill -f "manage.py runserver"
if [ $? -eq 0 ]; then
    echo "✅ Backend stopped"
else
    echo "⚠️  No backend process found"
fi

# Stop Frontend
echo "🎨 Stopping Frontend (Vite)..."
pkill -f "vite"
if [ $? -eq 0 ]; then
    echo "✅ Frontend stopped"
else
    echo "⚠️  No frontend process found"
fi

sleep 1

# Verify
if ! lsof -i :8000 > /dev/null 2>&1 && ! lsof -i :5173 > /dev/null 2>&1; then
    echo ""
    echo "✅ All servers stopped successfully"
else
    echo ""
    echo "⚠️  Some processes might still be running:"
    lsof -i :8000,5173 2>/dev/null
fi

echo ""
