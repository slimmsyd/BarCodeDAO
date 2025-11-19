"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { D3WorldTourBg } from "@/components/d3-world-tour-bg";

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
      staggerChildren: 0.08 as const,
      delayChildren: 0.2 as const,
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

export default function TermsPage() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative min-h-screen w-full overflow-x-hidden"
    >
      <div className="fixed inset-0 z-0 bg-black">
        <D3WorldTourBg />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12 md:px-8 lg:px-12">
        <motion.div
          variants={content}
          initial="initial"
          animate="animate"
          className="w-full max-w-4xl bg-black/40 backdrop-blur-2xl px-6 py-8 md:px-10 md:py-10 lg:px-12 lg:py-12 border border-white/20 shadow-2xl rounded-lg"
          style={{
            backdropFilter: 'blur(24px) saturate(150%)',
            WebkitBackdropFilter: 'blur(24px) saturate(150%)',
          }}
        >
          {/* Header */}
          <motion.div variants={item} className="mb-8">
            <Link
              href="/form"
              className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-6"
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
              Back to Application
            </Link>
            <h1
              className="text-4xl font-black leading-tight text-white md:text-5xl lg:text-6xl mb-2"
              style={{ fontFamily: 'var(--font-orbitron)' }}
            >
              Terms and Conditions
            </h1>
            <p className="text-sm text-gray-400">Last Updated: November 2025</p>
          </motion.div>

          {/* Content */}
          <motion.div
            variants={item}
            className="prose prose-invert max-w-none space-y-6 text-gray-300"
          >
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 mt-8">1. Introduction and Acceptance</h2>
              <p className="text-sm md:text-base leading-relaxed">
                These Terms and Conditions ("Terms") govern your access to and participation in the BARCODE DAO ("DAO," "we," "our"). The DAO is a decentralized autonomous organization that operates through a collection of open-source, publicly verifiable smart contracts ("Smart Contracts") on the [e.g., Ethereum] blockchain.
              </p>
              <p className="text-sm md:text-base leading-relaxed mt-4">
                By interacting with the DAO, including but not limited to purchasing, acquiring, or holding the governance token CODE ("Token"), submitting proposals, voting, or using any associated interface ("Interface"), you expressly agree to be bound by these Terms.
              </p>
              <p className="text-sm md:text-base leading-relaxed mt-4 font-semibold text-white">
                IF YOU DO NOT AGREE TO THESE TERMS, DO NOT PARTICIPATE IN THE DAO OR INTERACT WITH THE INTERFACE OR SMART CONTRACTS.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 mt-8">2. Definition and Decentralized Structure</h2>
              
              <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.1. Autonomous Nature</h3>
              <p className="text-sm md:text-base leading-relaxed">
                The DAO is not a legal entity, corporation, partnership, or organized group in a conventional sense. It is a form of self-governance executed by code. The DAO has no board of directors, management structure, fiduciary duties, or registered office.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.2. No Central Authority</h3>
              <p className="text-sm md:text-base leading-relaxed">
                The DAO is governed solely by the Token holders through the execution of the Smart Contracts. No individual, group of individuals, or initial contributor has the power to unilaterally change the Smart Contracts, transfer DAO funds, or alter these Terms. All changes must be approved via the established on-chain governance process.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">2.3. Jurisdiction</h3>
              <p className="text-sm md:text-base leading-relaxed">
                The DAO makes no representations about its operation or existence in any particular jurisdiction. All participants are responsible for complying with the laws in their country of residence, including, but not limited to, laws concerning tokens, decentralized finance, securities, and taxation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 mt-8">3. Governance and Token Usage</h2>
              
              <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.1. Governance Token</h3>
              <p className="text-sm md:text-base leading-relaxed">
                The Token, identified by the symbol CODE, is solely a governance and utility token. It confers the ability to vote on proposals that affect the future operation and parameters of the DAO's Smart Contracts.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.2. NO INVESTMENT EXPECTATION</h3>
              <p className="text-sm md:text-base leading-relaxed">
                The Token does not represent or confer any equity, ownership interest, security interest, right to dividends, profit-sharing, or any equivalent rights in the DAO, any company, or any initial contributor. Tokens are not intended to be a security, and you acknowledge that the Token is acquired solely for the purpose of decentralized governance.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.3. Voting</h3>
              <p className="text-sm md:text-base leading-relaxed">
                The weight of a participant's vote is determined solely by the amount of Token held or delegated in their address at the time of a proposal snapshot. Voting is a process executed by the Smart Contracts and is irreversible once confirmed on the blockchain.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">3.4. Proposals</h3>
              <p className="text-sm md:text-base leading-relaxed">
                Any Token holder may submit a proposal according to the rules and minimum threshold requirements hardcoded into the Smart Contracts. The DAO is not responsible for the content, legality, or execution of proposals submitted by the community.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 mt-8">4. Risks and Liability Disclaimer</h2>
              
              <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.1. ASSUMPTION OF RISK</h3>
              <p className="text-sm md:text-base leading-relaxed">
                You understand and accept that participation in a DAO involves inherent risks. You acknowledge and agree that you are solely responsible for all risks associated with your participation. These risks include, but are not limited to:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-4 ml-4 text-sm md:text-base">
                <li><strong>Smart Contract Risk:</strong> The risk of bugs, malfunctions, or exploits in the underlying Smart Contracts, which could lead to the permanent loss of Tokens or other assets.</li>
                <li><strong>Regulatory Risk:</strong> The risk that regulatory bodies in any jurisdiction may interpret the Tokens or DAO operations as illegal, requiring shutdown or sanctions.</li>
                <li><strong>Market Risk:</strong> The risk of extreme volatility or total loss of the market value of the Token or any assets held by the DAO treasury.</li>
                <li><strong>Governance Risk:</strong> The risk of proposals being passed that are detrimental to the interests of individual Token holders or the DAO as a whole (e.g., majority attacks).</li>
                <li><strong>Technological Risk:</strong> The risk of blockchain failure, loss of private keys, or network congestion.</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.2. NO WARRANTY</h3>
              <p className="text-sm md:text-base leading-relaxed">
                The DAO, the Interface, and the Smart Contracts are provided on an "AS IS" and "AS AVAILABLE" basis, without warranties of any kind, either express or implied, including, without limitation, implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">4.3. LIMITATION OF LIABILITY</h3>
              <p className="text-sm md:text-base leading-relaxed">
                To the maximum extent permitted by applicable law, in no event shall the DAO, its initial contributors, Token holders, or any affiliated parties be liable for any direct, indirect, incidental, special, consequential, or exemplary damages, including but not limited to, damages for loss of profits, goodwill, use, data, or other intangible losses, resulting from: (i) the use or inability to use the Interface or Tokens; (ii) any conduct or content of any third party; (iii) any unauthorized access, use, or alteration of your transmissions or content; or (iv) any errors, bugs, or omissions in the Smart Contracts.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 mt-8">5. User Obligations</h2>
              
              <h3 className="text-xl font-semibold text-white mb-3 mt-6">5.1. Eligibility</h3>
              <p className="text-sm md:text-base leading-relaxed">
                You must be at least 18 years of age or the age of majority in your jurisdiction to participate in the DAO. You must not be a resident of or located in any jurisdiction where the holding of Tokens or participation in DAOs is prohibited.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">5.2. Lawful Use</h3>
              <p className="text-sm md:text-base leading-relaxed">
                You agree that you will not use the DAO or Tokens for any unlawful purpose, including money laundering, fraud, or violation of any securities, commodity, or sanctions laws.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">5.3. Taxes</h3>
              <p className="text-sm md:text-base leading-relaxed">
                You are solely responsible for determining what, if any, taxes apply to your Token transactions, voting rewards, or other DAO-related activities. The DAO is not responsible for collecting, withholding, or reporting any taxes arising from your participation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 mt-8">6. Amendment of Terms</h2>
              <p className="text-sm md:text-base leading-relaxed">
                These Terms may be amended or modified only through a successful on-chain governance proposal voted upon by Token holders according to the rules of the Smart Contracts. Any amendment passed by the DAO will be binding upon all participants immediately upon execution of the governing Smart Contract.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 mt-8">7. Governing Law and Dispute Resolution</h2>
              
              <h3 className="text-xl font-semibold text-white mb-3 mt-6">7.1. Governing Law</h3>
              <p className="text-sm md:text-base leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of Wyoming DAO LLC, without regard to its conflict of law principles.
              </p>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">7.2. Arbitration</h3>
              <p className="text-sm md:text-base leading-relaxed">
                Any dispute, controversy, or claim arising out of or relating to these Terms or the DAO shall be settled by binding arbitration administered by [Arbitration Body, e.g., the American Arbitration Association], in accordance with its commercial arbitration rules. The arbitration shall take place in Sheridan, WY.
              </p>
            </section>
          </motion.div>

          {/* Back Button */}
          <motion.div variants={item} className="mt-8">
            <Link
              href="/form"
              className="inline-flex items-center justify-center rounded-xl bg-[#53361C]/30 backdrop-blur-sm border border-[#53361C]/50 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#53361C]/50 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#53361C]/50"
            >
              Back to Application
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}



