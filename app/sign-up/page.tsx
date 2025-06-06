// app/sign-up/page.tsx
'use client';

import React, { useState, FormEvent } from 'react';
import { supabase } from '@/lib/supabaseClient'; // Import the Supabase client
import { useRouter } from 'next/navigation'; // Import for potential redirect later

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState(''); // For success messages
  const [isLoading, setIsLoading] = useState(false); // For loading state
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: name, // Store the name in user_metadata (Supabase default) or public.users table via trigger
        }
        // If you have email confirmation enabled in Supabase (default),
        // a confirmation link will be sent to the user.
        // You can specify a redirect URL after confirmation if needed:
        // emailRedirectTo: `${window.location.origin}/dashboard`,
      }
    });

    setIsLoading(false);

    if (signUpError) {
      console.error('Supabase sign up error:', signUpError);
      setError(signUpError.message);
    } else if (data.user && data.user.identities && data.user.identities.length === 0) {
      // This case can happen if email confirmation is required but the user already exists without being confirmed.
      // Or if a user exists with an unverified email from a social provider.
      console.log('User exists but may not be confirmed or is linked to a social provider without email verification.');
      setMessage('User may already exist or requires email verification from a social provider. Please try logging in or check your email for a verification link.');
      // Optionally, you could attempt to resend confirmation here if applicable
      // await supabase.auth.resend({ type: 'signup', email: email });
    } else if (data.user) {
      // Check if email confirmation is pending
      if (data.session === null && data.user.email_confirmed_at === undefined) {
         setMessage('Sign up successful! Please check your email to confirm your account.');
      } else if (data.session) {
        // This case implies auto-confirmation or user already confirmed & logged in
        setMessage('Sign up successful! Redirecting...');
        // router.push('/dashboard'); // Or wherever you want to redirect after immediate sign-up/login
      } else {
        // A user object exists, but no session and not clearly pending confirmation (edge case)
        setMessage('Sign up process initiated. Please check your email or try logging in.');
      }
      // Clear form on success
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } else {
      // Fallback for unexpected response structure though data.user should exist on non-error
      setError('An unexpected issue occurred during sign up. Please try again.');
      console.log('Supabase sign up response (unexpected):', data);
    }
  };

  return (
    <div className="relative isolate bg-white min-h-screen">
      <main className="container mx-auto py-16 sm:py-20 lg:py-18 px-6 lg:px-8 z-10">
        <div className="max-w-lg mx-auto">
          <div className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl border border-gray-200/80">
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
              Create Your Account
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="block w-full p-3 sm:text-sm text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                  disabled={isLoading}
                />
              </div>

              {/* Email Input */}
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

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full p-3 sm:text-sm text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                  disabled={isLoading}
                />
              </div>

              {/* Confirm Password Input */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="block w-full p-3 sm:text-sm text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                  disabled={isLoading}
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 text-center">{error}</p>
              )}
              {message && (
                <p className="text-sm text-green-600 text-center">{message}</p>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-bold rounded-lg shadow-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 hover:shadow-xl transform hover:scale-105 disabled:opacity-70"
                >
                  {isLoading ? 'Signing Up...' : 'Sign Up'}
                </button>
              </div>
            </form>

            <p className="mt-8 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="font-medium text-purple-600 hover:text-purple-500 hover:underline">
                Log in
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
