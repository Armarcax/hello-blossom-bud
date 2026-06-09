# bot/config.py
import os
from dotenv import load_dotenv

load_dotenv()

# Telegram Configuration
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "8274801728:AAHtGEzDyXy_e_fHYnL3_aHvQvqOtvLd9MU")

# Blockchain Configuration
HAYQ_CONTRACT_ADDRESS = os.getenv("HAYQ_CONTRACT_ADDRESS", "")
RPC_URL = os.getenv("RPC_URL", "http://127.0.0.1:8545")

# Bot Configuration
TRADING_INTERVAL = int(os.getenv("TRADING_INTERVAL", 10))
NEWS_INTERVAL = int(os.getenv("NEWS_INTERVAL", 30))
SIGNALS_INTERVAL = int(os.getenv("SIGNALS_INTERVAL", 20))

# AI Model Configuration
MODEL_PATH = os.getenv("MODEL_PATH", "../ai/saved_model/hayq_model.pkl")

# Assets
LOGO_PATH = os.getenv("LOGO_PATH", "public-assets/logo.png")

# Supported Languages
SUPPORTED_LANGS = ["en", "hy", "ru", "fr", "es", "de", "zh", "ja", "ar"]
