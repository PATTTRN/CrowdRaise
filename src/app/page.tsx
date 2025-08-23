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
    desc: "Donors pay exactly what they intend. We charge campaign creators only 2% on successful withdrawals.",
  },
  {
    icon: "fas fa-rocket",
    title: "Lightning Fast Setup",
    desc: "Create and launch your campaign in under 3 minutes. No back-and-forth, no waiting for approval.",
  },
  {
    icon: "fas fa-mobile-alt",
    title: "Mobile-First Design",
    desc: "Beautiful, intuitive interface that works perfectly on every device. One-tap donations that actually work.",
  },
  {
    icon: "fas fa-chart-line",
    title: "Real-Time Analytics",
    desc: "Track your progress with detailed insights. Know exactly where your donations are coming from.",
  },
  {
    icon: "fas fa-shield-alt",
    title: "Bank-Level Security",
    desc: "Your money is protected with enterprise-grade security and instant fraud detection.",
  },
  {
    icon: "fas fa-clock",
    title: "Instant Withdrawals",
    desc: "Access your funds immediately. No waiting periods, no complex approval processes.",
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
              <a href="#" className="btn-primary">
                Start Fundraising
              </a>
              <a href="#" className="btn-secondary">
                Watch Demo
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

      <section className="cta-section">
        <div className="cta-container">
          <h2>Ready to Launch Your Campaign?</h2>
          <p>
            Join thousands of successful fundraisers who&apos;ve raised millions
            with transparent, donor-friendly fundraising.
          </p>

          <div className="email-signup mx-auto">
            <input
              type="email"
              className="email-input"
              placeholder="Enter your email for early access"
            />
            <a href="#" className="btn-primary mx-auto">
              Get Early Access
            </a>
          </div>

          <p
            style={{
              color: "rgba(255, 255, 255, 0.6)",
              fontSize: "0.9rem",
            }}
          >
            🚀 Launching Q1 2025 • Be among the first to try CrowdRaise
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;