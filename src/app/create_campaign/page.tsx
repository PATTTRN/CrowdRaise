'use client';

import { useState, useEffect, useRef } from 'react';

export default function CreateCampaign() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    goal: '',
    description: '',
    fullStory: '',
    fundUsage: '',
    terms: false
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const particlesRef = useRef<HTMLDivElement>(null);

  const totalSteps = 3;

  // Create floating particles
  useEffect(() => {
    if (particlesRef.current) {
      const container = particlesRef.current;
      const particleCount = 30;
      
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 6 + 's';
        particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
        container.appendChild(particle);
      }
    }
  }, []);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(prev => [...prev, ...files]);
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreviews(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // Remove image
  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Navigation functions
  const nextStep = () => {
    if (validateCurrentStep() && currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Validation
  const validateCurrentStep = () => {
    const currentStepEl = document.querySelector(`[data-step="${currentStep}"]`);
    if (!currentStepEl) return false;

    const requiredFields = currentStepEl.querySelectorAll('[required]') as NodeListOf<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = '#ff6b6b';
        isValid = false;
      } else {
        field.style.borderColor = '';
      }
    });
    
    return isValid;
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setShowSuccess(true);
    
    // Reset form after success
    setTimeout(() => {
      setShowSuccess(false);
      setCurrentStep(1);
      setFormData({
        title: '',
        category: '',
        goal: '',
        description: '',
        fullStory: '',
        fundUsage: '',
        terms: false
      });
      setImageFiles([]);
      setImagePreviews([]);
    }, 3000);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <div className="bg-particles" id="particles" ref={particlesRef}></div>

      {/* Main Content */}
      <div className="pt-20 pb-8 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4">
              Create Your Campaign
            </h1>
            <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto">
              Start raising funds for your cause in just a few minutes. Our simple 3-step process makes it easy to get started.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8 sm:mb-12">
            <div className="flex justify-between items-center mb-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base font-semibold transition-all duration-300 ${
                    step <= currentStep 
                      ? 'bg-gradient-to-r from-red-400 to-cyan-400 text-white' 
                      : 'bg-white/10 text-white/50'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-16 sm:w-24 h-1 mx-2 sm:mx-4 transition-all duration-300 ${
                      step < currentStep ? 'bg-gradient-to-r from-red-400 to-cyan-400' : 'bg-white/10'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center text-white/70 text-sm sm:text-base">
              Step {currentStep} of {totalSteps}
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white/10 rounded-3xl backdrop-blur-xl border border-white/20 p-6 sm:p-8 lg:p-10 shadow-2xl">
            <form onSubmit={handleSubmit}>
              
              {/* Step 1: Basic Information */}
              <div data-step="1" className={currentStep === 1 ? 'block' : 'hidden'}>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">Basic Information</h2>
                
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <label htmlFor="title" className="block text-white font-medium mb-2 text-sm sm:text-base">
                      Campaign Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Help Sarah Complete Medical School"
                      className="w-full px-4 py-3 sm:py-4 rounded-xl border-2 border-white/20 bg-white/10 text-white text-base sm:text-lg placeholder:text-white/50 backdrop-blur-md transition-all duration-300 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-white font-medium mb-2 text-sm sm:text-base">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 sm:py-4 rounded-xl border-2 border-white/20 bg-white/10 text-white text-base sm:text-lg backdrop-blur-md transition-all duration-300 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/20"
                    >
                      <option value="">Select a category</option>
                      <option value="Medical & Healthcare">Medical & Healthcare</option>
                      <option value="Education">Education</option>
                      <option value="Emergency Relief">Emergency Relief</option>
                      <option value="Community Development">Community Development</option>
                      <option value="Animal Welfare">Animal Welfare</option>
                      <option value="Arts & Culture">Arts & Culture</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="goal" className="block text-white font-medium mb-2 text-sm sm:text-base">
                      Fundraising Goal (₦) *
                    </label>
                    <input
                      type="number"
                      id="goal"
                      name="goal"
                      value={formData.goal}
                      onChange={handleInputChange}
                      required
                      min="1000"
                      placeholder="e.g., 500000"
                      className="w-full px-4 py-3 sm:py-4 rounded-xl border-2 border-white/20 bg-white/10 text-white text-base sm:text-lg placeholder:text-white/50 backdrop-blur-md transition-all duration-300 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-white font-medium mb-2 text-sm sm:text-base">
                      Short Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      placeholder="Brief description of your campaign (max 200 characters)"
                      maxLength={200}
                      className="w-full px-4 py-3 sm:py-4 rounded-xl border-2 border-white/20 bg-white/10 text-white text-base sm:text-lg placeholder:text-white/50 backdrop-blur-md transition-all duration-300 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/20 resize-none"
                    />
                    <div className="text-right text-white/50 text-xs sm:text-sm mt-1">
                      {formData.description.length}/200
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-8 sm:mt-10">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-red-400 to-cyan-400 text-white border-none rounded-full text-base sm:text-lg font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-400/40"
                  >
                    Next Step
                  </button>
                </div>
              </div>

              {/* Step 2: Campaign Story */}
              <div data-step="2" className={currentStep === 2 ? 'block' : 'hidden'}>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">Campaign Story</h2>
                
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <label htmlFor="fullStory" className="block text-white font-medium mb-2 text-sm sm:text-base">
                      Full Story *
                    </label>
                    <textarea
                      id="fullStory"
                      name="fullStory"
                      value={formData.fullStory}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      placeholder="Tell your story in detail. Why are you raising funds? What will the money be used for?"
                      className="w-full px-4 py-3 sm:py-4 rounded-xl border-2 border-white/20 bg-white/10 text-white text-base sm:text-lg placeholder:text-white/50 backdrop-blur-md transition-all duration-300 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/20 resize-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="fundUsage" className="block text-white font-medium mb-2 text-sm sm:text-base">
                      Fund Usage Breakdown *
                    </label>
                    <textarea
                      id="fundUsage"
                      name="fundUsage"
                      value={formData.fundUsage}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      placeholder="Break down how you plan to use the funds (e.g., 60% for tuition, 25% for books, 15% for living expenses)"
                      className="w-full px-4 py-3 sm:py-4 rounded-xl border-2 border-white/20 bg-white/10 text-white text-base sm:text-lg placeholder:text-white/50 backdrop-blur-md transition-all duration-300 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/20 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-3 text-sm sm:text-base">
                      Campaign Images
                    </label>
                    <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <i className="fas fa-cloud-upload-alt text-4xl text-white/50 mb-4 block"></i>
                        <p className="text-white/70 text-sm sm:text-base mb-2">Click to upload images</p>
                        <p className="text-white/50 text-xs sm:text-sm">PNG, JPG up to 5MB each</p>
                      </label>
                    </div>
                    
                    {/* Image Previews */}
                    {imagePreviews.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 sm:h-32 rounded-lg object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between mt-8 sm:mt-10">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-white/10 text-white border border-white/20 rounded-full text-base sm:text-lg font-semibold cursor-pointer transition-all duration-300 hover:bg-white/20 backdrop-blur-md"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-red-400 to-cyan-400 text-white border-none rounded-full text-base sm:text-lg font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-400/40"
                  >
                    Next Step
                  </button>
                </div>
              </div>

              {/* Step 3: Review & Submit */}
              <div data-step="3" className={currentStep === 3 ? 'block' : 'hidden'}>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">Review & Submit</h2>
                
                <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-10">
                  <div className="bg-white/5 rounded-xl p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-3">Campaign Summary</h3>
                    <div className="space-y-2 text-sm sm:text-base">
                      <div className="flex justify-between">
                        <span className="text-white/70">Title:</span>
                        <span className="text-white font-medium">{formData.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Category:</span>
                        <span className="text-white font-medium">{formData.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Goal:</span>
                        <span className="text-white font-medium">₦{formData.goal ? parseInt(formData.goal).toLocaleString() : '0'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Images:</span>
                        <span className="text-white font-medium">{imagePreviews.length} uploaded</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="terms"
                      name="terms"
                      checked={formData.terms}
                      onChange={handleInputChange}
                      required
                      className="mt-1 w-4 h-4 text-cyan-400 bg-white/10 border-white/20 rounded focus:ring-cyan-400 focus:ring-2"
                    />
                    <label htmlFor="terms" className="text-white/80 text-sm sm:text-base">
                      I agree to the <a href="#" className="text-cyan-400 hover:underline">Terms of Service</a> and <a href="#" className="text-cyan-400 hover:underline">Privacy Policy</a>. I confirm that all information provided is accurate and truthful.
                    </label>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-white/10 text-white border border-white/20 rounded-full text-base sm:text-lg font-semibold cursor-pointer transition-all duration-300 hover:bg-white/20 backdrop-blur-md"
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.terms}
                    className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-red-400 to-cyan-400 text-white border-none rounded-full text-base sm:text-lg font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-400/40 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Creating Campaign...
                      </>
                    ) : (
                      'Launch Campaign'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-20 right-4 sm:right-8 bg-green-500/90 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-2xl z-50 animate-slideIn max-w-sm">
          <i className="fas fa-check-circle mr-3"></i>
          Campaign created successfully! Redirecting to your dashboard...
        </div>
      )}
    </>
  );
}