"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, polygon, base, arbitrum, optimism } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { unicornConnector } from "@unicorn.eth/autoconnect";
import "@rainbow-me/rainbowkit/styles.css";

// RainbowKit wallets (existing behavior preserved)
const rainbowConnectors = connectorsForWallets(
  [
    {
      groupName: "Popular",
      wallets: [metaMaskWallet, coinbaseWallet, walletConnectWallet],
    },
  ],
  {
    appName: "BarCode DAO",
    projectId: "YOUR_PROJECT_ID", // Get from https://cloud.walletconnect.com
  }
);

// Wagmi config with Unicorn AutoConnect + existing RainbowKit connectors
const config = createConfig({
  connectors: [
    ...rainbowConnectors,
    unicornConnector({
      clientId: "4e8c81182c3709ee441e30d776223354",
      // thirdweb's default AccountFactory — works on Mainnet, Polygon, Base, Arbitrum, Optimism
      // If the client deployed a custom factory, replace this with that address
      factoryAddress: "0x85e23b94e7F5E9cC1fF78BCe78cfb15B81f0DF00",
    }),
  ],
  chains: [mainnet, polygon, base, arbitrum, optimism],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [base.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
  },
  ssr: true,
});

const queryClient = new QueryClient();

export function EVMWalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

