"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import AuthModal from "./AuthModal";

const NAV_ITEMS = [
  { href: "/explore", label: "Explore" },
  { href: "/create_collection", label: "Create" },
  { href: "/dashboard", label: "Dashboard" },
];

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    const handleOpenModal = () => setIsAuthModalOpen(true);
    window.addEventListener('open-auth-modal', handleOpenModal);
    return () => window.removeEventListener('open-auth-modal', handleOpenModal);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((open) => !open);
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-neutral-950/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              CrowdRaise
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-white/80 hover:text-white font-medium transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              
              <div className="h-6 w-px bg-white/10 mx-2" />

              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-white/60 text-sm">Hi, {user?.name.split(' ')[0]}</span>
                  <button
                    onClick={() => logout()}
                    className="text-white/90 font-medium px-5 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-all cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-white text-black font-bold px-6 py-2 rounded-full hover:bg-white/90 transition-all cursor-pointer"
                >
                  Login
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <i className={`fas ${isMobileMenuOpen ? "fa-times" : "fa-bars"} text-xl`}></i>
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"} border-t border-white/10 py-4`}
          >
            <div className="flex flex-col space-y-4 px-2">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-white/80 hover:text-white font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-rose-400 font-medium text-left cursor-pointer"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-pink-400 font-medium text-left cursor-pointer"
                >
                  Login / Sign Up
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </>
  );
};

export default Header;