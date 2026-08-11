import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpWithEmail } from '@/firebase/auth';
import { firebaseServicesEnabled } from '@/firebase/config';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const registerSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterForm = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setLoading(true);
      if (!firebaseServicesEnabled) {
        toast.success('Local preview mode is active. Firebase is disabled in this workspace.');
        navigate('/login');
        return;
      }
      await signUpWithEmail(data.email, data.password, data.displayName);
      toast.success('Account created successfully');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-1/2 bg-dark text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Same layout as Login for consistency */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3"></div>
        
        <div className="relative z-10">
          <h1 className="text-4xl font-display font-bold text-primary mb-2">ASPK4Hapur</h1>
          <p className="text-slate-300 text-lg">Join the Movement</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-card">
          <h2 className="text-3xl font-bold mb-2 font-display text-slate-800">Create Account</h2>
          <p className="text-slate-500 mb-8">Sign up to get involved with ASPK4Hapur.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input {...register('displayName')} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent" />
              {errors.displayName && <p className="text-xs text-danger mt-1">{errors.displayName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input type="email" {...register('email')} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent" />
              {errors.email && <p className="text-xs text-danger mt-1">{errors.email.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input type="password" {...register('password')} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent" />
              {errors.password && <p className="text-xs text-danger mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
              <input type="password" {...register('confirmPassword')} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary focus:border-transparent" />
              {errors.confirmPassword && <p className="text-xs text-danger mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="w-full bg-primary text-white font-medium py-2.5 rounded-lg hover:bg-primary/90 transition-colors flex justify-center items-center mt-6">
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Sign Up'}
            </button>
            {!firebaseServicesEnabled && (
              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                Firebase is disabled in local demo mode. Registration is simulated locally.
              </p>
            )}
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            Already have an account? <Link to="/login" className="text-primary font-medium hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
