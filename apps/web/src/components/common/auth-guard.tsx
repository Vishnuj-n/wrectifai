'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPublicPath = pathname === '/login' || pathname === '/signup';

  useEffect(() => {
    if (!isAuthenticated && !isPublicPath) {
      router.push('/login');
    }
  }, [isAuthenticated, isPublicPath, router]);

  if (!isAuthenticated && !isPublicPath) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafbfe]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1a56db]"></div>
      </div>
    );
  }

  return <>{children}</>;
}
