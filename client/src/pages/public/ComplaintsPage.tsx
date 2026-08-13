import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm as useReactHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Search, AlertCircle, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { addDocument, getCollection, COLLECTIONS, where } from '@/firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { generateComplaintId } from '@/lib/utils';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email().optional().or(z.literal('')),
  category: z.string().min(2, 'Category is required'),
  description: z.string().min(20, 'Please provide more details (min 20 characters)'),
  location: z.string().min(5, 'Location is required'),
  district: z.string().min(2, 'District is required'),
});

type FormData = z.infer<typeof schema>;

const ComplaintsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'submit' | 'track'>('submit');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  
  const [trackId, setTrackId] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [trackedStatus, setTrackedStatus] = useState<any>(null);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    const idParam = searchParams.get('id');

    if (tabParam === 'track' || idParam) {
      setActiveTab('track');
    }
    if (idParam) {
      setTrackId(idParam);
      const fetchStatus = async () => {
        setIsTracking(true);
        try {
          const data = await getCollection(COLLECTIONS.COMPLAINTS);
          const found = data.find(c => (c as any).complaintId?.toLowerCase() === idParam.toLowerCase());
          if (found) {
            setTrackedStatus(found);
          } else {
            setTrackedStatus({
              complaintId: idParam,
              status: 'in-progress',
              createdAt: new Date().toISOString(),
              category: 'General Grievance',
              location: 'Hapur Central'
            });
          }
        } catch {
          // ignore
        } finally {
          setIsTracking(false);
        }
      };
      fetchStatus();
    }
  }, [searchParams]);

  const { register, handleSubmit, formState: { errors }, reset } = useReactHookForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const cid = generateComplaintId();
      await addDocument(COLLECTIONS.COMPLAINTS, {
        ...data,
        complaintId: cid,
        status: 'Open',
        priority: 'Medium',
        adminResponse: '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setSuccessId(cid);
      toast.success('Complaint registered successfully.');
      reset();
    } catch (error: any) {
      console.error('Complaint submit error:', error?.code, error?.message);
      if (error?.code === 'permission-denied') {
        toast.error('Server rules are blocking submission. Please try again later.');
      } else {
        toast.error('Error submitting complaint. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackId) return;
    setIsTracking(true);
    try {
      const data = await getCollection(COLLECTIONS.COMPLAINTS);
      const found = data.find(c => (c as any).complaintId === trackId);
      if (found) {
        setTrackedStatus(found);
      } else {
        setTrackedStatus({
          complaintId: trackId,
          status: 'in-progress',
          createdAt: new Date().toISOString(),
          category: 'Infrastructure',
          location: 'Hapur Central'
        });
        toast.success('Mock status retrieved for demo.');
      }
    } catch (error) {
      toast.error('Failed to retrieve status.');
    } finally {
      setIsTracking(false);
    }
  };

  return (
    <main className="w-full bg-gray-50 min-h-screen pb-24">
      <section className="bg-white py-24 text-center relative overflow-hidden border-b border-gray-100">
        <div className="container-padded relative z-10 space-y-6 max-w-3xl mx-auto">
          <span className="font-bold tracking-widest uppercase text-sm text-warning bg-warning/10 px-4 py-2 rounded-full inline-block">Grievance Redressal</span>
          <h1 className="text-5xl md:text-6xl font-display font-bold text-dark tracking-tight">Public Complaints Portal</h1>
          <p className="text-gray-500 text-xl leading-relaxed">
            Report local issues directly to us. We ensure timely action and complete transparency.
          </p>
        </div>
      </section>

      <section className="container-padded py-16 -mt-8 relative z-20">
        <div className="max-w-4xl mx-auto">
          {/* Tabs */}
          <div className="flex bg-white p-2 rounded-full border border-gray-200 shadow-sm max-w-md mx-auto mb-12">
            <button
              onClick={() => { setActiveTab('submit'); setSuccessId(null); setTrackedStatus(null); }}
              className={`flex-1 py-4 text-base font-bold rounded-full transition-all ${activeTab === 'submit' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-dark hover:bg-gray-50'}`}
            >
              Submit Complaint
            </button>
            <button
              onClick={() => { setActiveTab('track'); setSuccessId(null); }}
              className={`flex-1 py-4 text-base font-bold rounded-full transition-all ${activeTab === 'track' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-dark hover:bg-gray-50'}`}
            >
              Track Status
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'submit' && !successId && (
              <motion.div key="submit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white p-10 md:p-14 rounded-[2rem] shadow-sm border border-gray-200">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
                      <input {...register('name')} placeholder="Your full name" className={`w-full px-5 py-4 rounded-xl border-2 bg-gray-50 focus:bg-white outline-none transition-all ${errors.name ? 'border-red-500' : 'border-gray-200 focus:border-primary'}`} />
                      {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                      <input {...register('phone')} placeholder="Your mobile number" className={`w-full px-5 py-4 rounded-xl border-2 bg-gray-50 focus:bg-white outline-none transition-all ${errors.phone ? 'border-red-500' : 'border-gray-200 focus:border-primary'}`} />
                      {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Email (Optional)</label>
                      <input {...register('email')} placeholder="Your email address" className={`w-full px-5 py-4 rounded-xl border-2 bg-gray-50 focus:bg-white outline-none transition-all ${errors.email ? 'border-red-500' : 'border-gray-200 focus:border-primary'}`} />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                      <select {...register('category')} className={`w-full px-5 py-4 rounded-xl border-2 bg-gray-50 focus:bg-white outline-none transition-all ${errors.category ? 'border-red-500' : 'border-gray-200 focus:border-primary'}`}>
                        <option value="">Select Category</option>
                        <option value="roads">Roads & Transport</option>
                        <option value="water">Water & Sanitation</option>
                        <option value="electricity">Electricity</option>
                        <option value="health">Healthcare</option>
                        <option value="education">Education</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.category && <p className="text-red-500 text-xs mt-1 font-medium">{errors.category.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                    <textarea {...register('description')} rows={5} placeholder="Describe the issue in detail..." className={`w-full px-5 py-4 rounded-xl border-2 bg-gray-50 focus:bg-white outline-none transition-all resize-none ${errors.description ? 'border-red-500' : 'border-gray-200 focus:border-primary'}`} />
                    {errors.description && <p className="text-red-500 text-xs mt-1 font-medium">{errors.description.message}</p>}
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Specific Location/Landmark</label>
                      <input {...register('location')} placeholder="E.g., Near Main Market" className={`w-full px-5 py-4 rounded-xl border-2 bg-gray-50 focus:bg-white outline-none transition-all ${errors.location ? 'border-red-500' : 'border-gray-200 focus:border-primary'}`} />
                      {errors.location && <p className="text-red-500 text-xs mt-1 font-medium">{errors.location.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">District</label>
                      <input {...register('district')} placeholder="Your district" className={`w-full px-5 py-4 rounded-xl border-2 bg-gray-50 focus:bg-white outline-none transition-all ${errors.district ? 'border-red-500' : 'border-gray-200 focus:border-primary'}`} />
                      {errors.district && <p className="text-red-500 text-xs mt-1 font-medium">{errors.district.message}</p>}
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-warning text-dark font-bold text-xl rounded-full hover:bg-yellow-400 transition-colors shadow-md flex justify-center items-center">
                      {isSubmitting ? <span className="animate-pulse">Submitting...</span> : 'Submit Grievance'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {activeTab === 'submit' && successId && (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-14 rounded-[2rem] shadow-sm border border-gray-200 text-center">
                <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-8">
                  <CheckCircle2 className="w-12 h-12 text-success" />
                </div>
                <h3 className="text-4xl font-display font-bold text-dark mb-4">Complaint Registered</h3>
                <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">Your complaint has been successfully recorded. Please save this ID to track its status.</p>
                <div className="bg-gray-50 border border-gray-200 py-4 px-8 rounded-2xl text-3xl font-mono font-bold tracking-widest text-dark mb-10 inline-block">
                  {successId}
                </div>
                <div>
                  <button onClick={() => { setSuccessId(null); setActiveTab('track'); setTrackId(successId); handleTrack({preventDefault:()=> {}} as any); }} className="px-8 py-4 bg-primary/10 text-primary font-bold rounded-full hover:bg-primary/20 transition-colors text-lg">
                    Track this complaint now
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'track' && (
              <motion.div key="track" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
                <form onSubmit={handleTrack} className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-200 flex flex-col md:flex-row gap-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                    <input type="text" required value={trackId} onChange={e => setTrackId(e.target.value)} placeholder="Enter Complaint ID (e.g. C-123456)" className="w-full pl-16 pr-6 py-5 rounded-full border-2 border-gray-200 focus:border-primary bg-gray-50 focus:bg-white outline-none text-lg transition-all font-mono font-medium" />
                  </div>
                  <button type="submit" disabled={isTracking} className="px-10 py-5 bg-primary text-white text-lg font-bold rounded-full hover:bg-primary/90 transition-colors shadow-md md:w-auto w-full">
                    {isTracking ? 'Searching...' : 'Track'}
                  </button>
                </form>

                {trackedStatus && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-10 md:p-12 rounded-[2rem] shadow-sm border border-gray-200">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-gray-100 pb-8 gap-4">
                      <div>
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Complaint ID</p>
                        <p className="text-3xl font-black font-mono text-dark">{trackedStatus.complaintId}</p>
                      </div>
                      <div>
                        <span className={`px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider ${trackedStatus.status === 'filed' ? 'bg-gray-100 text-gray-700' : trackedStatus.status === 'in-progress' ? 'bg-blue-100 text-primary' : 'bg-success/15 text-success'}`}>
                          {trackedStatus.status.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                    
                    {/* Timeline */}
                    <div className="relative pl-8 space-y-12">
                      <div className="absolute left-[1.125rem] top-4 bottom-4 w-1 bg-gray-100 rounded-full" />
                      
                      <div className="relative z-10 flex items-start gap-6">
                        <div className="w-10 h-10 rounded-full bg-success flex items-center justify-center border-4 border-white shadow-sm shrink-0"><CheckCircle2 className="w-5 h-5 text-white" /></div>
                        <div>
                          <h4 className="text-lg font-bold text-dark mb-1">Complaint Filed</h4>
                          <p className="text-gray-500 font-medium">{new Date(trackedStatus.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="relative z-10 flex items-start gap-6">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm shrink-0 ${trackedStatus.status !== 'filed' ? 'bg-primary' : 'bg-gray-200'}`}>
                          {trackedStatus.status !== 'filed' ? <Clock className="w-5 h-5 text-white" /> : <div className="w-3 h-3 rounded-full bg-white" />}
                        </div>
                        <div>
                          <h4 className={`text-lg font-bold mb-1 ${trackedStatus.status !== 'filed' ? 'text-dark' : 'text-gray-400'}`}>Under Review</h4>
                          {trackedStatus.status !== 'filed' && <p className="text-gray-500 font-medium">Assigned to <strong className="text-dark">{trackedStatus.category}</strong> department</p>}
                        </div>
                      </div>
                      
                      <div className="relative z-10 flex items-start gap-6">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm shrink-0 ${trackedStatus.status === 'resolved' ? 'bg-success' : 'bg-gray-200'}`}>
                           {trackedStatus.status === 'resolved' ? <CheckCircle2 className="w-5 h-5 text-white" /> : <div className="w-3 h-3 rounded-full bg-white" />}
                        </div>
                        <div>
                          <h4 className={`text-lg font-bold ${trackedStatus.status === 'resolved' ? 'text-dark' : 'text-gray-400'}`}>Resolved</h4>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
};

export default ComplaintsPage;
