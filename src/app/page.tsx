"use client";
import React, { useEffect, useRef } from "react";

const HERO_STATS = [
  { value: 2.4, suffix: "M+", label: "Raised", prefix: "₦" },
  { value: 1200, suffix: "+", label: "Campaigns" },
  { value: 98, suffix: "%", label: "Happy Users" },
];

const FEATURES = [
  {
    icon: "fas fa-hand-holding-heart",
    title: "Zero Donor Fees",
    desc: "Donors pay exactly what they intend.",
  },
  {
    icon: "fas fa-rocket",
    title: "Lightning Fast Setup",
    desc: "Create and launch your campaign in under 3 minutes.",
  },
  {
    icon: "fas fa-mobile-alt",
    title: "Mobile-First Design",
    desc: "Beautiful, intuitive interface that works perfectly on every device. One-tap donations that actually work.",
  },
];

function createParticles(container: HTMLElement) {
  const particleCount = 50;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.top = Math.random() * 100 + "%";
    particle.style.animationDelay = Math.random() * 6 + "s";
    particle.style.animationDuration = Math.random() * 4 + 4 + "s";
    container.appendChild(particle);
  }
}

function animateCounter(
  element: HTMLElement,
  target: number,
  suffix: string,
  prefix: string = "",
  duration = 2000
) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    if (prefix === "₦" && suffix === "M+") {
      element.textContent = prefix + current.toFixed(1) + suffix;
    } else if (suffix === "%") {
      element.textContent = current.toFixed(0) + suffix;
    } else {
      element.textContent = prefix + current.toFixed(0) + suffix;
    }
  }, 16);
}

