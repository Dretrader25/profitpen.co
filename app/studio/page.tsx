'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { useStoryStore } from '@/lib/store/storyStore';
import StudioNavigation from './components/StudioNavigation';
import ContentEditor from './components/ContentEditor';
import ChapterManager from './components/ChapterManager';
import CharacterManager from './components/CharacterManager';
import PlotOutline from './components/PlotOutline';
import BookAnalytics from './components/BookAnalytics';
import PublishingTools from './components/PublishingTools';
import SettingsPanel from './components/SettingsPanel';

export type StudioTab = 
  | 'overview' 
  | 'chapters' 
  | 'characters' 
  | 'plot' 
  | 'analytics' 
  | 'publishing' 
  | 'settings';

const tabConfigs = {
  overview: {
    title: 'Overview',
    description: 'Book summary and quick actions',
    icon: '📖',
    component: ContentEditor
  },
  chapters: {
    title: 'Chapters',
    description: 'Manage and edit chapters',
    icon: '📑',
    component: ChapterManager
  },
  characters: {
    title: 'Characters',
    description: 'Character development and profiles',
    icon: '👥',
    component: CharacterManager
  },
  plot: {
    title: 'Plot',
    description: 'Story structure and outline',
    icon: '🗺️',
    component: PlotOutline
  },
  analytics: {
    title: 'Analytics',
    description: 'Content quality and insights',
    icon: '📊',
    component: BookAnalytics
  },
  publishing: {
    title: 'Publishing',
    description: 'Export and publishing tools',
    icon: '🚀',
    component: PublishingTools
  },
  settings: {
    title: 'Settings',
    description: 'Studio preferences',
    icon: '⚙️',
    component: SettingsPanel
  }
};

