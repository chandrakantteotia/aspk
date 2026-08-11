import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getDocument, updateDocument, COLLECTIONS } from '@/firebase/firestore';
import toast from 'react-hot-toast';
import { Loader2, Save } from 'lucide-react';
import { useState } from 'react';

// Use a flexible settings type matching actual WebsiteSettings fields
interface SettingsForm {
  siteName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  whatsappNumber: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
    youtube: string;
    linkedin: string;
  };
  donationUpiId: string;
  donationBankDetails: string;
}

const defaultSettings: SettingsForm = {
  siteName: 'ASPK4Hapur',
  tagline: 'People First • Nation First',
  phone: '',
  email: '',
  address: 'Hapur, Uttar Pradesh, India',
  whatsappNumber: '',
  socialLinks: { facebook: '', twitter: '', instagram: '', youtube: '', linkedin: '' },
  donationUpiId: '',
  donationBankDetails: '',
};

const SettingsPage: React.FC = () => {
  const { register, handleSubmit, reset } = useForm<SettingsForm>({ defaultValues: defaultSettings });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const doc = await getDocument(COLLECTIONS.WEBSITE_SETTINGS, 'main');
        if (doc) reset(doc as SettingsForm);
      } catch {
        // Settings don't exist yet — use defaults
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [reset]);

  const onSubmit = async (data: SettingsForm) => {
    try {
      setSaving(true);
      await updateDocument(COLLECTIONS.WEBSITE_SETTINGS, 'main', data);
      toast.success('Settings updated successfully');
    } catch {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none text-sm';
  const labelClass = 'block text-sm font-medium text-slate-700 mb-1';

  if (loading) return (
    <div className="flex justify-center items-center p-16">
      <Loader2 className="animate-spin text-primary w-8 h-8" />
    </div>
  );

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-slate-800">Website Settings</h2>
        <p className="text-slate-500 text-sm mt-0.5">Configure your party website information.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Site Information */}
        <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-100 space-y-4">
          <h3 className="text-base font-display font-bold text-slate-800 border-b border-slate-100 pb-3">Site Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Site Name</label>
              <input {...register('siteName')} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Tagline</label>
              <input {...register('tagline')} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input {...register('phone')} className={inputClass} placeholder="+91 XXXX-XXX-XXX" />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input type="email" {...register('email')} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>WhatsApp Number</label>
              <input {...register('whatsappNumber')} className={inputClass} placeholder="+91XXXXXXXXXX" />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Address</label>
              <input {...register('address')} className={inputClass} />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-100 space-y-4">
          <h3 className="text-base font-display font-bold text-slate-800 border-b border-slate-100 pb-3">Social Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(['facebook', 'twitter', 'instagram', 'youtube', 'linkedin'] as const).map(platform => (
              <div key={platform}>
                <label className={labelClass} style={{ textTransform: 'capitalize' }}>{platform}</label>
                <input {...register(`socialLinks.${platform}`)} className={inputClass} placeholder={`https://${platform}.com/...`} />
              </div>
            ))}
          </div>
        </div>

        {/* Donation Info */}
        <div className="bg-white p-6 rounded-2xl shadow-card border border-slate-100 space-y-4">
          <h3 className="text-base font-display font-bold text-slate-800 border-b border-slate-100 pb-3">Donation Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>UPI ID</label>
              <input {...register('donationUpiId')} className={inputClass} placeholder="aspk4hapur@upi" />
            </div>
            <div>
              <label className={labelClass}>Bank Account Details</label>
              <textarea {...register('donationBankDetails')} rows={3} className={`${inputClass} resize-none`} placeholder="Bank name, account number, IFSC..." />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold shadow-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;
