"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Heart, ExternalLink, Info } from "lucide-react";

// Sample featured materials
const featuredMaterials = [
  {
    id: "m1",
    name: "Italian Calacatta Marble",
    category: "Flooring",
    supplier: "Milan Stone Works",
    description:
      "Premium white marble with distinctive gold veining, ideal for luxury flooring and countertops.",
    image: "/placeholder-marble.jpg",
    price: "$$$$",
    featured: true,
  },
  {
    id: "m2",
    name: "French Oak Parquet",
    category: "Flooring",
    supplier: "European Wood Importers",
    description:
      "Hand-crafted oak parquet flooring with a timeless chevron pattern and natural finish.",
    image: "/placeholder-wood.jpg",
    price: "$$$",
    featured: true,
  },
  {
    id: "m3",
    name: "Japanese Washi Wallpaper",
    category: "Wall Finishes",
    supplier: "Kyoto Artisan Papers",
    description:
      "Handmade paper wallcovering with delicate textures and subtle metallic accents.",
    image: "/placeholder-wallpaper.jpg",
    price: "$$$",
    featured: true,
  },
  {
    id: "m4",
    name: "Brushed Brass Hardware",
    category: "Furniture",
    supplier: "Artisan Metal Works",
    description:
      "Precision-crafted brass hardware with a warm, brushed finish for cabinetry and furniture.",
    image: "/placeholder-brass.jpg",
    price: "$$",
    featured: true,
  },
  {
    id: "m5",
    name: "Venetian Plaster",
    category: "Wall Finishes",
    supplier: "Italian Finishes",
    description:
      "Traditional lime-based plaster with a polished marble-like appearance for sophisticated walls.",
    image: "/placeholder-plaster.jpg",
    price: "$$$",
    featured: true,
  },
  {
    id: "m6",
    name: "Hand-Knotted Silk Rug",
    category: "Textiles",
    supplier: "Persian Luxury Textiles",
    description:
      "100% natural silk rug with intricate hand-knotted patterns inspired by classical Persian designs.",
    image: "/placeholder-rug.jpg",
    price: "$$$$",
    featured: true,
  },
];

export function FeaturedMaterials() {
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
    <section ref={sectionRef} className="section-padding">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
          >
            Featured <span className="gold-gradient">Luxury Materials</span>
          </motion.h2>
          <motion.p
            className="text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Discover our handpicked selection of premium materials that
            represent the pinnacle of quality and design excellence.
          </motion.p>
        </div>

        {/* Materials Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {featuredMaterials.map((material) => (
            <motion.div key={material.id} variants={itemVariants}>
              <div className="material-card group h-full flex flex-col">
                <div className="relative overflow-hidden rounded-t-lg">
                  {/* Overlay for hover effects */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <Image
                    src={material.image}
                    alt={material.name}
                    width={500}
                    height={400}
                    className="material-card-image"
                  />

                  {/* Featured badge */}
                  {material.featured && (
                    <div className="absolute top-3 left-3 bg-gold/90 text-white text-xs font-medium py-1 px-2 rounded-full z-20">
                      Featured
                    </div>
                  )}

                  {/* Price indicator */}
                  <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm text-xs font-medium py-1 px-2 rounded-full z-20">
                    {material.price}
                  </div>

                  {/* Hover action buttons */}
                  <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <button className="p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors">
                      <Heart className="h-5 w-5" />
                    </button>
                    <Link
                      href={`/materials/${material.id}`}
                      className="p-2 rounded-full bg-primary/90 text-primary-foreground hover:bg-primary transition-colors"
                    >
                      <Info className="h-5 w-5" />
                    </Link>
                  </div>
                </div>

                <div className="p-5 flex-grow flex flex-col">
                  <div className="mb-3">
                    <span className="text-xs font-medium bg-secondary/40 px-2 py-1 rounded-full">
                      {material.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {material.name}
                  </h3>

                  <p className="text-muted-foreground text-sm mb-4 flex-grow">
                    {material.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs text-muted-foreground">
                      By {material.supplier}
                    </span>

                    <Link
                      href={`/materials/${material.id}`}
                      className="flex items-center text-sm font-medium text-primary group-hover:text-gold transition-colors"
                    >
                      View Details
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
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
            href="/materials"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
          >
            Explore All Materials
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
