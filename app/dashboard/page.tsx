'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/authContext'; // Import useAuth
import { useRouter } from 'next/navigation'; // Import useRouter
import { motion, AnimatePresence } from 'framer-motion';
import { useStoryStore } from '@/lib/store/storyStore';
import DashboardNavigation from './components/DashboardNavigation';
import DashboardOverview from './components/DashboardOverview';

export type DashboardTab = 'dashboard' | 'overview' | 'chapters' | 'characters' | 'plot' | 'analytics' | 'publishing' | 'settings';

const tabConfigs = {
  dashboard: {
    title: 'Lead Dashboard', // Changed
    description: 'Your real estate lead overview', // Changed
    icon: '📊', // Icon can remain or be updated if a better one is available
    component: DashboardOverview
  },
  overview: {
    title: 'Summary', // Changed (as it redirects to studio/overview)
    description: 'Lead generation summary & quick actions', // Changed
    icon: '📖',
    redirectToStudio: true
  },
  chapters: {
    title: 'Properties/Leads', // Changed
    description: 'Manage properties & leads', // Changed
    icon: '📑',
    redirectToStudio: true
  },
  characters: {
    title: 'Contacts', // Changed
    description: 'Manage contacts & owner info', // Changed
    icon: '👥',
    redirectToStudio: true
  },
  plot: {
    title: 'Deal Workflow', // Changed
    description: 'Deal workflow & follow-ups', // Changed
    icon: '🗺️',
    redirectToStudio: true
  },
  analytics: {
    title: 'Market Analytics', // Changed
    description: 'Market analytics & lead scores', // Changed
    icon: '📊',
    redirectToStudio: true
  },
  publishing: {
    title: 'Reports/Exports', // Changed
    description: 'Export leads & generate reports', // Changed
    icon: '🚀',
    redirectToStudio: true
  },
  settings: {
    title: 'Preferences', // Changed
    description: 'Application preferences', // Changed
    icon: '⚙️',
    redirectToStudio: true
  }
};

export default function DashboardPage() {
  const { user, isLoading: authIsLoading } = useAuth(); // Get user and loading state
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DashboardTab>('dashboard');
  const [isLoading, setIsLoading] = useState(true); // Page specific loading, not auth
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { currentStory } = useStoryStore();

  const mockStats = {
    totalWords: 12450,
    totalPages: 28,
    qualityScore: 7.8,
    lastUpdated: new Date(),
    weeklyGoal: 15000,
    streakDays: 5
  };

  useEffect(() => {
    // Auth check
    if (!authIsLoading && !user) {
      router.push('/login');
    }
  }, [user, authIsLoading, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Page specific loading
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // If auth is still loading or user is null (and redirection hasn't happened yet)
  if (authIsLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <motion.div /* ... loading animation ... */ >
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Loading...</h2>
        </motion.div>
      </div>
    );
  }

  // If page is loading (for other reasons, e.g. data fetching, though not much here)
  if (isLoading) {
     return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        {/* ... same loading display as above or slightly different ... */}
        <motion.div>
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Preparing Dashboard...</h2>
        </motion.div>
      </div>
    );
  }

  // Original content of DashboardPage, rendered only if authenticated
  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Dashboard Navigation */}
      <DashboardNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabConfigs={tabConfigs}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentStory={currentStory}
        pageCount={mockStats.totalPages}
        qualityScore={Math.round(mockStats.qualityScore)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <motion.main 
          className="p-6 flex-1"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {/* Header */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  <span className="text-2xl">{tabConfigs[activeTab].icon}</span>
                  {tabConfigs[activeTab].title}
                </h1>
                <p className="text-gray-600">{tabConfigs[activeTab].description}</p>
              </div>
              
              {/* Quick Actions */}
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                  onClick={() => {/* Auto-save functionality */}}
                >
                  Auto-save: On
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm"
                  onClick={() => window.location.href = '/studio'}
                >
                  Open Studio
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              <DashboardOverview 
                currentStory={currentStory}
                stats={mockStats}
              />
            </motion.div>
          </AnimatePresence>
        </motion.main>
      </div>
    </motion.div>
  );
}
