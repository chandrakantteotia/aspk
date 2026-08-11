import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { onAuthChange, getUserProfile, signOut as firebaseSignOut } from '@/firebase/auth';
import type { UserProfile } from '@/types';

// Comma-separated admin emails from env (fallback when Firestore profile can't be read)
const ADMIN_EMAILS = (import.meta.env.VITE_ADMIN_EMAILS ?? '')
  .split(',')
  .map((e: string) => e.trim().toLowerCase())
  .filter(Boolean);

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  profileLoading: boolean;
  profileFetched: boolean;
  isAdmin: boolean;
  isEditor: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  profileLoading: false,
  profileFetched: false,
  isAdmin: false,
  isEditor: false,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]                     = useState<User | null>(null);
  const [profile, setProfile]               = useState<UserProfile | null>(null);
  const [loading, setLoading]               = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileFetched, setProfileFetched] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthChange(async currentUser => {
      setUser(currentUser);

      if (currentUser) {
        setProfileLoading(true);
        setProfileFetched(false);
        try {
          const profileData = await getUserProfile(currentUser.uid);
          setProfile(profileData);
        } catch {
          setProfile(null);
        } finally {
          setProfileLoading(false);
          setProfileFetched(true);
        }
      } else {
        setProfile(null);
        setProfileLoading(false);
        setProfileFetched(true);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // isAdmin: true if Firestore role says admin OR email is in the env admin list
  const emailIsAdmin = ADMIN_EMAILS.includes(
    user?.email?.toLowerCase() ?? ''
  );

  const isAdmin =
    profile?.role === 'admin' ||
    profile?.role === 'superadmin' ||
    emailIsAdmin;

  const isEditor = isAdmin || profile?.role === 'editor';

  return (
    <AuthContext.Provider value={{
      user, profile, loading, profileLoading, profileFetched,
      isAdmin, isEditor,
      signOut: firebaseSignOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
