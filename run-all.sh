#!/bin/bash

# HAYQ MiniMVP - Complete System Startup Script
# This script starts all components of the HAYQ ecosystem

echo "🚀 Starting HAYQ MiniMVP Ecosystem..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "${BLUE}Checking prerequisites...${NC}"

if ! command_exists node; then
    echo "${YELLOW}⚠️  Node.js not found. Please install Node.js >= 16.x${NC}"
    exit 1
fi

if ! command_exists python3; then
    echo "${YELLOW}⚠️  Python3 not found. Please install Python >= 3.9${NC}"
    exit 1
fi

if ! command_exists npx; then
    echo "${YELLOW}⚠️  npx not found. Please install npm${NC}"
    exit 1
fi

echo "${GREEN}✅ All prerequisites met${NC}"
echo ""

# 1. Start Hardhat Node
echo "${BLUE}1️⃣  Starting Hardhat Local Blockchain...${NC}"
cd src/contracts
npx hardhat node > ../../logs/hardhat.log 2>&1 &
HARDHAT_PID=$!
echo "Hardhat Node PID: $HARDHAT_PID"
cd ../..
sleep 5

# 2. Deploy Smart Contracts
echo "${BLUE}2️⃣  Deploying Smart Contracts...${NC}"
cd src/contracts
npx hardhat run scripts/deployAndCopy.js --network localhost
cd ../..
echo "${GREEN}✅ Contracts deployed${NC}"
echo ""

# 3. Start React DApp
echo "${BLUE}3️⃣  Starting React DApp...${NC}"
npm run dev > logs/react.log 2>&1 &
REACT_PID=$!
echo "React DApp PID: $REACT_PID"
echo "${GREEN}✅ React DApp started at http://localhost:8080${NC}"
echo ""

# 4. Start Telegram Bot (if configured)
if [ -f "bot/.env" ]; then
    echo "${BLUE}4️⃣  Starting Telegram Bot...${NC}"
    cd bot
    python3 main.py > ../logs/bot.log 2>&1 &
    BOT_PID=$!
    echo "Bot PID: $BOT_PID"
    cd ..
    echo "${GREEN}✅ Telegram Bot started${NC}"
else
    echo "${YELLOW}⚠️  Bot .env not found. Skipping Telegram Bot.${NC}"
    echo "   To enable: cp bot/.env.example bot/.env and configure"
fi
echo ""

# Save PIDs for cleanup
mkdir -p logs
echo "$HARDHAT_PID" > logs/hardhat.pid
echo "$REACT_PID" > logs/react.pid
[ ! -z "$BOT_PID" ] && echo "$BOT_PID" > logs/bot.pid

echo ""
echo "${GREEN}🎉 HAYQ Ecosystem Started Successfully!${NC}"
echo ""
echo "📊 Access Points:"
echo "   • React DApp: http://localhost:8080"
echo "   • Hardhat Node: http://127.0.0.1:8545"
[ ! -z "$BOT_PID" ] && echo "   • Telegram Bot: Running (check @YourBotUsername)"
echo ""
echo "📝 Logs:"
echo "   • Hardhat: logs/hardhat.log"
echo "   • React: logs/react.log"
[ ! -z "$BOT_PID" ] && echo "   • Bot: logs/bot.log"
echo ""
echo "To stop all services, run: ./stop-all.sh"
echo ""
