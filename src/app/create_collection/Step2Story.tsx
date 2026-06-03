'use client';

import { TYPE_CONFIG, type CollectionType } from '@/lib/type-config';

type FormState = {
  title: string;
  category: string;
  goal: string;
  eventDate: string;
  occasionType: string;
  receiverName: string;
  suggestedAmounts: string;
  description: string;
  fullStory: string;
  fundUsage: string;
  terms: boolean;
  isAnonymous: boolean;
};

const inputCls = 'w-full px-4 py-3.5 rounded-xl border-2 bg-background text-foreground text-base placeholder:text-muted-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:border-transparent';

export function Step2Story({
  selectedType,
  formData,
  handleInputChange,
  handleImageUpload,
  removeImage,
  imagePreviews,
  prevStep,
  nextStep,
}: {
  selectedType: CollectionType;
  formData: FormState;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (i: number) => void;
  imagePreviews: string[];
  prevStep: () => void;
  nextStep: () => void;
}) {
  const config = TYPE_CONFIG[selectedType];

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-2">{config.step2Heading}</h2>
      <p className="text-muted-foreground text-sm mb-8">
        {selectedType === 'fundraiser' ? 'Help supporters understand your need and connect with your cause.' :
         selectedType === 'occasion' ? 'Set the mood and let guests feel part of your special moment.' :
         'Show your personality and let supporters know who they\'re tipping.'}
      </p>

      <div className="space-y-5">
        <div>
          <label className="block text-muted-foreground text-sm font-medium mb-2">{config.storyLabel} *</label>
          <textarea
            name="fullStory"
            value={formData.fullStory}
            onChange={handleInputChange}
            required
            rows={7}
            placeholder={config.storyPlaceholder}
            className={`${inputCls} resize-none`}
          />
        </div>

        {config.showFundUsage && (
          <div>
            <label className="block text-muted-foreground text-sm font-medium mb-2">Fund Usage Breakdown *</label>
            <textarea
              name="fundUsage"
              value={formData.fundUsage}
              onChange={handleInputChange}
              required
              rows={4}
              placeholder="e.g., 60% for hospital fees, 25% for medication, 15% for recovery costs"
              className={`${inputCls} resize-none`}
            />
            <p className="text-muted-foreground text-xs mt-1.5">Being transparent about fund usage builds trust with donors.</p>
          </div>
        )}

        <div>
          <label className="block text-muted-foreground text-sm font-medium mb-2">
            {selectedType === 'fundraiser' ? 'Supporting Images' :
             selectedType === 'occasion' ? 'Celebration Photos' :
             'Your Profile / Work Photos'}
          </label>
          <label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl p-8 cursor-pointer transition-all duration-200 hover:bg-muted"
            style={{ borderColor: config.borderAccent }}
          >
            <div className="text-3xl">{selectedType === 'occasion' ? '📸' : selectedType === 'tips' ? '🖼' : '🗂'}</div>
            <div className="text-muted-foreground text-sm text-center">
              <span className="font-semibold" style={{ color: config.color }}>Click to upload</span> or drag & drop
              <br /><span className="text-xs text-muted-foreground">PNG, JPG up to 5MB each</span>
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
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedType === 'tips' && (
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isAnonymous"
              checked={formData.isAnonymous}
              onChange={handleInputChange}
              className="w-4 h-4 rounded"
            />
            <span className="text-muted-foreground text-sm">Allow anonymous tips (hide tipper names)</span>
          </label>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <button type="button" onClick={prevStep} className="px-6 py-3 rounded-full font-semibold text-muted-foreground text-base border border-border bg-background hover:bg-muted transition-all duration-200 cursor-pointer">
          ← Back
        </button>
        <button type="button" onClick={nextStep} className="px-8 py-3.5 rounded-full font-bold text-white text-base transition-all duration-200 hover:-translate-y-0.5 cursor-pointer" style={{ background: config.gradient }}>
          Review →
        </button>
      </div>
    </div>
  );
}
