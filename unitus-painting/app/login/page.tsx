'use client';

import React, { useState, Suspense } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { toast } from 'sonner';

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
    </div>
  );
}

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const checkAuth = async () => {
      console.log('Checking authentication status...');
      try {
        const response = await fetch('/api/auth', {
          method: 'GET',
        });
        console.log('Auth check response status:', response.status);
        console.log('Auth check response:', await response.clone().json());

        if (response.ok) {
          const from = searchParams.get('from') || '/admin';
          console.log('User is authenticated, redirecting to:', from);
          router.push(from);
        }
      } catch (error) {
        console.error('Auth check failed with error:', error);
      }
    };

    checkAuth();
  }, [router, searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log('Attempting login with email:', email);

    try {
      console.log('Sending login request to /api/auth...');
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Login response status:', response.status);
      const data = await response.json();
      console.log('Login response data:', data);

      if (data.success) {
        console.log('Login successful, setting authentication state');
        localStorage.setItem('isAuthenticated', 'true');
        toast.success('Logged in successfully');
        
        const from = searchParams.get('from') || '/admin';
        console.log('Redirecting to:', from);
        router.push(from);
      } else {
        console.error('Login failed:', data.message);
        toast.error(data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login request failed with error:', error);
      toast.error('An error occurred during login');
    } finally {
      console.log('Login attempt completed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-8">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Unitus Painting Admin</h1>
            <p className="text-gray-600 mt-2">Enter your credentials to login</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4 text-gray-500" />
                  ) : (
                    <EyeIcon className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LoginContent />
    </Suspense>
  );
}