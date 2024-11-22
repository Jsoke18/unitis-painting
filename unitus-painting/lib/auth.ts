import { jwtVerify } from 'jose';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Loading } from './components/Loading';

export async function verifyAuth(token: string) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    return verified.payload;
  } catch (err) {
    throw new Error('Invalid token');
  }
}

export function checkAuth(): boolean {
  if (typeof window === 'undefined') return false;
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated;
}

// Fixed HOC typing
export function withAuth<T extends React.ComponentType<any>>(
  WrappedComponent: T
): React.FC<React.ComponentProps<T>> {
  return function ProtectedRoute(props: React.ComponentProps<T>) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const isAuthenticated = checkAuth();
      if (!isAuthenticated) {
        router.replace('/login');
      } else {
        setLoading(false);
      }
    }, [router]);

    if (loading) {
      return <Loading />;
    }

    return <WrappedComponent {...props} />;
  };
}