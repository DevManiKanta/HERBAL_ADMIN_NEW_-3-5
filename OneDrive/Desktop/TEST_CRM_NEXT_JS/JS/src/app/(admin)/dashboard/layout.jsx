
'use client';
import ProtectedRoute from '@/components/ProtectdRoute';
export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  );
}
