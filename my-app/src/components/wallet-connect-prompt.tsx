"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useAccount } from "wagmi";
import Link from "next/link";

export function WalletConnectPrompt() {
  const solanaWallet = useWallet();
  const evmWallet = useAccount();

  const connected = solanaWallet.connected || evmWallet.isConnected;

  if (connected) return null;

  return (
    <div className="mb-6 rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 backdrop-blur-sm">
      <div className="flex items-start gap-3">
        <svg
          className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="flex-1">
          <p className="text-sm font-medium text-blue-200">
            Connect your wallet for faster onboarding
          </p>
          <p className="mt-1 text-xs text-blue-300/70">
            Your wallet address will be automatically filled in
          </p>
          <div className="mt-3">
            <Link
              href="/"
              className="inline-block rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-600"
            >
              ← Go back to connect wallet
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

