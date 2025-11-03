# HAYQ MiniMVP - Complete Ecosystem

## Project Overview

**URL**: https://lovable.dev/projects/49b5a17e-7dd3-4ea3-bcc1-07cddd39dcd7

HAYQ MiniMVP-ն լրիվ փաթեթ է ներառելով:
- 🌐 **React DApp** - Web3 դիմումի ինտերֆեյս
- 📜 **Smart Contracts** - Solidity կոնտրակտներ (ERC20, Staking, Vesting, Dividends)
- 🤖 **Telegram Bot** - 9 լեզուներով bot crypto signals-ով
- 🧠 **AI Module** - Machine Learning գնի կանխատեսման համար
- 📊 **Pine Script Strategy** - TradingView համար trading signals

## Project Structure

```
.
├── src/                    # React DApp (frontend)
│   ├── components/         # UI components
│   ├── contracts/          # Smart contracts (Solidity)
│   ├── hooks/              # React hooks for Web3
│   └── config/             # Contract addresses & ABIs
├── bot/                    # Telegram Bot
│   ├── main.py             # Bot entry point
│   ├── telegram_bot.py     # Bot implementation
│   ├── trader.py           # Trading signals
│   ├── news.py             # News sender
│   └── signals.py          # Signal bot
├── ai/                     # AI/ML Module
│   ├── predict.py          # Price prediction
│   └── train_model.py      # Model training
├── pine-script/            # TradingView Strategy
│   ├── hayq_strategy.pine  # Main strategy
│   └── signals/            # Signal modules
└── README.md
```

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/49b5a17e-7dd3-4ea3-bcc1-07cddd39dcd7) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Technologies Used

### Frontend (React DApp)
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- ethers.js (Web3 integration)
- React Query

### Smart Contracts
- Solidity ^0.8.20
- Hardhat
- OpenZeppelin Upgradeable Contracts

### Telegram Bot
- Python 3.9+
- python-telegram-bot
- web3.py
- asyncio

### AI/ML Module
- Python 3.9+
- scikit-learn
- pandas
- numpy
- joblib

### Pine Script Strategy
- Pine Script v5
- TradingView platform
- EMA/RSI indicators
- Modular signal system

## Quick Start

### Option 1: One-Command Start (Recommended)

```bash
# Make scripts executable
chmod +x run-all.sh stop-all.sh

# Start everything at once
./run-all.sh

# When done, stop all services
./stop-all.sh
```

This will automatically:
1. ✅ Start Hardhat local blockchain
2. ✅ Deploy all smart contracts
3. ✅ Start React DApp (http://localhost:8080)
4. ✅ Start Telegram Bot (if configured)

### Option 2: Manual Start (Step-by-Step)

#### 1. React DApp (Frontend)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

#### 2. Smart Contracts (Hardhat)

```bash
cd src/contracts

# Install dependencies
npm install

# Start local Hardhat node
npx hardhat node

# Deploy contracts (in another terminal)
npx hardhat run scripts/deployAndCopy.js --network localhost
```

#### 3. Telegram Bot

```bash
cd bot

# Install Python dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your Telegram token

# Run bot
python main.py
```

#### 4. AI Module

```bash
cd ai

# Install dependencies
pip install pandas scikit-learn joblib numpy

# Train model (if needed)
python train_model.py

# Test prediction
python predict.py
```

## Features

### React DApp Features
- 💼 Wallet Connection (MetaMask)
- 💰 Balance Display (HAYQ, staked, vesting)
- 🔄 Transfer HAYQ tokens
- 🥩 Stake/Unstake HAYQ
- 💎 Dividend Claims (ERC20 & ETH)
- 🔙 Buyback mechanism
- 🗳️ Voting/Snapshot
- 📊 Live Chart
- 🌱 Economic Growth metrics

### Telegram Bot Features
- 🌐 9 languages (EN, HY, RU, FR, ES, DE, ZH, JA, AR)
- 📊 Real-time trading signals
- 🤖 AI price predictions
- 📰 Automated news delivery
- 🔔 Custom alerts
- 💼 Wallet integration

### Smart Contract Features
- ♻️ Upgradeable contracts (UUPS proxy)
- 💰 ERC20 with dividend tracking
- 🥩 Staking rewards
- 📅 Vesting schedule
- 🔐 MultiSig Timelock governance
- 🏛️ Registry for module management

## Documentation

- [Integration Guide](INTEGRATION.md) - **Սկսիր այստեղից!** Ամբողջ համակարգի միանգամից աշխատեցնելու համար
- [Smart Contracts README](src/contracts/README.md)
- [Telegram Bot README](bot/README.md)
- [AI Module README](ai/README.md)
- [Pine Script Strategy README](pine-script/README.md)

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/49b5a17e-7dd3-4ea3-bcc1-07cddd39dcd7) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
