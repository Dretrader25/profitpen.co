'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';

const navigation = [
  { name: 'Story Studio', href: '/studio' },
  { name: 'Generate', href: '/dashboard/generate' },
  { name: 'Pricing', href: '/pricing' },
];

const moreLinks = [
  { name: 'Templates', href: '/templates' },
  { name: 'About', href: '/about' },
  { name: 'Blog', href: '/blog' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Calculate progress based on current path
  const getProgress = () => {
    const currentIndex = navigation.findIndex(item => item.href === pathname);
    if (currentIndex === -1) return 0;
    return ((currentIndex + 1) / navigation.length) * 100;
  };

  return (
    <header className="relative bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-medium text-gray-900">profitpen</span>
          </Link>
        </div>

        <div className="lg:hidden ml-4">
          <ThemeToggle />
        </div>

        <div className="hidden lg:block ml-4">
          <ThemeToggle />
        </div>

        <nav className="hidden lg:flex flex-1 justify-center">
          <div className="w-[507px]">
            <div className="flex w-full justify-center relative z-50">
              <nav className="flex items-center gap-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-100 bg-transparent whitespace-nowrap text-gray-600 relative ${
                      pathname === item.href ? 'bg-gray-100 text-gray-900' : ''
                    }`}
                  >
                    {item.name}
                    {item.name === 'Generate' && (
                      <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[6px] px-1 py-0.5 rounded-full">
                        NEW
                      </span>
                    )}
                  </Link>
                ))}
                <div className="relative">
                  <button
                    onClick={() => setIsMoreOpen(!isMoreOpen)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-100 bg-transparent whitespace-nowrap text-gray-600 flex items-center gap-1 ${
                      isMoreOpen ? 'bg-gray-100 text-gray-900' : ''
                    }`}
                  >
                    More
                    <svg
                      className={`w-4 h-4 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isMoreOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-gray-200">
                      <div className="py-1">
                        {moreLinks.map((link) => (
                          <Link
                            key={link.name}
                            href={link.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                            onClick={() => setIsMoreOpen(false)}
                          >
                            {link.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </nav>
            </div>
          </div>
        </nav>

        <div className="hidden lg:block flex-shrink-0">
          <div className="hidden lg:flex items-center gap-4">
            <Link
              href="/login"
              className="whitespace-nowrap inline-flex h-11 items-center justify-center rounded-xl px-8 py-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-gray-600 hover:text-gray-900"
            >
              Login
            </Link>
            <Link
              href="/sign-up"
              className="whitespace-nowrap inline-flex h-11 items-center justify-center rounded-xl px-8 py-2 font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Sign Up
            </Link>
          </div>
        </div>

        <div className="lg:hidden ml-auto flex items-center gap-2">
          <button
            className="lg:hidden flex items-center gap-2 px-3 h-[42px] rounded-full hover:shadow transition-shadow"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-menu text-gray-600"
            >
              <line x1="4" x2="20" y1="12" y2="12"></line>
              <line x1="4" x2="20" y1="6" y2="6"></line>
              <line x1="4" x2="20" y1="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
