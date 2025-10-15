"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
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
}

export default function FormPage() {
  const solanaWallet = useWallet();
  const evmWallet = useAccount();
  const [currentStep, setCurrentStep] = useState(1);
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
  });

  const connected = solanaWallet.connected || evmWallet.isConnected;

  // Ensure scrolling is always enabled on this page
  useEffect(() => {
    document.body.classList.remove("overflow-hidden");
  }, []);

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
    // Skip step 6, go directly to review (step 7)
    if (currentStep === 5) {
      setCurrentStep(7);
    } else if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.agreedToTerms) {
      alert("Please agree to the terms before submitting");
      return;
    }
    console.log("Form submitted:", formData);
    // Handle submission logic here
    alert("Application submitted successfully!");
  }

  function handleBack() {
    // If on step 7 (review), go back to step 5 (participation track)
    if (currentStep === 7) {
      setCurrentStep(5);
    } else if (currentStep > 1) {
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

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative min-h-screen w-full overflow-x-hidden "
    >
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
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 md:px-8">
        {/* Form Container Card */}
        <motion.div
          variants={content}
          initial="initial"
          animate="animate"
          className="w-full max-w-2xl rounded-3xl bg-black px-8 py-10 shadow-2xl md:px-12 md:py-14"
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
                Step {currentStep} of 7
              </span>
              <span className="text-sm text-gray-500">
                {Math.round((currentStep / 7) * 100)}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / 7) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={item}
            className="mb-2 text-3xl font-bold text-white md:text-4xl"
          >
            Join BARCODE
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={item}
            className="mb-8 text-sm text-gray-400 md:text-base"
          >
            Complete the application to join our DAO community
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
                      required
                      className="w-full rounded-xl bg-white/10 px-4 py-3 text-white placeholder-gray-500 backdrop-blur-sm transition-all focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
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
                      required
                      className="w-full rounded-xl bg-white/10 px-4 py-3 text-white placeholder-gray-500 backdrop-blur-sm transition-all focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
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
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl bg-white/10 px-4 py-3 text-white placeholder-gray-500 backdrop-blur-sm transition-all focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
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
                    required
                    className="w-full rounded-xl bg-white/10 px-4 py-3 text-white placeholder-gray-500 backdrop-blur-sm transition-all focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
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
                          className={`rounded-full cursor-pointer px-5 py-2 text-sm font-medium transition-all ${
                            isSelected
                              ? "bg-white text-gray-900"
                              : "bg-white/10 text-gray-300 hover:bg-white/20"
                          } ${
                            isConnectedChain
                              ? "ring-2 ring-green-400"
                              : ""
                          }`}
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
                    className="flex cursor-pointer items-center justify-center rounded-xl bg-[#53361C]/30 backdrop-blur-sm border border-[#53361C]/50 px-8 py-3 text-base font-semibold text-white transition-all hover:bg-[#53361C]/50 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#53361C]/50"
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
                    className="w-full rounded-xl bg-white/10 px-4 py-3 text-white placeholder-gray-500 backdrop-blur-sm transition-all focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
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
                    className="w-full rounded-xl bg-white/10 px-4 py-3 text-white placeholder-gray-500 backdrop-blur-sm transition-all focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
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
                    className="w-full rounded-xl bg-white/10 px-4 py-3 text-white placeholder-gray-500 backdrop-blur-sm transition-all focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
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
                    className="w-full rounded-xl bg-white/10 px-4 py-3 text-white placeholder-gray-500 backdrop-blur-sm transition-all focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
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
                    className="w-full rounded-xl bg-white/10 px-4 py-3 text-white placeholder-gray-500 backdrop-blur-sm transition-all focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="Tell us about your professional background and experience..."
                  />
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between gap-4 pt-6">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center justify-center rounded-xl bg-white/10 px-6 py-3 text-base font-medium text-white transition-all hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
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
                    className="flex cursor-pointer items-center justify-center rounded-xl bg-[#53361C]/30 backdrop-blur-sm border border-[#53361C]/50 px-8 py-3 text-base font-semibold text-white transition-all hover:bg-[#53361C]/50 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#53361C]/50"
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
                        className={`cursor-pointer rounded-full px-5 py-2 text-sm font-medium transition-all ${
                          formData.interests.includes(interest)
                            ? "bg-white text-gray-900"
                            : "bg-white/10 text-gray-300 hover:bg-white/20"
                        }`}
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
                    className="flex items-center justify-center rounded-xl bg-white/10 px-6 py-3 text-base font-medium text-white transition-all hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
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
                    className="flex cursor-pointer items-center justify-center rounded-xl bg-[#53361C]/30 backdrop-blur-sm border border-[#53361C]/50 px-8 py-3 text-base font-semibold text-white transition-all hover:bg-[#53361C]/50 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#53361C]/50"
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
                        className={`cursor-pointer rounded-full px-5 py-2 text-sm font-medium transition-all ${
                          formData.learningAreas.includes(area)
                            ? "bg-white text-gray-900"
                            : "bg-white/10 text-gray-300 hover:bg-white/20"
                        }`}
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
                    className="flex items-center justify-center rounded-xl bg-white/10 px-6 py-3 text-base font-medium text-white transition-all hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
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
                    className="flex cursor-pointer items-center justify-center rounded-xl bg-[#53361C]/30 backdrop-blur-sm border border-[#53361C]/50 px-8 py-3 text-base font-semibold text-white transition-all hover:bg-[#53361C]/50 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#53361C]/50"
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
                      className={`group cursor-pointer relative w-full rounded-2xl border-2 p-6 text-left transition-all ${
                        formData.participationTrack === "citizen"
                          ? "border-[#53361C] bg-[#53361C]/20 backdrop-blur-sm"
                          : "border-white/20 bg-transparent hover:border-white/40 hover:bg-white/5"
                      }`}
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
                      className={`group relative w-full rounded-2xl border-2 p-6 text-left transition-all ${
                        formData.participationTrack === "company"
                          ? "border-[#53361C] bg-[#53361C]/20 backdrop-blur-sm"
                          : "border-white/20 bg-transparent hover:border-white/40 hover:bg-white/5"
                      }`}
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
                      className={`group relative w-full rounded-2xl border-2 p-6 text-left transition-all ${
                        formData.participationTrack === "enterprise"
                          ? "border-[#53361C] bg-[#53361C]/20 backdrop-blur-sm"
                          : "border-white/20 bg-transparent hover:border-white/40 hover:bg-white/5"
                      }`}
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
                    className="flex items-center justify-center rounded-xl bg-white/10 px-6 py-3 text-base font-medium text-white transition-all hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
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
                    className="flex cursor-pointer items-center justify-center rounded-xl bg-[#53361C]/30 backdrop-blur-sm border border-[#53361C]/50 px-8 py-3 text-base font-semibold text-white transition-all hover:bg-[#53361C]/50 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#53361C]/50"
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

            {/* Step 7 - Review & Submit */}
            {currentStep === 7 && (
              <motion.div
                key="step7"
                {...stepTransition}
                className="space-y-6"
              >
                {/* Header */}
                <div className="mb-8">
                  <h2 className="mb-2 text-3xl font-bold text-white md:text-4xl">
                    REVIEW & SUBMIT
                  </h2>
                  <p className="text-sm text-gray-400">
                    Review your application before submitting
                  </p>
                </div>

                {/* Row 1: Identity & Professional Info */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Identity Section */}
                  <div className="rounded-2xl border border-white/20 bg-white/5 p-6">
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
                    <div className="rounded-2xl border border-white/20 bg-white/5 p-6">
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
                    <div className="rounded-2xl border border-white/20 bg-white/5 p-6">
                      <h3 className="mb-4 text-xl font-bold text-white">Bio</h3>
                      <p className="text-sm leading-relaxed text-gray-300">
                        {formData.bio}
                      </p>
                    </div>
                  )}

                  {/* Contributions & Skills */}
                  {formData.interests.length > 0 && (
                    <div className="rounded-2xl border border-white/20 bg-white/5 p-6">
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
                    <div className="rounded-2xl border border-white/20 bg-white/5 p-6">
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
                    <div className="rounded-2xl border border-white/20 bg-white/5 p-6">
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
                <div className="rounded-2xl border border-white/20 bg-white/5 p-6">
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
                      <span className="font-semibold text-white">get on code</span>
                      <br />
                      By proceeding, you agree to the terms outlined.
                    </label>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between gap-4 pt-6">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center justify-center rounded-xl bg-white/10 px-6 py-3 text-base font-medium text-white transition-all hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30"
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
                    disabled={!formData.agreedToTerms}
                    className="flex cursor-pointer items-center justify-center rounded-xl bg-[#53361C]/30 backdrop-blur-sm border border-[#53361C]/50 px-8 py-3 text-base font-semibold text-white transition-all hover:bg-[#53361C]/50 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#53361C]/50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                  >
                    Submit
                  </button>
                </div>
              </motion.div>
            )}

            {/* Placeholder for step 6 if needed later */}
            {currentStep === 6 && (
              <motion.div
                key="step6"
                {...stepTransition}
                className="py-12 text-center"
              >
                <p className="text-gray-400">Step 6 coming soon...</p>
                <button
                  onClick={handleBack}
                  className="mt-6 rounded-xl bg-white/10 px-6 py-2 text-white transition-colors hover:bg-white/20"
                >
                  Go Back
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}

