#!/bin/bash

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║          OJASRITU WELLNESS - FULL STACK START                  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"

# Check if running in development directory
if [ ! -f "manage.py" ]; then
    echo -e "${YELLOW}Error: Please run this script from the root directory (/workspaces/wellness)${NC}"
    exit 1
fi

echo -e "\n${BLUE}📋 Checking system...${NC}"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo -e "${YELLOW}Error: Python 3 not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Python found: $(python3 --version)${NC}"

# Check Node
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}Error: Node.js not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node found: $(node --version)${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${YELLOW}Error: npm not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm found: $(npm --version)${NC}"

echo -e "\n${BLUE}🔧 Preparing backend...${NC}"

# Collect static files
python3 manage.py collectstatic --noinput > /dev/null 2>&1
echo -e "${GREEN}✓ Static files collected${NC}"

# Run migrations
python3 manage.py migrate --run-syncdb > /dev/null 2>&1
echo -e "${GREEN}✓ Database migrations applied${NC}"

echo -e "\n${BLUE}📦 Preparing frontend...${NC}"

# Install frontend dependencies if needed
if [ ! -d "frontend/node_modules" ]; then
    echo -e "${YELLOW}Installing npm dependencies...${NC}"
    cd frontend
    npm install > /dev/null 2>&1
    cd ..
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Dependencies already installed${NC}"
fi

# Kill any existing servers
echo -e "\n${BLUE}🧹 Cleaning up old processes...${NC}"
pkill -f "manage.py runserver" 2>/dev/null || true
pkill -f "npm run dev" 2>/dev/null || true
sleep 1

echo -e "\n${BLUE}🚀 Starting servers...${NC}"

# Start backend in background
echo -e "${YELLOW}Starting backend on http://127.0.0.1:8000${NC}"
nohup python3 manage.py runserver 127.0.0.1:8000 > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
sleep 3

# Check if backend started successfully
if ! ps -p $BACKEND_PID > /dev/null; then
    echo -e "${YELLOW}Error: Backend failed to start${NC}"
    cat /tmp/backend.log
    exit 1
fi
echo -e "${GREEN}✓ Backend running (PID: $BACKEND_PID)${NC}"

# Start frontend in new terminal or background
echo -e "${YELLOW}Starting frontend on http://127.0.0.1:5173${NC}"
cd frontend
nohup npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..
sleep 5

# Check if frontend started successfully
if ! ps -p $FRONTEND_PID > /dev/null 2>&1; then
    echo -e "${YELLOW}Frontend starting in background...${NC}"
fi
echo -e "${GREEN}✓ Frontend starting (PID: $FRONTEND_PID)${NC}"

echo -e "\n${BLUE}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}✓ ALL SYSTEMS READY!${NC}"
echo -e "${BLUE}╠════════════════════════════════════════════════════════════════╣${NC}"
echo -e "${BLUE}║ Frontend:  ${GREEN}http://127.0.0.1:5173${BLUE}                        ║${NC}"
echo -e "${BLUE}║ Backend:   ${GREEN}http://127.0.0.1:8000${BLUE}                        ║${NC}"
echo -e "${BLUE}║ Admin:     ${GREEN}http://127.0.0.1:8000/admin${BLUE}                    ║${NC}"
echo -e "${BLUE}║ API:       ${GREEN}http://127.0.0.1:8000/api${BLUE}                      ║${NC}"
echo -e "${BLUE}╠════════════════════════════════════════════════════════════════╣${NC}"
echo -e "${BLUE}║ Backend Log: tail -f /tmp/backend.log                          ║${NC}"
echo -e "${BLUE}║ Frontend Log: tail -f /tmp/frontend.log                        ║${NC}"
echo -e "${BLUE}╠════════════════════════════════════════════════════════════════╣${NC}"
echo -e "${BLUE}║ To stop servers:                                              ║${NC}"
echo -e "${BLUE}║   pkill -f \"manage.py runserver\"                              ║${NC}"
echo -e "${BLUE}║   pkill -f \"npm run dev\"                                      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════════╝${NC}"

echo -e "\n${YELLOW}💡 First time? Read: API_CONNECTION_GUIDE.md${NC}"
echo -e "${YELLOW}📝 Add products in Django admin: http://127.0.0.1:8000/admin/shop/product/add/${NC}\n"

# Keep script running to show logs
tail -f /tmp/backend.log 2>/dev/null &
tail -f /tmp/frontend.log 2>/dev/null &
wait
