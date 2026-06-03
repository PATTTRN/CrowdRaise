"use client";
import Link from "next/link";
import React from "react";
import { Mail, MapPin, Globe, MessageCircle, Camera } from "lucide-react";

const Footer: React.FC = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-white border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="text-xl font-bold bg-gradient-to-r from-rose-500 via-rose-500 to-cyan-500 bg-clip-text text-transparent mb-3">
              CrowdRaise
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The transparent fundraising platform for Africa &amp; beyond.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/explore", label: "Explore Collections" },
                { href: "/create_collection", label: "Create Collection" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={scrollToTop}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Collection Types */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Collections</h4>
            <ul className="space-y-2">
              {[
                { href: "/create_collection?type=fundraiser", label: "Start a Fundraiser" },
                { href: "/create_collection?type=occasion", label: "Create a Gift Page" },
                { href: "/create_collection?type=tips", label: "Set Up Tips" },
                { href: "/explore", label: "Browse All" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={scrollToTop}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Contact</h4>
            <div className="space-y-2">
              <a
                href="mailto:hello@crowdraise.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="size-4" />
                hello@crowdraise.com
              </a>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="size-4" />
                Lagos, Nigeria
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
              >
                <Globe className="size-4" />
              </a>
              <a
                href="https://facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
              >
                <MessageCircle className="size-4" />
              </a>
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
              >
                <Camera className="size-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border text-center text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} CrowdRaise. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
