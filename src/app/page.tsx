import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-black text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-800/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 font-bold text-white">
              PoI
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Proof of Intelligence
            </span>
          </div>
          <nav className="flex items-center gap-4 text-sm text-zinc-400">
            <a
              href="https://github.com/srbisnes/proof-of-intelligence"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition"
            >
              GitHub
            </a>
            <Link
              href="/api/health"
              className="rounded-full bg-zinc-800 px-4 py-1.5 text-zinc-200 hover:bg-zinc-700 transition"
            >
              API Status
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
          Powered by Hedera Consensus Service
        </div>

        <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Cryptographic proof that an AI response
          <span className="block bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            can be safely reused
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
          Reduce LLM token costs by 40–90%. Semantic cache + immutable SHA-256
          proofs registered on Hedera Hashgraph. Every reuse is verifiable.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="https://github.com/srbisnes/proof-of-intelligence"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-violet-600 px-6 py-3 font-medium text-white shadow-lg shadow-violet-600/25 hover:bg-violet-500 transition"
          >
            View on GitHub
          </a>
          <Link
            href="/docs"
            className="rounded-xl border border-zinc-700 bg-zinc-900/50 px-6 py-3 font-medium text-zinc-200 hover:bg-zinc-800 transition"
          >
            Architecture
          </Link>
        </div>
      </section>

      {/* Value props */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Semantic Cache ≥ 95%",
              desc: "Qdrant vector search returns previously generated answers when similarity is high enough. Zero LLM cost on hit.",
            },
            {
              title: "Immutable Proof",
              desc: "Every new response is hashed (SHA-256) and registered on Hedera Consensus Service with a consensus timestamp.",
            },
            {
              title: "Real-time Savings",
              desc: "Dashboard shows tokens saved, USD saved, cache hit rate and verifiable transaction IDs on HashScan.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6"
            >
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-8 text-center text-sm text-zinc-500">
        Built by{" "}
        <a
          href="https://github.com/srbisnes"
          className="text-zinc-300 hover:text-white"
          target="_blank"
          rel="noopener noreferrer"
        >
          elcryptoboy
        </a>{" "}
        · Proof of Intelligence · MIT License
      </footer>
    </main>
  );
}
