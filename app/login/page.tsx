// app/login/page.tsx
'use client';

import React, { useState, FormEvent } from 'react';
import { supabase } from '@/lib/supabaseClient'; // Import Supabase client
import { useRouter } from 'next/navigation';   // Import Next.js router

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Please enter both email and password.');
      setIsLoading(false);
      return;
    }

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    setIsLoading(false);

    if (signInError) {
      console.error('Supabase login error:', signInError);
      setError(signInError.message || 'Failed to log in. Please check your credentials.');
    } else if (data.user) {
      console.log('Login successful, user:', data.user);
      // Successful login
      // The onAuthStateChange listener (to be implemented in a later step)
      // should ideally handle global state update and redirects.
      // For now, we can do a direct redirect.
      router.push('/dashboard'); // Or any other page you want to redirect to after login
    } else {
      // Should not happen if signInError is null and data.user is null, but as a fallback:
      setError('An unexpected issue occurred during login. Please try again.');
      console.log('Supabase login response (unexpected):', data);
    }
  };

  return (
    <div className="relative isolate bg-white min-h-screen">
      <main className="container mx-auto py-16 sm:py-20 lg:py-18 px-6 lg:px-8 z-10">
        <div className="max-w-lg mx-auto">
          <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl border border-gray-200/80">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
              Log In to PropAnalyzed
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full p-3 sm:text-sm text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full p-3 sm:text-sm text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                  disabled={isLoading}
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 text-center">{error}</p>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-bold rounded-lg shadow-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 hover:shadow-xl transform hover:scale-105 disabled:opacity-70"
                >
                  {isLoading ? 'Logging In...' : 'Log In'}
                </button>
              </div>
            </form>

            <p className="mt-8 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/sign-up" className="font-medium text-purple-600 hover:text-purple-500 hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
