'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { DashboardTab } from '../page';

interface DashboardNavigationProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  tabConfigs: Record<DashboardTab, {
    title: string;
    description: string;
    icon: string;
    component?: any;
    redirectToStudio?: boolean;
  }>;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  currentStory: any;
  pageCount: number;
  qualityScore: number;
}

export default function DashboardNavigation({
  activeTab,
  onTabChange,
  tabConfigs,
  sidebarCollapsed,
  onToggleSidebar,
  currentStory,
  pageCount,
  qualityScore
}: DashboardNavigationProps) {
  const router = useRouter();

  const sidebarVariants = {
    expanded: {
      width: 256,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    },
    collapsed: {
      width: 64,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    }
  };

  const contentVariants = {
    expanded: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, delay: 0.1 }
    },
    collapsed: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.2 }
    }
  };

  const handleTabClick = (key: string) => {
    const config = tabConfigs[key as DashboardTab];
    if (config.redirectToStudio) {
      // Redirect to studio with the appropriate tab
      const studioTab = key === 'overview' ? 'overview' : key;
      router.push(`/studio?tab=${studioTab}`);
    } else {
      onTabChange(key as DashboardTab);
    }
  };

  return (
    <>
      {/* Sidebar */}
      <motion.div
        className="h-full bg-white border-r border-gray-200 shadow-lg overflow-hidden flex-shrink-0"
        variants={sidebarVariants}
        animate={sidebarCollapsed ? 'collapsed' : 'expanded'}
        initial="expanded"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <motion.div
                  variants={contentVariants}
                  animate={sidebarCollapsed ? 'collapsed' : 'expanded'}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">PA</span> {/* PropAnalyzed short */}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">PropAnalyzed Dashboard</h3>
                    <p className="text-xs text-gray-500">Lead & Property Overview</p>
                  </div>
                </motion.div>
              )}
              
              <button
                onClick={onToggleSidebar}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg 
                  className={`w-4 h-4 text-gray-600 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Story Info */}
          {!sidebarCollapsed && currentStory && (
            <motion.div
              variants={contentVariants}
              animate={sidebarCollapsed ? 'collapsed' : 'expanded'}
              className="p-4 bg-gray-50 border-b border-gray-200"
            >
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900 text-sm truncate">
                  {currentStory.title || 'Untitled Story'}
                </h4>
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    {pageCount} data points {/* Changed from pages */}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${
                      qualityScore >= 8 ? 'bg-green-500' : 
                      qualityScore >= 6 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></span>
                    {qualityScore}/10 lead score {/* Added "lead score" for context */}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation Tabs */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-2">
              {Object.entries(tabConfigs)
                .filter(([key]) => key === 'dashboard')
                .map(([key, config]) => {
                const isActive = activeTab === key && !config.redirectToStudio;
                const isDashboard = key === 'dashboard';
                
                return (
                  <motion.button
                    key={key}
                    onClick={() => handleTabClick(key)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all group ${
                      isActive 
                        ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                        : isDashboard && activeTab === 'dashboard'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-lg flex-shrink-0">{config.icon}</span>
                    {!sidebarCollapsed && (
                      <motion.div
                        variants={contentVariants}
                        animate={sidebarCollapsed ? 'collapsed' : 'expanded'}
                        className="min-w-0 flex-1"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm">{config.title}</div>
                            <div className={`text-xs mt-0.5 transition-colors ${
                              (isActive || (isDashboard && activeTab === 'dashboard')) ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
                            }`}>
                              {config.description}
                            </div>
                          </div>
                          {config.redirectToStudio && (
                            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          )}
                        </div>
                      </motion.div>
                    )}
                    {(isActive || (isDashboard && activeTab === 'dashboard')) && (
                      <motion.div
                        layoutId="activeTab"
                        className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </nav>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-gray-200 space-y-2">
            <button
              onClick={() => router.push('/studio')}
              className={`w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors ${
                sidebarCollapsed ? 'justify-center' : ''
              }`}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              {!sidebarCollapsed && (
                <motion.span
                  variants={contentVariants}
                  animate={sidebarCollapsed ? 'collapsed' : 'expanded'}
                  className="text-sm"
                >
                  Lead Dashboard
                </motion.span>
              )}
            </button>
            
            <button
              onClick={() => router.push('/preview')}
              className={`w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors ${
                sidebarCollapsed ? 'justify-center' : ''
              }`}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {!sidebarCollapsed && (
                <motion.span
                  variants={contentVariants}
                  animate={sidebarCollapsed ? 'collapsed' : 'expanded'}
                  className="text-sm"
                >
                  View Reports
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