export default function StudioPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams?.get('tab') as StudioTab;
  const initialTab = (tabParam && Object.keys(tabConfigs).includes(tabParam)) ? tabParam : 'overview';
  const [activeTab, setActiveTab] = useState<StudioTab>(initialTab);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { currentStory } = useStoryStore();

  // State for real content data
  const [persistedContent, setPersistedContentState] = useState<any>({});
  const [currentPageCount, setCurrentPageCount] = useState(0);

  // Initialize with real content from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const content = JSON.parse(localStorage.getItem('previewContent') || '{}');
      const pageCount = parseInt(localStorage.getItem('currentPageCount') || '8');
      
      setPersistedContentState(content);
      setCurrentPageCount(pageCount);

      // Listen for localStorage changes
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'previewContent') {
          const newContent = JSON.parse(e.newValue || '{}');
          setPersistedContentState(newContent);
        } else if (e.key === 'currentPageCount') {
          const newPageCount = parseInt(e.newValue || '8');
          setCurrentPageCount(newPageCount);
        }
      };

      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, []);

  // Default quality score
  const averageQualityScore = 7;

  // Mock data for components that don't use real data yet
  const mockIsGeneratingMore = false;
  const mockMaxPages = 100;
  const mockContentQualityNumber = 7; // For components that expect a number
  const mockContentQualityStats = { overall: 7, readability: 8, engagement: 6 }; // For components that expect stats object
  const mockIsGenerating = false;
  const mockProgress = 0;

  // Mock functions
  const handleRemovePage = async (pageNum: number) => {
    console.log('Remove page:', pageNum);
  };

  const getVisiblePages = () => {
    return Array.from({ length: currentPageCount }, (_, i) => i + 1);
  };

  const handleRegeneratePage = async (pageNum: number) => {
    console.log('Regenerate page:', pageNum);
  };

  const generateMorePages = async () => {
    console.log('Generate more pages');
  };

  const getPageContent = (pageNum: number) => {
    return '';
  };

  const getBookQualityStats = () => {
    return mockContentQualityStats;
  };

  const setPersistedContent = (content: any) => {
    setPersistedContentState(content);
    if (typeof window !== 'undefined') {
      localStorage.setItem('previewContent', JSON.stringify(content));
    }
  };

  const handleTabChange = (tab: string) => {
    // Validate that the tab is a valid StudioTab before setting it
    if (Object.keys(tabConfigs).includes(tab)) {
      setActiveTab(tab as StudioTab);
    }
  };

  useEffect(() => {
    // Handle URL parameter changes
    const tab = searchParams?.get('tab') as StudioTab;
    if (tab && Object.keys(tabConfigs).includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    // Simulate loading for smooth transition
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const ActiveComponent = tabConfigs[activeTab]?.component;

  // Function to render component with appropriate props
  const renderActiveComponent = () => {
    const commonProps = {
      currentStory,
      onTabChange: handleTabChange
    };

    switch (activeTab) {
      case 'overview':
        return (
          <ContentEditor 
            {...commonProps}
            persistedContent={persistedContent}
            currentPageCount={currentPageCount}
            isGeneratingMore={mockIsGeneratingMore}
            maxPages={mockMaxPages}
            contentQuality={mockContentQualityNumber}
            handleRemovePage={handleRemovePage}
            getVisiblePages={getVisiblePages}
            handleRegeneratePage={handleRegeneratePage}
            generateMorePages={generateMorePages}
            isGenerating={mockIsGenerating}
            progress={mockProgress}
            getPageContent={getPageContent}
            getBookQualityStats={getBookQualityStats}
            setPersistedContent={setPersistedContent}
          />
        );
      
      case 'chapters':
        return (
          <ChapterManager 
            {...commonProps}
            persistedContent={persistedContent}
            currentPageCount={currentPageCount}
            handleRemovePage={handleRemovePage}
            getVisiblePages={getVisiblePages}
            handleRegeneratePage={handleRegeneratePage}
            generateMorePages={generateMorePages}
            isGenerating={mockIsGenerating}
            progress={mockProgress}
            getPageContent={getPageContent}
            setPersistedContent={setPersistedContent}
          />
        );
      
      case 'characters':
        return (
          <CharacterManager 
            {...commonProps}
          />
        );
      
      case 'plot':
        return (
          <PlotOutline 
            {...commonProps}
          />
        );
      
      case 'analytics':
        return (
          <BookAnalytics 
            currentStory={currentStory}
            persistedContent={[]}
            contentQuality={averageQualityScore}
            getBookQualityStats={getBookQualityStats}
            currentPageCount={currentPageCount}
          />
        );
      
      case 'publishing':
        return (
          <PublishingTools 
            {...commonProps}
            persistedContent={[]}
            currentPageCount={currentPageCount}
          />
        );
      
      case 'settings':
        return (
          <SettingsPanel 
            {...commonProps}
          />
        );
      
      default:
        return (
          <ContentEditor 
            {...commonProps}
            persistedContent={persistedContent}
            currentPageCount={currentPageCount}
            isGeneratingMore={mockIsGeneratingMore}
            maxPages={mockMaxPages}
            contentQuality={mockContentQualityNumber}
            handleRemovePage={handleRemovePage}
            getVisiblePages={getVisiblePages}
            handleRegeneratePage={handleRegeneratePage}
            generateMorePages={generateMorePages}
            isGenerating={mockIsGenerating}
            progress={mockProgress}
            getPageContent={getPageContent}
            getBookQualityStats={getBookQualityStats}
            setPersistedContent={setPersistedContent}
          />
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Loading Studio</h2>
          <p className="text-gray-500">Preparing your creative workspace...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Studio Navigation */}
      <StudioNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabConfigs={tabConfigs}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentStory={currentStory}
        pageCount={0}
        qualityScore={Math.round(averageQualityScore)}
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
                  <span className="text-2xl">{tabConfigs[activeTab]?.icon || '📖'}</span>
                  {tabConfigs[activeTab]?.title || 'Overview'}
                </h1>
                <p className="text-gray-600">{tabConfigs[activeTab]?.description || 'Book summary and quick actions'}</p>
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
                  onClick={() => setActiveTab('publishing')}
                >
                  Export Book
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
              {renderActiveComponent()}
            </motion.div>
          </AnimatePresence>
        </motion.main>
      </div>
    </motion.div>
  );
}