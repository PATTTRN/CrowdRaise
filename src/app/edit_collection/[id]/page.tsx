'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import { collectionService } from '@/services';
import { upload } from "@imagekit/next";
import api from '@/lib/axios';

const TYPE_CONFIG = {
  fundraiser: {
    label: 'Fundraiser',
    color: 'rgb(224, 123, 140)',
    gradient: 'linear-gradient(135deg,rgb(224, 123, 140),rgb(203, 88, 132))',
    categories: [
      'Medical & Healthcare',
      'Education',
      'Emergency & Crisis',
      'Community Development',
      'Animal Welfare',
      'Arts & Culture',
      'Other'
    ],
    heroImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?fit=crop&w=1200&q=80',
  },
  occasion: {
    label: 'Gift Page',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
    categories: [
      'Wedding',
      'Birthday',
      'Anniversary',
      'Baby Shower',
      'Graduation',
      'Retirement',
      'Other Celebration'
    ],
    heroImage: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?fit=crop&w=1200&q=80',
  },
  tips: {
    label: 'Tips Page',
    color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    categories: [
      'Content Creator',
      'Music / DJ',
      'Performer / Artist',
      'Freelancer',
      'Food & Hospitality',
      'Education / Tutoring',
      'Other'
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
  const { user, isAuthenticated } = useAuthStore();
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
  const particlesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const res = await collectionService.getCollectionById(id);
        // NOTE: Add interface for col
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
      } catch (_error) {
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

  // img._id can be undefined! So ignore if it's undefined or does not match
  const removeExistingImage = (imgId?: string) => {
    // Only attempt to remove if imgId is defined
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

      // Map existingImages to include url and publicId only (ignore isPrimary since not always present)
      const baseImages = existingImages.map(({ url, publicId }) => ({ url, publicId }));
      const finalImages: (UploadedImage & Partial<Pick<Image, 'isPrimary'>>)[] = [
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
        payload.fundUsage = [
          {
            description: formData.fundUsage,
            amount: Number(formData.goal) || 0
          }
        ];
      }

      await collectionService.updateCollection(id, payload);
      toast.success('Collection updated successfully!');
      router.push(`/collection_detail/${id}`);
    } catch (error) {
      // TS: error is unknown, so narrow
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { message?: string; error?: string } } }).response === "object"
      ) {
        // try to display error from backend
        const errTyped = error as { response?: { data?: { message?: string; error?: string } } };
        toast.error(
          errTyped.response?.data?.message ||
            errTyped.response?.data?.error ||
            'Update failed'
        );
      } else {
        toast.error('Update failed');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading...
      </div>
    );

  const config = TYPE_CONFIG[selectedType];
  const inputCls =
    `w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:border-pink-500 transition-all`;

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Edit Campaign</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-xl">
          <div>
            <label className="block text-white/60 text-sm mb-2">Campaign Title</label>
            <input name="title" value={formData.title} onChange={handleInputChange} className={inputCls} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white/60 text-sm mb-2">Category</label>
              <select name="category" value={formData.category} onChange={handleInputChange} className={inputCls} required>
                {config.categories.map((c) => (
                  <option key={c} value={c} className="bg-neutral-900">
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-white/60 text-sm mb-2">Goal (₦)</label>
              <input type="number" name="goal" value={formData.goal} onChange={handleInputChange} className={inputCls} />
            </div>
          </div>

          <div>
            <label className="block text-white/60 text-sm mb-2">Short Description</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} className={inputCls} rows={2} required />
          </div>

          <div>
            <label className="block text-white/60 text-sm mb-2">Full Story</label>
            <textarea name="fullStory" value={formData.fullStory} onChange={handleInputChange} className={inputCls} rows={6} required />
          </div>

          <div>
            <label className="block text-white/60 text-sm mb-2">Images</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mb-4">
              {existingImages.map((img) => (
                <div
                  key={img._id ?? `${img.url}:${img.publicId}`}
                  className="relative aspect-square rounded-lg overflow-hidden border border-white/10"
                >
                  <img src={img.url} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(img._id)}
                    className="absolute top-1 right-1 bg-black/60 p-1 rounded-full text-white/80 hover:text-white"
                  >
                    <i className="fas fa-times text-xs"></i>
                  </button>
                </div>
              ))}
              {imagePreviews.map((prev, i) => (
                <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-pink-500/50">
                  <img src={prev} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeNewImage(i)}
                    className="absolute top-1 right-1 bg-black/60 p-1 rounded-full text-white/80 hover:text-white"
                  >
                    <i className="fas fa-times text-xs"></i>
                  </button>
                </div>
              ))}
              <label className="aspect-square rounded-lg border-2 border-dashed border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/5 transition-colors">
                <i className="fas fa-plus text-white/20"></i>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 py-4 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-[2] py-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold shadow-lg shadow-pink-500/20 hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              {isSubmitting ? <i className="fas fa-spinner fa-spin mr-2"></i> : null}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
