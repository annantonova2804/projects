import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinAlly — AI Trading Workstation",
  description: "AI-powered simulated trading workstation with live market data and an LLM trading assistant.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="font-mono bg-term-bg text-term-text antialiased">{children}</body>
    </html>
  );
}
