'use client';

import { useState, useEffect, Suspense, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { uploadService } from '@/services';
import { TYPE_CONFIG, type CollectionType } from '@/lib/type-config';
import type { CreateCollectionPayload, UploadedImage } from '@/lib/api-types';
import { useCreateCollection } from '@/hooks/use-queries';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Lock, Loader2 } from 'lucide-react';
import { FullHeroCarousel } from './FullHeroCarousel';
import { Step1Basics } from './Step1Basics';
import { Step2Story } from './Step2Story';
import { Step3Review } from './Step3Review';

const COLLECTION_TYPES: { id: CollectionType; desc: string }[] = [
  { id: 'fundraiser', desc: 'Raise money for a cause, need, or project' },
  { id: 'occasion', desc: 'Collect gifts for a wedding, birthday, anniversary & more' },
  { id: 'tips', desc: 'Let fans & followers tip you for your work' },
];

type FormValues = {
  title: string;
  category: string;
  goal: string;
  eventDate: string;
  receiverName: string;
  suggestedAmounts: string;
  description: string;
  fullStory: string;
  fundUsage: string;
  terms: boolean;
  isAnonymous: boolean;
};

function SearchParamsInitializer({ children }: { children: (searchParams: ReturnType<typeof useSearchParams>) => React.ReactNode }) {
  const searchParams = useSearchParams();
  return <>{children(searchParams)}</>;
}

export default function CreateCampaign() {
  return (
    <Suspense fallback={null}>
      <SearchParamsInitializer>
        {(searchParams) => <CreateCampaignInner initialType={(searchParams.get('type') as CollectionType) || 'fundraiser'} />}
      </SearchParamsInitializer>
    </Suspense>
  );
}

