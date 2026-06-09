# telegram_bot.py — UNIFIED HAYQ Bot
# Merged: hello-blossom-bud UI + hayq_pocket_v1 signals
# + Telegram Stars payment + HAYQ Token gate

import asyncio
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    ApplicationBuilder, CommandHandler, ContextTypes,
    CallbackQueryHandler, MessageHandler, filters
)
from bot_i18n import resources  # existing multilang
from blockchain_gate import check_hayq_balance, REQUIRED_BALANCE
from telegram_stars_payment import register_payment_handlers, is_pro

import os

BOT_TOKEN  = os.getenv("TELEGRAM_BOT_TOKEN",
                        "8274801728:AAHtGEzDyXy_e_fHYnL3_aHvQvqOtvLd9MU")
LOGO_PATH  = "public-assets/logo.png"
SUPPORTED_LANGS = ["en", "hy", "ru", "fr", "es", "de", "zh", "ja", "ar"]

# ── i18n helper ──────────────────────────────────────────
def t(key: str, lang: str) -> str:
    return resources.get(lang, resources["en"]).get(key, key)

def get_lang(update: Update, ctx: ContextTypes.DEFAULT_TYPE) -> str:
    return ctx.user_data.get(
        "lang",
        getattr(update.effective_user, "language_code", "en")
    )

# ── Tier helper ───────────────────────────────────────────
def get_tier(ctx: ContextTypes.DEFAULT_TYPE) -> str:
    return ctx.user_data.get("tier", "free")

def tier_badge(tier: str) -> str:
    return {"free": "🔓 Free", "pro": "⚡ Pro",
            "hayq_premium": "🪙 HAYQ Premium"}.get(tier, "🔓 Free")

