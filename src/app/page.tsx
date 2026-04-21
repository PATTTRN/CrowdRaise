"use client";
import React, { useEffect, useRef, useState } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

const HERO_STATS = [
  { value: 2.4, suffix: "M+", label: "Collected", prefix: "₦" },
  { value: 1200, suffix: "+", label: "Collections" },
  { value: 98, suffix: "%", label: "Happy Users" },
];

const COLLECTION_TYPES = [
  {
    id: "fundraiser",
    emoji: "🌟",
    label: "Fundraiser",
    tagline: "Rally support for your cause",
    description:
      "Medical bills, education, emergencies, community projects — bring your cause to life with a campaign page that moves people.",
    color: "#f43f5e",
    gradient: "linear-gradient(135deg, #f43f5e, #fb923c)",
    bgAccent: "rgba(244,63,94,0.10)",
    borderAccent: "rgba(244,63,94,0.28)",
    examples: [
      "Medical surgery fund",
      "Student scholarship",
      "Flood relief",
      "Community borehole",
    ],
    cta: "Start a fundraiser",
    href: "/create_campaign?type=fundraiser",
  },
  {
    id: "occasion",
    emoji: "🎉",
    label: "Occasion Gifts",
    tagline: "Make celebrations unforgettable",
    description:
      "Wedding? Birthday? Baby shower? Create a beautiful gift collection page so your guests can chip in with love — no awkward cash envelopes.",
    color: "#8b5cf6",
    gradient: "linear-gradient(135deg, #8b5cf6, #ec4899)",
    bgAccent: "rgba(139,92,246,0.10)",
    borderAccent: "rgba(139,92,246,0.28)",
    examples: [
      "Traditional wedding",
      "30th birthday bash",
      "Baby arrival gift",
      "Anniversary celebration",
    ],
    cta: "Create a gift page",
    href: "/create_campaign?type=occasion",
  },
  {
    id: "tips",
    emoji: "💸",
    label: "Tips & Show Love",
    tagline: "Let fans support your hustle",
    description:
      "Content creator, freelancer, performer, or just someone doing great things — accept appreciation in the most direct way possible.",
    color: "#06b6d4",
    gradient: "linear-gradient(135deg, #06b6d4, #3b82f6)",
    bgAccent: "rgba(6,182,212,0.10)",
    borderAccent: "rgba(6,182,212,0.28)",
    examples: [
      "YouTube creator",
      "DJ / performer",
      "Freelance designer",
      "Street food vendor",
    ],
    cta: "Set up a tip page",
    href: "/create_campaign?type=tips",
  },
];

// Cards that rotate inside the mockup
const MOCKUP_CARDS = [
  {
    type: "fundraiser",
    label: "Fundraiser 🌟",
    title: "Help Sarah's Medical School",
    sub: "Medical & Healthcare · Lagos",
    raised: "₦485,000 raised",
    goal: "of ₦650,000 goal · 28 days left",
    pct: 74,
    color: "rgb(219, 66, 201)",
    gradient: "linear-gradient(90deg,rgb(151, 58, 73),rgb(219, 66, 201))",
    supporters: "142 donors",
    image:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Young african student in medical attire smiling",
  },
  {
    type: "occasion",
    label: "Occasion Gift 🎉",
    title: "Tobi & Chisom's Wedding",
    sub: "Wedding · Lagos",
    raised: "₦320,000 gifted",
    goal: "of ₦500,000 goal · March 15",
    pct: 64,
    color: "#8b5cf6",
    gradient: "linear-gradient(90deg, #8b5cf6, #ec4899)",
    supporters: "67 gift givers",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Beautiful wedding celebration with happy couple",
  },
  {
    type: "tips",
    label: "Tips Page 💸",
    title: "Support DJ Kemi",
    sub: "Music & Entertainment · Abuja",
    raised: "₦95,000 received",
    goal: "of ₦200,000 target · ongoing",
    pct: 47,
    color: "#06b6d4",
    gradient: "linear-gradient(90deg, #06b6d4, #3b82f6)",
    supporters: "89 supporters",
    image:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=700&q=80",
    imageAlt: "Female DJ performing to an excited crowd",
  },
];

