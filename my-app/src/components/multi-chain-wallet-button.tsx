"use client";

import { useState } from "react";
import { useWallet as useSolanaWallet } from "@solana/wallet-adapter-react";
import { useAccount, useDisconnect } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { motion } from "framer-motion";

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function MultiChainWalletButton() {
  const [showOptions, setShowOptions] = useState(false);
  const solana = useSolanaWallet();
  const evm = useAccount();

  const isSolanaConnected = solana.connected && solana.publicKey;
  const isEVMConnected = evm.isConnected && evm.address;
  const isAnyConnected = isSolanaConnected || isEVMConnected;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="relative"
    >
      {!isAnyConnected ? (
        <div className="space-y-3">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="w-full cursor-pointer rounded-xl bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 md:px-10 md:py-5 md:text-lg"
          >
            Connect Wallet
          </button>

          {showOptions && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2 rounded-xl border border-white/20 bg-black/80 p-4 backdrop-blur-sm"
            >
              <p className="mb-3 text-sm font-medium text-gray-300">
                Choose Network:
              </p>

              {/* EVM Chains Option */}
              <div className="wallet-connect-button">
                <ConnectButton.Custom>
                  {({ openConnectModal }) => (
                    <button
                      onClick={openConnectModal}
                      className="w-full cursor-pointer rounded-lg bg-white/10 px-4 py-3 text-left text-sm font-medium text-white transition-all hover:bg-white/20"
                    >
                      <div className="flex items-center justify-between">
                        <span>Ethereum, Polygon, Base, Arbitrum, Optimism</span>
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </button>
                  )}
                </ConnectButton.Custom>
              </div>

              {/* Solana Option */}
              <div className="wallet-adapter-dropdown">
                <WalletMultiButton className="!w-full cursor-pointer !rounded-lg !bg-white/10 !px-4 !py-3 !text-left !text-sm !font-medium !text-white !transition-all hover:!bg-white/20">
                  <div className="flex w-full items-center justify-between">
                    <span>Solana</span>
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </WalletMultiButton>
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-xl bg-white/20 px-8 py-4 backdrop-blur-sm md:px-10 md:py-5">
          <svg
            className="h-5 w-5 text-green-400 md:h-6 md:w-6"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-base font-semibold text-white md:text-lg">
            {isSolanaConnected &&
              solana.publicKey &&
              truncateAddress(solana.publicKey.toBase58())}
            {isEVMConnected && evm.address && truncateAddress(evm.address)}
          </span>
          {isSolanaConnected && (
            <WalletMultiButton className="!ml-auto !rounded-lg !bg-white/10 !px-4 !py-2 !text-sm !text-white hover:!bg-white/20" />
          )}
          {isEVMConnected && (
            <div className="ml-auto">
              <ConnectButton />
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

