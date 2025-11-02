# HAYQ MiniMVP - Integration Guide

Այս ուղեցույցը բացատրում է, թե ինչպես միանգամից աշխատեցնել ամբողջ էկոհամակարգը։

## Նախապայմաններ

### System Requirements
- Node.js >= 16.x
- npm >= 8.x
- Python >= 3.9
- Git

### Required Accounts
- MetaMask կամ այլ Web3 դրամապանակ
- Telegram Bot Token (from [@BotFather](https://t.me/botfather))
- Infura կամ Alchemy API key (optional, for testnet/mainnet)

## Step-by-Step Integration

### 1️⃣ Clone և Setup

```bash
# Clone repository
git clone <YOUR_GIT_URL>
cd <PROJECT_NAME>

# Install frontend dependencies
npm install
```

### 2️⃣ Deploy Smart Contracts

```bash
cd src/contracts

# Install Hardhat dependencies
npm install

# Terminal 1: Start local Hardhat node
npx hardhat node

# Terminal 2: Deploy contracts
npx hardhat run scripts/deployAndCopy.js --network localhost
```

Deployment-ը ավտոմատ կթարմացնի:
- `src/config/contracts.ts` - Contract addresses
- `src/contracts/abis/` - Contract ABIs
- `bot/abi.json` - Bot-ի համար ABI

### 3️⃣ Start React DApp

```bash
# From project root
npm run dev
```

Դեղատետր: `http://localhost:8080`

### 4️⃣ Setup Telegram Bot

```bash
cd bot

# Install Python dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env with your values
# TELEGRAM_BOT_TOKEN=your_token_here
# HAYQ_CONTRACT_ADDRESS=<from deployment>
# RPC_URL=http://127.0.0.1:8545
```

**Get Telegram Bot Token:**
1. Open Telegram
2. Search for [@BotFather](https://t.me/botfather)
3. Send `/newbot`
4. Follow instructions
5. Copy token to `.env`

### 5️⃣ Setup AI Module

```bash
cd ai

# Install dependencies
pip install -r requirements.txt

# Train initial model
python train_model.py
```

### 6️⃣ Start Telegram Bot

```bash
cd bot
python main.py
```

Bot-ը կսկսի և կաշխատեցնի:
- 🤖 Telegram bot interface
- 📊 Trading signals loop
- 📰 News sender loop
- 🔔 Signal bot loop

## Testing the Integration

### Test React DApp
1. Բացել `http://localhost:8080`
2. Connect MetaMask
3. Import HAYQ token (contract address from deployment)
4. Test features: transfer, stake, claim dividends

### Test Telegram Bot
1. Գտնել bot-ը Telegram-ում (search by username)
2. Send `/start`
3. Try commands: `/help`, `/lang`
4. Click buttons to test features

### Test Blockchain Connection
```bash
cd bot
python -c "from blockchain_connector import blockchain; print('Connected:', blockchain.is_connected())"
```

### Test AI Predictions
```bash
cd ai
python predict.py
```

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                  HAYQ Ecosystem                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────┐    ┌──────────────┐              │
│  │  React DApp │    │ Telegram Bot │              │
│  │  (Port 8080)│    │  (Python)    │              │
│  └──────┬──────┘    └───────┬──────┘              │
│         │                   │                      │
│         │    ┌──────────────┴──────┐              │
│         │    │                     │              │
│         │    │  ┌────────────┐    │              │
│         └────┼──┤ Blockchain │◄───┘              │
│              │  │ (Hardhat)  │                    │
│              │  └────────────┘                    │
│              │                                     │
│              │  ┌────────────┐                    │
│              └──┤ AI Module  │                    │
│                 │ (ML Model) │                    │
│                 └────────────┘                    │
└─────────────────────────────────────────────────────┘
```

## Common Issues

### Contract Deployment Failed
- Համոզվիր, որ Hardhat node-ը աշխատում է
- Check `src/contracts/hardhat.config.js`
- Մաքրիր cache: `npx hardhat clean`

### Bot Can't Connect to Blockchain
- Վստահիր, որ RPC_URL-ը ճիշտ է `.env`-ում
- Վստահիր, որ contract address-ը թարմացված է
- Test: `python -c "from blockchain_connector import blockchain; print(blockchain.is_connected())"`

### MetaMask Connection Failed
- Համոզվիր, որ MetaMask-ը միացված է local network-ին
- Network: `http://127.0.0.1:8545`
- Chain ID: `31337` (Hardhat default)

### AI Model Not Found
- Run `python train_model.py` from `ai/` directory
- Check that `saved_model/hayq_model.pkl` exists

## Production Deployment

### Smart Contracts (Testnet/Mainnet)
```bash
cd src/contracts

# Configure network in hardhat.config.js
# Add INFURA_API_KEY, PRIVATE_KEY to .env

# Deploy to Sepolia
npx hardhat run scripts/deployAndCopy.js --network sepolia

# Deploy to Mainnet (be careful!)
npx hardhat run scripts/deployAndCopy.js --network mainnet
```

### React DApp
```bash
# Build for production
npm run build

# Deploy via Lovable or any static hosting
# (Vercel, Netlify, GitHub Pages, etc.)
```

### Telegram Bot
```bash
# Deploy to VPS or cloud service
# Use systemd, pm2, or Docker for process management

# Example with pm2:
pm2 start bot/main.py --interpreter python3 --name hayq-bot
```

### AI Module
- Deploy model to cloud (AWS, GCP, Azure)
- Use serverless functions (AWS Lambda, GCP Functions)
- Or include in bot deployment

## Next Steps

1. **Customize Smart Contracts**
   - Edit `src/contracts/HAYQ.sol`
   - Redeploy with `deployAndCopy.js`

2. **Enhance Bot Features**
   - Add more commands in `telegram_bot.py`
   - Implement wallet linking
   - Add transaction notifications

3. **Improve AI Model**
   - Gather real market data
   - Train better models (LSTM, Transformer)
   - Implement real-time predictions

4. **Security Audit**
   - Audit smart contracts
   - Secure bot token storage
   - Implement rate limiting

## Support

- [React DApp Documentation](src/README.md)
- [Smart Contracts Guide](src/contracts/README.md)
- [Telegram Bot Guide](bot/README.md)
- [AI Module Guide](ai/README.md)

---

**Հաջողություն! 🚀**
