"use client";
import Link from "next/link";
import React, { useState } from "react";

const NAV_ITEMS = [
  { href: "/explore", label: "Explore Collections" },
  { href: "/create_collection", label: "Create Collection" },
  { href: "/dashboard", label: "Dashboard" },
];

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((open) => !open);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-white">
            CrowdRaise
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-white/90 no-underline font-medium px-6 py-2 rounded-full transition-all duration-300 border border-white/30 backdrop-blur-md hover:bg-white/10 hover:-translate-y-0.5"
              >
                {item.label}
              </a>
            ))}
            {/* <a
              href="/#about"
              className="text-white/90 no-underline font-medium px-6 py-2 rounded-full transition-all duration-300 border border-white/30 backdrop-blur-md hover:bg-white/10 hover:-translate-y-0.5"
            >
              About
            </a>
            <a
              href="/#contact"
              className="text-white/90 no-underline font-medium px-6 py-2 rounded-full transition-all duration-300 border border-white/30 backdrop-blur-md hover:bg-white/10 hover:-translate-y-0.5"
            >
              Contact
            </a> */}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <i className={`fas ${isMobileMenuOpen ? "fa-times" : "fa-bars"} text-xl`}></i>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"} border-t border-white/20`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block px-3 py-2 text-white/90 rounded-md hover:bg-white/10 transition-colors"
              >
                {item.label}
              </a>
            ))}
            {/* <a
              href="#about"
              className="block px-3 py-2 text-white/90 rounded-md hover:bg-white/10 transition-colors"
            >
              About
            </a>
            <a
              href="#contact"
              className="block px-3 py-2 text-white/90 rounded-md hover:bg-white/10 transition-colors"
            >
              Contact
            </a> */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;