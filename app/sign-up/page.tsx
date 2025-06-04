// app/sign-up/page.tsx
'use client';

import React, { useState, FormEvent } from 'react'; // Import useState, FormEvent

export default function SignUpPage() {
  const [name, setName] = useState(''); // State for Name
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(''); // State for error messages

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(''); // Clear previous errors

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Log form data (replace with actual submission logic later)
    console.log('Sign Up form submitted with:', {
      name,
      email,
      password, // Only log password, not confirmPassword
    });
    // alert(`Sign up attempt: Name: ${name}, Email: ${email}`); // Optional for quick visual feedback
    // Add logic here to actually submit to a backend in a real app
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
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  autoComplete="name"
                  value={name} // Bind state
                  onChange={(e) => setName(e.target.value)} // Add handler
                  required // HTML5 validation
                  className="block w-full p-3 sm:text-sm text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  value={email} // Bind state
                  onChange={(e) => setEmail(e.target.value)} // Add handler
                  required // HTML5 validation
                  className="block w-full p-3 sm:text-sm text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
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
                  autoComplete="new-password"
                  value={password} // Bind state
                  onChange={(e) => setPassword(e.target.value)} // Add handler
                  required // HTML5 validation
                  className="block w-full p-3 sm:text-sm text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={confirmPassword} // Bind state
                  onChange={(e) => setConfirmPassword(e.target.value)} // Add handler
                  required // HTML5 validation
                  className="block w-full p-3 sm:text-sm text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 text-center">{error}</p>
              )}

              <div>
                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-bold rounded-lg shadow-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 hover:shadow-xl transform hover:scale-105"
                >
                  Sign Up
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
