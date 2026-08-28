import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Proof of Intelligence",
  description:
    "Cryptographic proof that an AI response was already generated, validated and can be safely reused. Reduce LLM token costs with Hedera Hashgraph.",
  openGraph: {
    title: "Proof of Intelligence",
    description:
      "Semantic AI cache + immutable proofs on Hedera Consensus Service",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
