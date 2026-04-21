'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// ─── Type config ─────────────────────────────────────────────────────────────
const TYPE_CONFIG = {
  fundraiser: {
    emoji: '',
    label: 'Fundraiser',
    tagline: 'Rally support for your cause',
    color: 'rgb(224, 123, 140)',
    gradient: 'linear-gradient(135deg,rgb(224, 123, 140),rgb(203, 88, 132))',
    bgAccent: 'rgba(244,63,94,0.10)',
    borderAccent: 'rgba(244,63,94,0.28)',
    categories: [
      'Medical & Healthcare',
      'Education',
      'Emergency & Crisis',
      'Community Development',
      'Animal Welfare',
      'Arts & Culture',
      'Other',
    ],
    storyLabel: 'Your Story',
    storyPlaceholder:
      'Tell supporters what you need help with, why it matters, and what a difference their contribution will make…',
    goalLabel: 'Fundraising Goal (₦)',
    showFundUsage: true,
    showEventDate: false,
    showTipSuggestions: false,
    step2Heading: 'Tell Your Story',
    // Befitting fundraising/charity/hope crowd-sourced image
    heroImage:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?fit=crop&w=1200&q=80',
  },
  occasion: {
    emoji: '',
    label: 'Gift Page',
    tagline: 'Create your gift collection page',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
    bgAccent: 'rgba(139,92,246,0.10)',
    borderAccent: 'rgba(139,92,246,0.28)',
    categories: [
      'Wedding',
      'Birthday',
      'Anniversary',
      'Baby Shower',
      'Graduation',
      'Retirement',
      'Other Celebration',
    ],
    storyLabel: 'Message to Your Guests',
    storyPlaceholder:
      'Write a warm message to your guests — tell them about the occasion, what the gifts mean to you, and how they can celebrate with you…',
    goalLabel: 'Gift Collection Target (₦) — optional',
    showFundUsage: false,
    showEventDate: true,
    showTipSuggestions: false,
    step2Heading: 'Your Celebration Story',
    // A happy celebration
    heroImage:
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?fit=crop&w=1200&q=80',
  },
  tips: {
    emoji: '',
    label: 'Tips Page',
    tagline: 'Let your fans show love',
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    bgAccent: 'rgba(6,182,212,0.10)',
    borderAccent: 'rgba(6,182,212,0.28)',
    categories: [
      'Content Creator',
      'Music / DJ',
      'Performer / Artist',
      'Freelancer',
      'Food & Hospitality',
      'Education / Tutoring',
      'Other',
    ],
    storyLabel: 'About You',
    storyPlaceholder:
      'Tell your supporters who you are, what you do, and why their tips make a difference. Be personal and genuine!',
    goalLabel: 'Monthly Tip Target (₦) — optional',
    showFundUsage: false,
    showEventDate: false,
    showTipSuggestions: true,
    step2Heading: 'Introduce Yourself',
    // Remindful of creative work or small business - working at a cafe
    heroImage:
      'https://images.unsplash.com/photo-1464983953574-0892a716854b?fit=crop&w=1200&q=80',
  },
} as const;

type CollectionType = keyof typeof TYPE_CONFIG;

const COLLECTION_TYPES: { id: CollectionType; desc: string }[] = [
  { id: 'fundraiser', desc: 'Raise money for a cause, need, or project' },
  { id: 'occasion', desc: 'Collect gifts for a wedding, birthday, anniversary & more' },
  { id: 'tips', desc: 'Let fans & followers tip you for your work' },
];

