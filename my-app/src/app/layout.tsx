import type { Metadata } from "next";
import localFont from "next/font/local";
import { Orbitron } from "next/font/google";
import "./globals.css";
import { PageTransition } from "@/components/page-transition";
import { SolanaWalletProvider } from "@/components/wallet-provider";
import { EVMWalletProvider } from "@/components/evm-wallet-provider";

const gellix = localFont({
  src: [
    {
      path: "../../public/fonts/Gellix/Gellix-TRIAL-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/Gellix/Gellix-TRIAL-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/Gellix/Gellix-TRIAL-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Gellix/Gellix-TRIAL-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Gellix/Gellix-TRIAL-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/Gellix/Gellix-TRIAL-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Gellix/Gellix-TRIAL-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/Gellix/Gellix-TRIAL-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-gellix",
  display: "swap",
});

const orbitron = Orbitron({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BARCODE - Join the Community",
  description: "Fill out the form to become a potential member of our DAO.",
  openGraph: {
    title: "BARCODE - Join the Community",
    description: "Fill out the form to become a potential member of our DAO.",
    images: ["/BARCODE Website Cover.PNG"],
  },
  twitter: {
    card: "summary_large_image",
    title: "BARCODE - Join the Community",
    description: "Fill out the form to become a potential member of our DAO.",
    images: ["/BARCODE Website Cover.PNG"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${gellix.variable} ${orbitron.variable} antialiased`}>
        <EVMWalletProvider>
          <SolanaWalletProvider>
            <PageTransition>{children}</PageTransition>
          </SolanaWalletProvider>
        </EVMWalletProvider>
      </body>
    </html>
  );
}
