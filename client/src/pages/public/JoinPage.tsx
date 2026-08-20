import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Check, ChevronRight, ChevronLeft, UserPlus } from 'lucide-react';
import { addDocument, COLLECTIONS } from '@/firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  dob: z.string().min(1, 'Date of Birth is required'),
  gender: z.enum(['male', 'female', 'other']),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  district: z.string().min(2, 'District is required'),
  pincode: z.string().min(6, 'Valid Pincode is required'),
  occupation: z.string().min(2, 'Occupation is required'),
  qualification: z.string().min(2, 'Qualification is required'),
  interest: z.string().min(2, 'Please select an area of interest'),
});

type FormData = z.infer<typeof schema>;

const JoinPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, trigger } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onTouched',
  });

  const nextStep = async () => {
    let isValid = false;
    if (step === 1) isValid = await trigger(['name', 'dob', 'gender', 'email', 'phone']);
    if (step === 2) isValid = await trigger(['address', 'district', 'pincode']);
    
    if (isValid) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => setStep(prev => prev - 1);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const appId = `APP-${Math.floor(100000 + Math.random() * 900000)}`;
      await addDocument(COLLECTIONS.MEMBER_APPLICATIONS, {
        ...data,
        gender: data.gender.charAt(0).toUpperCase() + data.gender.slice(1) as any,
        applicationId: appId,
        status: 'Pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setSuccessId(appId);
      toast.success('Application submitted successfully!');
    } catch (error: any) {
      console.error('Firestore write error:', error?.code, error?.message);
      if (error?.code === 'permission-denied') {
        toast.error('Submission blocked by server rules. Please contact support.');
      } else {
        toast.error('Failed to submit application. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successId) {
    return (
      <main className="w-full bg-gray-50 min-h-screen flex items-center justify-center py-20 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 max-w-lg w-full text-center"
        >
          <div className="w-24 h-24 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-8">
            <Check className="w-12 h-12 text-success" />
          </div>
          <h2 className="text-4xl font-display font-bold text-dark mb-4">Application Received</h2>
          <p className="text-gray-500 text-lg mb-8">Thank you for applying to join ASPK4Hapur. Your application ID is:</p>
          <div className="bg-gray-50 border border-gray-200 py-4 px-8 rounded-xl text-3xl font-mono font-bold tracking-widest text-primary mb-10 inline-block">
            {successId}
          </div>
          <p className="text-gray-500 mb-10">We will review your application and contact you shortly.</p>
          <button onClick={() => window.location.href = '/'} className="px-8 py-4 bg-primary text-white font-bold text-lg rounded-lg hover:bg-primary/90 transition-colors w-full shadow-md">
            Return to Home
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="w-full bg-gray-50 min-h-screen pb-24">
      <section className="bg-white py-20 text-center relative overflow-hidden border-b border-gray-100">
        <div className="container-padded relative z-10 space-y-4 max-w-3xl mx-auto">
          <span className="font-bold tracking-widest uppercase text-sm text-primary">Membership</span>
          <h1 className="text-5xl md:text-6xl font-display font-bold text-dark">Join the Movement</h1>
          <p className="text-gray-500 text-xl leading-relaxed">Become a part of the change. Register as an official member today.</p>
        </div>
      </section>

      <section className="container-padded py-16 -mt-8 relative z-20">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Progress Indicator */}
          <div className="px-10 py-8 border-b border-gray-100 flex justify-between items-center relative">
            <div className="absolute top-1/2 left-[15%] right-[15%] h-1 bg-gray-100 -translate-y-1/2 -z-0 rounded-lg hidden sm:block">
              <div className="h-full bg-primary transition-all duration-500 rounded-lg" style={{ width: `${(step - 1) * 50}%` }} />
            </div>
            {[1, 2, 3].map(num => (
              <div key={num} className="flex flex-col items-center relative z-10 bg-white px-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg transition-all ${step > num ? 'bg-primary text-white' : step === num ? 'bg-primary/10 text-primary border-2 border-primary' : 'bg-gray-50 text-gray-400 border-2 border-gray-200'}`}>
                  {step > num ? <Check className="w-6 h-6" /> : num}
                </div>
                <span className={`text-sm mt-3 font-bold uppercase tracking-wider ${step >= num ? 'text-dark' : 'text-gray-400'}`}>
                  {num === 1 ? 'Personal' : num === 2 ? 'Address' : 'Details'}
                </span>
              </div>
            ))}
          </div>

          <div className="p-10 md:p-14">
            <form onSubmit={handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                    <h3 className="text-3xl font-display font-bold text-dark mb-8">Personal Information</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                        <input {...register('name')} className={`w-full px-5 py-4 rounded-xl border-2 bg-gray-50 focus:bg-white outline-none transition-all ${errors.name ? 'border-red-500' : 'border-gray-200 focus:border-primary'}`} placeholder="Enter your full name" />
                        {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Date of Birth</label>
                        <input type="date" {...register('dob')} className={`w-full px-5 py-4 rounded-xl border-2 bg-gray-50 focus:bg-white outline-none transition-all ${errors.dob ? 'border-red-500' : 'border-gray-200 focus:border-primary'}`} />
                        {errors.dob && <p className="text-red-500 text-xs mt-1 font-medium">{errors.dob.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Gender</label>
                        <select {...register('gender')} className={`w-full px-5 py-4 rounded-xl border-2 bg-gray-50 focus:bg-white outline-none transition-all ${errors.gender ? 'border-red-500' : 'border-gray-200 focus:border-primary'}`}>
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                        {errors.gender && <p className="text-red-500 text-xs mt-1 font-medium">{errors.gender.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                        <input type="email" {...register('email')} className={`w-full px-5 py-4 rounded-xl border-2 bg-gray-50 focus:bg-white outline-none transition-all ${errors.email ? 'border-red-500' : 'border-gray-200 focus:border-primary'}`} placeholder="Enter email address" />
                        {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>}
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                        <input type="tel" {...register('phone')} className={`w-full px-5 py-4 rounded-xl border-2 bg-gray-50 focus:bg-white outline-none transition-all ${errors.phone ? 'border-red-500' : 'border-gray-200 focus:border-primary'}`} placeholder="Enter 10-digit mobile number" />
                        {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone.message}</p>}
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                    <h3 className="text-3xl font-display font-bold text-dark mb-8">Address & Location</h3>
                    <div className="space-y-8">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Full Address</label>
                        <textarea {...register('address')} rows={3} className={`w-full px-5 py-4 rounded-xl border-2 bg-gray-50 focus:bg-white outline-none transition-all resize-none ${errors.address ? 'border-red-500' : 'border-gray-200 focus:border-primary'}`} placeholder="Enter complete residential address" />
                        {errors.address && <p className="text-red-500 text-xs mt-1 font-medium">{errors.address.message}</p>}
                      </div>
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">District/City</label>
                          <input {...register('district')} className={`w-full px-5 py-4 rounded-xl border-2 bg-gray-50 focus:bg-white outline-none transition-all ${errors.district ? 'border-red-500' : 'border-gray-200 focus:border-primary'}`} placeholder="Enter district" />
                          {errors.district && <p className="text-red-500 text-xs mt-1 font-medium">{errors.district.message}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Pincode</label>
                          <input {...register('pincode')} className={`w-full px-5 py-4 rounded-xl border-2 bg-gray-50 focus:bg-white outline-none transition-all ${errors.pincode ? 'border-red-500' : 'border-gray-200 focus:border-primary'}`} placeholder="Enter 6-digit pincode" />
                          {errors.pincode && <p className="text-red-500 text-xs mt-1 font-medium">{errors.pincode.message}</p>}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                    <h3 className="text-3xl font-display font-bold text-dark mb-8">Background & Interests</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Highest Qualification</label>
                        <input {...register('qualification')} className={`w-full px-5 py-4 rounded-xl border-2 bg-gray-50 focus:bg-white outline-none transition-all ${errors.qualification ? 'border-red-500' : 'border-gray-200 focus:border-primary'}`} placeholder="E.g., Graduate, Post Graduate" />
                        {errors.qualification && <p className="text-red-500 text-xs mt-1 font-medium">{errors.qualification.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Current Occupation</label>
                        <input {...register('occupation')} className={`w-full px-5 py-4 rounded-xl border-2 bg-gray-50 focus:bg-white outline-none transition-all ${errors.occupation ? 'border-red-500' : 'border-gray-200 focus:border-primary'}`} placeholder="E.g., Student, Business, Service" />
                        {errors.occupation && <p className="text-red-500 text-xs mt-1 font-medium">{errors.occupation.message}</p>}
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Area of Interest to Contribute</label>
                        <select {...register('interest')} className={`w-full px-5 py-4 rounded-xl border-2 bg-gray-50 focus:bg-white outline-none transition-all ${errors.interest ? 'border-red-500' : 'border-gray-200 focus:border-primary'}`}>
                          <option value="">Select an area of interest</option>
                          <option value="campaigning">Campaigning & Outreach</option>
                          <option value="digital">Digital & Social Media</option>
                          <option value="events">Event Management</option>
                          <option value="policy">Policy & Research</option>
                          <option value="general">General Volunteer</option>
                        </select>
                        {errors.interest && <p className="text-red-500 text-xs mt-1 font-medium">{errors.interest.message}</p>}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-12 flex justify-between pt-8 border-t border-gray-100">
                {step > 1 ? (
                  <button type="button" onClick={prevStep} className="flex items-center px-8 py-4 rounded-lg border-2 border-gray-200 text-gray-700 font-bold hover:border-gray-300 hover:bg-gray-50 transition-all text-lg">
                    <ChevronLeft className="w-5 h-5 mr-2" /> Back
                  </button>
                ) : (
                  <div />
                )}
                
                {step < 3 ? (
                  <button type="button" onClick={nextStep} className="flex items-center px-10 py-4 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-md text-lg">
                    Continue <ChevronRight className="w-5 h-5 ml-2" />
                  </button>
                ) : (
                  <button type="submit" disabled={isSubmitting} className="flex items-center px-10 py-4 rounded-lg bg-success text-white font-bold hover:bg-success/90 transition-all shadow-md disabled:opacity-70 text-lg">
                    {isSubmitting ? 'Submitting...' : 'Submit Application'} <UserPlus className="w-5 h-5 ml-3" />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default JoinPage;