// ─── Hero Fullscreen Carousel ────────────────────────────────────────────────
function FullHeroCarousel({
  selectedType,
  setSelectedType,
}: {
  selectedType: CollectionType;
  setSelectedType: (type: CollectionType) => void;
}) {
  return (
    <div
      className="relative h-[48vh] min-h-[340px] md:min-h-[430px] lg:min-h-[525px] w-full overflow-hidden flex items-stretch justify-stretch"
      style={{ zIndex: 0 }}
    >
      {COLLECTION_TYPES.map((t) => {
        const config = TYPE_CONFIG[t.id];
        const isActive = selectedType === t.id;
        return (
          <div
            key={t.id}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-30' : 'opacity-0 z-10 pointer-events-none'}`}
            style={{
              backgroundImage: `url('${config.heroImage}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              transition: 'opacity 1s',
            }}
            aria-hidden={!isActive}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(110deg,rgba(0,0,0,0.60),rgba(0,0,0,0.22) 70%,rgba(0,0,0,0.09) 100%)',
              }}
            ></div>
            <div className="relative h-full flex flex-col justify-center px-7 md:px-14 lg:px-20 w-auto">
       
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-5 border transition"
                style={{
                  color: config.color,
                  background: config.bgAccent,
                  borderColor: config.borderAccent,
                  marginTop: '2.3rem',
                  textShadow: '0 1px 6px #0008',
                  width: 'max-content'
                }}
              >
                {config.emoji} {config.tagline}
              </div>
              <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white drop-shadow-xl mb-2">
                Create a {config.label}
              </h1>
              <p className="text-white/90 text-lg leading-relaxed font-medium max-w-xl drop-shadow-lg mb-5">
                {t.desc}
              </p>
            </div>
          </div>
        );
      })}
      {/* Carousel dots */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-6 flex gap-3 z-40">
        {COLLECTION_TYPES.map((t) => (
          <button
            type="button"
            key={t.id}
            className={`w-3 h-3 rounded-full transition-all duration-200 border-2 shadow
              ${selectedType === t.id
                ? 'bg-white border-white scale-125'
                : 'bg-white/50 border-white/40'
              }`}
            aria-label={`Show ${TYPE_CONFIG[t.id].label} banner`}
            onClick={() => setSelectedType(t.id)}
            tabIndex={0}
          />
        ))}
      </div>
      {/* Carousel arrows */}
      <button
        type="button"
        aria-label="Previous"
        className="hidden md:flex absolute left-5 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-black/40 text-white hover:bg-black/70 items-center justify-center transition"
        onClick={() => {
          const idx = COLLECTION_TYPES.findIndex((t) => t.id === selectedType);
          setSelectedType(COLLECTION_TYPES[(idx - 1 + COLLECTION_TYPES.length) % COLLECTION_TYPES.length].id);
        }}
      >
        <svg width={26} height={26} viewBox="0 0 24 24" fill="none"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
      </button>
      <button
        type="button"
        aria-label="Next"
        className="hidden md:flex absolute right-5 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-black/40 text-white hover:bg-black/70 items-center justify-center transition"
        onClick={() => {
          const idx = COLLECTION_TYPES.findIndex((t) => t.id === selectedType);
          setSelectedType(COLLECTION_TYPES[(idx + 1) % COLLECTION_TYPES.length].id);
        }}
      >
        <svg width={26} height={26} viewBox="0 0 24 24" fill="none"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
      </button>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CreateCampaign() {
  const searchParams = useSearchParams();
  const initialType = (searchParams.get('type') as CollectionType) || 'fundraiser';

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState<CollectionType>(initialType);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    goal: '',
    eventDate: '',
    occasionType: '',
    receiverName: '',
    suggestedAmounts: '',
    description: '',
    fullStory: '',
    fundUsage: '',
    terms: false,
    isAnonymous: false,
  });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const particlesRef = useRef<HTMLDivElement>(null);

  const config = TYPE_CONFIG[selectedType];
  const totalSteps = 3;

  useEffect(() => {
    if (particlesRef.current) {
      const container = particlesRef.current;
      for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        p.style.animationDelay = Math.random() * 6 + 's';
        p.style.animationDuration = (Math.random() * 4 + 4) + 's';
        container.appendChild(p);
      }
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles((prev) => [...prev, ...files]);
    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) =>
          setImagePreviews((prev) => [
            ...prev,
            ev.target?.result as string,
          ]);
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (i: number) => {
    setImageFiles((prev) => prev.filter((_, idx) => idx !== i));
    setImagePreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep((s) => s + 1);
  };
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsSubmitting(false);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setCurrentStep(1);
      setFormData({
        title: '',
        category: '',
        goal: '',
        eventDate: '',
        occasionType: '',
        receiverName: '',
        suggestedAmounts: '',
        description: '',
        fullStory: '',
        fundUsage: '',
        terms: false,
        isAnonymous: false,
      });
      setImagePreviews([]);
      setImageFiles([]);
    }, 3500);
  };

  // ── Input style helper ──
  const inputCls = `w-full px-4 py-3.5 rounded-xl border-2 bg-white/5 text-white text-base placeholder:text-white/35 backdrop-blur-md transition-all duration-200 focus:outline-none`;
  const focusBorder = (focused?: boolean) => ({
    borderColor: focused ? config.color : 'rgba(255,255,255,0.15)',
  });

  return (
    <>
      <div className="bg-particles" ref={particlesRef}></div>

      {/* ── Visual hero section with carousel ── */}
      <section
        className="relative w-full"
        style={{
          minHeight: '48vh',
          minWidth: 0,
        }}
      >
        <FullHeroCarousel
          selectedType={selectedType}
          setSelectedType={setSelectedType}
        />
      </section>

      {/* Main content card, over hero */}
      <div
        className="relative z-10 max-w-3xl mx-auto"
        style={{
          marginTop: '-90px',
          paddingBottom: '1.5rem',
        }}
      >
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl px-4 sm:px-6 lg:px-8 pt-10 pb-2">
          {/* ── Step indicator ── */}
          <div className="mb-10">
            <div className="flex items-center justify-center gap-0">
              {[1, 2, 3].map((step, i) => (
                <div key={step} className="flex items-center">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300"
                    style={
                      step <= currentStep
                        ? { background: config.gradient, color: '#fff' }
                        : {
                            background: 'rgba(255,255,255,0.08)',
                            color: 'rgba(255,255,255,0.4)',
                          }
                    }
                  >
                    {step < currentStep ? '✓' : step}
                  </div>
                  {step < 3 && (
                    <div
                      className="w-20 sm:w-32 h-0.5 mx-1 transition-all duration-500"
                      style={{
                        background:
                          step < currentStep
                            ? config.gradient
                            : 'rgba(255,255,255,0.1)',
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center text-white/50 text-sm mt-3">
              Step {currentStep} of {totalSteps} ·{' '}
              {currentStep === 1
                ? 'Collection Type'
                : currentStep === 2
                ? 'Details & Story'
                : 'Review & Launch'}
            </div>
          </div>
  

          {/* ── Form card ── */}
          <div
            className="rounded-3xl border p-6 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-xl"
            style={{ background: 'rgba(255,255,255,0.05)', borderColor: config.borderAccent }}
          >
            <form onSubmit={handleSubmit}>

              {/* ═══ STEP 1: Type + basics ═══ */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">What are you creating?</h2>
                  <p className="text-white/55 text-sm mb-8">Choose the type that matches your goal — each has its own experience.</p>

                  {/* Type selector */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                    {COLLECTION_TYPES.map((t) => {
                      const tc = TYPE_CONFIG[t.id];
                      const isSelected = selectedType === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setSelectedType(t.id)}
                          className="p-5 rounded-2xl border-2 text-left transition-all duration-200 hover:-translate-y-0.5"
                          style={isSelected
                            ? { background: tc.bgAccent, borderColor: tc.color }
                            : { background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.12)' }
                          }
                        >
                          <div className="text-2xl mb-2">{tc.emoji}</div>
                          <div className="text-white font-bold text-sm mb-1">{tc.label}</div>
                          <div className="text-white/50 text-xs leading-relaxed">{t.desc}</div>
                          {isSelected && (
                            <div className="mt-3 text-xs font-semibold" style={{ color: tc.color }}>
                              ✓ Selected
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Basic fields */}
                  <div className="space-y-5">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        {selectedType === 'occasion' ? 'Occasion Title *' : 'Collection Title *'}
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        placeholder={
                          selectedType === 'fundraiser' ? 'e.g., Help me complete my surgery' :
                          selectedType === 'occasion' ? "e.g., Tobi & Chisom's Wedding Gifts 💍" :
                          'e.g., Tip DJ Kemi – Show Some Love'
                        }
                        className={inputCls}
                        style={focusBorder()}
                        onFocus={e => e.target.style.borderColor = config.color}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                      />
                    </div>

                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Category *</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className={inputCls}
                        style={{ borderColor: 'rgba(255,255,255,0.15)' }}
                        onFocus={e => e.target.style.borderColor = config.color}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                      >
                        <option value="">Select a category</option>
                        {config.categories.map(c => (
                          <option key={c} value={c} className="bg-gray-900">{c}</option>
                        ))}
                      </select>
                    </div>

                    {/* Occasion: extra fields */}
                    {selectedType === 'occasion' && (
                      <>
                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-2">Celebrant / Receiver Name *</label>
                          <input
                            type="text"
                            name="receiverName"
                            value={formData.receiverName}
                            onChange={handleInputChange}
                            required
                            placeholder="e.g., Tobi and Chisom"
                            className={inputCls}
                            style={{ borderColor: 'rgba(255,255,255,0.15)' }}
                            onFocus={e => e.target.style.borderColor = config.color}
                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                          />
                        </div>
                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-2">Occasion Date</label>
                          <input
                            type="date"
                            name="eventDate"
                            value={formData.eventDate}
                            onChange={handleInputChange}
                            className={inputCls}
                            style={{ borderColor: 'rgba(255,255,255,0.15)', colorScheme: 'dark' }}
                            onFocus={e => e.target.style.borderColor = config.color}
                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                          />
                        </div>
                      </>
                    )}

                    {/* Fundraiser & occasion: goal */}
                    {(selectedType === 'fundraiser' || selectedType === 'occasion') && (
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">{config.goalLabel}</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 font-bold">₦</span>
                          <input
                            type="number"
                            name="goal"
                            value={formData.goal}
                            onChange={handleInputChange}
                            required={selectedType === 'fundraiser'}
                            min="1000"
                            placeholder="500,000"
                            className={`${inputCls} pl-9`}
                            style={{ borderColor: 'rgba(255,255,255,0.15)' }}
                            onFocus={e => e.target.style.borderColor = config.color}
                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                          />
                        </div>
                      </div>
                    )}

                    {/* Tips: target + suggested amounts */}
                    {selectedType === 'tips' && (
                      <>
                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-2">{config.goalLabel}</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 font-bold">₦</span>
                            <input
                              type="number"
                              name="goal"
                              value={formData.goal}
                              onChange={handleInputChange}
                              min="1000"
                              placeholder="100,000"
                              className={`${inputCls} pl-9`}
                              style={{ borderColor: 'rgba(255,255,255,0.15)' }}
                              onFocus={e => e.target.style.borderColor = config.color}
                              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-2">Suggested Tip Amounts</label>
                          <input
                            type="text"
                            name="suggestedAmounts"
                            value={formData.suggestedAmounts}
                            onChange={handleInputChange}
                            placeholder="e.g., 1000, 2500, 5000, 10000"
                            className={inputCls}
                            style={{ borderColor: 'rgba(255,255,255,0.15)' }}
                            onFocus={e => e.target.style.borderColor = config.color}
                            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                          />
                          <p className="text-white/40 text-xs mt-1.5">Comma-separated amounts in Naira</p>
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">Short Description *</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        maxLength={200}
                        placeholder={
                          selectedType === 'fundraiser' ? 'A brief, compelling summary of your campaign (max 200 characters)' :
                          selectedType === 'occasion' ? 'A short, warm intro that guests will see first…' :
                          'Tell visitors what you do in one sentence'
                        }
                        className={`${inputCls} resize-none`}
                        style={{ borderColor: 'rgba(255,255,255,0.15)' }}
                        onFocus={e => e.target.style.borderColor = config.color}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                      />
                      <div className="text-right text-white/35 text-xs mt-1">{formData.description.length}/200</div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-8">
                    <button type="button" onClick={nextStep} className="px-8 py-3.5 rounded-full font-bold text-white text-base transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl" style={{ background: config.gradient }}>
                      Continue →
                    </button>
                  </div>
                </div>
              )}

              {/* ═══ STEP 2: Details & story ═══ */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{config.step2Heading}</h2>
                  <p className="text-white/55 text-sm mb-8">
                    {selectedType === 'fundraiser' ? 'Help supporters understand your need and connect with your cause.' :
                     selectedType === 'occasion' ? 'Set the mood and let guests feel part of your special moment.' :
                     'Show your personality and let supporters know who they\'re tipping.'}
                  </p>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">{config.storyLabel} *</label>
                      <textarea
                        name="fullStory"
                        value={formData.fullStory}
                        onChange={handleInputChange}
                        required
                        rows={7}
                        placeholder={config.storyPlaceholder}
                        className={`${inputCls} resize-none`}
                        style={{ borderColor: 'rgba(255,255,255,0.15)' }}
                        onFocus={e => e.target.style.borderColor = config.color}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                      />
                    </div>

                    {/* Fund usage — fundraisers only */}
                    {config.showFundUsage && (
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">Fund Usage Breakdown *</label>
                        <textarea
                          name="fundUsage"
                          value={formData.fundUsage}
                          onChange={handleInputChange}
                          required
                          rows={4}
                          placeholder="e.g., 60% for hospital fees, 25% for medication, 15% for recovery costs"
                          className={`${inputCls} resize-none`}
                          style={{ borderColor: 'rgba(255,255,255,0.15)' }}
                          onFocus={e => e.target.style.borderColor = config.color}
                          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                        />
                        <p className="text-white/40 text-xs mt-1.5">Being transparent about fund usage builds trust with donors.</p>
                      </div>
                    )}

                    {/* Image upload */}
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        {selectedType === 'fundraiser' ? 'Supporting Images' :
                         selectedType === 'occasion' ? 'Celebration Photos 🎊' :
                         'Your Profile / Work Photos'}
                      </label>
                      <label
                        htmlFor="image-upload"
                        className="flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-all duration-200 hover:bg-white/5"
                        style={{ borderColor: config.borderAccent }}
                      >
                        <div className="text-3xl">{selectedType === 'occasion' ? '📸' : selectedType === 'tips' ? '🖼' : '🗂'}</div>
                        <div className="text-white/60 text-sm text-center">
                          <span className="font-semibold" style={{ color: config.color }}>Click to upload</span> or drag & drop
                          <br /><span className="text-xs text-white/35">PNG, JPG up to 5MB each</span>
                        </div>
                        <input id="image-upload" type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                      {imagePreviews.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {imagePreviews.map((src, i) => (
                            <div key={i} className="relative group">
                              <img src={src} alt="" className="w-full h-20 rounded-xl object-cover" />
                              <button
                                type="button"
                                onClick={() => removeImage(i)}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Tips: anonymity option */}
                    {selectedType === 'tips' && (
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="isAnonymous"
                          checked={formData.isAnonymous}
                          onChange={handleInputChange}
                          className="w-4 h-4 rounded"
                        />
                        <span className="text-white/70 text-sm">Allow anonymous tips (hide tipper names)</span>
                      </label>
                    )}
                  </div>

                  <div className="flex justify-between mt-8">
                    <button type="button" onClick={prevStep} className="px-6 py-3 rounded-full font-semibold text-white/70 text-base border border-white/15 bg-white/5 hover:bg-white/10 transition-all duration-200">
                      ← Back
                    </button>
                    <button type="button" onClick={nextStep} className="px-8 py-3.5 rounded-full font-bold text-white text-base transition-all duration-200 hover:-translate-y-0.5" style={{ background: config.gradient }}>
                      Review →
                    </button>
                  </div>
                </div>
              )}

              {/* ═══ STEP 3: Review & submit ═══ */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Almost there! 🎉</h2>
                  <p className="text-white/55 text-sm mb-8">Review your collection before it goes live.</p>

                  {/* Summary card */}
                  <div
                    className="rounded-2xl p-6 border mb-6"
                    style={{ background: config.bgAccent, borderColor: config.borderAccent }}
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <span className="text-3xl">{config.emoji}</span>
                      <div>
                        <div className="text-white font-bold text-lg">{formData.title || '(No title yet)'}</div>
                        <div className="text-sm" style={{ color: config.color }}>{config.label}</div>
                      </div>
                    </div>

                    <div className="space-y-2.5 text-sm">
                      {[
                        { label: 'Category', value: formData.category },
                        { label: 'Description', value: formData.description },
                        formData.goal ? { label: 'Goal', value: `₦${parseInt(formData.goal || '0').toLocaleString()}` } : null,
                        formData.eventDate ? { label: 'Occasion Date', value: formData.eventDate } : null,
                        formData.receiverName ? { label: 'Celebrant', value: formData.receiverName } : null,
                        formData.suggestedAmounts ? { label: 'Suggested Tips', value: formData.suggestedAmounts } : null,
                        { label: 'Images', value: `${imagePreviews.length} uploaded` },
                      ].filter(Boolean).map((row) => row && (
                        <div key={row.label} className="flex gap-2">
                          <span className="text-white/50 w-28 flex-shrink-0">{row.label}:</span>
                          <span className="text-white/85 font-medium">{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Image previews summary */}
                  {imagePreviews.length > 0 && (
                    <div className="flex gap-2 mb-6 flex-wrap">
                      {imagePreviews.map((src, i) => (
                        <img key={i} src={src} alt="" className="w-14 h-14 rounded-xl object-cover" />
                      ))}
                    </div>
                  )}

                  {/* Terms */}
                  <label className="flex items-start gap-3 cursor-pointer mb-8">
                    <input
                      type="checkbox"
                      name="terms"
                      checked={formData.terms}
                      onChange={handleInputChange}
                      required
                      className="mt-0.5 w-4 h-4 rounded"
                    />
                    <span className="text-white/65 text-sm leading-relaxed">
                      I agree to the <a href="#" className="underline" style={{ color: config.color }}>Terms of Service</a> and <a href="#" className="underline" style={{ color: config.color }}>Privacy Policy</a>. All information I have provided is accurate and truthful.
                    </span>
                  </label>

                  <div className="flex justify-between">
                    <button type="button" onClick={prevStep} className="px-6 py-3 rounded-full font-semibold text-white/70 text-base border border-white/15 bg-white/5 hover:bg-white/10 transition-all duration-200">
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !formData.terms}
                      className="px-8 py-3.5 rounded-full font-bold text-white text-base transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      style={{ background: config.gradient }}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" strokeLinecap="round"/>
                          </svg>
                          Launching…
                        </span>
                      ) : `🚀 Launch ${config.label}`}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Success toast */}
      {showSuccess && (
        <div
          className="fixed bottom-6 right-4 sm:right-6 text-white px-5 py-4 rounded-2xl shadow-2xl z-50 max-w-xs border"
          style={{ background: 'rgba(0,0,0,0.88)', borderColor: config.borderAccent, backdropFilter: 'blur(16px)' }}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">{config.emoji}</span>
            <div>
              <div className="font-bold mb-1">{config.label} created!</div>
              <div className="text-white/65 text-sm">Redirecting to your dashboard…</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}