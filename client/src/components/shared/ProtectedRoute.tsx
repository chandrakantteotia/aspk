import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { firebaseServicesEnabled } from '@/firebase/config';
import PageLoader from '@/components/shared/PageLoader';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, isAdmin, loading, profileLoading, profileFetched } = useAuth();
  const location = useLocation();

  // Firebase disabled — allow through (local dev / demo mode)
  if (!firebaseServicesEnabled) {
    return <>{children}</>;
  }

  // Step 1: Auth state resolving
  if (loading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <PageLoader className="h-auto" />
      </div>
    );
  }

  // Step 2: Not logged in → go to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Step 3: Profile fetch done but not admin → redirect home
  // Only redirect AFTER profileFetched=true so we don't redirect during fetch
  if (requireAdmin && profileFetched && !isAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Step 4: Profile not yet fetched — keep waiting briefly
  if (requireAdmin && !profileFetched) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <PageLoader className="h-auto" />
      </div>
    );
  }

  return <>{children}</>;
}
