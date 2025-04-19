// components/navbar.tsx (updated)
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";

export function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
    setProfileMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return "/login";

    switch (user.userType) {
      case "admin":
        return "/admin";
      case "supplier":
        return "/supplier";
      case "projectOwner":
        return "/project-owner";
      default:
        return "/login";
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Materials", href: "/materials" },
    { name: "Categories", href: "/categories" },
    { name: "Suppliers", href: "/suppliers" },
    { name: "About", href: "/about" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/90 dark:bg-black/90 backdrop-blur-md shadow-md py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <motion.span
            className="text-xl md:text-2xl font-bold gold-gradient"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            MATERIALS LIBRARY
          </motion.span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <ul className="flex space-x-6">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-foreground/80 hover:text-foreground transition-colors duration-200"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-secondary/70 transition-colors duration-200"
                >
                  <span className="font-medium">{user.name}</span>
                  <User size={20} />
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-background border border-border">
                    <div className="py-1">
                      <Link
                        href={getDashboardLink()}
                        className="block px-4 py-2 text-sm hover:bg-secondary/50"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-secondary/50"
                      >
                        <div className="flex items-center space-x-2">
                          <LogOut size={16} />
                          <span>Logout</span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-full border border-border hover:bg-secondary transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Navigation Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="p-2 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="md:hidden bg-background border-t border-border"
        >
          <div className="container mx-auto px-4 py-6">
            <ul className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="block py-2 text-foreground/80 hover:text-foreground transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col space-y-3">
              {user ? (
                <>
                  <div className="py-2 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-1">
                      Signed in as
                    </p>
                    <p className="font-medium">{user.name}</p>
                  </div>
                  <Link
                    href={getDashboardLink()}
                    className="block text-center py-3 rounded-full border border-border hover:bg-secondary transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block text-center py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block text-center py-3 rounded-full border border-border hover:bg-secondary transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block text-center py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
}
