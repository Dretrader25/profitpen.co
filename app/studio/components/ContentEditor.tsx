'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ContentEditorProps {
  currentStory: any;
  persistedContent: any;
  currentPageCount: number;
  isGeneratingMore: boolean;
  maxPages: number;
  contentQuality: number;
  handleRemovePage: (pageNum: number) => void;
  getVisiblePages: () => number[];
  handleRegeneratePage: (pageNum: number) => Promise<void>;
  generateMorePages: () => Promise<void>;
  isGenerating: boolean;
  progress: number;
  getPageContent: (pageNum: number) => string;
  getBookQualityStats: () => any;
  setPersistedContent: (content: any) => void;
  onTabChange: (tab: string) => void;
}

export default function ContentEditor({
  currentStory,
  persistedContent,
  currentPageCount,
  isGeneratingMore,
  maxPages,
  contentQuality,
  handleRemovePage,
  getVisiblePages,
  handleRegeneratePage,
  generateMorePages,
  isGenerating,
  progress,
  getPageContent,
  getBookQualityStats,
  setPersistedContent,
  onTabChange
}: ContentEditorProps) {
  const [selectedSection, setSelectedSection] = useState<'summary' | 'premise' | 'themes'>('summary');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [isEditing]);

  const handleEdit = (section: string, content: string) => {
    setSelectedSection(section as 'summary' | 'premise' | 'themes');
    setEditContent(content);
    setIsEditing(true);
  };

  const handleSave = () => {
    // Save logic here
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditContent('');
  };

  const quickActions = [
    {
      title: 'Generate More Pages',
      description: 'Extend your book with AI-generated content',
      icon: '📝',
      action: generateMorePages,
      disabled: isGeneratingMore || currentPageCount >= maxPages,
      color: 'blue'
    },
    {
      title: 'Improve Quality',
      description: 'Enhance existing content quality',
      icon: '✨',
      action: () => onTabChange('analytics'),
      disabled: false,
      color: 'purple'
    },
    {
      title: 'Add Characters',
      description: 'Develop new characters',
      icon: '👥',
      action: () => onTabChange('characters'),
      disabled: false,
      color: 'green'
    },
    {
      title: 'Plot Structure',
      description: 'Refine story structure',
      icon: '🗺️',
      action: () => onTabChange('plot'),
      disabled: false,
      color: 'orange'
    }
  ];

  const stats = [
    {
      label: 'Pages',
      value: currentPageCount,
      max: maxPages,
      icon: '📄',
      color: 'blue'
    },
    {
      label: 'Quality Score',
      value: contentQuality,
      max: 10,
      icon: '⭐',
      color: contentQuality >= 8 ? 'green' : contentQuality >= 6 ? 'yellow' : 'red'
    },
    {
      label: 'Characters',
      value: currentStory?.characters?.length || 0,
      max: null,
      icon: '👥',
      color: 'purple'
    },
    {
      label: 'Chapters',
      value: currentStory?.chapters?.length || 0,
      max: null,
      icon: '📚',
      color: 'orange'
    }
  ];

  return (
    <div className="p-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-2xl font-bold ${
                stat.color === 'blue' ? 'text-blue-600' :
                stat.color === 'green' ? 'text-green-600' :
                stat.color === 'yellow' ? 'text-yellow-600' :
                stat.color === 'red' ? 'text-red-600' :
                stat.color === 'purple' ? 'text-purple-600' :
                'text-orange-600'
              }`}>
                {stat.value}
                {stat.max && <span className="text-gray-400 text-sm">/{stat.max}</span>}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-900">{stat.label}</h3>
            {stat.max && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      stat.color === 'blue' ? 'bg-blue-500' :
                      stat.color === 'green' ? 'bg-green-500' :
                      stat.color === 'yellow' ? 'bg-yellow-500' :
                      stat.color === 'red' ? 'bg-red-500' :
                      'bg-purple-500'
                    }`}
                    style={{ width: `${(stat.value / stat.max) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Story Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Story Details */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span>📖</span> Story Overview
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <div className="text-xl font-bold text-gray-900">
                  {currentStory?.title || 'Untitled Story'}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {currentStory?.genre || 'Not set'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tone</label>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {currentStory?.tone || 'Not set'}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Audience</label>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {currentStory?.audience || 'Not set'}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Premise</label>
                  <button
                    onClick={() => handleEdit('premise', currentStory?.premise || '')}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {currentStory?.premise || 'No premise set yet. Click edit to add one.'}
                </p>
              </div>
            </div>
          </div>

          {/* Themes */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <span>🎭</span> Themes
              </h3>
              <button
                onClick={() => handleEdit('themes', currentStory?.themes?.join(', ') || '')}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Edit
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {currentStory?.themes?.length > 0 ? (
                currentStory.themes.map((theme: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                  >
                    {theme}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No themes defined yet.</p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Empty Container 1 */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 h-48">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span>📊</span> Analytics
            </h3>
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>Content coming soon...</p>
            </div>
          </div>

          {/* Empty Container 2 */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 h-48">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span>🔧</span> Tools
            </h3>
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>Content coming soon...</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions - Moved down and made horizontal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-8"
      >
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>⚡</span> Quick Actions
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.title}
                onClick={action.action}
                disabled={action.disabled}
                className={`p-4 rounded-lg border text-left transition-all group ${
                  action.disabled 
                    ? 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-50' 
                    : `bg-${action.color}-50 border-${action.color}-200 hover:bg-${action.color}-100 hover:shadow-sm`
                }`}
                whileHover={action.disabled ? {} : { scale: 1.02 }}
                whileTap={action.disabled ? {} : { scale: 0.98 }}
              >
                <div className="flex flex-col items-center text-center gap-2">
                  <span className="text-2xl">{action.icon}</span>
                  <div>
                    <h4 className="font-medium text-gray-900 group-hover:text-gray-700 text-sm">
                      {action.title}
                    </h4>
                    <p className="text-xs text-gray-600 mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Recent Activity - Moved down */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-8"
      >
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>⏰</span> Recent Activity
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Generated 5 new pages</p>
                <p className="text-xs text-gray-600">2 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Quality improved to 7.8/10</p>
                <p className="text-xs text-gray-600">15 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Added character profile</p>
                <p className="text-xs text-gray-600">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Edit Modal */}
      {isEditing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Edit {selectedSection.charAt(0).toUpperCase() + selectedSection.slice(1)}
              </h3>
            </div>
            
            <div className="p-6">
              <textarea
                ref={textareaRef}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Enter ${selectedSection} content...`}
              />
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
