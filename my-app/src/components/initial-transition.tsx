"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

const blackBox = {
  initial: {
    height: "100vh",
    bottom: 0,
  },
  animate: {
    height: 0,
    transition: {
      when: "afterChildren",
      duration: 0.8,
      ease: [0.87, 0, 0.13, 1] as const,
    },
  },
};

const textContainer = {
  initial: {
    opacity: 1,
  },
  animate: {
    opacity: 0,
    transition: {
      duration: 0.3,
      delay: 0.8,
      when: "afterChildren",
    },
  },
};

const barcode = {
  initial: {
    y: 40,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      delay: 0,
      ease: [0.6, -0.05, 0.01, 0.99] as const,
    },
  },
};

const title = {
  initial: {
    y: 40,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      delay: 0.1,
      ease: [0.6, -0.05, 0.01, 0.99] as const,
    },
  },
};

const tagline = {
  initial: {
    y: 40,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      delay: 0.2,
      ease: [0.6, -0.05, 0.01, 0.99] as const,
    },
  },
};

interface InitialTransitionProps {
  onComplete?: () => void;
}

export function InitialTransition({ onComplete }: InitialTransitionProps) {
  useEffect(() => {
    // Add overflow-hidden on mount
    document.body.classList.add("overflow-hidden");

    // Safety timeout to ensure overflow-hidden is removed after animation
    const timer = setTimeout(() => {
      document.body.classList.remove("overflow-hidden");
    }, 4500); // Total animation time is ~2s, so 2.5s is safe

    // Cleanup: always remove overflow-hidden when component unmounts
    return () => {
      clearTimeout(timer);
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      <motion.div
        className="relative z-50 flex h-full w-full items-center justify-center bg-black"
        initial="initial"
        animate="animate"
        variants={blackBox}
        onAnimationComplete={() => {
          document.body.classList.remove("overflow-hidden");
          onComplete?.();
        }}
      >
        <motion.div
          variants={textContainer}
          className="absolute z-50 flex flex-col items-center justify-center space-y-6 px-8"
        >
          {/* Title */}
          {/* <motion.h1
            variants={title}
            className="text-center text-6xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl"
          >
            BARCODE
          </motion.h1> */}

          {/* Client Loading Animation */}
          <motion.div
            variants={barcode}
            className="mt-12 flex flex-col items-center gap-4"
          >
            {/* Loading GIF */}
            <div className="relative flex items-center justify-center">
              <img
                src="/Loading Graphic.GIF"
                alt="Loading animation"
                className="h-auto w-64 md:w-80 lg:w-96"
              />
            </div>
          </motion.div>

          {/* Tagline */}

        </motion.div>
      </motion.div>
    </div >
  );
}

