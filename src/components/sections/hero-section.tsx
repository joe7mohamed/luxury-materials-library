"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  return (
    <section className="relative min-h-screen pt-24 flex items-center overflow-hidden">
      {/* Background abstract patterns - will be visible on light backgrounds */}
      <div className="absolute inset-0 z-0 opacity-10">
        <svg
          width="100%"
          height="100%"
          className="absolute inset-0"
          viewBox="0 0 1000 1000"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text Content */}
          <motion.div
            className="order-2 lg:order-1"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.span
              className="inline-block mb-4 px-4 py-1 rounded-full bg-secondary/30 text-sm"
              variants={itemVariants}
            >
              The Ultimate Interior Design Resource
            </motion.span>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-balance"
              variants={itemVariants}
            >
              Discover Premium{" "}
              <span className="gold-gradient">Luxury Materials</span> for Your
              Design Vision
            </motion.h1>

            <motion.p
              className="text-lg text-muted-foreground mb-8 max-w-lg text-pretty"
              variants={itemVariants}
            >
              A curated collection of high-end finishing and furnishing
              materials for interior designers and discerning clients seeking
              excellence.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              variants={itemVariants}
            >
              <Link
                href="/register"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 font-medium"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>

              <Link
                href="/categories"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-border hover:bg-secondary/50 transition-colors duration-200"
              >
                Explore Categories
              </Link>
            </motion.div>
          </motion.div>

          {/* Image Content */}
          <motion.div
            className="order-1 lg:order-2 relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="relative h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden">
              {/* Placeholder for actual image - replace with your own luxury interior image */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 z-10 mix-blend-overlay" />

              <Image
                src="/placeholder-luxury-interior.jpg"
                alt="Luxury Interior Design Materials"
                width={800}
                height={600}
                className="object-cover w-full h-full"
                priority
              />

              {/* Floating accent elements */}
              <motion.div
                className="absolute top-10 right-10 w-32 h-32 rounded-full bg-gold-light/20 mix-blend-overlay"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.7, 0.5],
                }}
                transition={{
                  duration: 6,
                  ease: "easeInOut",
                  repeat: Infinity,
                }}
              />

              <motion.div
                className="absolute bottom-10 left-10 w-24 h-24 rounded-full bg-silver/10 mix-blend-overlay"
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 5,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: 1,
                }}
              />
            </div>

            {/* Stats overlay */}
            <motion.div
              className="absolute -bottom-6 left-6 right-6 bg-background/95 backdrop-blur rounded-xl p-4 border border-border/50 shadow-lg"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold gold-gradient">
                    3000+
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Premium Materials
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold gold-gradient">
                    150+
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Luxury Suppliers
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl md:text-3xl font-bold gold-gradient">
                    24/7
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Design Support
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
