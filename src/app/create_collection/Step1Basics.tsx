'use client';

import { UseFormRegister, UseFormWatch, FieldErrors } from 'react-hook-form';
import { TYPE_CONFIG, type CollectionType } from '@/lib/type-config';

type FormValues = {
  title: string; category: string; goal: string; eventDate: string; receiverName: string;
  suggestedAmounts: string; description: string; fullStory: string; fundUsage: string;
  terms: boolean; isAnonymous: boolean;
};

const inputCls = 'w-full px-4 py-3.5 rounded-xl border-2 border-border bg-background text-foreground text-base placeholder:text-muted-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:border-transparent';

export function Step1Basics({
  selectedType, setSelectedType, formData, register, errors, nextStep, COLLECTION_TYPES,
}: {
  selectedType: CollectionType; setSelectedType: (t: CollectionType) => void;
  formData: FormValues; register: UseFormRegister<FormValues>; errors: FieldErrors<FormValues>;
  nextStep: () => void; COLLECTION_TYPES: { id: CollectionType; desc: string }[];
}) {
  const config = TYPE_CONFIG[selectedType];

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-2">What are you creating?</h2>
      <p className="text-muted-foreground text-sm mb-8">Choose the type that matches your goal — each has its own experience.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        {COLLECTION_TYPES.map((t) => {
          const tc = TYPE_CONFIG[t.id];
          const isSelected = selectedType === t.id;
          return (
            <button key={t.id} type="button" onClick={() => setSelectedType(t.id)}
              className="p-5 rounded-2xl border-2 text-left transition-all duration-200 hover:-translate-y-0.5 cursor-pointer bg-background"
              style={isSelected ? { background: tc.bgAccent, borderColor: tc.color } : { borderColor: 'var(--border)' }}>
              <div className="text-2xl mb-2">{tc.emoji}</div>
              <div className="text-foreground font-bold text-sm mb-1">{tc.label}</div>
              <div className="text-muted-foreground text-xs leading-relaxed">{t.desc}</div>
              {isSelected && <div className="mt-3 text-xs font-semibold" style={{ color: tc.color }}>✓ Selected</div>}
            </button>
          );
        })}
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">{selectedType === 'occasion' ? 'Occasion Title *' : 'Collection Title *'}</label>
          <input {...register('title', { required: true })} autoComplete="off" placeholder={selectedType === 'fundraiser' ? 'e.g., Help me complete my surgery' : selectedType === 'occasion' ? "e.g., Tobi & Chisom's Wedding Gifts" : 'e.g., Tip DJ Kemi – Show Some Love'} className={inputCls} />
          {errors.title && <p className="text-xs text-red-500 mt-1">Title is required</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Category *</label>
          <select {...register('category', { required: true })} className={inputCls}>
            <option value="">Select a category</option>
            {config.categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.category && <p className="text-xs text-red-500 mt-1">Category is required</p>}
        </div>

        {selectedType === 'occasion' && (
          <>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Celebrant / Receiver Name *</label>
              <input {...register('receiverName', { required: selectedType === 'occasion' })} autoComplete="off" placeholder="e.g., Tobi and Chisom" className={inputCls} />
              {errors.receiverName && <p className="text-xs text-red-500 mt-1">Receiver name is required</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Occasion Date</label>
              <input type="date" {...register('eventDate')} className={`${inputCls} [color-scheme:light]`} />
            </div>
          </>
        )}

        {(selectedType === 'fundraiser' || selectedType === 'occasion') && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">{config.goalFieldLabel}</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">₦</span>
              <input type="number" {...register('goal', { required: selectedType === 'fundraiser' })} autoComplete="off" min="1000" placeholder="500,000" className={`${inputCls} pl-9`} />
            </div>
            {errors.goal && <p className="text-xs text-red-500 mt-1">Goal amount is required</p>}
          </div>
        )}

        {selectedType === 'tips' && (
          <>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">{config.goalFieldLabel}</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">₦</span>
                <input type="number" {...register('goal')} min="1000" placeholder="100,000" className={`${inputCls} pl-9`} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Suggested Tip Amounts</label>
              <input {...register('suggestedAmounts')} placeholder="e.g., 1000, 2500, 5000, 10000" className={inputCls} />
              <p className="text-muted-foreground text-xs mt-1.5">Comma-separated amounts in Naira</p>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Short Description *</label>
          <textarea {...register('description', { required: true, maxLength: 200 })} rows={3} maxLength={200}
            placeholder={selectedType === 'fundraiser' ? 'A brief, compelling summary of your campaign (max 200 characters)' : selectedType === 'occasion' ? 'A short, warm intro that guests will see first…' : 'Tell visitors what you do in one sentence'}
            className={`${inputCls} resize-none`} />
          {errors.description && <p className="text-xs text-red-500 mt-1">Description is required</p>}
          <div className="text-right text-muted-foreground text-xs mt-1">{formData.description.length}/200</div>
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button type="button" onClick={nextStep} className="px-8 py-3.5 rounded-full font-bold text-white text-base transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl cursor-pointer" style={{ background: config.gradient }}>Continue →</button>
      </div>
    </div>
  );
}
