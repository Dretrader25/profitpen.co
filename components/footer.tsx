import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <a href="/" className="inline-block">
              <div className="mb-4">
                <h2 className="text-2xl font-medium text-gray-900">profitpen</h2>
              </div>
            </a>
            <p className="text-gray-600 text-sm max-w-md">
              Create amazing stories with AI-powered assistance. Transform your ideas into compelling narratives with our advanced story generation platform.
            </p>
          </div>
          <div>
            <h3 className="text-gray-900 mb-3 font-medium">Features</h3>
            <ul className="space-y-2">
              <li>
                <a className="text-gray-600 hover:text-gray-900 text-sm transition-colors" href="/studio">
                  Story Studio
                </a>
              </li>
              <li>
                <a className="text-gray-600 hover:text-gray-900 text-sm transition-colors" href="/preview">
                  Preview & Export
                </a>
              </li>
              <li>
                <a className="text-gray-600 hover:text-gray-900 text-sm transition-colors" href="/dashboard">
                  Dashboard
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-gray-900 mb-3 font-medium">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a className="text-gray-600 hover:text-gray-900 text-sm transition-colors" href="/terms">
                  Terms of Service
                </a>
              </li>
              <li>
                <a className="text-gray-600 hover:text-gray-900 text-sm transition-colors" href="/privacy">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a className="text-gray-600 hover:text-gray-900 text-sm transition-colors" href="/pricing">
                  Pricing
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            © 2025 ProfitPen. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
