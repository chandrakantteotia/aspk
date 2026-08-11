import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Heart, ShieldCheck, CheckCircle2, Copy, ArrowRight, Wallet, Building2 } from 'lucide-react';
import { addDocument, COLLECTIONS } from '@/firebase/firestore';
import { toast } from 'react-hot-toast';

const schema = z.object({
  amount: z.number().min(1, 'Amount must be greater than 0'),
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number is required'),
  pan: z.string().optional(),
  address: z.string().min(5, 'Address is required'),
  method: z.enum(['upi', 'bank']),
});

type FormData = z.infer<typeof schema>;

const presets = [500, 1000, 2500, 5000, 10000];

const DonatePage: React.FC = () => {
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(1000);
  const [step, setStep] = useState(1);
  const [receiptData, setReceiptData] = useState<any>(null);

  const { register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { amount: 1000, method: 'upi' }
  });

  const watchAmount = watch('amount');
  const watchMethod = watch('method');

  const handlePresetSelect = (amt: number) => {
    setSelectedPreset(amt);
    setCustomAmount('');
    setValue('amount', amt);
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomAmount(val);
    setSelectedPreset(null);
    setValue('amount', Number(val) || 0);
  };

  const onSubmit = async (data: FormData) => {
    try {
      setStep(2);
      
      setTimeout(async () => {
        const receiptNo = `REC-${Math.floor(100000 + Math.random() * 900000)}`;
        await addDocument(COLLECTIONS.DONATIONS, {
          ...data,
          receiptNumber: receiptNo,
          status: 'completed',
          date: new Date().toISOString()
        });
        setReceiptData({ ...data, receiptNo });
        setStep(3);
        toast.success('Donation successful! Thank you.');
      }, 2000);
    } catch (error) {
      toast.error('Payment processing failed.');
      setStep(1);
    }
  };

  return (
    <main className="w-full bg-gray-50 min-h-screen pb-24">
      <section className="bg-white py-24 text-center relative overflow-hidden border-b border-gray-100">
        <div className="container-padded relative z-10 space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-500 mx-auto mb-4">
            <Heart className="w-8 h-8" />
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold text-dark tracking-tight">Support the Cause</h1>
          <p className="text-gray-500 text-xl leading-relaxed">
            Your contribution fuels our mission to build a transparent and prosperous Hapur. Every rupee brings us closer to a better tomorrow.
          </p>
        </div>
      </section>

      <section className="container-padded py-16 -mt-8 relative z-20">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-8 md:p-12">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.form key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit(onSubmit)} className="space-y-12">
                    
                    {/* Amount Selection */}
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">1</div>
                        <h3 className="text-2xl font-bold font-display text-dark">Select Amount</h3>
                      </div>
                      <div className="flex flex-wrap gap-4 mb-6">
                        {presets.map(amt => (
                          <button
                            type="button"
                            key={amt}
                            onClick={() => handlePresetSelect(amt)}
                            className={`flex-1 min-w-[120px] py-4 rounded-full font-bold text-lg transition-all border-2 ${selectedPreset === amt ? 'border-primary bg-primary text-white shadow-md' : 'border-gray-200 text-gray-700 bg-white hover:border-primary/50'}`}
                          >
                            ₹{amt.toLocaleString()}
                          </button>
                        ))}
                      </div>
                      <div className="relative max-w-xs">
                        <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-lg">₹</span>
                        <input type="number" placeholder="Custom Amount" value={customAmount} onChange={handleCustomAmountChange} className="w-full pl-12 pr-6 py-4 rounded-full border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none font-bold text-dark text-lg transition-all bg-gray-50 focus:bg-white" />
                      </div>
                      {errors.amount && <p className="text-red-500 text-sm mt-2">{errors.amount.message}</p>}
                    </div>

                    <hr className="border-gray-100" />

                    {/* Personal Details */}
                    <div>
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">2</div>
                        <h3 className="text-2xl font-bold font-display text-dark">Donor Details</h3>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                          <input {...register('name')} placeholder="Enter your full name" className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-primary outline-none transition-all bg-gray-50 focus:bg-white" />
                          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                          <input {...register('phone')} placeholder="Enter mobile number" className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-primary outline-none transition-all bg-gray-50 focus:bg-white" />
                          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                          <input {...register('email')} placeholder="Enter email address" className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-primary outline-none transition-all bg-gray-50 focus:bg-white" />
                          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">PAN Number <span className="text-gray-400 font-normal">(Optional)</span></label>
                          <input {...register('pan')} placeholder="Enter PAN for tax benefit" className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-primary outline-none transition-all bg-gray-50 focus:bg-white" />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-bold text-gray-700 mb-2">Full Address</label>
                          <textarea {...register('address')} placeholder="Enter your complete address" rows={2} className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 focus:border-primary outline-none transition-all bg-gray-50 focus:bg-white resize-none" />
                          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                        </div>
                      </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Payment Method */}
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">3</div>
                        <h3 className="text-2xl font-bold font-display text-dark">Payment Method</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <label className={`cursor-pointer border-2 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all ${watchMethod === 'upi' ? 'border-primary bg-primary/5 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                          <input type="radio" value="upi" {...register('method')} className="sr-only" />
                          <Wallet className={`w-8 h-8 ${watchMethod === 'upi' ? 'text-primary' : 'text-gray-400'}`} />
                          <span className={`font-bold ${watchMethod === 'upi' ? 'text-primary' : 'text-gray-700'}`}>UPI / QR</span>
                        </label>
                        <label className={`cursor-pointer border-2 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all ${watchMethod === 'bank' ? 'border-primary bg-primary/5 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                          <input type="radio" value="bank" {...register('method')} className="sr-only" />
                          <Building2 className={`w-8 h-8 ${watchMethod === 'bank' ? 'text-primary' : 'text-gray-400'}`} />
                          <span className={`font-bold ${watchMethod === 'bank' ? 'text-primary' : 'text-gray-700'}`}>Bank Transfer</span>
                        </label>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button type="submit" className="w-full py-5 bg-primary text-white font-bold rounded-full text-xl hover:bg-primary/90 transition-all shadow-md flex items-center justify-center gap-3 group">
                        Donate ₹{watchAmount?.toLocaleString() || 0}
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                      </button>
                      <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500 font-medium">
                        <ShieldCheck className="w-5 h-5 text-success" /> 
                        Secure 256-bit SSL encrypted payment
                      </div>
                    </div>
                  </motion.form>
                )}

                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center min-h-[500px]">
                    {watchMethod === 'upi' ? (
                      <>
                        <div className="w-56 h-56 bg-gray-50 border-2 border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center mb-8">
                          <Wallet className="w-12 h-12 text-gray-300 mb-2" />
                          <span className="text-gray-400 font-bold uppercase tracking-wider text-sm">QR CODE</span>
                        </div>
                        <p className="text-2xl font-bold font-display text-dark mb-3">Scan with any UPI App</p>
                        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 px-6 py-3 rounded-full font-mono text-gray-700 font-bold text-lg mb-12">
                          aspk4hapur@upi 
                          <button className="text-gray-400 hover:text-primary transition-colors p-1"><Copy className="w-5 h-5" /></button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-left bg-gray-50 p-8 rounded-2xl w-full max-w-md border border-gray-200 mb-12">
                          <h4 className="font-bold text-xl font-display text-dark border-b border-gray-200 pb-4 mb-6">Bank Details</h4>
                          <div className="space-y-4">
                            <div className="flex justify-between"><span className="text-gray-500 font-medium">Bank Name</span><span className="font-bold text-dark">State Bank of India</span></div>
                            <div className="flex justify-between"><span className="text-gray-500 font-medium">Account No</span><span className="font-bold text-dark font-mono">0000123456789</span></div>
                            <div className="flex justify-between"><span className="text-gray-500 font-medium">IFSC Code</span><span className="font-bold text-dark font-mono">SBIN0001234</span></div>
                            <div className="flex justify-between"><span className="text-gray-500 font-medium">Account Name</span><span className="font-bold text-dark">ASPK4Hapur</span></div>
                          </div>
                        </div>
                      </>
                    )}
                    <div className="flex items-center gap-4 px-6 py-4 bg-primary/5 text-primary rounded-full font-bold">
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      Waiting for payment confirmation...
                    </div>
                  </motion.div>
                )}

                {step === 3 && receiptData && (
                  <motion.div key="step3" initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-16">
                    <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-8">
                      <CheckCircle2 className="w-12 h-12 text-success" />
                    </div>
                    <h2 className="text-4xl font-display font-bold mb-4 text-dark">Thank You, {receiptData.name}!</h2>
                    <p className="text-gray-500 text-lg mb-10 max-w-md mx-auto">Your generous donation has been received successfully and will make a real impact.</p>
                    
                    <div className="bg-gray-50 border border-gray-200 rounded-3xl p-8 max-w-md mx-auto text-left mb-10 shadow-sm">
                      <div className="flex justify-between items-end mb-6 border-b border-gray-200 pb-6">
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">Amount Paid</p>
                          <p className="font-black text-3xl text-dark">₹{receiptData.amount.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-500 mb-1">Date</p>
                          <p className="font-bold text-dark">{new Date().toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Receipt Number</p>
                        <p className="font-mono font-bold text-lg text-dark bg-white p-3 rounded-xl border border-gray-200 text-center">{receiptData.receiptNo}</p>
                      </div>
                    </div>

                    <button onClick={() => { setStep(1); reset(); setCustomAmount(''); }} className="text-primary font-bold hover:text-dark transition-colors text-lg">
                      Make another donation
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <div className="bg-dark text-white rounded-3xl p-10 border border-gray-800 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
                <Heart className="w-24 h-24" />
              </div>
              <h3 className="text-3xl font-display font-bold mb-8 relative z-10">Why Donate?</h3>
              <ul className="space-y-6 relative z-10">
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 className="w-5 h-5 text-warning" /></div>
                  <span className="text-gray-300 font-medium leading-relaxed">Fund local development initiatives and grassroots campaigns.</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 className="w-5 h-5 text-warning" /></div>
                  <span className="text-gray-300 font-medium leading-relaxed">Support digital infrastructure and public portals.</span>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5"><CheckCircle2 className="w-5 h-5 text-warning" /></div>
                  <span className="text-gray-300 font-medium leading-relaxed">Organize community awareness and empowerment seminars.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <h3 className="font-bold text-dark mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" /> Legal Notice
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">
                As per Election Commission guidelines, donations must be from a valid Indian bank account. Donations above ₹2,000 cannot be in cash. Contributions are eligible for tax benefits under Section 80GGC. By proceeding, you declare you are an Indian citizen and funds are from legitimate sources.
              </p>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
};

export default DonatePage;
