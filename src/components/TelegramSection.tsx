interface Props {
  standalone?: boolean;
}

export default function TelegramSection({ standalone }: Props) {
  return (
    <section className={`py-20 px-6 text-center ${standalone ? 'min-h-screen bg-background' : ''}`}>
      <h2 className="text-3xl font-bold mb-4">
        HAYQ Telegram Bot
      </h2>
      <p className="text-gray-400 mb-8 max-w-xl mx-auto">
        Real-time trading signals · Pocket Option · Binance · Bybit · 20+ strategies
      </p>
      <div className="flex gap-4 justify-center flex-wrap">
        <a
          href="https://t.me/hayq_pocket_v1_bot"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-semibold transition-colors"
        >
          Open in Telegram
        </a>
        <a
          href="https://trading.hayq.live"
          target="_blank"
          rel="noopener noreferrer"
          className="border border-green-500 text-green-400 hover:bg-green-500 hover:text-white px-8 py-3 rounded-full font-semibold transition-colors"
        >
          Launch Trading Dashboard
        </a>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
        {/* Free */}
        <div className="border border-gray-700 rounded-2xl p-6">
          <div className="text-gray-400 text-sm mb-2">FREE</div>
          <div className="text-2xl font-bold mb-4">$0</div>
          <ul className="text-gray-400 text-sm space-y-2 text-left">
            <li>Mock data signals</li>
            <li>5 signals/day</li>
            <li>Basic dashboard</li>
          </ul>
        </div>

        {/* Pro */}
        <div className="border-2 border-green-500 rounded-2xl p-6 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
            POPULAR
          </div>
          <div className="text-green-400 text-sm mb-2">PRO</div>
          <div className="text-2xl font-bold mb-4">
            $15<span className="text-sm text-gray-400">/mo</span>
          </div>
          <ul className="text-gray-400 text-sm space-y-2 text-left">
            <li>Binance + Bybit live</li>
            <li>Unlimited signals</li>
            <li>Telegram alerts</li>
            <li>Pocket Option</li>
          </ul>
        </div>

        {/* HAYQ Premium */}
        <div className="border-2 border-purple-500 rounded-2xl p-6">
          <div className="text-purple-400 text-sm mb-2">HAYQ PREMIUM</div>
          <div className="text-2xl font-bold mb-4">Free</div>
          <ul className="text-gray-400 text-sm space-y-2 text-left">
            <li>Hold 100+ HAYQ token</li>
            <li>Everything in Pro</li>
            <li>Exclusive strategies</li>
            <li>Governance voting</li>
          </ul>
        </div>
      </div>
    </section>
  );
}