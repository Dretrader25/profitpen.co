'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Navigation() {
  const router = useRouter();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              ← Back
            </button>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => router.push('/')}
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Home
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 