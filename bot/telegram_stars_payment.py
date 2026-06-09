# telegram_stars_payment.py
# Telegram Stars subscription — ոչ մի bank account պետք չէ

from telegram import LabeledPrice, Update
from telegram.ext import (
    ContextTypes, PreCheckoutQueryHandler,
    MessageHandler, CommandHandler, filters
)
import aiohttp, os

STARS_PRICE = 300  # ~$15 worth of Stars

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")


async def send_invoice(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Sends Pro subscription invoice via Telegram Stars"""
    await context.bot.send_invoice(
        chat_id=update.effective_chat.id,
        title="HAYQ Pro — Monthly",
        description=(
            "✅ Unlimited signals\n"
            "✅ Binance + Bybit live data\n"
            "✅ Pocket Option access\n"
            "✅ All 20+ strategies"
        ),
        payload=f"pro_sub_{update.effective_user.id}",
        currency="XTR",
        prices=[LabeledPrice("HAYQ Pro (1 month)", STARS_PRICE)],
        provider_token="",
    )


async def pre_checkout_callback(
    update: Update, context: ContextTypes.DEFAULT_TYPE
):
    await update.pre_checkout_query.answer(ok=True)


async def successful_payment_callback(
    update: Update, context: ContextTypes.DEFAULT_TYPE
):
    user_id = update.effective_user.id

    if SUPABASE_URL and SUPABASE_SERVICE_KEY:
        async with aiohttp.ClientSession() as session:
            # Upsert subscription
            await session.patch(
                f"{SUPABASE_URL}/rest/v1/subscriptions"
                f"?telegram_user_id=eq.{user_id}",
                headers={
                    "apikey": SUPABASE_SERVICE_KEY,
                    "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
                    "Content-Type": "application/json",
                    "Prefer": "return=minimal",
                },
                json={
                    "tier": "pro",
                    "telegram_user_id": user_id,
                }
            )

    # Store in context for local check too
    context.user_data["tier"] = "pro"

    await update.message.reply_text(
        "🎉 <b>Վճարումը հաջողված է!</b>\n\n"
        "🚀 <b>HAYQ Pro ակտիվ է</b>\n\n"
        "Հիմա ունես անսահմանափակ signals և "
        "բոլոր բորժաների հասանելիություն։\n\n"
        "Օգտագործիր /signals — սկսելու համար",
        parse_mode="HTML"
    )


def is_pro(context: ContextTypes.DEFAULT_TYPE) -> bool:
    return context.user_data.get("tier") in ("pro", "hayq_premium")


def register_payment_handlers(app):
    app.add_handler(CommandHandler("subscribe", send_invoice))
    app.add_handler(PreCheckoutQueryHandler(pre_checkout_callback))
    app.add_handler(
        MessageHandler(
            filters.SUCCESSFUL_PAYMENT,
            successful_payment_callback
        )
    )