"use client";
import React, { useRef, useState } from "react";
import Link from "next/link";
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Shield, Zap, Globe } from "lucide-react";

const COLLECTION_TYPES = [
  {
    id: "fundraiser" as const,
    label: "Fundraiser",
    tagline: "Rally support for a cause",
    description: "Medical bills, education, emergencies, community projects — bring your cause to life.",
    cta: "Start a fundraiser",
    gradient: "from-indigo-500 to-blue-500",
    accent: "#635bff",
    bgAccent: "rgba(99,91,255,0.08)",
    emoji: "🌟",
    examples: ["Medical surgery fund", "Student scholarship", "Flood relief", "Community project"],
  },
  {
    id: "occasion" as const,
    label: "Occasion Gift",
    tagline: "Make celebrations unforgettable",
    description: "Weddings, birthdays, baby showers — create a beautiful gift collection page.",
    cta: "Create a gift page",
    gradient: "from-purple-500 to-pink-500",
    accent: "#a855f7",
    bgAccent: "rgba(168,85,247,0.08)",
    emoji: "🎉",
    examples: ["Traditional wedding", "Birthday celebration", "Baby arrival", "Anniversary"],
  },
  {
    id: "tips" as const,
    label: "Tips",
    tagline: "Let fans support your work",
    description: "Content creators, freelancers, performers — accept appreciation directly.",
    cta: "Set up a tip page",
    gradient: "from-cyan-500 to-teal-500",
    accent: "#06b6d4",
    bgAccent: "rgba(6,182,212,0.08)",
    emoji: "💸",
    examples: ["YouTube creator", "DJ / performer", "Freelance designer", "Street food vendor"],
  },
];

const FEATURES = [
  { icon: Shield, title: "No donor fees", desc: "Supporters pay exactly what they intend. Zero hidden charges." },
  { icon: Zap, title: "Go live in minutes", desc: "Set up a beautiful collection page in under 3 minutes, no design skills needed." },
  { icon: Globe, title: "Built for Africa", desc: "Paystack integration, NGN support, and mobile-first design for Nigerian users." },
];