const FEATURES = [
  {
    icon: "fas fa-hand-holding-heart",
    title: "Zero Donor Fees",
    desc: "Donors pay exactly what they intend. No hidden charges, ever.",
  },
  {
    icon: "fas fa-rocket",
    title: "Lightning Fast Setup",
    desc: "Create and launch your collection in under 3 minutes.",
  },
  {
    icon: "fas fa-mobile-alt",
    title: "Mobile-First Design",
    desc: "Beautiful, intuitive interface that works perfectly on every device.",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function createParticles(container: HTMLElement) {
  for (let i = 0; i < 50; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    p.style.left = Math.random() * 100 + "%";
    p.style.top = Math.random() * 100 + "%";
    p.style.animationDelay = Math.random() * 6 + "s";
    p.style.animationDuration = Math.random() * 4 + 4 + "s";
    container.appendChild(p);
  }
}

function animateCounter(
  element: HTMLElement,
  target: number,
  suffix: string,
  prefix = "",
  duration = 2000
) {
  const increment = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) { current = target; clearInterval(timer); }
    if (prefix === "₦" && suffix === "M+") element.textContent = prefix + current.toFixed(1) + suffix;
    else if (suffix === "%") element.textContent = current.toFixed(0) + suffix;
    else element.textContent = prefix + current.toFixed(0) + suffix;
  }, 16);
}

// ─── Component ────────────────────────────────────────────────────────────────

