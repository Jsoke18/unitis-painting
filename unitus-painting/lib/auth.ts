// lib/auth.ts
import { jwtVerify } from 'jose';

export async function verifyAuth(token: string) {
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

// Optional: Client-side auth check
export function checkAuth() {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated;
}

// Optional: HOC to protect client components
export function withAuth(Component: React.ComponentType) {
  return function ProtectedRoute(props: any) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const isAuthenticated = checkAuth();
      if (!isAuthenticated) {
        router.replace('/login');
      } else {
        setLoading(false);
      }
    }, []);

    if (loading) {
      return <div>Loading...</div>; // Or your loading component
    }

    return <Component {...props} />;
  };
}