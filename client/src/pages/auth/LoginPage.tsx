import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { signInWithEmail, signInWithGoogle, getGoogleRedirectResult } from '@/firebase/auth';
import { firebaseServicesEnabled } from '@/firebase/config';
import toast from 'react-hot-toast';
import { Loader2, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Min 6 characters'),
});
type LoginForm = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const { isAdmin, profile, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [checkingRedirect, setCheckingRedirect] = useState(true); // true until we confirm no pending redirect

  const from = (location.state as any)?.from?.pathname || '/';

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  // ── Handle Google redirect result on page load ────────────────
  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const user = await getGoogleRedirectResult();
        if (user) {
          toast.success(`Welcome, ${user.displayName?.split(' ')[0] || 'back'}!`);
          // Navigate to the originally requested page (defaults to home page)
          navigate(from, { replace: true });
        }
      } catch {
        // No redirect result — normal page load
      } finally {
        setCheckingRedirect(false);
      }
    };
    handleRedirect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Redirect if already authenticated ──────────────────────────
  useEffect(() => {
    if (!checkingRedirect && !authLoading && user) {
      navigate(from, { replace: true });
    }
  }, [user, checkingRedirect, authLoading, navigate, from]);

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoading(true);
      if (!firebaseServicesEnabled) {
        toast.success('Demo mode: navigating to admin.');
        navigate('/admin', { replace: true });
        return;
      }
      await signInWithEmail(data.email, data.password);
      toast.success('Welcome back!');
      // Always go to the originally requested page (default /admin)
      // Don't check isAdmin here — profile hasn't loaded from Firestore yet
      navigate(from, { replace: true });
    } catch (error: any) {
      const msg = error?.code === 'auth/invalid-credential'
        ? 'Invalid email or password.'
        : error?.message || 'Sign in failed.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setGoogleLoading(true);
      if (!firebaseServicesEnabled) {
        toast.error('Firebase is not configured.');
        return;
      }
      // signInWithGoogle triggers a redirect — page will reload
      await signInWithGoogle();
    } catch {
      toast.error('Google sign-in failed.');
      setGoogleLoading(false);
    }
  };

  // Show spinner while checking for redirect result
  if (checkingRedirect) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-slate-500">Completing sign-in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left brand panel */}
      <div className="hidden lg:flex w-1/2 bg-[#0a0f1e] text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-lg blur-[100px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/20 rounded-lg blur-[100px] translate-y-1/3 -translate-x-1/3" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <p className="font-display font-bold text-lg leading-none">ASPK4Hapur</p>
            <p className="text-primary/70 text-xs mt-0.5">Admin Portal</p>
          </div>
        </div>
        <div className="relative z-10">
          <blockquote className="text-2xl font-display font-semibold leading-snug mb-4 text-white/90">
            "Empowering the marginalized,<br />building a just society."
          </blockquote>
          <p className="text-slate-400 text-sm">Azad Samaj Party (Kanshi Ram) — Hapur District</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md bg-white p-8 rounded-xl shadow-card border border-slate-100"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-display font-bold text-slate-800">Sign In</h2>
            <p className="text-slate-500 text-sm mt-1">Access your admin dashboard.</p>
          </div>

          {/* Google button */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 border border-slate-200 py-2.5 rounded-xl hover:bg-slate-50 transition-colors font-medium text-slate-700 text-sm mb-6 disabled:opacity-60"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            {googleLoading ? 'Redirecting to Google...' : 'Continue with Google'}
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-400 font-medium">or sign in with email</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/25 focus:border-primary outline-none transition-all"
                placeholder="admin@aspk4hapur.in"
              />
              {errors.email && <p className="text-xs text-danger mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <input
                type="password"
                {...register('password')}
                autoComplete="current-password"
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary/25 focus:border-primary outline-none transition-all"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-xs text-danger mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-semibold py-2.5 rounded-xl hover:bg-primary/90 transition-colors flex justify-center items-center gap-2 disabled:opacity-60 text-sm"
            >
              {loading ? <Loader2 className="animate-spin w-4 h-4" /> : null}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">Create Account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
