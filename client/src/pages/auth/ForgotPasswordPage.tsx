import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { resetPassword } from '@/firebase/auth';
import toast from 'react-hot-toast';
import { Loader2, Mail, CheckCircle } from 'lucide-react';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      setLoading(true);
      await resetPassword(email);
      setSuccess(true);
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-card text-center">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-lg flex items-center justify-center mx-auto mb-6">
          <Mail size={28} />
        </div>

        <h2 className="text-2xl font-bold mb-2 font-display text-slate-800">Reset Password</h2>

        {success ? (
          <div className="space-y-6">
            <CheckCircle className="w-12 h-12 text-success mx-auto" />
            <p className="text-slate-500">
              We've sent a password reset link to <span className="font-medium text-slate-800">{email}</span>. Please check your inbox.
            </p>
            <Link to="/login" className="block w-full bg-primary text-white font-medium py-2.5 rounded-xl hover:bg-primary/90 transition-colors">
              Return to Login
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-slate-500 text-sm text-left">
              Enter the email address associated with your account and we'll send you a link to reset your password.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                  placeholder="name@example.com"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white font-semibold py-2.5 rounded-xl hover:bg-primary/90 transition-colors flex justify-center items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Send Reset Link'}
              </button>
            </form>
            <div className="text-sm text-slate-600">
              Remember your password?{' '}
              <Link to="/login" className="text-primary font-medium hover:underline">Back to Login</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
