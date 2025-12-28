'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { checkSession } from '@/lib/api/clientApi';

type Props = {
  children: ReactNode;
};

const privateRoutes = ['/profile', '/notes'];

export default function AuthProvider({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const setUser = useAuthStore(state => state.setUser);
  const clearIsAuthenticated = useAuthStore(state => state.clearIsAuthenticated);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      try {
        const user = await checkSession();
        if (user) {
          setUser(user);
        } else {
          clearIsAuthenticated();
          if (privateRoutes.some(route => pathname.startsWith(route))) {
            router.push('/sign-in');
          }
        }
      } catch {
        clearIsAuthenticated();
        if (privateRoutes.some(route => pathname.startsWith(route))) {
          router.push('/sign-in');
        }
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [pathname, router, setUser, clearIsAuthenticated]);

  if (loading) {
    return <div style={{
        textAlign: 'center',
        padding: '2rem',
        fontSize: '1.2rem'
      }}>Loading...</div>;
  }

  return <>{children}</>;
}

