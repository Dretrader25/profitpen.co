'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface DashboardOverviewProps {
  currentStory: any;
  stats: {
    totalWords: number;
    totalPages: number;
    qualityScore: number;
    lastUpdated: Date;
    weeklyGoal: number;
    streakDays: number;
  };
}

export default function DashboardOverview({ currentStory, stats }: DashboardOverviewProps) {
  const router = useRouter();

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const progressPercentage = (stats.totalWords / stats.weeklyGoal) * 100;

  const statCards = [
    {
      title: 'Total Words',
      value: formatNumber(stats.totalWords),
      icon: '✍️',
      color: 'blue',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Pages Written',
      value: stats.totalPages.toString(),
      icon: '📄',
      color: 'green',
      change: '+3',
      changeType: 'positive'
    },
    {
      title: 'Quality Score',
      value: `${stats.qualityScore.toFixed(1)}/10`,
      icon: '⭐',
      color: 'yellow',
      change: '+0.5',
      changeType: 'positive'
    },
    {
      title: 'Writing Streak',
      value: `${stats.streakDays} days`,
      icon: '🔥',
      color: 'red',
      change: '+1',
      changeType: 'positive'
    }
  ];

  const quickActions = [
    {
      title: 'Continue Writing',
      description: 'Pick up where you left off',
      icon: '✏️',
      color: 'blue',
      action: () => router.push('/studio')
    },
    {
      title: 'Review Chapters',
      description: 'Edit and refine your content',
      icon: '📖',
      color: 'green',
      action: () => router.push('/studio?tab=chapters')
    },
    {
      title: 'Character Development',
      description: 'Build compelling characters',
      icon: '👥',
      color: 'purple',
      action: () => router.push('/studio?tab=characters')
    },
    {
      title: 'Preview Book',
      description: 'See how your book looks',
      icon: '👁️',
      color: 'indigo',
      action: () => router.push('/preview')
    }
  ];

  const recentActivity = [
    {
      action: 'Added new chapter',
      chapter: 'Chapter 12: The Revelation',
      time: '2 hours ago',
      icon: '📝'
    },
    {
      action: 'Character updated',
      chapter: 'Sarah Mitchell - Main Protagonist',
      time: '1 day ago',
      icon: '👤'
    },
    {
      action: 'Plot outline revised',
      chapter: 'Act II Development',
      time: '2 days ago',
      icon: '🗺️'
    }
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back to your writing journey! 
        </h2>
        <p className="text-gray-600">
          {currentStory?.title ? `Continue working on "${currentStory.title}"` : 'Ready to create your next masterpiece?'}
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 + index * 0.05 }}
            className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg bg-${stat.color}-100 flex items-center justify-center text-xl`}>
                {stat.icon}
              </div>
              <span className={`text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Weekly Goal Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Weekly Writing Goal</h3>
            <p className="text-sm text-gray-600">
              {formatNumber(stats.totalWords)} of {formatNumber(stats.weeklyGoal)} words
            </p>
          </div>
          <div className="text-2xl">🎯</div>
        </div>
        <div className="w-full bg-white rounded-full h-3 mb-3">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
        <p className="text-sm font-medium text-blue-700">
          {progressPercentage >= 100 ? '🎉 Goal achieved!' : `${Math.round(progressPercentage)}% complete`}
        </p>
      </motion.div>

      {/* Content Grid Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="w-full bg-white rounded-xl border border-gray-200 p-6"
      >
        {/* Header with Navigation and Controls */}
        <div className="flex items-center justify-between mb-6">
          {/* Left Navigation */}
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h3 className="text-lg font-semibold text-gray-900">Recent Projects</h3>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Filter */}
            <select className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 hover:border-gray-300 transition-colors">
              <option>All Items</option>
              <option>Chapters</option>
              <option>Characters</option>
              <option>Notes</option>
            </select>

            {/* Sort */}
            <select className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white text-gray-700 hover:border-gray-300 transition-colors">
              <option>Recent</option>
              <option>A-Z</option>
              <option>Modified</option>
              <option>Created</option>
            </select>

            {/* Right Navigation */}
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* 4x2 Grid */}
        <div className="grid grid-cols-4 gap-4">
          {/* Row 1 */}
          <div className="aspect-square bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all cursor-pointer group relative">
            <img 
              src="https://img.freepik.com/free-vector/minimalist-book-cover-template_23-2148899519.jpg?semt=ais_items_boosted&w=740"
              alt="Book Cover"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2 left-2">
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Active</span>
            </div>
          </div>
          <div className="aspect-square bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all cursor-pointer group relative">
            <img 
              src="https://img.freepik.com/free-vector/minimalist-book-cover-template_23-2148899519.jpg?semt=ais_items_boosted&w=740"
              alt="Book Cover"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2 left-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">Draft</span>
            </div>
          </div>
          <div className="aspect-square bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all cursor-pointer group relative">
            <img 
              src="https://img.freepik.com/free-vector/minimalist-book-cover-template_23-2148899519.jpg?semt=ais_items_boosted&w=740"
              alt="Book Cover"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2 left-2">
              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">Review</span>
            </div>
          </div>
          <div className="aspect-square bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all cursor-pointer group relative">
            <img 
              src="https://img.freepik.com/free-vector/minimalist-book-cover-template_23-2148899519.jpg?semt=ais_items_boosted&w=740"
              alt="Book Cover"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2 left-2">
              <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">Planning</span>
            </div>
          </div>

          {/* Row 2 */}
          <div className="aspect-square bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all cursor-pointer group relative">
            <img 
              src="https://img.freepik.com/free-vector/minimalist-book-cover-template_23-2148899519.jpg?semt=ais_items_boosted&w=740"
              alt="Book Cover"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2 left-2">
              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">Complete</span>
            </div>
          </div>
          <div className="aspect-square bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all cursor-pointer group relative">
            <img 
              src="https://img.freepik.com/free-vector/minimalist-book-cover-template_23-2148899519.jpg?semt=ais_items_boosted&w=740"
              alt="Book Cover"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2 left-2">
              <span className="px-2 py-1 bg-rose-100 text-rose-700 text-xs font-medium rounded-full">On Hold</span>
            </div>
          </div>
          <div className="aspect-square bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all cursor-pointer group relative">
            <img 
              src="https://img.freepik.com/free-vector/minimalist-book-cover-template_23-2148899519.jpg?semt=ais_items_boosted&w=740"
              alt="Book Cover"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2 left-2">
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">Published</span>
            </div>
          </div>
          <div className="aspect-square bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all cursor-pointer group relative">
            <img 
              src="https://img.freepik.com/free-vector/minimalist-book-cover-template_23-2148899519.jpg?semt=ais_items_boosted&w=740"
              alt="Book Cover"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2 left-2">
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">New</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {quickActions.map((action, index) => (
              <motion.button
                key={action.title}
                onClick={action.action}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg bg-${action.color}-100 flex items-center justify-center text-lg group-hover:scale-110 transition-transform`}>
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {action.title}
                    </h4>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sm shadow-sm">
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600 truncate">{activity.chapter}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Current Story Section */}
      {currentStory && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white rounded-xl p-6 border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Project</h3>
          <div className="flex items-start gap-4">
            <div className="w-16 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-2xl">
              📚
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                {currentStory.title || 'Untitled Story'}
              </h4>
              <p className="text-gray-600 mb-3">
                {currentStory.description || 'No description available'}
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Genre: {currentStory.genre || 'Not specified'}</span>
                <span>•</span>
                <span>Last updated: {stats.lastUpdated.toLocaleDateString()}</span>
              </div>
            </div>
            <button
              onClick={() => router.push('/studio')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue Writing
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
