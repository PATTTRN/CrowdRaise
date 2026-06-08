import Link from "next/link";
import { ArrowRight, Shield, Zap, Globe, Check } from "lucide-react";
import { Button } from '@/components/ui/button';
import { CardPreview } from "./CardPreview";

export const dynamic = 'force-dynamic';

const COLLECTION_TYPES = [
  {
    id: "fundraiser", label: "Fundraiser", tagline: "Rally support for a cause",
    description: "Medical bills, education, emergencies, community projects — bring your cause to life.",
    cta: "Start a fundraiser", gradient: "from-indigo-500 to-blue-500", accent: "#635bff", emoji: "\u{1F31F}",
    examples: ["Medical surgery fund", "Student scholarship", "Flood relief", "Community project"],
  },
  {
    id: "occasion", label: "Occasion Gift", tagline: "Make celebrations unforgettable",
    description: "Weddings, birthdays, baby showers — create a beautiful gift collection page.",
    cta: "Create a gift page", gradient: "from-purple-500 to-pink-500", accent: "#a855f7", emoji: "\u{1F389}",
    examples: ["Traditional wedding", "Birthday celebration", "Baby arrival", "Anniversary"],
  },
  {
    id: "tips", label: "Tips", tagline: "Let fans support your work",
    description: "Content creators, freelancers, performers — accept appreciation directly.",
    cta: "Set up a tip page", gradient: "from-cyan-500 to-teal-500", accent: "#06b6d4", emoji: "\u{1F4B8}",
    examples: ["YouTube creator", "DJ / performer", "Freelance designer", "Street food vendor"],
  },
];

const FEATURES = [
  { icon: Shield, title: "No donor fees", desc: "Supporters pay exactly what they intend. Zero hidden charges." },
  { icon: Zap, title: "Go live in minutes", desc: "Set up a beautiful collection page in under 3 minutes, no design skills needed." },
  { icon: Globe, title: "Built for Africa", desc: "Paystack integration, NGN support, and mobile-first design for Nigerian users." },
];

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden stripe-hero-gradient min-h-[90vh] flex items-center">
        <div className="absolute inset-0 stripe-dot-pattern opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-16 py-24 sm:py-32">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white/80 rounded-full text-xs font-medium mb-6 tracking-wide uppercase border border-white/10">
                Fundraising · Gifts · Tips
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-6">
                Money collection made{" "}
                <span className="text-primary">beautifully simple</span>
              </h1>

              <p className="text-lg text-white/60 max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed">
                Whether you&apos;re raising funds for a cause, collecting gifts for a celebration, or accepting tips — CrowdRaise makes it effortless and transparent.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-12">
                <Link href="/create_collection">
                  <Button size="lg" className="w-full sm:w-auto shadow-lg hover:shadow-xl bg-primary hover:bg-primary/90">
                    Get started <ArrowRight className="size-4" />
                  </Button>
                </Link>
                <Link href="/explore">
                  <Button size="lg" className="w-full sm:w-auto bg-transparent text-white shadow-sm ring-1 ring-inset ring-white/20 hover:bg-white/10 hover:text-white">
                    Browse collections
                  </Button>
                </Link>
              </div>

              <div className="flex gap-8 sm:gap-12 justify-center lg:justify-start">
                {[{ value: "₦2.4M+", label: "Collected" }, { value: "1,200+", label: "Collections" }, { value: "98%", label: "Happy users" }].map((s) => (
                  <div key={s.label}>
                    <div className="text-xl sm:text-2xl font-bold text-white">{s.value}</div>
                    <div className="text-sm text-white/50">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <CardPreview />
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">Three ways to collect</h2>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">Pick the type that fits your moment. Each is purpose-built for that occasion.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {COLLECTION_TYPES.map((type) => (
              <div key={type.id} className="group rounded-xl bg-card p-8 shadow-md ring-1 ring-black/5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.gradient} flex items-center justify-center text-white text-xl mb-5 shadow-sm`}>{type.emoji}</div>
                <h3 className="text-lg font-bold text-foreground mb-2">{type.tagline}</h3>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{type.description}</p>
                <ul className="space-y-2 mb-8">
                  {type.examples.map((ex) => (
                    <li key={ex} className="text-sm text-muted-foreground flex items-center gap-2">
                      <Check className="size-4 flex-shrink-0" style={{ color: type.accent }} />
                      {ex}
                    </li>
                  ))}
                </ul>
                <Link href={`/create_collection?type=${type.id}`} className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors" style={{ color: type.accent }}>
                  {type.cta} <ArrowRight className="size-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">Everything you need</h2>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">No unnecessary features. Just what matters for a great collection experience.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map((f) => (
              <div key={f.title} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center mx-auto mb-5"><f.icon className="size-5" /></div>
                <h3 className="text-lg font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 bg-card" id="about">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 tracking-tight">About CrowdRaise</h2>
          <p className="text-lg text-muted-foreground mb-16 leading-relaxed">
            CrowdRaise is a next-generation collection platform built to empower individuals, communities, and organisations across Africa. We give you the tools to succeed — with no hidden fees and no confusing processes.
          </p>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Secure & transparent", desc: "Your data and collections are protected with industry-leading security.", accent: "text-primary", bg: "bg-primary/5" },
              { icon: Globe, title: "Community driven", desc: "Built for people, by people. We improve constantly based on feedback.", accent: "text-purple-500", bg: "bg-purple-50" },
              { icon: Zap, title: "Lightning fast", desc: "Everything loads in an instant. No bloat, no unnecessary complexity.", accent: "text-cyan-500", bg: "bg-cyan-50" },
            ].map((item) => (
              <div key={item.title}>
                <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.accent} flex items-center justify-center mx-auto mb-4`}><item.icon className="size-5" /></div>
                <h3 className="font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-28 stripe-hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 stripe-dot-pattern opacity-20" />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">Ready to get started?</h2>
          <p className="text-white/60 text-lg mb-8 max-w-md mx-auto">Join thousands of Nigerians using CrowdRaise to collect money beautifully.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/create_collection">
              <Button size="lg" className="w-full sm:w-auto bg-white text-foreground hover:bg-white/90 shadow-lg">
                Create your first collection <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/explore">
              <Button size="lg" className="w-full sm:w-auto bg-transparent text-white shadow-sm ring-1 ring-inset ring-white/20 hover:bg-white/10 hover:text-white">
                Explore collections
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
