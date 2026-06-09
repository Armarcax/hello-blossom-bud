# main.py — HAYQ Unified Bot Entry Point
import asyncio
from telegram_bot import start_telegram_bot
from signals import run_signal_bot

async def main():
    print("🚀 HAYQ Ecosystem starting...")
    await asyncio.gather(
        start_telegram_bot(),
        run_signal_bot(),
    )

if __name__ == "__main__":
    asyncio.run(main())