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
        field.style.borderColor = 'rgba(255, 255, 255, 0.2)';
      }
    });
    
    return isValid;
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCurrentStep()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setShowSuccess(true);
      setIsSubmitting(false);
      
      // Simulate redirect after 2 seconds
      setTimeout(() => {
        alert('Campaign created successfully! You would now be redirected to your campaign page.');
        setShowSuccess(false);
      }, 2000);
    }, 1500);
  };

  // Character count component
  const CharacterCount = ({ current: currentCount, max }: { current: number; max: number }) => {
    const isWarning = currentCount > max * 0.7;
    const isDanger = currentCount > max * 0.9;
    
    return (
      <div className={`text-right text-sm mt-2 ${
        isDanger ? 'text-red-400' : isWarning ? 'text-yellow-400' : 'text-white/60'
      }`}>
        {currentCount}/{max}
      </div>
    );
  };

  return (
    <>
      <div className="bg-particles" ref={particlesRef}></div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full px-8 py-4 bg-white/10 backdrop-blur-md border-b border-white/20 z-50 transition-all duration-300">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <a href="#" className="text-3xl font-bold text-transparent bg-gradient-to-r from-red-400 to-cyan-400 bg-clip-text">
            DonateFlow
          </a>
          <ul className="flex gap-8 list-none">
            <li><a href="#dashboard" className="text-white/90 no-underline font-medium transition-all duration-300 hover:text-cyan-400 hover:-translate-y-0.5">Dashboard</a></li>
            <li><a href="#campaigns" className="text-white/90 no-underline font-medium transition-all duration-300 hover:text-cyan-400 hover:-translate-y-0.5">My Campaigns</a></li>
            <li><a href="#help" className="text-white/90 no-underline font-medium transition-all duration-300 hover:text-cyan-400 hover:-translate-y-0.5">Help</a></li>
            <li><a href="#profile" className="text-white/90 no-underline font-medium transition-all duration-300 hover:text-cyan-400 hover:-translate-y-0.5">Profile</a></li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-32 pb-16 px-8 min-h-screen relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-white mb-4 leading-tight">
              Create Your <span className="text-transparent bg-gradient-to-r from-red-400 to-cyan-400 bg-clip-text">Campaign</span>
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Tell your story and start raising funds in minutes. We'll guide you through every step.
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-white/10 rounded-3xl backdrop-blur-xl border border-white/20 p-12 shadow-2xl relative overflow-hidden">
            {/* Shimmer effect */}
            <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/5 to-transparent transform rotate-45 animate-shimmer"></div>

            {/* Progress Steps */}
            <div className="flex justify-center mb-12 relative z-10">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center text-white/60 font-medium relative">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center mr-3 font-semibold border-2 transition-all duration-300 ${
                    step < currentStep 
                      ? 'bg-cyan-400 border-cyan-400 text-white' 
                      : step === currentStep 
                        ? 'bg-gradient-to-r from-red-400 to-cyan-400 border-cyan-400 text-white'
                        : 'bg-white/10 border-white/30'
                  }`}>
                    {step}
                  </div>
                  <span className={step <= currentStep ? 'text-white' : ''}>
                    {step === 1 ? 'Campaign Details' : step === 2 ? 'Media & Story' : 'Review & Launch'}
                  </span>
                  {step < 3 && (
                    <div className={`w-24 h-0.5 mx-4 relative -top-0.5 ${
                      step < currentStep ? 'bg-cyan-400' : 'bg-white/20'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>

            {/* Success Message */}
            {showSuccess && (
              <div className="bg-cyan-400/20 border border-cyan-400 rounded-xl p-4 mb-8 text-white text-center animate-slideIn">
                <i className="fas fa-rocket mr-2"></i> Campaign created successfully! Redirecting to your dashboard...
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Step 1: Campaign Details */}
              <div className={`form-step ${currentStep === 1 ? 'block' : 'hidden'}`} data-step="1">
                <div className="mb-10 relative z-10">
                  <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                    <i className="fas fa-edit text-transparent bg-gradient-to-r from-red-400 to-cyan-400 bg-clip-text"></i>
                    Campaign Basics
                  </h3>
                  
                  <div className="mb-7">
                    <label htmlFor="title" className="block text-white/90 font-medium mb-3 text-base">
                      Campaign Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 rounded-xl border-2 border-white/20 bg-white/10 text-white text-base backdrop-blur-md transition-all duration-300 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/20 focus:bg-white/15 placeholder:text-white/60"
                      placeholder="Give your campaign a clear, compelling title"
                      required
                      maxLength={80}
                    />
                    <CharacterCount current={formData.title.length} max={80} />
                  </div>

                  <div className="mb-7">
                    <label htmlFor="category" className="block text-white/90 font-medium mb-3 text-base">
                      Category <span className="text-red-400">*</span>
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 rounded-xl border-2 border-white/20 bg-white/10 text-white text-base backdrop-blur-md transition-all duration-300 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/20 focus:bg-white/15"
                      required
                    >
                      <option value="">Choose a category</option>
                      <option value="medical">Medical & Healthcare</option>
                      <option value="education">Education</option>
                      <option value="emergency">Emergency & Crisis</option>
                      <option value="community">Community & Social</option>
                      <option value="charity">Charity & Nonprofit</option>
                      <option value="business">Business & Startup</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="mb-7">
                    <label htmlFor="goal" className="block text-white/90 font-medium mb-3 text-base">
                      Funding Goal <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400 font-semibold text-lg">₦</span>
                      <input
                        type="number"
                        id="goal"
                        name="goal"
                        value={formData.goal}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-6 py-4 rounded-xl border-2 border-white/20 bg-white/10 text-white text-lg font-semibold backdrop-blur-md transition-all duration-300 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/20 focus:bg-white/15 placeholder:text-white/60"
                        placeholder="0"
                        min="1000"
                        max="100000000"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-7">
                    <label htmlFor="description" className="block text-white/90 font-medium mb-3 text-base">
                      Short Description <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 rounded-xl border-2 border-white/20 bg-white/10 text-white text-base backdrop-blur-md transition-all duration-300 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/20 focus:bg-white/15 placeholder:text-white/60 min-h-[120px] font-inherit leading-relaxed resize-y"
                      placeholder="Write a brief, compelling description of your campaign (this appears in search results)"
                      required
                      maxLength={200}
                    />
                    <CharacterCount current={formData.description.length} max={200} />
                  </div>
                </div>
              </div>

              {/* Step 2: Media & Story */}
              <div className={`form-step ${currentStep === 2 ? 'block' : 'hidden'}`} data-step="2">
                <div className="mb-10 relative z-10">
                  <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                    <i className="fas fa-images text-transparent bg-gradient-to-r from-red-400 to-cyan-400 bg-clip-text"></i>
                    Campaign Media
                  </h3>
                  
                  <div className="mb-7">
                    <label className="block text-white/90 font-medium mb-3 text-base">Campaign Images</label>
                    <div className="relative inline-block w-full cursor-pointer">
                      <input
                        type="file"
                        id="images"
                        name="images"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="absolute -left-[9999px]"
                      />
                      <label
                        htmlFor="images"
                        className="flex items-center justify-center gap-4 p-8 border-2 border-dashed border-white/30 rounded-xl bg-white/5 text-white/80 font-medium transition-all duration-300 cursor-pointer hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-white"
                      >
                        <i className="fas fa-cloud-upload-alt text-2xl text-cyan-400"></i>
                        <span>Click to upload images or drag and drop</span>
                      </label>
                    </div>
                    {imagePreviews.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative rounded-lg overflow-hidden aspect-square bg-white/10">
                            <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-red-400/90 text-white border-none rounded-full w-6 h-6 cursor-pointer flex items-center justify-center text-sm transition-all duration-300 hover:bg-red-400 hover:scale-110"
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-10 relative z-10">
                  <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                    <i className="fas fa-heart text-transparent bg-gradient-to-r from-red-400 to-cyan-400 bg-clip-text"></i>
                    Your Story
                  </h3>
                  
                  <div className="mb-7">
                    <label htmlFor="fullStory" className="block text-white/90 font-medium mb-3 text-base">
                      Tell Your Full Story <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="fullStory"
                      name="fullStory"
                      value={formData.fullStory}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 rounded-xl border-2 border-white/20 bg-white/10 text-white text-base backdrop-blur-md transition-all duration-300 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/20 focus:bg-white/15 placeholder:text-white/60 min-h-[200px] font-inherit leading-relaxed resize-y"
                      placeholder="Share your complete story here. Explain why you need support, how the funds will be used, and what impact donations will make. Be authentic and specific."
                      required
                      maxLength={5000}
                    />
                    <CharacterCount current={formData.fullStory.length} max={5000} />
                  </div>

                  <div className="mb-7">
                    <label htmlFor="fundUsage" className="block text-white/90 font-medium mb-3 text-base">
                      How Will Funds Be Used?
                    </label>
                    <textarea
                      id="fundUsage"
                      name="fundUsage"
                      value={formData.fundUsage}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 rounded-xl border-2 border-white/20 bg-white/10 text-white text-base backdrop-blur-md transition-all duration-300 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/20 focus:bg-white/15 placeholder:text-white/60 min-h-[120px] font-inherit leading-relaxed resize-y"
                      placeholder="Break down how you plan to use the donated funds (e.g., 70% medical bills, 20% treatment costs, 10% recovery expenses)"
                      maxLength={1000}
                    />
                    <CharacterCount current={formData.fundUsage.length} max={1000} />
                  </div>
                </div>
              </div>

              {/* Step 3: Review */}
              <div className={`form-step ${currentStep === 3 ? 'block' : 'hidden'}`} data-step="3">
                <div className="mb-10 relative z-10">
                  <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                    <i className="fas fa-check-circle text-transparent bg-gradient-to-r from-red-400 to-cyan-400 bg-clip-text"></i>
                    Review & Launch
                  </h3>
                  <p className="text-white/80 mb-8 leading-relaxed">
                    Review your campaign details below. Once published, your campaign will be live immediately and ready to receive donations.
                  </p>
                  
                  <div className="bg-white/5 p-8 rounded-xl mb-8">
                    <div className="text-center">
                      <h3 className="text-white text-2xl font-semibold mb-2">{formData.title || 'Your Campaign Title'}</h3>
                      <p className="text-cyan-400 font-medium mb-4">{formData.category || 'Category'}</p>
                      <div className="text-4xl font-bold text-cyan-400 mb-4">
                        ₦{parseInt(formData.goal || '0').toLocaleString()} Goal
                      </div>
                      <p className="text-white/80 leading-relaxed">{formData.description || 'Campaign description'}</p>
                    </div>
                  </div>

                  <div className="mb-7">
                    <label className="flex items-center text-white/90 font-medium">
                      <input
                        type="checkbox"
                        id="terms"
                        name="terms"
                        checked={formData.terms}
                        onChange={handleInputChange}
                        className="mr-3"
                        required
                      />
                      I agree to the <a href="#" className="text-cyan-400 ml-1">Terms of Service</a> and confirm that all information provided is accurate.
                    </label>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 justify-center mt-12 relative z-10">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-8 py-4 rounded-full text-white font-semibold text-lg transition-all duration-300 relative overflow-hidden border-2 border-white/30 bg-white/10 backdrop-blur-md hover:bg-white/20 hover:-translate-y-1 flex items-center gap-3"
                  >
                    <i className="fas fa-arrow-left"></i> Previous
                  </button>
                )}
                
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-4 rounded-full text-white font-semibold text-lg transition-all duration-300 relative overflow-hidden bg-gradient-to-r from-red-400 to-cyan-400 shadow-lg shadow-red-400/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-400/40 flex items-center gap-3"
                  >
                    Next <i className="fas fa-arrow-right"></i>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-4 rounded-full text-white font-semibold text-lg transition-all duration-300 relative overflow-hidden bg-gradient-to-r from-red-400 to-cyan-400 shadow-lg shadow-red-400/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-400/40 flex items-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i> Creating Campaign...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-rocket"></i> Launch Campaign
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}