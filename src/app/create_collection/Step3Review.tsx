'use client';

import { UseFormRegister } from 'react-hook-form';
import { TYPE_CONFIG, type CollectionType } from '@/lib/type-config';
import { Loader2 } from 'lucide-react';

type FormValues = {
  title: string; category: string; goal: string; eventDate: string; receiverName: string;
  suggestedAmounts: string; description: string; fullStory: string; fundUsage: string;
  terms: boolean; isAnonymous: boolean;
};

export function Step3Review({
  selectedType, formData, register, imagePreviews, isSubmitting, prevStep,
}: {
  selectedType: CollectionType; formData: FormValues; register: UseFormRegister<FormValues>;
  imagePreviews: string[]; isSubmitting: boolean; prevStep: () => void;
}) {
  const config = TYPE_CONFIG[selectedType];

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Almost there!</h2>
      <p className="text-muted-foreground text-sm mb-8">Review your collection before it goes live.</p>

      <div className="rounded-2xl p-6 border mb-6 bg-secondary" style={{ borderColor: config.borderAccent }}>
        <div className="flex items-center gap-3 mb-5">
          <span className="text-3xl">{config.emoji}</span>
          <div>
            <div className="text-foreground font-bold text-lg">{formData.title || '(No title yet)'}</div>
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
              <span className="text-muted-foreground w-28 flex-shrink-0">{row.label}:</span>
              <span className="text-foreground font-medium">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {imagePreviews.length > 0 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          {imagePreviews.map((src, i) => <img key={i} src={src} alt="" className="w-14 h-14 rounded-xl object-cover" />)}
        </div>
      )}

      <label className="flex items-start gap-3 cursor-pointer mb-8">
        <input type="checkbox" {...register('terms')} required className="mt-0.5 w-4 h-4 rounded" />
        <span className="text-muted-foreground text-sm leading-relaxed">
          I agree to the <a href="#" className="underline" style={{ color: config.color }}>Terms of Service</a> and <a href="#" className="underline" style={{ color: config.color }}>Privacy Policy</a>. All information I have provided is accurate and truthful.
        </span>
      </label>

      <div className="flex justify-between">
        <button type="button" onClick={prevStep} className="px-6 py-3 rounded-full font-semibold text-muted-foreground text-base border border-border bg-background hover:bg-muted transition-all duration-200 cursor-pointer">← Back</button>
        <button type="submit" disabled={isSubmitting || !formData.terms}
          className="px-8 py-3.5 rounded-full font-bold text-white text-base transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
          style={{ background: config.gradient }}>
          {isSubmitting ? <span className="flex items-center gap-2"><Loader2 className="size-4 animate-spin" />Launching…</span> : `🚀 Launch ${config.label}`}
        </button>
      </div>
    </div>
  );
}
