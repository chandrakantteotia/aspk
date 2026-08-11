import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Send, Twitter, Facebook, Instagram } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { addDocument, COLLECTIONS } from '@/firebase/firestore';
import { toast } from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number is required'),
  subject: z.string().min(5, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormData = z.infer<typeof schema>;

const ContactPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await addDocument(COLLECTIONS.CONTACT_MESSAGES, {
        ...data,
        createdAt: new Date().toISOString(),
        status: 'unread'
      });
      toast.success('Message sent successfully. We will get back to you soon.');
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="w-full bg-background min-h-screen pb-20 md:pb-28">
      <section className="bg-white py-20 md:py-28 border-b border-slate-100">
        <div className="container-padded text-center max-w-4xl mx-auto space-y-6">
          <span className="font-semibold tracking-widest uppercase text-sm text-primary">Reach Out</span>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-dark tracking-tight">Contact Us</h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">We're here to listen. Reach out to us for any queries, feedback, or media inquiries.</p>
        </div>
      </section>

      <section className="container-padded py-20">
        <div className="max-w-6xl mx-auto bg-white rounded-[2rem] shadow-card overflow-hidden flex flex-col lg:flex-row border border-slate-100 relative z-20 -mt-10 lg:-mt-20">
          
          {/* Info Side */}
          <div className="lg:w-2/5 bg-dark text-white p-10 md:p-14 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-10 text-white">Get in Touch</h2>
              
              <div className="space-y-10">
                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:border-primary/30 transition-colors">
                    <MapPin className="w-6 h-6 text-white" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2 text-lg">Headquarters</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">ASPK4Hapur Central Office,<br/>Near Town Hall, Station Road,<br/>Hapur, UP 245101</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:border-primary/30 transition-colors">
                    <Phone className="w-6 h-6 text-white" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2 text-lg">Phone / WhatsApp</h4>
                    <p className="text-slate-300 text-sm mb-1">+91 98765 43210</p>
                    <p className="text-slate-300 text-sm">+91 12345 67890</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:border-primary/30 transition-colors">
                    <Mail className="w-6 h-6 text-white" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-2 text-lg">Email</h4>
                    <p className="text-slate-300 text-sm mb-1">contact@aspk4hapur.org</p>
                    <p className="text-slate-300 text-sm">media@aspk4hapur.org</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-16 pt-8 border-t border-white/10">
              <h4 className="font-bold text-white/50 mb-6 text-xs uppercase tracking-widest">Connect with us</h4>
              <div className="flex gap-4">
                <a href="#" className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-dark transition-all duration-300"><Twitter className="w-5 h-5" /></a>
                <a href="#" className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-dark transition-all duration-300"><Facebook className="w-5 h-5" /></a>
                <a href="#" className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-white hover:text-dark transition-all duration-300"><Instagram className="w-5 h-5" /></a>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:w-3/5 p-10 md:p-16 bg-white">
            <h2 className="text-3xl font-display font-bold text-dark mb-8">Send us a message</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Your Name</label>
                  <input {...register('name')} className={`w-full px-5 py-4 rounded-xl border focus:ring-2 focus:ring-primary outline-none bg-slate-50 focus:bg-white transition-all text-dark ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-slate-200'}`} placeholder="John Doe" />
                  {errors.name && <p className="text-red-500 text-xs mt-2 font-medium">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Email Address</label>
                  <input {...register('email')} type="email" className={`w-full px-5 py-4 rounded-xl border focus:ring-2 focus:ring-primary outline-none bg-slate-50 focus:bg-white transition-all text-dark ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-200'}`} placeholder="john@example.com" />
                  {errors.email && <p className="text-red-500 text-xs mt-2 font-medium">{errors.email.message}</p>}
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Phone Number</label>
                  <input {...register('phone')} className={`w-full px-5 py-4 rounded-xl border focus:ring-2 focus:ring-primary outline-none bg-slate-50 focus:bg-white transition-all text-dark ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-slate-200'}`} placeholder="+91 98765 43210" />
                  {errors.phone && <p className="text-red-500 text-xs mt-2 font-medium">{errors.phone.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Subject</label>
                  <input {...register('subject')} className={`w-full px-5 py-4 rounded-xl border focus:ring-2 focus:ring-primary outline-none bg-slate-50 focus:bg-white transition-all text-dark ${errors.subject ? 'border-red-500 focus:ring-red-500' : 'border-slate-200'}`} placeholder="How can we help?" />
                  {errors.subject && <p className="text-red-500 text-xs mt-2 font-medium">{errors.subject.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Message</label>
                <textarea {...register('message')} rows={5} className={`w-full px-5 py-4 rounded-xl border focus:ring-2 focus:ring-primary outline-none bg-slate-50 focus:bg-white transition-all text-dark resize-none ${errors.message ? 'border-red-500 focus:ring-red-500' : 'border-slate-200'}`} placeholder="Write your message here..." />
                {errors.message && <p className="text-red-500 text-xs mt-2 font-medium">{errors.message.message}</p>}
              </div>

              <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto px-10 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 hover:-translate-y-1 hover:shadow-button transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:translate-y-0 text-lg mt-8">
                {isSubmitting ? 'Sending...' : 'Send Message'} <Send className="w-5 h-5" />
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* Map Embed */}
      <section className="container-padded pb-20 md:pb-28">
        <div className="w-full h-[500px] bg-slate-100 rounded-[2rem] overflow-hidden border border-slate-200 relative group">
           <iframe 
            src="about:blank" 
            title="Google Maps Location"
            className="absolute inset-0 w-full h-full border-0 grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
            loading="lazy"
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white/95 backdrop-blur-sm px-8 py-4 rounded-2xl text-dark font-display font-bold shadow-card border border-slate-100 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              Hapur District, UP
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
