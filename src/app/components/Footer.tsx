"use client";
import Link from "next/link";
import React from "react";

const Footer: React.FC = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-white border-t border-border/50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="text-lg font-bold text-[#0a2540] tracking-tight mb-3">
              CrowdRaise
            </div>
            <p className="text-sm text-[#6b7c93] leading-relaxed">
              The transparent fundraising platform for Africa &amp; beyond.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#0a2540] mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/explore", label: "Explore Collections" },
                { href: "/create_collection", label: "Create Collection" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} onClick={scrollToTop} className="text-sm text-[#6b7c93] hover:text-[#0a2540] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#0a2540] mb-4">Collections</h4>
            <ul className="space-y-3">
              {[
                { href: "/create_collection?type=fundraiser", label: "Start a Fundraiser" },
                { href: "/create_collection?type=occasion", label: "Create a Gift Page" },
                { href: "/create_collection?type=tips", label: "Set Up Tips" },
                { href: "/explore", label: "Browse All" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} onClick={scrollToTop} className="text-sm text-[#6b7c93] hover:text-[#0a2540] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#0a2540] mb-4">Contact</h4>
            <div className="space-y-3">
              <a href="mailto:hello@crowdraise.com" className="flex items-center gap-2 text-sm text-[#6b7c93] hover:text-[#0a2540] transition-colors">
                hello@crowdraise.com
              </a>
              <div className="text-sm text-[#6b7c93]">
                Lagos, Nigeria
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/50 text-center text-sm text-[#6b7c93]">
          &copy; {new Date().getFullYear()} CrowdRaise. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
