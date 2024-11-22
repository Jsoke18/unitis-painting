import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export function checkAuth(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('isAuthenticated') === 'true';
}

export function withAuth(Component: any) {
  return function ProtectedRoute(props: any) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (!checkAuth()) {
        router.replace('/login');
      } else {
        setLoading(false);
      }
    }, [router]);

    if (loading) return null;
    
    return Component(props);
  };
}