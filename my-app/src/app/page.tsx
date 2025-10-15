"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { InitialTransition } from "@/components/initial-transition";
import { MultiChainWalletButton } from "@/components/multi-chain-wallet-button";

const content = (isFirstMount: boolean) => ({
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: isFirstMount ? 1.2 : 0,
    },
  },
});

const item = {
  initial: { y: 20, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.6, -0.05, 0.01, 0.99] as const,
    },
  },
};

export default function Home() {
  const [isFirstMount, setIsFirstMount] = useState(true);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited");

    if (!hasVisited) {
      sessionStorage.setItem("hasVisited", "true");
    } else {
      setIsFirstMount(false);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.3, ease: [0.6, -0.05, 0.01, 0.99] }}
      className="relative min-h-screen w-full overflow-x-hidden "
    >
      {/* Initial Transition - Only on first visit */}
      {isFirstMount && <InitialTransition />}
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/BarcodeBG.jpg"
          alt="Community background"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex min-h-screen items-center px-4 py-12 md:px-8 lg:px-16">
        {/* Black Container Card - Left Aligned */}
        <motion.div
          variants={content(isFirstMount)}
          initial="initial"
          animate="animate"
          className="w-full max-w-2xl rounded-3xl bg-black px-8 py-12 shadow-2xl md:px-12 md:py-16 lg:px-16 lg:py-20"
        >
          {/* Barcode Icon */}
          <motion.div variants={item} className="mb-8 flex justify-start">
            <div className="flex gap-[3px]">
              <div className="h-12 w-[3px] bg-white"></div>
              <div className="h-12 w-[2px] bg-white"></div>
              <div className="h-12 w-[3px] bg-white"></div>
              <div className="h-12 w-[2px] bg-white"></div>
              <div className="h-12 w-[4px] bg-white"></div>
              <div className="h-12 w-[2px] bg-white"></div>
              <div className="h-12 w-[3px] bg-white"></div>
              <div className="h-12 w-[2px] bg-white"></div>
              <div className="h-12 w-[3px] bg-white"></div>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={item}
            className="mb-6 text-5xl font-bold leading-tight text-white md:text-6xl lg:text-7xl"
          >
            BARCODE
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={item}
            className="mb-10 text-base text-gray-300 md:text-lg lg:text-xl"
          >
            Get On Code: where access, accountability and acceleration drive
            everything
          </motion.p>

     

          {/* Get Started Button */}
          <motion.div variants={item} className="mb-10 mt-6">
            <Link href="/form">
              <button className="flex cursor-pointer items-center justify-between rounded-xl bg-white px-8 py-4 text-base font-semibold text-gray-900 transition-all hover:bg-gray-100 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white/50 md:px-10 md:py-5 md:text-lg">
                <span>Get Started</span>
                <svg
                  className="ml-3 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </Link>
          </motion.div>

               {/* Wallet Connection */}
               <MultiChainWalletButton />

          {/* Footer Text */}
          <motion.p
            variants={item}
            className="text-center text-sm mt-6 text-gray-400 md:text-base"
          >
            BUILD WITH US. Fill out our{" "}
            <Link
              href="/form"
              className="font-semibold text-white underline transition-colors hover:text-gray-300"
            >
              Contributor Application
            </Link>
            .
          </motion.p>

          {/* Social Icons */}
          <motion.div
            variants={item}
            className="mt-8 flex justify-center"
          >
            <a
              href="https://www.instagram.com/barcode.dao/"
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-full bg-white/10 p-3 transition-all hover:bg-white/20 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Instagram"
            >
              <svg
                className="h-6 w-6 text-white transition-colors group-hover:text-pink-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
