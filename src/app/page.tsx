"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TYPE_CONFIG, type CollectionType } from '@/lib/type-config';
import {
  Heart,
  Rocket,
  Smartphone,
  ArrowRight,
  Users,
  Shield,
  Globe,
  Send,
  Sparkles,
} from "lucide-react";

const HERO_STATS = [
  { value: 2.4, suffix: "M+", label: "Collected", prefix: "₦" },
  { value: 1200, suffix: "+", label: "Collections" },
  { value: 98, suffix: "%", label: "Happy Users" },
];

const COLLECTION_TYPES: {
  id: CollectionType;
  tagline: string;
  description: string;
  examples: string[];
  cta: string;
}[] = [
  {
    id: "fundraiser",
    tagline: "Rally support for your cause",
    description:
      "Medical bills, education, emergencies, community projects — bring your cause to life.",
    examples: [
      "Medical surgery fund",
      "Student scholarship",
      "Flood relief",
      "Community borehole",
    ],
    cta: "Start a fundraiser",
  },
  {
    id: "occasion",
    tagline: "Make celebrations unforgettable",
    description:
      "Wedding, birthday, baby shower — create a beautiful gift collection page so your guests can chip in with love.",
    examples: [
      "Traditional wedding",
      "30th birthday bash",
      "Baby arrival gift",
      "Anniversary celebration",
    ],
    cta: "Create a gift page",
  },
  {
    id: "tips",
    tagline: "Let fans support your hustle",
    description:
      "Content creator, freelancer, performer — accept appreciation in the most direct way.",
    examples: [
      "YouTube creator",
      "DJ / performer",
      "Freelance designer",
      "Street food vendor",
    ],
    cta: "Set up a tip page",
  },
];

const MOCKUP_CARDS = [
  {
    type: "fundraiser" as CollectionType,
    title: "Help Sarah's Medical School",
    sub: "Medical & Healthcare · Lagos",
    raised: "₦485,000 raised",
    goal: "of ₦650,000 goal · 28 days left",
    pct: 74,
    supporters: "142 donors",
    image:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=700&q=80",
  },
  {
    type: "occasion" as CollectionType,
    title: "Tobi & Chisom's Wedding",
    sub: "Wedding · Lagos",
    raised: "₦320,000 gifted",
    goal: "of ₦500,000 goal · March 15",
    pct: 64,
    supporters: "67 gift givers",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=80",
  },
  {
    type: "tips" as CollectionType,
    title: "Support DJ Kemi",
    sub: "Music & Entertainment · Abuja",
    raised: "₦95,000 received",
    goal: "of ₦200,000 target · ongoing",
    pct: 47,
    supporters: "89 supporters",
    image:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=700&q=80",
  },
];

const FEATURES = [
  {
    icon: Heart,
    title: "Zero Donor Fees",
    desc: "Donors pay exactly what they intend. No hidden charges, ever.",
  },
  {
    icon: Rocket,
    title: "Lightning Fast Setup",
    desc: "Create and launch your collection in under 3 minutes.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    desc: "Beautiful, intuitive interface that works perfectly on every device.",
  },
];

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
  duration = 5000
) {
  const increment = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    if (prefix === "₦" && suffix === "M+")
      element.textContent = prefix + current.toFixed(1) + suffix;
    else if (suffix === "%")
      element.textContent = current.toFixed(0) + suffix;
    else element.textContent = prefix + current.toFixed(0) + suffix;
  }, 16);
}