const HomePage: React.FC = () => {
  const particlesRef = useRef<HTMLDivElement>(null);
  const heroStatsRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState(0);

  // Rotate mockup cards every 1.6 s (increased speed as per request)
  useEffect(() => {
    const interval = setInterval(
      () => setActiveCard((p) => (p + 1) % MOCKUP_CARDS.length),
      1600
    );
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (particlesRef.current && particlesRef.current.childElementCount === 0) {
      createParticles(particlesRef.current);
    }

    const nav = document.querySelector("nav");
    const handleScroll = () => {
      if (!nav) return;
      (nav as HTMLElement).style.background =
        window.scrollY > 100 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.1)";
    };
    window.addEventListener("scroll", handleScroll);

    let observer: IntersectionObserver | null = null;
    if (heroStatsRef.current) {
      const statNumbers = heroStatsRef.current.querySelectorAll(".stat-number");
      observer = new window.IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              statNumbers.forEach((stat, i) => {
                const { value, suffix, prefix } = HERO_STATS[i];
                setTimeout(
                  () =>
                    animateCounter(
                      stat as HTMLElement,
                      value,
                      suffix,
                      prefix || "",
                      2000
                    ),
                  i * 200
                );
              });
              observer?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5, rootMargin: "0px 0px -100px 0px" }
      );
      observer.observe(heroStatsRef.current);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (observer && heroStatsRef.current)
        observer.unobserve(heroStatsRef.current);
    };
  }, []);

  const card = MOCKUP_CARDS[activeCard];

  return (
    <div>
      <div className="bg-particles" id="particles" ref={particlesRef}></div>

      <section className="hero">
        <div className="hero-container">
          {/* ── Left: hero-content ── */}
          <div className="hero-content">
            {/* Live badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.18)",
                borderRadius: "999px",
                padding: "5px 14px",
                fontSize: "13px",
                color: "rgba(255,255,255,0.7)",
                marginBottom: "22px",
                backdropFilter: "blur(8px)",
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#4ade80",
                  display: "inline-block",
                }}
              />
              Fundraise · Gift Collections · Tips — all in one place
            </div>

            <h1>
              Money Collection Made{" "}
              <span
                className="highlight"
                style={{
                  background:
                    "linear-gradient(135deg, #f43f5e 0%,rgb(31, 15, 69) 55%, #06b6d4 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Beautifully Simple
              </span>
            </h1>

            <p>
              Whether you&apos;re raising funds for a cause, collecting gifts for a
              special moment, or letting your fans show love — CrowdRaise makes it
              effortless, transparent, and completely free of hidden fees.
            </p>

            <div className="cta-buttons">
              <a href="/create_campaign" className="btn-primary">
                Start a Collection
              </a>
              <a href="/explore" className="btn-secondary">
                Explore Collections
              </a>
            </div>

            <div className="hero-stats" ref={heroStatsRef}>
              {HERO_STATS.map((stat) => (
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

          {/* ── Right: hero-visual / dashboard-mockup (original classes) ── */}
          <div className="hero-visual">
            {/* Custom keyframes for card tilt animation */}
            <style>{`
              @keyframes idWiggle {
                0%   { transform: rotate(-4deg); }
                50%  { transform: rotate(4deg); }
                100% { transform: rotate(-4deg); }
              }
              .dashboard-mockup {
                animation: idWiggle 1.6s ease-in-out infinite !important;
                transform-origin: bottom center;
              }
            `}</style>
            <div
              className="dashboard-mockup"
              style={{
                // Card with background image
                background: `
                  linear-gradient(0deg, rgba(18,16,38,0.62) 60%, rgba(0,0,0,0.20) 100%),
                  url('${card.image}')
                `,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                borderRadius: 24,
                boxShadow:
                  "0px 7px 32px 0px rgba(0,0,0,0.08), 0px 1.5px 6px 0 rgba(0,0,0,0.03)",
                minHeight: 380,
                maxWidth: "35vw",
                width: "100%",
                transition: "background-image 0.7s, box-shadow 0.19s",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Dot nav — lets user also click to switch card */}
              <div
                style={{
                  display: "flex",
                  gap: "6px",
                  justifyContent: "center",
                  marginBottom: "14px",
                  marginTop: "14px"
                }}
              >
                {MOCKUP_CARDS.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveCard(i)}
                    style={{
                      width: i === activeCard ? 22 : 6,
                      height: 6,
                      borderRadius: "999px",
                      background:
                        i === activeCard ? c.color : "rgba(255,255,255,0.22)",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      transition: "all 0.35s ease",
                    }}
                    aria-label={`Switch to ${c.label} card`}
                  />
                ))}
              </div>

              {/* Collection type pill */}
              <div style={{ textAlign: "center", marginBottom: "12px" }}>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    color: card.color,
                    background: `${card.color}1a`,
                    border: `1px solid ${card.color}40`,
                    borderRadius: "999px",
                    padding: "3px 11px",
                    transition: "all 0.4s ease",
                    display: "inline-block",
                  }}
                >
                  {card.label}
                </span>
              </div>

              {/* Avatar + info — original .mockup-header structure */}
              <div className="mockup-header" style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: "12px",
                margin: "0 30px"
              }}>
                <div
                  className="mockup-avatar"
                  style={{
                    background: card.gradient,
                    transition: "background 0.5s ease",
                  }}
                />
                <div className="mockup-info">
                  <h3 style={{
                    transition: "all 0.3s ease",
                    color: "#fff",
                    margin: 0
                  }}>{card.title}</h3>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.7)",
                      fontSize: "12px",
                      transition: "all 0.3s ease",
                      margin: 0
                    }}
                  >
                    {card.sub}
                  </p>
                </div>
              </div>

              {/* Progress bar — original .progress-bar class, dynamic fill */}
              <div
                className="progress-bar"
                style={{
                  background: "rgba(255,255,255,0.20)",
                  borderRadius: "6px",
                  height: 9,
                  margin: "28px 30px 0px 30px",
                  position: "relative",
                  boxShadow: "0 1.5px 8px 0 rgba(0,0,0,0.07)",
                  overflow: "hidden",
                }}
              >
                <div
                  className="progress-fill"
                  style={{
                    width: `${card.pct}%`,
                    background: card.gradient,
                    height: "100%",
                    borderRadius: "6px",
                    boxShadow: "0 1.5px 6px 0 rgba(0,0,0,0.11)",
                    transition: "width 0.7s ease, background 0.5s ease",
                  }}
                />
              </div>

              {/* Raised */}
              <div
                className="donation-amount"
                style={{
                  color: card.color,
                  transition: "color 0.4s ease",
                  margin: "20px 0 0 0",
                  fontWeight: 600,
                  fontSize: "1.25rem",
                  textAlign: "center",
                  textShadow: "0 1.5px 8px rgba(0,0,0,0.18)",
                  letterSpacing: 0.2,
                }}
              >
                {card.raised}
              </div>

              {/* Goal */}
              <p
                style={{
                  color: "rgba(255,255,255,0.8)",
                  textAlign: "center",
                  fontSize: "13px",
                  margin: "6px 0 0 0",
                  textShadow: "0 1.5px 8px rgba(0,0,0,0.13)",
                  fontWeight: 400
                }}
              >
                {card.goal}
              </p>

              {/* Supporters row */}
              <div
                style={{
                  marginTop: "14px",
                  paddingTop: "12px",
                  borderTop: "1px solid rgba(255,255,255,0.16)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.82)",
                  textShadow: "0 1px 6px rgba(0,0,0,0.15)"
                }}
              >
                <span style={{ color: card.color, fontWeight: 800, fontSize: "15px" }}>♥</span>
                {card.supporters}
              </div>
              {/* Subtle overlay for extra gradient at the bottom for readability */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 24,
                  background: "linear-gradient(0deg, rgba(18,18,38,0.36) 75%, rgba(0,0,0,0.00) 100%)",
                  zIndex: 1,
                  pointerEvents: "none",
                  transition: "opacity 0.5s"
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          THREE COLLECTION TYPES
          ══════════════════════════════════════════ */}
      <section className="features" id="features">
        <div className="features-container">
          <h2>Three Ways to Collect</h2>
          <p className="features-subtitle">
            Pick the type that fits your moment. Each is built and designed specifically for that purpose.
          </p>
          <div className="features-grid">
            {COLLECTION_TYPES.map((type) => (
              <div
                key={type.id}
                className="feature-card"
                style={{
                  borderColor: type.borderAccent,
                  borderWidth: 1,
                  borderStyle: "solid",
                }}
              >
                <span
                  style={{
                    fontSize: "30px",
                    display: "block",
                    marginBottom: "10px",
                  }}
                >
                  {type.emoji}
                </span>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: type.color,
                    background: type.bgAccent,
                    borderRadius: "999px",
                    padding: "3px 10px",
                    display: "inline-block",
                    marginBottom: "10px",
                  }}
                >
                  {type.label}
                </span>
                <h3>{type.tagline}</h3>
                <p style={{ fontSize: "14px", marginBottom: "14px" }}>
                  {type.description}
                </p>
                <div style={{ marginBottom: "18px" }}>
                  {type.examples.map((ex) => (
                    <div
                      key={ex}
                      style={{
                        fontSize: "12px",
                        color: "rgba(255,255,255,0.45)",
                        marginBottom: "4px",
                        display: "flex",
                        gap: "6px",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{ color: type.color, fontWeight: "bold" }}
                      >
                        →
                      </span>
                      {ex}
                    </div>
                  ))}
                </div>
                <a
                  href={type.href}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "13px",
                    fontWeight: 700,
                    color: type.color,
                    textDecoration: "none",
                  }}
                >
                  {type.cta} →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          WHY CROWDRAISE
          ══════════════════════════════════════════ */}
      <section className="features" id="why">
        <div className="features-container">
          <h2>Why Choose CrowdRaise?</h2>
          <p className="features-subtitle">
            We&apos;ve rebuilt money collection from the ground up — addressing every pain
            point that makes people avoid these platforms.
          </p>
          <div className="features-grid">
            {FEATURES.map((f) => (
              <div className="feature-card" key={f.title}>
                <i className={`${f.icon} feature-icon`} />
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ABOUT
          ══════════════════════════════════════════ */}
      <section className="about-section py-20" id="about">
        <div className="about-container max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            About CrowdRaise
          </h2>
          <p className="text-white/80 text-lg mb-10">
            CrowdRaise is a next-generation collection platform built to empower
            individuals, communities, and organisations across Africa. Whether you
            want to raise funds for a cause, collect gifts for a celebration, or
            receive tips for your work — we give you the tools to succeed with no
            hidden fees and no confusing processes.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            {[
              {
                icon: "fas fa-users",
                color: "#06b6d4",
                title: "Community Driven",
                desc: "Built for people, by people. We listen to our users and improve constantly.",
              },
              {
                icon: "fas fa-lock",
                color: "#f43f5e",
                title: "Secure & Transparent",
                desc:
                  "Your collections and data are protected with industry-leading security.",
              },
              {
                icon: "fas fa-globe-africa",
                color: "#8b5cf6",
                title: "For Africa & Beyond",
                desc:
                  "Designed for the unique needs of African communities, but open to the world.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex-1 min-w-[250px] max-w-xs bg-white/10 rounded-xl p-8 flex flex-col items-center"
              >
                <i
                  className={`${item.icon} text-3xl mb-3`}
                  style={{ color: item.color }}
                ></i>
                <h3 className="text-white font-semibold text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-white/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA
          ══════════════════════════════════════════ */}
      <section className="cta-section" id="cta">
        <div className="cta-container">
          <h2>Start Collecting Today</h2>
          <p>
            Raise support for a cause, receive gifts for life events, or collect
            tips for your work — all in one beautiful place.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6 w-full">
            <a
              href="/create_campaign"
              className="btn-primary min-w-[180px] text-center"
            >
              Create a Collection
            </a>
            <a
              href="/explore"
              className="btn-secondary min-w-[180px] text-center"
            >
              Explore Collections
            </a>
          </div>
          <p className="text-white/60 text-sm">
            Join thousands of Nigerians on CrowdRaise — fundraisers, celebrants, and
            creators.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CONTACT
          ══════════════════════════════════════════ */}
      <section className="contact-section py-20 bg-white/5" id="contact">
        <div className="contact-container max-w-xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Contact Us
          </h2>
          <p className="text-white/80 mb-8">
            Have questions, feedback, or want to partner with us? We&apos;d love to
            hear from you.
          </p>
          <form
            className="flex flex-col gap-5 max-w-xl mx-auto"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thank you for reaching out! We'll get back to you soon.");
            }}
          >
            <input
              type="text"
              placeholder="Your Name"
              required
              className="px-5 py-3 rounded-lg border-none bg-white/20 text-white text-base focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-white/60"
            />
            <input
              type="email"
              placeholder="Your Email"
              required
              className="px-5 py-3 rounded-lg border-none bg-white/20 text-white text-base focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-white/60"
            />
            <textarea
              placeholder="Your Message"
              required
              rows={4}
              className="px-5 py-3 rounded-lg border-none bg-white/20 text-white text-base resize-vertical focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-white/60"
            />
            <button
              type="submit"
              className="btn-primary w-full font-semibold text-lg mt-2"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default HomePage;