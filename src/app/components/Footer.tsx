import Link from "next/link";
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1e1e28]/[0.98] border-t border-white/10 pt-10 pb-6 px-4 text-white/85">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row flex-wrap gap-8 md:gap-0 justify-between items-start">
        {/* Brand */}
        <div className="min-w-[200px] flex-1 mb-8 md:mb-0">
          <div className="font-bold text-2xl text-[#4ecdc4] mb-2 tracking-wide">
            CrowdRaise
          </div>
          <div className="text-base text-white/70">
            The transparent fundraising platform for Africa &amp; beyond.
          </div>
        </div>
        {/* Quick Links */}
        <div className="min-w-[150px] flex-1 mb-8 md:mb-0">
          <div className="font-semibold mb-2">Quick Links</div>
          <ul className="space-y-1 text-white/85">
            <li>
              <Link href="/" className="hover:text-[#4ecdc4] transition-colors">
                Home
              </Link>
            </li>
            <li>
              <a href="/explore" className="hover:text-[#4ecdc4] transition-colors">
                Explore Campaigns
              </a>
            </li>
            <li>
              <a href="/create_campaign" className="hover:text-[#4ecdc4] transition-colors">
                Start Fundraising
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-[#4ecdc4] transition-colors">
                About
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-[#4ecdc4] transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </div>
        {/* Contact */}
        <div className="min-w-[180px] flex-1">
          <div className="font-semibold mb-2">Contact</div>
          <div className="text-base text-white/70">
            <div>
              <a
                href="mailto:hello@crowdraise.com"
                className="text-[#4ecdc4] hover:underline"
              >
                hello@crowdraise.com
              </a>
            </div>
            <div className="mt-2 text-white/50 text-sm">Lagos, Nigeria</div>
          </div>
          <div className="mt-4 flex gap-4">
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="text-[#4ecdc4] text-xl hover:scale-110 transition-transform"
            >
              <i className="fab fa-twitter" />
            </a>
            <a
              href="https://facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-[#4ecdc4] text-xl hover:scale-110 transition-transform"
            >
              <i className="fab fa-facebook" />
            </a>
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-[#4ecdc4] text-xl hover:scale-110 transition-transform"
            >
              <i className="fab fa-instagram" />
            </a>
          </div>
        </div>
      </div>
      <div className="text-center mt-10 text-white/40 text-sm tracking-wide">
        &copy; {new Date().getFullYear()} CrowdRaise. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

