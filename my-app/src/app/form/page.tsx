"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAccount } from "wagmi";
import { WalletConnectPrompt } from "@/components/wallet-connect-prompt";

const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.6, -0.05, 0.01, 0.99] as const,
    },
  },
  exit: {
    opacity: 0,
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: [0.6, -0.05, 0.01, 0.99] as const,
    },
  },
};

const content = {
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const item = {
  initial: { y: 20, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.6, -0.05, 0.01, 0.99] as const,
    },
  },
};

const stepTransition = {
  initial: { x: 50, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -50, opacity: 0 },
  transition: { duration: 0.3 },
};

interface DidYouKnow {
  text: string;
  source: string;
  sourceUrl: string;
}

const didYouKnowFacts: DidYouKnow[] = [
  {
    text: "If the Black U.S. population were a country, their $2.1 trillion spending power would position them as the 10th richest nation in the world, ahead of Canada, South Korea, Russia, and Brazil—representing a level of economic activity larger than most countries on Earth.",
    source: "NOIR Press",
    sourceUrl: "https://noirpress.org/tenet5-you-got-money-how-the-world-runs-on-black-power/"
  },
  {
    text: "Dr. Amos N. Wilson is one of the clearest 20th-century voices on how real power works. He speaks on 'Intrusive Power'—the ability to enter the personality, occupy the ego and edit perception, memory and desire so that the oppressed person needs no external whip.",
    source: "Dr. Amos N. Wilson",
    sourceUrl: "https://noirpress.org/tenet5-you-got-money-how-the-world-runs-on-black-power/"
  },
  {
    text: "Africa's household and business consumption is projected to approach $4 trillion by 2025, fueled by a rapidly growing middle class and urbanization.",
    source: "NOIR Press",
    sourceUrl: "https://noirpress.org/tenet5-you-got-money-how-the-world-runs-on-black-power/"
  },
];

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  walletAddress: string;
  chain: string;
  company: string;
  title: string;
  website: string;
  linkedin: string;
  bio: string;
  interests: string[];
  learningAreas: string[];
  participationTrack: string;
  agreedToTerms: boolean;
  timestamp: string;
}