function CreateCampaignInner({ initialType }: { initialType: CollectionType }) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  useEffect(() => { document.title = 'Create Collection - CrowdRaise'; }, []);

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedType, setSelectedType] = useState<CollectionType>(initialType);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    defaultValues: { title: '', category: '', goal: '', eventDate: '', receiverName: '', suggestedAmounts: '', description: '', fullStory: '', fundUsage: '', terms: false, isAnonymous: false },
  });

  const formData = watch();
  const createMutation = useCreateCollection();
  const config = TYPE_CONFIG[selectedType];
  const totalSteps = 3;



  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-[var(--header-height)]">
        <Card className="p-10 max-w-md text-center shadow-lg">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6"><Lock className="size-8 text-primary" /></div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Login Required</h2>
          <p className="text-muted-foreground mb-8">You need to be logged in to create a collection and start raising funds.</p>
          <Button size="lg" className="w-full" onClick={() => window.dispatchEvent(new CustomEvent('open-auth-modal'))}>Open Login Modal</Button>
        </Card>
      </div>
    );
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (imageFiles.length + files.length > 5) { toast.error('You can only upload up to 5 images'); return; }
    setImageFiles((prev) => [...prev, ...files]);
    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => setImagePreviews((prev) => [...prev, ev.target?.result as string]);
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (i: number) => {
    setImageFiles((prev) => prev.filter((_, idx) => idx !== i));
    setImagePreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!formData.title || !formData.category || !formData.description) { toast.error('Please fill in all required fields'); return; }
      if (selectedType === 'fundraiser' && !formData.goal) { toast.error('Goal amount is required for fundraisers'); return; }
    }
    if (currentStep === 2) { if (!formData.fullStory) { toast.error('Please tell your story'); return; } }
    if (currentStep < totalSteps) setCurrentStep((s) => s + 1);
  };

  const prevStep = () => { if (currentStep > 1) setCurrentStep((s) => s - 1); };

  const onSubmit = async () => {
    const backendCategory = selectedType === 'occasion' ? 'Occasion Gifts' : selectedType === 'tips' ? 'Personal Tips' : formData.category;

    const uploadedImages: UploadedImage[] = [];
    if (imageFiles.length > 0) {
      const results = await Promise.allSettled(
        imageFiles.map((file, i) =>
          uploadService.uploadImage(file).then((res) => ({
            url: res.url,
            publicId: res.fileId,
            isPrimary: i === 0,
          }))
        )
      );
      for (const result of results) {
        if (result.status === 'fulfilled') uploadedImages.push(result.value);
        else toast.error('Some images failed to upload. The collection was still created.');
      }
    }

    const payload: CreateCollectionPayload = {
      type: selectedType, title: formData.title, category: backendCategory,
      description: formData.description, fullStory: formData.fullStory,
      goal: formData.goal ? Number(formData.goal) : undefined,
      images: uploadedImages.length > 0 ? uploadedImages : [],
      ...(selectedType === 'occasion' && { eventDate: formData.eventDate, receiverName: formData.receiverName }),
      ...(selectedType === 'fundraiser' && formData.fundUsage ? { fundUsage: [{ description: formData.fundUsage, amount: Number(formData.goal) || 0 }] } : {}),
      ...(formData.suggestedAmounts ? { suggestedAmounts: formData.suggestedAmounts.split(',').map(a => a.trim()).filter(a => !isNaN(Number(a))).map(a => Number(a)) } : {}),
    };

    const response = await createMutation.mutateAsync(payload);
    toast.success('Collection created successfully!');
    router.push(`/collection_detail/${response.data._id}?share=true`);
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      <section className="relative w-full min-h-[48vh] min-w-0">
        <FullHeroCarousel selectedType={selectedType} setSelectedType={setSelectedType} COLLECTION_TYPES={COLLECTION_TYPES} />
      </section>

      <div className="relative z-10 max-w-3xl mx-auto" style={{ marginTop: '-90px', paddingBottom: '1.5rem' }}>
        <div className="bg-white border border-border rounded-2xl shadow-sm px-4 sm:px-6 lg:px-8 pt-10 pb-2">
          <div className="mb-10">
            <div className="flex items-center justify-center gap-0">
              {[1, 2, 3].map((step, i) => (
                <div key={step} className="flex items-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300"
                    style={step <= currentStep ? { background: config.gradient, color: '#fff' } : { background: 'var(--muted)', color: 'var(--muted-foreground)' }}>{step < currentStep ? '\u2713' : step}</div>
                  {step < 3 && <div className="w-20 sm:w-32 h-0.5 mx-1 transition-all duration-500" style={{ background: step < currentStep ? config.gradient : 'var(--border)' }} />}
                </div>
              ))}
            </div>
            <div className="text-center text-muted-foreground text-sm mt-3">
              Step {currentStep} of {totalSteps} · {currentStep === 1 ? 'Basics' : currentStep === 2 ? 'Story & Images' : 'Review & Launch'}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 lg:p-10 shadow-sm relative">
            {createMutation.isPending && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-2xl flex items-center justify-center z-50">
                <div className="text-center"><Loader2 className="size-8 animate-spin text-primary mx-auto mb-3" /><p className="text-foreground font-medium">Creating your collection...</p></div>
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
              {currentStep === 1 && (
                <Step1Basics selectedType={selectedType} setSelectedType={setSelectedType} formData={formData}
                  register={register} errors={errors} nextStep={nextStep} COLLECTION_TYPES={COLLECTION_TYPES} />
              )}
              {currentStep === 2 && (
                <Step2Story selectedType={selectedType} formData={formData} register={register} errors={errors}
                  handleImageUpload={handleImageUpload} removeImage={removeImage} imagePreviews={imagePreviews}
                  prevStep={prevStep} nextStep={nextStep} />
              )}
              {currentStep === 3 && (
                <Step3Review selectedType={selectedType} formData={formData} register={register}
                  imagePreviews={imagePreviews} isSubmitting={createMutation.isPending} prevStep={prevStep} />
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
