'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { collectionService } from '@/services';
import { upload } from "@imagekit/next";

const TYPE_CONFIG = {
  fundraiser: {
    label: 'Fundraiser',
    color: '#635bff',
    gradient: 'linear-gradient(135deg, #635bff, #3b82f6)',
    categories: [
      'Medical & Healthcare', 'Education', 'Emergency & Crisis',
      'Community Development', 'Animal Welfare', 'Arts & Culture', 'Other'
    ],
    heroImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?fit=crop&w=1200&q=80',
  },
  occasion: {
    label: 'Gift Page',
    color: '#a855f7',
    gradient: 'linear-gradient(135deg, #a855f7, #ec4899)',
    categories: [
      'Wedding', 'Birthday', 'Anniversary', 'Baby Shower',
      'Graduation', 'Retirement', 'Other Celebration'
    ],
    heroImage: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?fit=crop&w=1200&q=80',
  },
  tips: {
    label: 'Tips Page',
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    categories: [
      'Content Creator', 'Music / DJ', 'Performer / Artist',
      'Freelancer', 'Food & Hospitality', 'Education / Tutoring', 'Other'
    ],
    heroImage: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?fit=crop&w=1200&q=80',
  },
} as const;

type CollectionType = keyof typeof TYPE_CONFIG;

interface Image {
  _id?: string;
  url: string;
  publicId: string;
  isPrimary?: boolean;
}

export default function EditCollection({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<CollectionType>('fundraiser');
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    goal: '',
    eventDate: '',
    receiverName: '',
    suggestedAmounts: '',
    description: '',
    fullStory: '',
    fundUsage: '',
  });

  const [existingImages, setExistingImages] = useState<Image[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const res = await collectionService.getCollectionById(id);
        type FundUsage = { description: string; amount: number };
        interface CollectionResData {
          type: string;
          title: string;
          category: string;
          goal?: string | number;
          eventDate?: string;
          receiverName?: string;
          suggestedAmounts?: (string | number)[];
          description: string;
          fullStory: string;
          fundUsage?: FundUsage[];
          images?: Image[];
        }
        const col = res.data as CollectionResData;

        setSelectedType(col.type as CollectionType);
        setFormData({
          title: col.title,
          category: col.category,
          goal: col.goal !== undefined && col.goal !== null ? String(col.goal) : '',
          eventDate: col.eventDate
            ? new Date(col.eventDate).toISOString().split('T')[0]
            : '',
          receiverName: col.receiverName || '',
          suggestedAmounts: Array.isArray(col.suggestedAmounts)
            ? col.suggestedAmounts.join(', ')
            : '',
          description: col.description,
          fullStory: col.fullStory,
          fundUsage:
            Array.isArray(col.fundUsage) && col.fundUsage.length > 0
              ? col.fundUsage[0]?.description ?? ''
              : '',
        });
        setExistingImages(Array.isArray(col.images) ? col.images : []);
      } catch {
        toast.error('Failed to load collection');
        router.push('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) fetchCollection();
  }, [id, isAuthenticated, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev: ProgressEvent<FileReader>) =>
        setImagePreviews((prev) => [...prev, typeof ev.target?.result === 'string' ? ev.target.result : '']);
      reader.readAsDataURL(file);
    });
  };

  const removeExistingImage = (imgId?: string) => {
    if (!imgId) return;
    setExistingImages((prev) => prev.filter((img) => img._id !== imgId));
  };

  const removeNewImage = (index: number) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  type AuthParams = { signature: string; expire: number; token: string };
  const authenticator = async (): Promise<AuthParams> => {
    const response = await fetch("/api/upload-auth");
    return await response.json();
  };

  interface UploadedImage {
    url: string;
    publicId: string;
    isPrimary?: boolean;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const uploadedImages: UploadedImage[] = [];
      for (const file of imageFiles) {
        const authParams = await authenticator();
        const uploadRes = await upload({
          ...authParams,
          file,
          fileName: file.name,
          folder: "/crowdraise/collections",
          publicKey: ''
        });
        uploadedImages.push({
          url: uploadRes.url as string,
          publicId: uploadRes.fileId as string
        });
      }

      const baseImages: UploadedImage[] = existingImages.map(({ url, publicId, isPrimary }) => ({ url, publicId, isPrimary }));
      const finalImages: UploadedImage[] = [
        ...baseImages,
        ...uploadedImages
      ];
      if (finalImages.length > 0) {
        finalImages[0] = { ...finalImages[0], isPrimary: true };
      }

      const payload: Record<string, unknown> = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        fullStory: formData.fullStory,
        goal: formData.goal ? Number(formData.goal) : undefined,
        images: finalImages,
      };

      if (selectedType === 'occasion') {
        payload.eventDate = formData.eventDate;
        payload.receiverName = formData.receiverName;
      }

      if (selectedType === 'fundraiser' && formData.fundUsage) {
        payload.fundUsage = [{ description: formData.fundUsage, amount: Number(formData.goal) || 0 }];
      }

      await collectionService.updateCollection(id, payload);
      toast.success('Collection updated successfully!');
      router.push(`/collection_detail/${id}`);
    } catch (error) {
      if (typeof error === "object" && error !== null && "response" in error) {
        const errTyped = error as { response?: { data?: { message?: string; error?: string } } };
        toast.error(errTyped.response?.data?.message || errTyped.response?.data?.error || 'Update failed');
      } else {
        toast.error('Update failed');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary/30 border-t-primary"></div>
      </div>
    );

  const config = TYPE_CONFIG[selectedType];
  const inputCls = 'w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all';

  return (
    <div className="min-h-screen bg-secondary/30 pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8 tracking-tight">Edit Campaign</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl border border-border shadow-sm">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Campaign Title</label>
            <input name="title" value={formData.title} onChange={handleInputChange} className={inputCls} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Category</label>
              <select name="category" value={formData.category} onChange={handleInputChange} className={inputCls} required>
                {config.categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Goal (₦)</label>
              <input type="number" name="goal" value={formData.goal} onChange={handleInputChange} className={inputCls} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Short Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} className={inputCls} rows={2} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Full Story</label>
            <textarea name="fullStory" value={formData.fullStory} onChange={handleInputChange} className={inputCls} rows={6} required />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Images</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mb-4">
              {existingImages.map((img) => (
                <div key={img._id ?? `${img.url}:${img.publicId}`} className="relative aspect-square rounded-lg overflow-hidden border border-border">
                  <img src={img.url} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeExistingImage(img._id)}
                    className="absolute top-1 right-1 bg-black/60 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center hover:bg-black/80">×</button>
                </div>
              ))}
              {imagePreviews.map((prev, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-primary/50">
                  <img src={prev} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeNewImage(i)}
                    className="absolute top-1 right-1 bg-black/60 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center hover:bg-black/80">×</button>
                </div>
              ))}
              <label className="aspect-square rounded-lg border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:bg-muted transition-colors">
                <span className="text-muted-foreground text-2xl">+</span>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={() => router.back()}
              className="flex-1 py-4 rounded-xl border border-border text-foreground font-medium hover:bg-muted transition-all cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting}
              className="flex-[2] py-4 rounded-xl text-white font-bold shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 cursor-pointer"
              style={{ background: config.gradient }}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