export default function FormPage() {
  const solanaWallet = useWallet();
  const evmWallet = useAccount();
  const [currentStep, setCurrentStep] = useState(1);
  const [showDidYouKnow, setShowDidYouKnow] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showTermsError, setShowTermsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    walletAddress: "",
    chain: "",
    company: "",
    title: "",
    website: "",
    linkedin: "",
    bio: "",
    interests: [],
    learningAreas: [],
    participationTrack: "",
    agreedToTerms: false,
    timestamp: new Date().toISOString(),
  });

  const connected = solanaWallet.connected || evmWallet.isConnected;
  
  // Get the current "Did You Know" fact based on current step
  const currentFact = didYouKnowFacts[Math.min(currentStep - 1, didYouKnowFacts.length - 1)];

  // Ensure scrolling is always enabled on this page
  useEffect(() => {
    document.body.classList.remove("overflow-hidden");
  }, []);

  // Show "Did You Know" popup when step changes (only for first 3 steps)
  useEffect(() => {
    if (currentStep <= 3) {
      setShowDidYouKnow(true);
      // Auto-hide after 15 seconds
      const timer = setTimeout(() => {
        setShowDidYouKnow(false);
      }, 15000);
      return () => clearTimeout(timer);
    } else {
      // Hide popup if on step 4 or later
      setShowDidYouKnow(false);
    }
  }, [currentStep]);

  // Auto-populate wallet address when wallet is connected
  useEffect(() => {
    // Solana wallet connected
    if (solanaWallet.connected && solanaWallet.publicKey) {
      setFormData((prev) => ({
        ...prev,
        walletAddress: solanaWallet.publicKey!.toBase58(),
        chain: "solana",
      }));
    }
    // EVM wallet connected
    else if (evmWallet.isConnected && evmWallet.address) {
      let chainName = "ethereum"; // default
      
      // Map chain IDs to names
      if (evmWallet.chain) {
        switch (evmWallet.chain.id) {
          case 137:
            chainName = "polygon";
            break;
          case 8453:
            chainName = "base";
            break;
          case 42161:
            chainName = "arbitrum";
            break;
          case 10:
            chainName = "optimism";
            break;
          default:
            chainName = "ethereum";
        }
      }

      setFormData((prev) => ({
        ...prev,
        walletAddress: evmWallet.address!,
        chain: chainName,
      }));
    }
  }, [solanaWallet.connected, solanaWallet.publicKey, evmWallet.isConnected, evmWallet.address, evmWallet.chain]);

  function handleNext(e: React.FormEvent) {
    e.preventDefault();
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.agreedToTerms) {
      setShowTermsError(true);
      setTimeout(() => setShowTermsError(false), 3000);
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Determine which endpoint to use based on environment
      const isProduction = process.env.NODE_ENV === 'production' || 
                          (typeof window !== 'undefined' && !window.location.hostname.includes('localhost'));
      
      const webhookUrl = isProduction
        ? 'https://oncode.app.n8n.cloud/webhook/4170702c-3177-418d-a652-5f7fc8312286'
        : 'https://oncode.app.n8n.cloud/webhook-test/4170702c-3177-418d-a652-5f7fc8312286';

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Submission failed: ${response.status} ${response.statusText}`);
      }

      // Success - show success modal
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError(
        error instanceof Error 
          ? error.message 
          : 'Failed to submit application. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleBack() {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function toggleInterest(interest: string) {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  }

  function toggleLearningArea(area: string) {
    setFormData((prev) => ({
      ...prev,
      learningAreas: prev.learningAreas.includes(area)
        ? prev.learningAreas.filter((a) => a !== area)
        : [...prev.learningAreas, area],
    }));
  }

  // Get step-specific heading
  function getStepHeading(step: number): string {
    const headings: Record<number, string> = {
      1: "IDENTITY",
      2: "PROFESSIONAL BACKGROUND",
      3: "CONTRIBUTION & SKILLS",
      4: "INTEREST",
      5: "PARTICIPATION TRACK",
      6: "REVIEW & SUBMIT",
    };
    return headings[step] || "IDENTITY";
  }

  // Get step-specific subtext
  function getStepSubtext(step: number): string {
    const subtexts: Record<number, string> = {
      1: "Complete the application to join our DAO community",
      2: "Complete the application to join our DAO community",
      3: "Complete the application to join our DAO community",
      4: "Please share your professional background",
      5: "Complete the application to join our DAO community",
      6: "Complete the application to join our DAO community",
    };
    return subtexts[step] || "Complete the application to join our DAO community";
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative min-h-screen w-full overflow-x-hidden "
    >
      {/* Background Video with Enhanced Glass Effect */}
      <div className="fixed inset-0 z-0 bg-black">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        >
          <source src="/assets/Only_Group.mp4" type="video/mp4" />
        </video>
        {/* Multi-layer Gradient Overlay for Enhanced Glass */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 md:px-8">
        {/* "Did You Know" Popup */}
        <AnimatePresence>
          {showDidYouKnow && currentStep <= 3 && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="fixed bottom-6 right-6 z-50 w-80 rounded-2xl border border-white/20 bg-black/80 p-5 shadow-2xl md:w-96"
              style={{
                backdropFilter: 'blur(40px) saturate(180%)',
                WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowDidYouKnow(false)}
                className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-gray-400 transition-all hover:bg-white/20 hover:text-white"
                aria-label="Close"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Header */}
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#53361C]/40 backdrop-blur-sm">
                  <svg
                    className="h-5 w-5 text-white"
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
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  Did You Know?
                </h3>
              </div>

              {/* Content */}
              <p className="mb-4 text-sm leading-relaxed text-gray-300">
                {currentFact.text}
              </p>

              {/* Source Link */}
              <a
                href={currentFact.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-[#53361C] transition-colors hover:text-[#6b4524]"
                style={{ color: '#D4A574' }}
              >
                <span>Source: {currentFact.source}</span>
                <svg
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Modal */}
        <AnimatePresence>
          {showSuccessModal && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowSuccessModal(false)}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              />
              
              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/20 bg-black/90 p-8 shadow-2xl md:p-10"
                style={{
                  backdropFilter: 'blur(40px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
                }}
              >
                {/* Success Icon */}
                <div className="mb-6 flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20 backdrop-blur-sm border border-green-500/30">
                    <svg
                      className="h-12 w-12 text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Title */}
                <h2 className="mb-4 text-center text-2xl font-bold text-white md:text-3xl">
                  Application Submitted!
                </h2>

                {/* Message */}
                <p className="mb-8 text-center text-base leading-relaxed text-gray-300 md:text-lg">
                  Thank you for your interest in joining BARCODE. Please check your email for confirmation.
                </p>

                {/* Close Button */}
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full rounded-xl bg-[#53361C]/40 backdrop-blur-xl border border-[#53361C]/60 px-8 py-3 text-base font-semibold text-white transition-all hover:bg-[#53361C]/60 hover:scale-105 hover:border-[#53361C]/80 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#53361C]/50"
                  style={{
                    backdropFilter: 'blur(20px) saturate(150%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                    boxShadow: '0 4px 16px 0 rgba(83, 54, 28, 0.2)',
                  }}
                >
                  Close
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Terms Error Toast */}
        <AnimatePresence>
          {showTermsError && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-6 left-1/2 z-50 w-full max-w-md -translate-x-1/2 rounded-2xl border border-red-500/30 bg-red-500/20 p-4 shadow-2xl backdrop-blur-xl"
              style={{
                backdropFilter: 'blur(40px) saturate(180%)',
                WebkitBackdropFilter: 'blur(40px) saturate(180%)',
              }}
            >
              <div className="flex items-center gap-3">
                <svg
                  className="h-5 w-5 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm font-medium text-white">
                  Please agree to the terms before submitting
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Container Card with Enhanced Liquid Glass */}
        <motion.div
          variants={content}
          initial="initial"
          animate="animate"
          className="w-full max-w-2xl rounded-3xl bg-black/70 px-8 py-10 shadow-2xl md:px-12 md:py-14 border border-white/10"
          style={{
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Back Button */}
          <motion.div variants={item} className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-gray-400 transition-colors hover:text-white"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </Link>
          </motion.div>

          {/* Progress Bar */}
          <motion.div variants={item} className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-400">
                Step {currentStep} of 6
              </span>
              <span className="text-sm text-gray-500">
                {Math.round((currentStep / 6) * 100)}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/5 border border-white/10 overflow-hidden backdrop-blur-xl"
              style={{
                backdropFilter: 'blur(20px) saturate(150%)',
                WebkitBackdropFilter: 'blur(20px) saturate(150%)',
              }}
            >
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-white via-white/90 to-white shadow-lg"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / 6) * 100}%` }}
                transition={{ duration: 0.3 }}
                style={{
                  boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
                }}
              />
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={item}
            className="mb-2 text-3xl font-bold text-white md:text-4xl"
          >
            {getStepHeading(currentStep)}
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={item}
            className="mb-8 text-sm text-gray-400 md:text-base"
          >
            {getStepSubtext(currentStep)}
          </motion.p>

          {/* Form Steps */}
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.form
                key="step1"
                {...stepTransition}
                onSubmit={handleNext}
                className="space-y-5"
              >
                {/* Wallet Connect Prompt */}
                <WalletConnectPrompt />

                {/* First Name & Last Name Row */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="mb-2 block text-sm font-medium text-gray-300"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full rounded-xl bg-white/5 px-4 py-3 text-white placeholder-gray-500 border border-white/10 backdrop-blur-xl transition-all focus:bg-white/10 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 hover:border-white/20"
                      style={{
                        backdropFilter: 'blur(20px) saturate(150%)',
                        WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                      }}
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="mb-2 block text-sm font-medium text-gray-300"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full rounded-xl bg-white/5 px-4 py-3 text-white placeholder-gray-500 border border-white/10 backdrop-blur-xl transition-all focus:bg-white/10 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 hover:border-white/20"
                      style={{
                        backdropFilter: 'blur(20px) saturate(150%)',
                        WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                      }}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-300"
                  >
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl bg-white/5 px-4 py-3 text-white placeholder-gray-500 border border-white/10 backdrop-blur-xl transition-all focus:bg-white/10 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 hover:border-white/20"
                    style={{
                      backdropFilter: 'blur(20px) saturate(150%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                    }}
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-gray-300"
                  >
                    Phone Number
                  </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-xl bg-white/5 px-4 py-3 text-white placeholder-gray-500 border border-white/10 backdrop-blur-xl transition-all focus:bg-white/10 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 hover:border-white/20"
                    style={{
                      backdropFilter: 'blur(20px) saturate(150%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                    }}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                {/* Wallet Address & Chain */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="walletAddress"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Web3 Identity (Wallet Address)
                    </label>
                    {connected && (
                      <span className="flex items-center gap-1 text-xs text-green-400">
                        <svg
                          className="h-3 w-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Wallet Connected
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    id="walletAddress"
                    name="walletAddress"
                    value={formData.walletAddress}
                    onChange={handleChange}
                    disabled={connected}
                    className={`w-full rounded-xl bg-white/10 px-4 py-3 text-white placeholder-gray-500 backdrop-blur-sm transition-all focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 ${
                      connected ? "cursor-not-allowed opacity-70" : ""
                    }`}
                    placeholder="0x... or connect wallet"
                  />
                </div>

                {/* Chain Selection */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-gray-300">
                    Blockchain Network
                  </label>
                  <div className="flex flex-wrap gap-3 cursor-pointer">
                    {[
                      "Ethereum",
                      "Polygon",
                      "Base",
                      "Arbitrum",
                      "Optimism",
                      "Solana",
                    ].map((network) => {
                      const isSelected = formData.chain === network.toLowerCase();
                      const isConnectedChain = connected && isSelected;
                      
                      return (
                        <button
                          key={network}
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              chain: network.toLowerCase(),
                            })
                          }
                          disabled={isConnectedChain}
                          className={`rounded-full cursor-pointer px-5 py-2 text-sm font-medium transition-all border backdrop-blur-xl ${
                            isSelected
                              ? "bg-white text-gray-900 border-white shadow-lg"
                              : "bg-white/5 text-gray-300 hover:bg-white/10 border-white/10 hover:border-white/20"
                          } ${
                            isConnectedChain
                              ? "ring-2 ring-green-400/50"
                              : ""
                          }`}
                          style={!isSelected ? {
                            backdropFilter: 'blur(20px) saturate(150%)',
                            WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                          } : {}}
                        >
                          {network}
                          {isConnectedChain && (
                            <span className="ml-1.5">
                              <svg
                                className="inline h-3 w-3 text-green-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-end gap-4 pt-6">
                  <button
                    type="submit"
                    className="flex cursor-pointer items-center justify-center rounded-xl bg-[#53361C]/40 backdrop-blur-xl border border-[#53361C]/60 px-8 py-3 text-base font-semibold text-white transition-all hover:bg-[#53361C]/60 hover:scale-105 hover:border-[#53361C]/80 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#53361C]/50"
                    style={{
                      backdropFilter: 'blur(20px) saturate(150%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                      boxShadow: '0 4px 16px 0 rgba(83, 54, 28, 0.2)',
                    }}
                  >
                    Continue
                    <svg
                      className="ml-2 h-4 w-4"
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
                  </button>
                </div>
              </motion.form>
            )}

            {/* Step 2 - Professional Information */}
            {currentStep === 2 && (
              <motion.form
                key="step2"
                {...stepTransition}
                onSubmit={handleNext}
                className="space-y-5"
              >
                {/* Company */}
                <div>
                  <label
                    htmlFor="company"
                    className="mb-2 block text-sm font-medium text-gray-300"
                  >
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-white/5 px-4 py-3 text-white placeholder-gray-500 border border-white/10 backdrop-blur-xl transition-all focus:bg-white/10 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 hover:border-white/20"
                    style={{
                      backdropFilter: 'blur(20px) saturate(150%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                    }}
                    placeholder="Your company name"
                  />
                </div>

                {/* Title/Position */}
                <div>
                  <label
                    htmlFor="title"
                    className="mb-2 block text-sm font-medium text-gray-300"
                  >
                    Title/Position
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-white/5 px-4 py-3 text-white placeholder-gray-500 border border-white/10 backdrop-blur-xl transition-all focus:bg-white/10 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 hover:border-white/20"
                    style={{
                      backdropFilter: 'blur(20px) saturate(150%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                    }}
                    placeholder="e.g., Senior Developer, Product Manager"
                  />
                </div>

                {/* Website */}
                <div>
                  <label
                    htmlFor="website"
                    className="mb-2 block text-sm font-medium text-gray-300"
                  >
                    Website
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-white/5 px-4 py-3 text-white placeholder-gray-500 border border-white/10 backdrop-blur-xl transition-all focus:bg-white/10 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 hover:border-white/20"
                    style={{
                      backdropFilter: 'blur(20px) saturate(150%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                    }}
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                {/* LinkedIn Profile */}
                <div>
                  <label
                    htmlFor="linkedin"
                    className="mb-2 block text-sm font-medium text-gray-300"
                  >
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    id="linkedin"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleChange}
                    className="w-full rounded-xl bg-white/5 px-4 py-3 text-white placeholder-gray-500 border border-white/10 backdrop-blur-xl transition-all focus:bg-white/10 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 hover:border-white/20"
                    style={{
                      backdropFilter: 'blur(20px) saturate(150%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                    }}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>

                {/* Professional Bio */}
                <div>
                  <label
                    htmlFor="bio"
                    className="mb-2 block text-sm font-medium text-gray-300"
                  >
                    Professional Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full rounded-xl bg-white/5 px-4 py-3 text-white placeholder-gray-500 border border-white/10 backdrop-blur-xl transition-all focus:bg-white/10 focus:border-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 hover:border-white/20"
                    style={{
                      backdropFilter: 'blur(20px) saturate(150%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                    }}
                    placeholder="Tell us about your professional background and experience..."
                  />
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between gap-4 pt-6">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center justify-center rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-3 text-base font-medium text-white transition-all hover:bg-white/10 hover:border-white/20 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/20"
                    style={{
                      backdropFilter: 'blur(20px) saturate(150%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                    }}
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex cursor-pointer items-center justify-center rounded-xl bg-[#53361C]/40 backdrop-blur-xl border border-[#53361C]/60 px-8 py-3 text-base font-semibold text-white transition-all hover:bg-[#53361C]/60 hover:scale-105 hover:border-[#53361C]/80 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#53361C]/50"
                    style={{
                      backdropFilter: 'blur(20px) saturate(150%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                      boxShadow: '0 4px 16px 0 rgba(83, 54, 28, 0.2)',
                    }}
                  >
                    Continue
                    <svg
                      className="ml-2 h-4 w-4"
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
                  </button>
                </div>
              </motion.form>
            )}

            {/* Step 3 - Areas of Interest/Expertise */}
            {currentStep === 3 && (
              <motion.form
                key="step3"
                {...stepTransition}
                onSubmit={handleNext}
                className="space-y-5"
              >
                {/* Interests Selection */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-gray-300">
                   Contributions & Skills
                  </label>
                  <p className="mb-4 text-xs text-gray-500">
                    Choose all that apply
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {[
                      "Business Strategy",
                      "Real Estate",
                      "Marketing",
                      "Legal",
                      "Leadership",
                      "Product Development",
                      "Health & Wellness",
                      "Investment",
                      "Technology",
                      "Operations",
                      "Finance",
                      "Sales",
                      "Education / Training",
                      "Capital / Funding Access",
                      "Community Organizing",
                      "Funding",
                      "Digital Ads",
                    ].map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`cursor-pointer rounded-full px-5 py-2 text-sm font-medium transition-all border backdrop-blur-xl hover:scale-105 ${
                          formData.interests.includes(interest)
                            ? "bg-white text-gray-900 border-white shadow-lg"
                            : "bg-white/5 text-gray-300 hover:bg-white/10 border-white/10 hover:border-white/20"
                        }`}
                        style={!formData.interests.includes(interest) ? {
                          backdropFilter: 'blur(20px) saturate(150%)',
                          WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                        } : {}}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between gap-4 pt-6">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center justify-center rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-3 text-base font-medium text-white transition-all hover:bg-white/10 hover:border-white/20 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/20"
                    style={{
                      backdropFilter: 'blur(20px) saturate(150%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                    }}
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex cursor-pointer items-center justify-center rounded-xl bg-[#53361C]/40 backdrop-blur-xl border border-[#53361C]/60 px-8 py-3 text-base font-semibold text-white transition-all hover:bg-[#53361C]/60 hover:scale-105 hover:border-[#53361C]/80 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#53361C]/50"
                    style={{
                      backdropFilter: 'blur(20px) saturate(150%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                      boxShadow: '0 4px 16px 0 rgba(83, 54, 28, 0.2)',
                    }}
                  >
                    Continue
                    <svg
                      className="ml-2 h-4 w-4"
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
                  </button>
                </div>
              </motion.form>
            )}

            {/* Step 4 - Learning Interests */}
            {currentStep === 4 && (
              <motion.form
                key="step4"
                {...stepTransition}
                onSubmit={handleNext}
                className="space-y-5"
              >
                {/* Learning Areas Selection */}
                <div>
                  <label className="mb-3 block text-sm font-medium text-gray-300">
                    Areas You'd Like to Learn More About
                  </label>
                  <p className="mb-4 text-xs text-gray-500">
                    Choose all that apply
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {[
                      "Business Strategy",
                      "Real Estate",
                      "Marketing",
                      "Legal",
                      "Leadership",
                      "Product Development",
                      "Health & Wellness",
                      "Investment",
                      "Technology",
                      "Operations",
                      "Finance",
                      "Sales",
                      "Education / Training",
                      "Capital / Funding Access",
                      "Community Organizing",
                      "Funding",
                      "Digital Ads",
                    ].map((area) => (
                      <button
                        key={area}
                        type="button"
                        onClick={() => toggleLearningArea(area)}
                        className={`cursor-pointer rounded-full px-5 py-2 text-sm font-medium transition-all border backdrop-blur-xl hover:scale-105 ${
                          formData.learningAreas.includes(area)
                            ? "bg-white text-gray-900 border-white shadow-lg"
                            : "bg-white/5 text-gray-300 hover:bg-white/10 border-white/10 hover:border-white/20"
                        }`}
                        style={!formData.learningAreas.includes(area) ? {
                          backdropFilter: 'blur(20px) saturate(150%)',
                          WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                        } : {}}
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between gap-4 pt-6">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center justify-center rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-3 text-base font-medium text-white transition-all hover:bg-white/10 hover:border-white/20 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/20"
                    style={{
                      backdropFilter: 'blur(20px) saturate(150%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                    }}
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex cursor-pointer items-center justify-center rounded-xl bg-[#53361C]/40 backdrop-blur-xl border border-[#53361C]/60 px-8 py-3 text-base font-semibold text-white transition-all hover:bg-[#53361C]/60 hover:scale-105 hover:border-[#53361C]/80 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#53361C]/50"
                    style={{
                      backdropFilter: 'blur(20px) saturate(150%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                      boxShadow: '0 4px 16px 0 rgba(83, 54, 28, 0.2)',
                    }}
                  >
                    Continue
                    <svg
                      className="ml-2 h-4 w-4"
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
                  </button>
                </div>
              </motion.form>
            )}

            {/* Step 5 - Participation Track */}
            {currentStep === 5 && (
              <motion.form
                key="step5"
                {...stepTransition}
                onSubmit={handleNext}
                className="space-y-5"
              >
                {/* Participation Track Selection */}
                <div>
                  <label className="mb-6 block text-2xl font-bold text-white">
                    PARTICIPATION TRACK
                  </label>
                  <p className="mb-6 text-sm text-gray-400">
                    Choose your preferred level of participation
                  </p>

                  <div className="space-y-4">
                    {/* Citizen Option */}
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, participationTrack: "citizen" })
                      }
                      className={`group cursor-pointer relative w-full rounded-2xl border-2 p-6 text-left transition-all backdrop-blur-xl ${
                        formData.participationTrack === "citizen"
                          ? "border-[#53361C]/80 bg-[#53361C]/30 shadow-lg"
                          : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10 hover:scale-105"
                      }`}
                      style={{
                        backdropFilter: 'blur(20px) saturate(150%)',
                        WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="mb-2 text-xl font-bold text-white">
                            Citizen
                          </h3>
                          <p className="text-sm text-gray-400">
                            In-person + Virtual events, educational resources
                          </p>
                        </div>
                        {formData.participationTrack === "citizen" && (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#53361C] border border-[#53361C]">
                            <svg
                              className="h-4 w-4 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>

                    {/* Company Option */}
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, participationTrack: "company" })
                      }
                      className={`group cursor-pointer relative w-full rounded-2xl border-2 p-6 text-left transition-all backdrop-blur-xl ${
                        formData.participationTrack === "company"
                          ? "border-[#53361C]/80 bg-[#53361C]/30 shadow-lg"
                          : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10 hover:scale-105"
                      }`}
                      style={{
                        backdropFilter: 'blur(20px) saturate(150%)',
                        WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="mb-2 text-xl font-bold text-white">
                            Company
                          </h3>
                          <p className="text-sm text-gray-400">
                            Citizen + Collaborative opportunities
                          </p>
                        </div>
                        {formData.participationTrack === "company" && (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#53361C] border border-[#53361C]">
                            <svg
                              className="h-4 w-4 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>

                    {/* Enterprise Option */}
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          participationTrack: "enterprise",
                        })
                      }
                      className={`group cursor-pointer relative w-full rounded-2xl border-2 p-6 text-left transition-all backdrop-blur-xl ${
                        formData.participationTrack === "enterprise"
                          ? "border-[#53361C]/80 bg-[#53361C]/30 shadow-lg"
                          : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10 hover:scale-105"
                      }`}
                      style={{
                        backdropFilter: 'blur(20px) saturate(150%)',
                        WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="mb-2 text-xl font-bold text-white">
                            Enterprise
                          </h3>
                          <p className="text-sm text-gray-400">
                            Company + Sponsorship opportunities, priority access, &
                            more
                          </p>
                        </div>
                        {formData.participationTrack === "enterprise" && (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#53361C] border border-[#53361C]">
                            <svg
                              className="h-4 w-4 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between gap-4 pt-6">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center justify-center rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-3 text-base font-medium text-white transition-all hover:bg-white/10 hover:border-white/20 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/20"
                    style={{
                      backdropFilter: 'blur(20px) saturate(150%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                    }}
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex cursor-pointer items-center justify-center rounded-xl bg-[#53361C]/40 backdrop-blur-xl border border-[#53361C]/60 px-8 py-3 text-base font-semibold text-white transition-all hover:bg-[#53361C]/60 hover:scale-105 hover:border-[#53361C]/80 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#53361C]/50"
                    style={{
                      backdropFilter: 'blur(20px) saturate(150%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                      boxShadow: '0 4px 16px 0 rgba(83, 54, 28, 0.2)',
                    }}
                  >
                    Continue
                    <svg
                      className="ml-2 h-4 w-4"
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
                  </button>
                </div>
              </motion.form>
            )}

            {/* Step 6 - Review & Submit */}
            {currentStep === 6 && (
              <motion.div
                key="step6"
                {...stepTransition}
                className="space-y-6"
              >
                {/* Header */}
                <div className="mb-8">
                  <p className="text-sm text-gray-400">
                    Review your application before submitting
                  </p>
                </div>

                {/* Row 1: Identity & Professional Info */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Identity Section */}
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-lg"
                    style={{
                      backdropFilter: 'blur(20px) saturate(150%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                    }}
                  >
                    <h3 className="mb-4 text-xl font-bold text-white">Identity</h3>
                    <div className="space-y-2 text-gray-300">
                      <p className="text-base">
                        {formData.firstName} {formData.lastName}
                      </p>
                      <p className="text-base">{formData.email}</p>
                      <p className="text-base">{formData.phone}</p>
                      {formData.walletAddress && (
                        <p className="break-all text-sm">
                          {formData.walletAddress}
                          {formData.chain && (
                            <span className="ml-2 text-xs text-gray-500">
                              ({formData.chain})
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Professional Info Section */}
                  {(formData.company || formData.title || formData.website || formData.linkedin) && (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-lg"
                    style={{
                      backdropFilter: 'blur(20px) saturate(150%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                    }}
                  >
                      <h3 className="mb-4 text-xl font-bold text-white">
                        Professional Information
                      </h3>
                      <div className="space-y-2 text-gray-300">
                        {formData.company && (
                          <p className="text-base">
                            <span className="text-gray-500">Company:</span>{" "}
                            {formData.company}
                          </p>
                        )}
                        {formData.title && (
                          <p className="text-base">
                            <span className="text-gray-500">Title:</span>{" "}
                            {formData.title}
                          </p>
                        )}
                        {formData.website && (
                          <p className="text-sm">
                            <span className="text-gray-500">Website:</span>{" "}
                            <a
                              href={formData.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white underline hover:text-gray-300"
                            >
                              {formData.website}
                            </a>
                          </p>
                        )}
                        {formData.linkedin && (
                          <p className="text-sm">
                            <span className="text-gray-500">LinkedIn:</span>{" "}
                            <a
                              href={formData.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white underline hover:text-gray-300"
                            >
                              {formData.linkedin}
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Row 2: Bio & Contributions/Skills */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Bio Section */}
                  {formData.bio && (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-lg"
                    style={{
                      backdropFilter: 'blur(20px) saturate(150%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                    }}
                  >
                      <h3 className="mb-4 text-xl font-bold text-white">Bio</h3>
                      <p className="text-sm leading-relaxed text-gray-300">
                        {formData.bio}
                      </p>
                    </div>
                  )}

                  {/* Contributions & Skills */}
                  {formData.interests.length > 0 && (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-lg"
                    style={{
                      backdropFilter: 'blur(20px) saturate(150%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                    }}
                  >
                      <h3 className="mb-4 text-xl font-bold text-white">
                        Contributions & Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {formData.interests.map((interest) => (
                          <span
                            key={interest}
                            className="rounded-full bg-white/10 px-4 py-1.5 text-sm text-gray-300"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Row 3: Learning Interests & Participation Track */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Learning Interests */}
                  {formData.learningAreas.length > 0 && (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-lg"
                    style={{
                      backdropFilter: 'blur(20px) saturate(150%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                    }}
                  >
                      <h3 className="mb-4 text-xl font-bold text-white">
                        Learning Interests
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {formData.learningAreas.map((area) => (
                          <span
                            key={area}
                            className="rounded-full bg-white/10 px-4 py-1.5 text-sm text-gray-300"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Participation Track */}
                  {formData.participationTrack && (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-lg"
                    style={{
                      backdropFilter: 'blur(20px) saturate(150%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                    }}
                  >
                      <h3 className="mb-4 text-xl font-bold text-white">
                        Participation Track
                      </h3>
                      <p className="text-base capitalize text-gray-300">
                        {formData.participationTrack}
                      </p>
                    </div>
                  )}
                </div>

                {/* Terms Agreement */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
                  style={{
                    backdropFilter: 'blur(20px) saturate(150%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={formData.agreedToTerms}
                      onChange={(e) =>
                        setFormData({ ...formData, agreedToTerms: e.target.checked })
                      }
                      className="mt-1 h-5 w-5 cursor-pointer rounded border-white/20 bg-white/10 text-white focus:ring-2 focus:ring-white/50"
                    />
                    <label htmlFor="terms" className="cursor-pointer text-sm text-gray-400">
                      <span className="font-semibold text-white">GET ON CODE</span>
                      <br />
                      <span className="text-xs text-gray-500 mt-1 block">
                        I agree to the Terms & Conditions and acknowledge the Privacy Policy by proceeding.
                      </span>
                    </label>
                  </div>
                </div>

                {/* Error Message */}
                {submitError && (
                  <div className="rounded-2xl border border-red-500/30 bg-red-500/20 p-4 backdrop-blur-xl"
                    style={{
                      backdropFilter: 'blur(20px) saturate(150%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-red-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-sm font-medium text-white">
                        {submitError}
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between gap-4 pt-6">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={isSubmitting}
                    className="flex items-center justify-center rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 px-6 py-3 text-base font-medium text-white transition-all hover:bg-white/10 hover:border-white/20 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                    style={{
                      backdropFilter: 'blur(20px) saturate(150%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                    }}
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!formData.agreedToTerms || isSubmitting}
                    className="flex cursor-pointer items-center justify-center rounded-xl bg-[#53361C]/30 backdrop-blur-sm border border-[#53361C]/50 px-8 py-3 text-base font-semibold text-white transition-all hover:bg-[#53361C]/50 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#53361C]/50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                    style={{
                      backdropFilter: 'blur(20px) saturate(150%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(150%)',
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="mr-2 h-5 w-5 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      'Submit'
                    )}
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}

