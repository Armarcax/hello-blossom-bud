#!/bin/bash

# HAYQ MiniMVP - Stop All Services Script

echo "🛑 Stopping HAYQ MiniMVP Ecosystem..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Function to kill process by PID file
kill_process() {
    local pid_file=$1
    local name=$2
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p "$pid" > /dev/null; then
            kill "$pid" 2>/dev/null
            echo "${GREEN}✅ Stopped $name (PID: $pid)${NC}"
        else
            echo "${RED}⚠️  $name process not found (PID: $pid)${NC}"
        fi
        rm "$pid_file"
    else
        echo "${RED}⚠️  No PID file for $name${NC}"
    fi
}

# Stop services
kill_process "logs/hardhat.pid" "Hardhat Node"
kill_process "logs/react.pid" "React DApp"
kill_process "logs/bot.pid" "Telegram Bot"

# Kill any remaining node/python processes (be careful!)
# Uncomment if needed:
# pkill -f "hardhat node"
# pkill -f "vite"
# pkill -f "bot/main.py"

echo ""
echo "${GREEN}🎉 All services stopped${NC}"
echo ""