const HomePage: React.FC = () => {
  const particlesRef = useRef<HTMLDivElement>(null);
  const heroStatsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create floating particles
    if (particlesRef.current && particlesRef.current.childElementCount === 0) {
      createParticles(particlesRef.current);
    }

    // Smooth scrolling for navigation links
    const handleNavClick = (e: Event) => {
      const anchor = e.currentTarget as HTMLAnchorElement;
      const href = anchor.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    };
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach((link) => {
      link.addEventListener("click", handleNavClick);
    });

    // Add scroll effect to navigation
    const nav = document.querySelector("nav");
    const handleScroll = () => {
      if (!nav) return;
      if (window.scrollY > 100) {
        (nav as HTMLElement).style.background = "rgba(255, 255, 255, 0.15)";
      } else {
        (nav as HTMLElement).style.background = "rgba(255, 255, 255, 0.1)";
      }
    };
    window.addEventListener("scroll", handleScroll);

    // Add hover effects to CTA buttons
    const ctaBtns = document.querySelectorAll(".btn-primary, .btn-secondary");
    ctaBtns.forEach((btn) => {
      btn.addEventListener("mouseenter", (e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-3px) scale(1.05)";
      });
      btn.addEventListener("mouseleave", (e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0) scale(1)";
      });
    });

    // Counter animation for stats
    let observer: IntersectionObserver | null = null;
    if (heroStatsRef.current) {
      const statNumbers = heroStatsRef.current.querySelectorAll(
        ".stat-number"
      );
      observer = new window.IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              statNumbers.forEach((stat, index) => {
                const { value, suffix, prefix } = HERO_STATS[index];
                setTimeout(() => {
                  animateCounter(
                    stat as HTMLElement,
                    value,
                    suffix,
                    prefix || "",
                    2000
                  );
                }, index * 200);
              });
              observer && observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.5,
          rootMargin: "0px 0px -100px 0px",
        }
      );
      observer.observe(heroStatsRef.current);
    }

    // Cleanup
    return () => {
      navLinks.forEach((link) => {
        link.removeEventListener("click", handleNavClick);
      });
      window.removeEventListener("scroll", handleScroll);
      ctaBtns.forEach((btn) => {
        btn.removeEventListener("mouseenter", function () {});
        btn.removeEventListener("mouseleave", function () {});
      });
      if (observer && heroStatsRef.current) {
        observer.unobserve(heroStatsRef.current);
      }
    };
  }, []);

  return (
    <div>
      <div className="bg-particles" id="particles" ref={particlesRef}></div>

      {/* <Header /> */}

      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1>
              Fundraising Made <span className="highlight">Transparent</span>
            </h1>
            <p>
              The donation platform that puts donors first. No hidden fees,
              crystal clear pricing, and an interface so simple your grandmother
              could use it.
            </p>

            <div className="cta-buttons">
              <a href="/create_campaign" className="btn-primary">
                Start Fundraising
              </a>
              <a href="/explore" className="btn-secondary">
                Donate to a Cause
              </a>
            </div>

            <div className="hero-stats" ref={heroStatsRef}>
              {HERO_STATS.map((stat, idx) => (
                <div className="stat" key={stat.label}>
                  <span className="stat-number">
                    {stat.prefix}
                    {stat.value}
                    {stat.suffix}
                  </span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-visual">
            <div className="dashboard-mockup">
              <div className="mockup-header">
                <div className="mockup-avatar"></div>
                <div className="mockup-info">
                  <h3>Help Sarah&apos;s Education</h3>
                  <p>Medical School Fundraiser</p>
                </div>
              </div>
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
              <div className="donation-amount">₦485,000 raised</div>
              <p
                style={{
                  color: "rgba(255, 255, 255, 0.6)",
                  textAlign: "center",
                }}
              >
                of ₦650,000 goal • 28 days left
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="features" id="features">
        <div className="features-container">
          <h2>Why Choose CrowdRaise?</h2>
          <p className="features-subtitle">
            We&apos;ve rebuilt fundraising from the ground up, addressing every
            pain point that makes people avoid donation platforms.
          </p>

          <div className="features-grid">
            {FEATURES.map((feature) => (
              <div className="feature-card" key={feature.title}>
                <i className={`${feature.icon} feature-icon`} />
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section py-20" id="about">
        <div className="about-container max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            About CrowdRaise
          </h2>
          <p className="text-white/80 text-lg mb-10">
            CrowdRaise is a next-generation fundraising platform built to empower individuals, communities, and organizations to make a real impact.
            Our mission is to make fundraising transparent, accessible, and truly donor-friendly. Whether you want to support a cause or start your own,
            CrowdRaise gives you the tools to succeed—no hidden fees, no confusing processes, just real results.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex-1 min-w-[250px] max-w-xs bg-white/10 rounded-xl p-8 flex flex-col items-center">
              <i className="fas fa-users text-3xl text-primary-400 mb-3"></i>
              <h3 className="text-white font-semibold text-lg mb-2">
                Community Driven
              </h3>
              <p className="text-white/70">
                Built for people, by people. We listen to our users and improve constantly.
              </p>
            </div>
            <div className="flex-1 min-w-[250px] max-w-xs bg-white/10 rounded-xl p-8 flex flex-col items-center">
              <i className="fas fa-lock text-3xl text-red-400 mb-3"></i>
              <h3 className="text-white font-semibold text-lg mb-2">
                Secure &amp; Transparent
              </h3>
              <p className="text-white/70">
                Your donations and data are protected with industry-leading security and transparency.
              </p>
            </div>
            <div className="flex-1 min-w-[250px] max-w-xs bg-white/10 rounded-xl p-8 flex flex-col items-center">
              <i className="fas fa-globe-africa text-3xl text-primary-400 mb-3"></i>
              <h3 className="text-white font-semibold text-lg mb-2">
                For Africa &amp; Beyond
              </h3>
              <p className="text-white/70">
                Designed for the unique needs of African communities, but open to the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section (replaces Get Early Access) */}
      <section className="cta-section" id="cta">
        <div className="cta-container">
          <h2>Make a Difference Today</h2>
          <p>
            Whether you want to support a cause or start your own, CrowdRaise makes it easy to take action.
          </p>
          <div className="flex flex-col sm:flex-row justify-center align-center gap-6 mb-6 w-full">
            <a
              href="/create_campaign"
              className="btn-primary min-w-[180px] text-center transition-transform duration-150"
            >
              Create a Campaign
            </a>
            <a
              href="/explore"
              className="btn-secondary min-w-[180px] text-center transition-transform duration-150"
            >
              Donate to a Cause
            </a>
          </div>
          <p className="text-white/60 text-sm">
            Join thousands of changemakers on CrowdRaise.
          </p>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="contact-section py-20 bg-white/5" id="contact">
        <div className="contact-container max-w-xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Contact Us
          </h2>
          <p className="text-white/80 mb-8">
            Have questions, feedback, or want to partner with us? We&apos;d love to hear from you!
          </p>
          <form
            className="flex flex-col gap-5 max-w-xl mx-auto"
            onSubmit={e => {
              e.preventDefault();
              alert("Thank you for reaching out! We'll get back to you soon.");
            }}
          >
            <input
              type="text"
              placeholder="Your Name"
              required
              className="px-5 py-3 rounded-lg border-none bg-white/20 text-white text-base focus:outline-none focus:ring-2 focus:ring-primary-400 placeholder-white/60"
            />
            <input
              type="email"
              placeholder="Your Email"
              required
              className="px-5 py-3 rounded-lg border-none bg-white/20 text-white text-base focus:outline-none focus:ring-2 focus:ring-primary-400 placeholder-white/60"
            />
            <textarea
              placeholder="Your Message"
              required
              rows={4}
              className="px-5 py-3 rounded-lg border-none bg-white/20 text-white text-base resize-vertical focus:outline-none focus:ring-2 focus:ring-primary-400 placeholder-white/60"
            />
            <button
              type="submit"
              className="btn-primary w-full font-semibold text-lg mt-2 transition-transform duration-150"
            >
              Send Message
            </button>
          </form>
          {/* <div className="mt-8 text-white/50 text-sm">
            Or email us directly at <a href="mailto:hello@crowdraise.com" className="text-primary-400">hello@crowdraise.com</a>
          </div> */}
        </div>
      </section>
    </div>
  );
};

export default HomePage;