export default function HomePage() {
  const [activeCard, setActiveCard] = useState(0);
  const card = COLLECTION_TYPES[activeCard];

  return (
    <div>
      <div className="bg-particles" />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-indigo-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16 pt-24 pb-20 sm:pt-32 sm:pb-28">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary rounded-full text-xs font-medium mb-6 tracking-wide uppercase">
                <Sparkles className="size-3" /> Fundraising · Gifts · Tips
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#0a2540] leading-[1.1] mb-6">
                Money collection made{" "}
                <span className="text-primary">beautifully simple</span>
              </h1>

              <p className="text-lg text-[#6b7c93] max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed">
                Whether you&apos;re raising funds for a cause, collecting gifts for a celebration, or accepting tips — CrowdRaise makes it effortless and transparent.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-12">
                <Link href="/create_collection">
                  <Button size="lg" className="w-full sm:w-auto shadow-sm hover:shadow-md">
                    Get started <ArrowRight className="size-4" />
                  </Button>
                </Link>
                <Link href="/explore">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto border-[#e6ebf1] text-[#0a2540] hover:bg-[#f6f9fc]">
                    Browse collections
                  </Button>
                </Link>
              </div>

              <div className="flex gap-8 sm:gap-12 justify-center lg:justify-start">
                {[
                  { value: "₦2.4M+", label: "Collected" },
                  { value: "1,200+", label: "Collections" },
                  { value: "98%", label: "Happy users" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-xl sm:text-2xl font-bold text-[#0a2540]">{s.value}</div>
                    <div className="text-sm text-[#6b7c93]">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Card Preview */}
            <div className="flex-1 w-full max-w-md lg:max-w-none">
              <div className="mockup-card bg-white rounded-2xl shadow-xl border border-[#e6ebf1] overflow-hidden">
                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white text-lg`}>
                        {card.emoji}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#0a2540]">{card.label}</div>
                        <div className="text-xs text-[#6b7c93]">{card.tagline}</div>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      {COLLECTION_TYPES.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveCard(i)}
                          className="h-2 rounded-full transition-all duration-300 cursor-pointer"
                          style={{
                            width: i === activeCard ? 24 : 6,
                            backgroundColor: i === activeCard ? '#635bff' : '#e6ebf1',
                          }}
                          aria-label={`Switch to ${COLLECTION_TYPES[i].label}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="h-3 bg-[#f6f9fc] rounded w-3/4" />
                    <div className="h-3 bg-[#f6f9fc] rounded w-1/2" />
                    <div className="h-3 bg-[#f6f9fc] rounded w-5/6" />
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold text-[#0a2540]">₦485,000 raised</span>
                      <span className="text-[#6b7c93]">74%</span>
                    </div>
                    <div className="h-2 bg-[#f6f9fc] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${card.gradient} transition-all duration-700`}
                        style={{ width: `${[74, 64, 47][activeCard]}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-[#6b7c93]">
                    <div className="flex items-center gap-1.5">
                      <div className="size-2 rounded-full bg-green-400" />
                      67 supporters
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="size-2 rounded-full bg-[#635bff]" />
                      28 days left
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Three Collection Types ── */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0a2540] mb-4 tracking-tight">
              Three ways to collect
            </h2>
            <p className="text-lg text-[#6b7c93] max-w-lg mx-auto">
              Pick the type that fits your moment. Each is purpose-built for that occasion.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {COLLECTION_TYPES.map((type) => (
              <div
                key={type.id}
                className="group rounded-2xl border border-[#e6ebf1] bg-white p-8 hover:shadow-lg hover:border-transparent transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.gradient} flex items-center justify-center text-white text-xl mb-5`}>
                  {type.emoji}
                </div>
                <h3 className="text-lg font-bold text-[#0a2540] mb-2">{type.tagline}</h3>
                <p className="text-sm text-[#6b7c93] mb-6 leading-relaxed">{type.description}</p>

                <ul className="space-y-2 mb-8">
                  {type.examples.map((ex) => (
                    <li key={ex} className="text-sm text-[#6b7c93] flex items-center gap-2">
                      <svg className="size-4 flex-shrink-0" style={{ color: type.accent }} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {ex}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/create_collection?type=${type.id}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
                  style={{ color: type.accent }}
                >
                  {type.cta} <ArrowRight className="size-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-20 sm:py-28 bg-[#f6f9fc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0a2540] mb-4 tracking-tight">
              Everything you need
            </h2>
            <p className="text-lg text-[#6b7c93] max-w-lg mx-auto">
              No unnecessary features. Just what matters for a great collection experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center mx-auto mb-5">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-lg font-bold text-[#0a2540] mb-2">{f.title}</h3>
                  <p className="text-sm text-[#6b7c93] leading-relaxed max-w-xs mx-auto">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section className="py-20 sm:py-28 bg-white" id="about">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0a2540] mb-6 tracking-tight">
            About CrowdRaise
          </h2>
          <p className="text-lg text-[#6b7c93] mb-16 leading-relaxed">
            CrowdRaise is a next-generation collection platform built to empower individuals, communities, and organisations across Africa. We give you the tools to succeed — with no hidden fees and no confusing processes.
          </p>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Secure & transparent", desc: "Your data and collections are protected with industry-leading security.", accent: "text-primary", bg: "bg-primary/5" },
              { icon: Globe, title: "Community driven", desc: "Built for people, by people. We improve constantly based on feedback.", accent: "text-purple-500", bg: "bg-purple-50" },
              { icon: Zap, title: "Lightning fast", desc: "Everything loads in an instant. No bloat, no unnecessary complexity.", accent: "text-cyan-500", bg: "bg-cyan-50" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title}>
                  <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.accent} flex items-center justify-center mx-auto mb-4`}>
                    <Icon className="size-5" />
                  </div>
                  <h3 className="font-bold text-[#0a2540] mb-2">{item.title}</h3>
                  <p className="text-sm text-[#6b7c93] leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 sm:py-28 bg-[#0a2540]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
            Ready to get started?
          </h2>
          <p className="text-[#8ba0b8] text-lg mb-8 max-w-md mx-auto">
            Join thousands of Nigerians using CrowdRaise to collect money beautifully.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/create_collection">
              <Button size="lg" className="w-full sm:w-auto bg-white text-[#0a2540] hover:bg-white/90 shadow-lg">
                Create your first collection <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/explore">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-transparent border border-[#2d4a6b] text-white hover:bg-[#1a3a5a]"
              >
                Explore collections
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
