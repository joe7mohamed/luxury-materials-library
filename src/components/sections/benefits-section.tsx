"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Search,
  ShieldCheck,
  LibraryBig,
  Clock,
  Users,
  BadgeCheck,
} from "lucide-react";

// Define our benefits
const benefits = [
  {
    icon: <Search className="h-10 w-10 text-gold" />,
    title: "Effortless Material Discovery",
    description:
      "Quickly find the perfect materials for your project with our intuitive search and filtering system.",
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-gold" />,
    title: "Quality Assurance",
    description:
      "Every material in our library is vetted for quality and authenticity by our expert team.",
  },
  {
    icon: <LibraryBig className="h-10 w-10 text-gold" />,
    title: "Extensive Catalog",
    description:
      "Access thousands of premium materials from the world's leading luxury suppliers.",
  },
  {
    icon: <Clock className="h-10 w-10 text-gold" />,
    title: "Time Saving",
    description:
      "Streamline your material sourcing process with our centralized platform and save valuable time.",
  },
  {
    icon: <Users className="h-10 w-10 text-gold" />,
    title: "Direct Supplier Connections",
    description:
      "Connect directly with suppliers to simplify the procurement process and negotiate the best terms.",
  },
  {
    icon: <BadgeCheck className="h-10 w-10 text-gold" />,
    title: "Expert Curation",
    description:
      "Benefit from our expert-curated selection that showcases the finest luxury materials available.",
  },
];

export function BenefitsSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="section-padding bg-gradient-to-b from-secondary/5 to-background"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            Why Choose{" "}
            <span className="gold-gradient">Luxury Materials Library</span>
          </motion.h2>
          <motion.p
            className="text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Our platform offers unique advantages for interior designers and
            clients seeking premium materials for their projects.
          </motion.p>
        </div>

        {/* Benefits Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="luxury-card hover:border-gold/30"
            >
              <div className="p-6">
                <div className="mb-5">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to action */}
        <motion.div
          className="mt-16 p-8 md:p-12 rounded-2xl bg-primary/5 border border-primary/20 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Elevate Your Design Projects?
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Join our platform today and get access to thousands of premium
            materials, connect with suppliers, and streamline your sourcing
            process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="/register"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200 font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Register Now
            </motion.a>
            <motion.a
              href="/about"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-border hover:bg-secondary/50 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Learn More
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
