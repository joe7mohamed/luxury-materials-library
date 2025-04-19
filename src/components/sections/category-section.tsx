"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { ChevronRight } from "lucide-react";

// Define our material categories based on the SRS document
const categories = [
  {
    id: "flooring",
    name: "Flooring",
    description: "Luxury flooring options including hardwood, marble, and designer tiles",
    image: "/placeholder-flooring.jpg",
    count: 450,
  },
  {
    id: "walls",
    name: "Wall Finishes",
    description: "Premium wall coverings, paints, and decorative panels",
    image: "/placeholder-walls.jpg",
    count: 380,
  },
  {
    id: "furniture",
    name: "Furniture",
    description: "High-end furniture materials and finishes",
    image: "/placeholder-furniture.jpg",
    count: 520,
  },
  {
    id: "lighting",
    name: "Lighting",
    description: "Designer lighting fixtures and accessories",
    image: "/placeholder-lighting.jpg",
    count: 290,
  },
  {
    id: "pools",
    name: "Swimming Pools",
    description: "Premium pool materials, tiles, and filtration systems",
    image: "/placeholder-pools.jpg",
    count: 175,
  },
  {
    id: "kitchens",
    name: "Kitchens",
    description: "Luxury kitchen materials, cabinetry, and appliances",
    image: "/placeholder-kitchens.jpg",
    count: 340,
  },
  {
    id: "outdoor",
    name: "Outdoor & Landscaping",
    description: "High-quality outdoor materials for luxury landscapes",
    image: "/placeholder-outdoor.jpg",
    count: 210,
  },
  {
    id: "textiles",
    name: "Textiles & Fabrics",
    description: "Designer fabrics, upholstery, and textile materials",
    image: "/placeholder-textiles.jpg",
    count: 320,
  },
];

export function CategorySection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

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
      transition: { duration: 0.5, ease: "easeOut" }
    },
  };

  return (
    <section ref={sectionRef} className="section-padding bg-secondary/5">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            Explore <span className="gold-gradient">Material Categories</span>
          </motion.h2>
          <motion.p 
            className="text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Browse our extensive collection of premium materials organized by category to find the perfect match for your luxury design projects.
          </motion.p>
        </div>

        {/* Categories Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={itemVariants}>
              <Link 
                href={`/categories/${category.id}`}
                className="block group"
              >
                <div className="luxury-card group-hover:border-gold/30 overflow-hidden h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium z-20">
                      {category.count}+ items
                    </div>
                  </div>

                  <div className="p-5 flex-grow flex flex-col">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 flex-grow">
                      {category.description}
                    </p>
                    <div className="flex items-center text-sm font-medium text-primary group-hover:text-gold transition-colors">
                      Explore Materials
                      <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Link */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link 
            href="/categories" 
            className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-border hover:bg-secondary/20 transition-colors duration-200"
          >
            View All Categories
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}