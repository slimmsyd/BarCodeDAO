"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
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
  const [showTransition, setShowTransition] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited");

    if (!hasVisited) {
      sessionStorage.setItem("hasVisited", "true");
    } else {
      setIsFirstMount(false);
      setShowTransition(false);
      // If not first mount, ensure scrolling is enabled
      document.body.classList.remove("overflow-hidden");
    }
  }, []);

  // Try to autoplay with sound after transition completes
  useEffect(() => {
    if (!showTransition && videoRef.current) {
      // Add a slight delay to ensure video is ready
      const timer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.muted = false;
          videoRef.current.play().then(() => {
            setIsMuted(false);
          }).catch(() => {
            // If autoplay with sound fails (most browsers), keep it muted
            videoRef.current!.muted = true;
            setIsMuted(true);
          });
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [showTransition]);

  // Try to autoplay with sound immediately on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      videoRef.current.play().then(() => {
        setIsMuted(false);
      }).catch(() => {
        // If autoplay with sound fails, keep it muted
        videoRef.current!.muted = true;
        setIsMuted(true);
      });
    }
  }, []);

  const handleTransitionComplete = () => {
    // Remove the transition component after animation completes
    setShowTransition(false);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.3, ease: [0.6, -0.05, 0.01, 0.99] }}
      className="relative min-h-screen w-full overflow-x-hidden"
    >
      {/* Initial Transition - Only on first visit */}
      {isFirstMount && showTransition && (
        <InitialTransition onComplete={handleTransitionComplete} />
      )}
      {/* Background Video - Fixed Position */}
      <div className="fixed inset-0 z-0 bg-black">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="h-full w-full object-contain"
        >
          <source src="/assets/Only_Group.mp4" type="video/mp4" />
        </video>
        {/* Subtle Gradient Overlay for Glass Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
      </div>

      {/* Sound Toggle Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: isFirstMount ? 1.5 : 0 }}
        onClick={toggleMute}
        className="fixed right-6 top-6 z-20 rounded-full bg-black/40 p-3 backdrop-blur-xl border border-white/10 transition-all hover:bg-black/60 hover:scale-110 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 shadow-lg"
        style={{
          backdropFilter: 'blur(20px) saturate(150%)',
          WebkitBackdropFilter: 'blur(20px) saturate(150%)',
        }}
        aria-label={isMuted ? "Unmute video" : "Mute video"}
      >
        {isMuted ? (
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
            />
          </svg>
        ) : (
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
          </svg>
        )}
      </motion.button>

      {/* Content Container */}
      <div className="relative z-10 flex min-h-screen flex-col md:flex-row md:justify-end">
        {/* Mobile Top Video - Only visible on mobile */}
        <div className="block w-full md:hidden">
          <div className="relative h-48 w-full overflow-hidden bg-black">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-contain"
            >
              <source src="/assets/Only_Group.mp4" type="video/mp4" />
            </video>
          </div>
        </div>

        {/* Black Container - Right-Aligned Column with Liquid Glass Effect */}
        <motion.div
          variants={content(isFirstMount)}
          initial="initial"
          animate="animate"
          className="w-full bg-black/80 backdrop-blur-3xl px-8 py-12 md:min-h-screen md:w-5/12 md:px-12 md:py-16 lg:w-1/3 lg:px-16 lg:py-20 flex flex-col justify-center border-l border-white/10 shadow-2xl"
          style={{
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          }}
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
    
               {/* Wallet Connection */}
               <MultiChainWalletButton />
               <motion.div variants={item} className="mb-10 mt-6">
            <Link href="/form">
              <button className="flex w-full text-center  justify-center *:items-center cursor-pointer rounded-xl bg-[#53361C]/30 backdrop-blur-sm border border-[#53361C]/50 px-8 py-4 text-base font-semibold text-white transition-all hover:bg-[#53361C]/50 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#53361C]/50 md:px-10 md:py-5 md:text-lg">
                <span>Begin Application</span>
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



               <motion.div
            variants={item}
            className="mb-6 rounded-2xl mt-4 border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-lg"
            style={{
              backdropFilter: 'blur(20px) saturate(150%)',
              WebkitBackdropFilter: 'blur(20px) saturate(150%)',
            }}
          >
            <h2 className="mb-4 text-2xl font-bold text-white">
              EARLY ACCESS
            </h2>
            <ul className="space-y-2 text-sm text-gray-300 md:text-base">
              <li className="flex items-start">
                <svg
                  className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-[#53361C]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Private & Secure Process</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-[#53361C]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Few carefully curated steps</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-[#53361C]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Takes 5-10 minutes to complete</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="mr-3 mt-1 h-5 w-5 flex-shrink-0 text-[#53361C]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Progress automatically saved</span>
              </li>
            </ul>
          </motion.div>
          {/* Footer Text */}
          <motion.p
            variants={item}
            className="text-center text-sm mt-4 text-gray-400 md:text-base"
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
            className="mt-4 flex justify-center"
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

      {/* Secondary Hero Section */}
      <div className="relative z-10 flex min-h-[60vh] items-center justify-center px-4 py-20 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: isFirstMount ? 1.5 : 0.3, ease: [0.6, -0.05, 0.01, 0.99] }}
          className="relative w-full max-w-5xl"
        >
          {/* Glass Container */}
          <div 
            className="rounded-3xl border border-white/10 bg-black/60 px-8 py-16 text-center backdrop-blur-3xl shadow-2xl md:px-16 md:py-20"
            style={{
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
            }}
          >
            {/* Main Statement */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: isFirstMount ? 1.8 : 0.5 }}
              className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl"
            >
              We are the system now.
            </motion.h2>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: isFirstMount ? 2.0 : 0.7 }}
              className="text-xl font-medium text-gray-300 md:text-2xl lg:text-3xl"
            >
              Autonomous. Accountable. Accelerating
            </motion.p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
