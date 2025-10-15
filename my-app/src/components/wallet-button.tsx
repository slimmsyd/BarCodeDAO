"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { motion } from "framer-motion";

function truncateAddress(address: string): string {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export function WalletButton() {
  const { connected, publicKey } = useWallet();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="wallet-button-wrapper"
    >
      <WalletMultiButton
        className="!rounded-xl !bg-white/10 !px-6 !py-3 !text-base !font-medium !text-white !backdrop-blur-sm !transition-all hover:!bg-white/20 hover:!scale-105 focus:!outline-none focus:!ring-2 focus:!ring-white/50"
        style={{
          backgroundColor: connected ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.1)",
        }}
      >
        {connected && publicKey ? (
          <span className="flex items-center gap-2">
            <svg
              className="h-4 w-4 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {truncateAddress(publicKey.toBase58())}
          </span>
        ) : (
          "Connect Wallet"
        )}
      </WalletMultiButton>
    </motion.div>
  );
}

