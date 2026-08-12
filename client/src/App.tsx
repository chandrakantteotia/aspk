import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';

import { queryClient } from '@/lib/queryClient';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

import Layout from '@/components/layout/Layout';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import HomePage from '@/pages/public/HomePage';

// ── Lazy-loaded public pages ───────────────────────────────────
const AboutPage = lazy(() => import('@/pages/public/AboutPage'));
const ManifestoPage = lazy(() => import('@/pages/public/ManifestoPage'));
const MembersPage = lazy(() => import('@/pages/public/MembersPage'));
const GalleryPage = lazy(() => import('@/pages/public/GalleryPage'));
const NewsPage = lazy(() => import('@/pages/public/NewsPage'));
const EventsPage = lazy(() => import('@/pages/public/EventsPage'));
const FAQPage = lazy(() => import('@/pages/public/FAQPage'));
const JoinPage = lazy(() => import('@/pages/public/JoinPage'));
const ComplaintsPage = lazy(() => import('@/pages/public/ComplaintsPage'));
const DonatePage = lazy(() => import('@/pages/public/DonatePage'));
const ContactPage = lazy(() => import('@/pages/public/ContactPage'));

// ── Auth pages ────────────────────────────────────────────────
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));

// ── Admin pages ───────────────────────────────────────────────
const AdminLayout = lazy(() => import('@/pages/admin/AdminLayout'));
const DashboardPage = lazy(() => import('@/pages/admin/DashboardPage'));
const NewsManagerPage = lazy(() => import('@/pages/admin/NewsManagerPage'));
const EventsManagerPage = lazy(() => import('@/pages/admin/EventsManagerPage'));
const GalleryManagerPage = lazy(() => import('@/pages/admin/GalleryManagerPage'));
const MembersManagerPage = lazy(() => import('@/pages/admin/MembersManagerPage'));
const ComplaintsManagerPage = lazy(() => import('@/pages/admin/ComplaintsManagerPage'));
const DonationsManagerPage = lazy(() => import('@/pages/admin/DonationsManagerPage'));
const SettingsPage = lazy(() => import('@/pages/admin/SettingsPage'));

// ── Shared pages ──────────────────────────────────────────────
const NotFoundPage = lazy(() => import('@/pages/shared/NotFoundPage'));

// ── Page loader ───────────────────────────────────────────────
import SharedPageLoader from '@/components/shared/PageLoader';

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <SharedPageLoader />
    </div>
  );
}

// ── Toast config ──────────────────────────────────────────────
const toastOptions = {
  duration: 4000,
  style: {
    borderRadius: '12px',
    background: '#0F172A',
    color: '#fff',
    fontSize: '14px',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontWeight: '500',
  },
  success: {
    iconTheme: { primary: '#22C55E', secondary: '#fff' },
  },
  error: {
    iconTheme: { primary: '#EF4444', secondary: '#fff' },
  },
};

import InitialLoader from '@/components/shared/InitialLoader';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <InitialLoader />
      <AuthProvider>
        <ThemeProvider>
          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={toastOptions}
            containerStyle={{ top: 80 }}
          />

          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* ── Public Routes (with Layout) ── */}
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/manifesto" element={<ManifestoPage />} />
                <Route path="/party-members" element={<MembersPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/news" element={<NewsPage />} />
                <Route path="/news/:slug" element={<NewsPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/events/:slug" element={<EventsPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/join" element={<JoinPage />} />
                <Route path="/complaints" element={<ComplaintsPage />} />
                <Route path="/donate" element={<DonatePage />} />
                <Route path="/contact" element={<ContactPage />} />
                {/* Catch-all */}
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* ── Auth Routes (no Layout) ── */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              {/* ── Admin Routes (protected) ── */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<DashboardPage />} />
                <Route path="news" element={<NewsManagerPage />} />
                <Route path="events" element={<EventsManagerPage />} />
                <Route path="gallery" element={<GalleryManagerPage />} />
                <Route path="members" element={<MembersManagerPage />} />
                <Route path="complaints" element={<ComplaintsManagerPage />} />
                <Route path="donations" element={<DonationsManagerPage />} />
                <Route path="settings" element={<SettingsPage />} />
                
                {/* Admin Catch-all */}
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </Suspense>
        </ThemeProvider>
      </AuthProvider>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