# ── /start ────────────────────────────────────────────────
async def start(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    lang = get_lang(update, ctx)
    tier = get_tier(ctx)

    text = (
        f"🇦🇲 <b>{t('welcome', lang)}</b>\n"
        f"Plan: {tier_badge(tier)}"
    )

    keyboard = [
        [InlineKeyboardButton(t("walletConnect", lang), callback_data="walletConnect"),
         InlineKeyboardButton(t("balance", lang),       callback_data="balance")],
        [InlineKeyboardButton(t("stake", lang),         callback_data="stake"),
         InlineKeyboardButton(t("unstake", lang),       callback_data="unstake")],
        [InlineKeyboardButton(t("dividend", lang),      callback_data="dividend"),
         InlineKeyboardButton(t("voting", lang),        callback_data="voting")],
        [InlineKeyboardButton("📊 Signals",             callback_data="signals"),
         InlineKeyboardButton(t("liveChart", lang),     callback_data="liveChart")],
        [InlineKeyboardButton("⚡ Subscribe Pro",       callback_data="subscribe"),
         InlineKeyboardButton("🪙 HAYQ Token Gate",    callback_data="tokenGate")],
        [InlineKeyboardButton(t("growth", lang),        callback_data="growth")],
    ]

    markup = InlineKeyboardMarkup(keyboard)
    try:
        await update.message.reply_photo(
            photo=open(LOGO_PATH, "rb"),
            caption=text, reply_markup=markup, parse_mode="HTML"
        )
    except Exception:
        await update.message.reply_text(text, reply_markup=markup, parse_mode="HTML")


# ── /signals ──────────────────────────────────────────────
async def signals_command(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    tier = get_tier(ctx)
    if tier == "free":
        await update.message.reply_text(
            "🔒 <b>Pro Feature</b>\n\n"
            "Real-time signals-ը Pro կամ HAYQ Premium plan-ի համար է։\n\n"
            "⚡ Subscribe: /subscribe\n"
            "🪙 HAYQ Token Gate: /tokengate",
            parse_mode="HTML"
        )
        return

    await update.message.reply_text(
        "📊 <b>HAYQ Signal Engine</b> — Ակտիվ\n\n"
        "20 strategies · RSI · SR · CandleForce · TrendTF\n\n"
        "Signals-ը կկառուցվեն Binance/Bybit data-ից։\n"
        "Pocket Option-ի համար օգտագործիր /pocket հրամանը։",
        parse_mode="HTML"
    )


# ── /tokengate ────────────────────────────────────────────
async def token_gate_command(
    update: Update, ctx: ContextTypes.DEFAULT_TYPE
):
    await update.message.reply_text(
        "🪙 <b>HAYQ Token Gate</b>\n\n"
        f"Hold ≥{REQUIRED_BALANCE} HAYQ → Free Premium access\n\n"
        "Ուղղարկիր քո Sepolia wallet հասցեն.\n"
        "<code>0x...</code>",
        parse_mode="HTML"
    )
    ctx.user_data["awaiting_wallet"] = True


# ── Wallet address handler ────────────────────────────────
async def wallet_address_handler(
    update: Update, ctx: ContextTypes.DEFAULT_TYPE
):
    if not ctx.user_data.get("awaiting_wallet"):
        return

    address = update.message.text.strip()
    if not (address.startswith("0x") and len(address) == 42):
        await update.message.reply_text(
            "❌ Սխալ հasцe։ Պետք է լինի 0x... (42 symbol)"
        )
        return

    ctx.user_data["awaiting_wallet"] = False
    msg = await update.message.reply_text("⏳ Ստուգում ենք Sepolia-ում...")

    # Check balance (sync call in thread pool)
    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(
        None, check_hayq_balance, address
    )

    if "error" in result:
        await msg.edit_text(f"❌ Error: {result['error']}")
        return

    if result["has_enough"]:
        ctx.user_data["tier"] = "hayq_premium"
        ctx.user_data["wallet"] = address
        await msg.edit_text(
            f"✅ <b>HAYQ Premium ակtiв!</b>\n\n"
            f"Wallet: <code>{address[:6]}...{address[-4:]}</code>\n"
            f"Balance: {result['wallet_balance']} HAYQ"
            + (f" + {result['staked_balance']} staked"
               if result['staked_balance'] > 0 else "")
            + f"\nTotal: {result['total']} HAYQ",
            parse_mode="HTML"
        )
    else:
        need = REQUIRED_BALANCE - result["total"]
        await msg.edit_text(
            f"⚠️ <b>Անbav balance</b>\n\n"
            f"Ունեtc: {result['total']} HAYQ\n"
            f"Պetq: {need:.2f} more HAYQ\n\n"
            f"Ստacyum token-ներ՝ staking-ով կամ գնmamb։",
            parse_mode="HTML"
        )


# ── Callback query handler ────────────────────────────────
async def button_callback(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    lang = get_lang(update, ctx)
    action = query.data

    if action == "subscribe":
        await query.message.reply_text(
            "⚡ <b>Subscribe Pro</b>\n\nUse /subscribe command",
            parse_mode="HTML"
        )
    elif action == "tokenGate":
        await token_gate_command(query, ctx)
    elif action == "signals":
        await signals_command(query, ctx)
    elif action == "walletConnect":
        await query.message.reply_text(
            "🔗 Wallet Connect\n\n"
            "Ուղarкиr քo Sepolia wallet հасцеn՝\n"
            "<code>0x...</code>",
            parse_mode="HTML"
        )
        ctx.user_data["awaiting_wallet"] = True
    else:
        await query.message.reply_text(
            f"{t(action, lang)} ✅"
        )


# ── /help ─────────────────────────────────────────────────
async def help_command(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "<b>HAYQ Bot Commands</b>\n\n"
        "/start — Главное меню\n"
        "/signals — Trading signals (Pro)\n"
        "/subscribe — Subscribe Pro via Stars\n"
        "/tokengate — HAYQ Token Premium\n"
        "/lang en|hy|ru — Change language\n"
        "/help — This message",
        parse_mode="HTML"
    )


# ── /lang ─────────────────────────────────────────────────
async def set_language(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    if not ctx.args or ctx.args[0] not in SUPPORTED_LANGS:
        await update.message.reply_text(
            f"Usage: /lang <{'|'.join(SUPPORTED_LANGS)}>"
        )
        return
    ctx.user_data["lang"] = ctx.args[0]
    await update.message.reply_text(f"Language: {ctx.args[0]} ✅")


# ── Start bot ─────────────────────────────────────────────
async def start_telegram_bot():
    app = ApplicationBuilder().token(BOT_TOKEN).build()

    app.add_handler(CommandHandler("start",     start))
    app.add_handler(CommandHandler("help",      help_command))
    app.add_handler(CommandHandler("lang",      set_language))
    app.add_handler(CommandHandler("signals",   signals_command))
    app.add_handler(CommandHandler("tokengate", token_gate_command))
    app.add_handler(CallbackQueryHandler(button_callback))

    # Wallet address input
    app.add_handler(MessageHandler(
        filters.TEXT & ~filters.COMMAND,
        wallet_address_handler
    ))

    # Stripe Stars payment handlers
    register_payment_handlers(app)

    print("🤖 HAYQ Unified Bot started...")
    await app.initialize()
    await app.start()
    await app.updater.start_polling(drop_pending_updates=True)
    await asyncio.Event().wait()