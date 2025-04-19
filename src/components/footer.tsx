"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  Phone,
} from "lucide-react";

export function Footer() {
  const footerLinks = {
    company: [
      { name: "About Us", href: "/about" },
      { name: "Our Team", href: "/team" },
      { name: "Careers", href: "/careers" },
      { name: "Contact", href: "/contact" },
    ],
    resources: [
      { name: "Blog", href: "/blog" },
      { name: "Guides", href: "/guides" },
      { name: "FAQ", href: "/faq" },
      { name: "Support", href: "/support" },
    ],
    legal: [
      { name: "Terms of Service", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Cookie Policy", href: "/cookies" },
    ],
  };

  return (
    <footer className="bg-secondary/50 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="col-span-1 lg:col-span-1">
            <Link href="/" className="inline-block">
              <h2 className="text-xl font-bold gold-gradient mb-4">
                LUXURY MATERIALS
              </h2>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md">
              A curated digital hub for sourcing premium finishing and
              furnishing materials for your luxury design projects.
            </p>
            <div className="flex space-x-4">
              <motion.a
                href="#"
                className="p-2 rounded-full bg-secondary hover:bg-secondary/70 transition-colors"
                whileHover={{ y: -3 }}
              >
                <Facebook size={20} />
              </motion.a>
              <motion.a
                href="#"
                className="p-2 rounded-full bg-secondary hover:bg-secondary/70 transition-colors"
                whileHover={{ y: -3 }}
              >
                <Instagram size={20} />
              </motion.a>
              <motion.a
                href="#"
                className="p-2 rounded-full bg-secondary hover:bg-secondary/70 transition-colors"
                whileHover={{ y: -3 }}
              >
                <Twitter size={20} />
              </motion.a>
              <motion.a
                href="#"
                className="p-2 rounded-full bg-secondary hover:bg-secondary/70 transition-colors"
                whileHover={{ y: -3 }}
              >
                <Linkedin size={20} />
              </motion.a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-muted-foreground" />
                <a
                  href="mailto:info@luxurymaterials.com"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  info@luxurymaterials.com
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-muted-foreground" />
                <a
                  href="tel:+1234567890"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-muted-foreground text-sm">
            © {new Date().getFullYear()} Luxury Materials Library. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
