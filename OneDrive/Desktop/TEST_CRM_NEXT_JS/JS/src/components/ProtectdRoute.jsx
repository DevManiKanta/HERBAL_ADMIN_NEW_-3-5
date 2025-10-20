'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/authContext';

export default function ProtectedRoute({ children }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!user && !token) {
      router.replace(`/auth/sign-in?redirectTo=${encodeURIComponent(window.location.pathname + window.location.search)}`);
    }
  }, [user, isLoading, router]);
  if (isLoading) return null;
  return children;
}