const HomePage: React.FC = () => {
  const particlesRef = useRef<HTMLDivElement>(null);
  const heroStatsRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setActiveCard((p) => (p + 1) % MOCKUP_CARDS.length),
      3600
    );
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (
      particlesRef.current &&
      particlesRef.current.childElementCount === 0
    ) {
      createParticles(particlesRef.current);
    }

    let observer: IntersectionObserver | null = null;
    const currentHeroStats = heroStatsRef.current;
    if (typeof window !== "undefined" && currentHeroStats) {
      observer = new window.IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const statNumbers =
                entry.target.querySelectorAll(".stat-number");
              statNumbers.forEach((stat, i) => {
                const { value, suffix, prefix } = HERO_STATS[i];
                setTimeout(
                  () =>
                    animateCounter(
                      stat as HTMLElement,
                      value,
                      suffix,
                      prefix || "",
                      5000
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
      observer.observe(currentHeroStats);
    }

    return () => {
      if (observer && currentHeroStats) observer.unobserve(currentHeroStats);
    };
  }, []);

  const card = MOCKUP_CARDS[activeCard];
  const meta = TYPE_CONFIG[card.type];

  return (
    <div>
      <div className="bg-particles" ref={particlesRef}></div>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-white to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-100 text-rose-600 rounded-full text-sm font-medium mb-6">
                <Sparkles className="size-4" />
                Fundraise · Gifts · Tips — all in one place
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6">
                Money Collection Made{" "}
                <span className="bg-gradient-to-r from-rose-500 via-rose-500 to-cyan-500 bg-clip-text text-transparent">
                  Beautifully Simple
                </span>
              </h1>

              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Whether you&apos;re raising funds for a cause, collecting gifts
                for a special moment, or letting your fans show love —
                CrowdRaise makes it effortless, transparent, and completely free
                of hidden fees.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <Link href="/create_collection">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start a Collection <ArrowRight className="size-4" />
                  </Button>
                </Link>
                <Link href="/explore">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Explore Collections
                  </Button>
                </Link>
              </div>

              <div className="flex gap-8 sm:gap-12" ref={heroStatsRef}>
                {HERO_STATS.map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl sm:text-3xl font-bold text-foreground stat-number">
                      {stat.prefix}
                      {stat.suffix === '%' ? '0%' : `0${stat.suffix}`}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Mockup Card */}
              <div className="hidden lg:flex justify-center">
              <div
                className="mockup-card w-full max-w-md rounded-2xl overflow-hidden shadow-xl border border-gray-100"
                style={{
                  backgroundImage: `linear-gradient(0deg, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.15) 100%), url('${card.image}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  minHeight: 420,
                }}
              >
                {/* Dot nav */}
                <div className="flex gap-1.5 justify-center pt-4">
                  {MOCKUP_CARDS.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveCard(i)}
                      className="h-1.5 rounded-full transition-all duration-300"
                      style={{
                        width: i === activeCard ? 20 : 5,
                        background:
                          i === activeCard
                            ? meta.accentColor
                            : "rgba(255,255,255,0.3)",
                      }}
                      aria-label={`Switch to ${c.type} card`}
                    />
                  ))}
                </div>

                {/* Type pill */}
                <div className="text-center mt-4">
                  <Badge
                    style={{
                      background: meta.bgAccent,
                      color: meta.accentColor,
                      border: `1px solid ${meta.borderAccent}`,
                    }}
                  >
                    {meta.emoji} {meta.label}
                  </Badge>
                </div>

                {/* Content */}
                <div className="p-6 mt-auto">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-full"
                      style={{ background: meta.accentGradient }}
                    />
                    <div>
                      <h3 className="text-white font-bold text-sm">
                        {card.title}
                      </h3>
                      <p className="text-white/60 text-xs">{card.sub}</p>
                    </div>
                  </div>

                  <div className="h-2 bg-white/20 rounded-full mb-3 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${card.pct}%`,
                        background: meta.accentGradient,
                      }}
                    />
                  </div>

                  <div className="text-center">
                    <div
                      className="text-lg font-bold"
                      style={{ color: meta.accentColor }}
                    >
                      {card.raised}
                    </div>
                    <div className="text-white/70 text-xs">{card.goal}</div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/20 text-center text-white/70 text-xs">
                    <span style={{ color: meta.accentColor }}>♥</span>{" "}
                    {card.supporters}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Three Collection Types ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Three Ways to Collect
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-12">
            Pick the type that fits your moment. Each is built and designed
            specifically for that purpose.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {COLLECTION_TYPES.map((type) => {
              const t = TYPE_CONFIG[type.id];
              return (
                <Card
                  key={type.id}
                  className="p-6 text-left hover:shadow-md transition-shadow"
                  style={{
                    borderColor: t.borderAccent,
                  }}
                >
                  <Badge
                    className="mb-3"
                    style={{
                      background: t.bgAccent,
                      color: t.accentColor,
                      border: `1px solid ${t.borderAccent}`,
                    }}
                  >
                    {t.emoji} {t.label}
                  </Badge>
                  <h3 className="text-lg font-bold text-foreground mb-1">
                    {type.tagline}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {type.description}
                  </p>
                  <div className="mb-4 space-y-1">
                    {type.examples.map((ex) => (
                      <div
                        key={ex}
                        className="text-xs text-muted-foreground flex items-center gap-2"
                      >
                        <span
                          className="font-bold"
                          style={{ color: t.accentColor }}
                        >
                          →
                        </span>
                        {ex}
                      </div>
                    ))}
                  </div>
                  <Link
                    href={`/create_collection?type=${type.id}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold hover:underline"
                    style={{ color: t.accentColor }}
                  >
                    {type.cta} <ArrowRight className="size-3" />
                  </Link>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Why Choose CrowdRaise ── */}
      <section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Why Choose CrowdRaise?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-12">
            We&apos;ve rebuilt money collection from the ground up — addressing
            every pain point that makes people avoid these platforms.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <Card key={f.title} className="p-8 text-center">
                  <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-500 flex items-center justify-center mx-auto mb-4">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    {f.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{f.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section className="py-20 bg-white" id="about">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            About CrowdRaise
          </h2>
          <p className="text-muted-foreground text-lg mb-12">
            CrowdRaise is a next-generation collection platform built to empower
            individuals, communities, and organisations across Africa. Whether
            you want to raise funds for a cause, collect gifts for a
            celebration, or receive tips for your work — we give you the tools
            to succeed with no hidden fees and no confusing processes.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: Users,
                color: "text-cyan-500",
                bg: "bg-cyan-100",
                title: "Community Driven",
                desc: "Built for people, by people. We listen and improve constantly.",
              },
              {
                icon: Shield,
                color: "text-rose-500",
                bg: "bg-rose-100",
                title: "Secure & Transparent",
                desc: "Your collections and data are protected with industry-leading security.",
              },
              {
                icon: Globe,
                color: "text-violet-500",
                bg: "bg-violet-100",
                title: "For Africa & Beyond",
                desc: "Designed for the unique needs of African communities, but open to the world.",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="p-8">
                  <div
                    className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center mx-auto mb-4`}
                  >
                    <Icon className="size-6" />
                  </div>
                  <h3 className="font-bold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{item.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-gradient-to-br from-rose-500 via-rose-500 to-cyan-500 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Start Collecting Today
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Raise support for a cause, receive gifts for life events, or
            collect tips for your work — all in one beautiful place.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
            <Link href="/create_collection">
              <Button
                size="lg"
                className="bg-white text-rose-600 hover:bg-white/90 shadow-lg"
              >
                Create a Collection <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/explore">
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Explore Collections
              </Button>
            </Link>
          </div>
          <p className="text-white/60 text-sm">
            Join thousands of Nigerians on CrowdRaise — fundraisers, celebrants,
            and creators.
          </p>
        </div>
      </section>

      {/* ── Contact ── */}
      <section className="py-20 bg-muted" id="contact">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Contact Us
          </h2>
          <p className="text-muted-foreground mb-8">
            Have questions, feedback, or want to partner with us? We&apos;d
            love to hear from you.
          </p>
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Thank you for reaching out! We'll get back to you soon.");
            }}
          >
            <Input
              type="text"
              placeholder="Your Name"
              required
              className="h-12"
            />
            <Input
              type="email"
              placeholder="Your Email"
              required
              className="h-12"
            />
            <textarea
              placeholder="Your Message"
              required
              rows={4}
              className="flex w-full rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
            />
            <Button type="submit" size="lg" className="w-full">
              <Send className="size-4" />
              Send Message
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
