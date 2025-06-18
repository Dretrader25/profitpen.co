'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { StudioTab } from '../page';

interface StudioNavigationProps {
  activeTab: StudioTab;
  onTabChange: (tab: StudioTab) => void;
  tabConfigs: Record<StudioTab, {
    title: string;
    description: string;
    icon: string;
    component: any;
  }>;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  currentStory: any;
  pageCount: number;
  qualityScore: number;
}

export default function StudioNavigation({
  activeTab,
  onTabChange,
  tabConfigs,
  sidebarCollapsed,
  onToggleSidebar,
  currentStory,
  pageCount,
  qualityScore
}: StudioNavigationProps) {
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
                    <h3 className="font-semibold text-gray-900 text-sm">PropAnalyzed Lead Dashboard</h3>
                    <p className="text-xs text-gray-500">Lead Analysis Workspace</p>
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
                    {pageCount} data points {/* Changed */}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${
                      qualityScore >= 8 ? 'bg-green-500' : 
                      qualityScore >= 6 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></span>
                    {qualityScore}/10 data integrity {/* Changed/Added context */}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Navigation Tabs */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-2">
              {Object.entries(tabConfigs).map(([key, config]) => {
                const isActive = activeTab === key;
                return (
                  <motion.button
                    key={key}
                    onClick={() => onTabChange(key as StudioTab)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all group ${
                      isActive 
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
                        <div className="font-medium text-sm">{config.title}</div>
                        <div className={`text-xs mt-0.5 transition-colors ${
                          isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
                        }`}>
                          {config.description}
                        </div>
                      </motion.div>
                    )}
                    {isActive && (
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
              onClick={() => router.push('/dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors ${
                sidebarCollapsed ? 'justify-center' : ''
              }`}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0H8v0z" />
              </svg>
              {!sidebarCollapsed && (
                <motion.span
                  variants={contentVariants}
                  animate={sidebarCollapsed ? 'collapsed' : 'expanded'}
                  className="text-sm"
                >
                  Dashboard
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
                  View Report
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
