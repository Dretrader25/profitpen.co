'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  BookOpen, 
  Clock, 
  Users, 
  Star,
  AlertTriangle,
  CheckCircle,
  Zap,
  Eye,
  MessageSquare
} from 'lucide-react';

interface BookAnalyticsProps {
  currentStory: any;
  persistedContent: any[];
  contentQuality: number;
  getBookQualityStats: () => any;
  currentPageCount: number;
}

export default function BookAnalytics({
  currentStory,
  persistedContent,
  contentQuality,
  getBookQualityStats,
  currentPageCount
}: BookAnalyticsProps) {
  const [selectedMetric, setSelectedMetric] = useState<'overview' | 'quality' | 'readability' | 'engagement'>('overview');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');

  const qualityStats = useMemo(() => getBookQualityStats(), [getBookQualityStats]);

  // Calculate analytics metrics
  const analytics = useMemo(() => {
    const totalWords = persistedContent.reduce((sum, page) => {
      return sum + (page.content?.split(' ').length || 0);
    }, 0);

    const averageWordsPerPage = currentPageCount > 0 ? Math.round(totalWords / currentPageCount) : 0;
    const estimatedReadingTime = Math.round(totalWords / 250); // 250 words per minute average

    // Quality analysis
    const qualityDistribution = {
      excellent: Math.round(currentPageCount * 0.2),
      good: Math.round(currentPageCount * 0.4),
      average: Math.round(currentPageCount * 0.3),
      needsWork: Math.round(currentPageCount * 0.1)
    };

    // Engagement metrics
    const engagementScore = Math.round((contentQuality + 20) / 1.2); // Simulated
    const readabilityScore = Math.round(75 + Math.random() * 20); // Simulated Flesch score

    return {
      totalWords,
      averageWordsPerPage,
      estimatedReadingTime,
      qualityDistribution,
      engagementScore,
      readabilityScore,
      completionRate: Math.round((currentPageCount / 50) * 100), // Assuming 50 pages target
      consistency: Math.round(85 + Math.random() * 10) // Simulated consistency score
    };
  }, [persistedContent, currentPageCount, contentQuality]);

  const metricCards = [
    {
      id: 'overview',
      title: 'Overview',
      icon: BarChart3,
      color: 'blue',
      metrics: [
        { label: 'Total Words', value: analytics.totalWords.toLocaleString(), trend: '+12%' },
        { label: 'Pages', value: currentPageCount, trend: '+3' },
        { label: 'Reading Time', value: `${analytics.estimatedReadingTime} min`, trend: '+5 min' },
        { label: 'Completion', value: `${analytics.completionRate}%`, trend: '+8%' }
      ]
    },
    {
      id: 'quality',
      title: 'Content Quality',
      icon: Star,
      color: 'green',
      metrics: [
        { label: 'Overall Score', value: `${contentQuality}/100`, trend: '+5' },
        { label: 'Excellent Pages', value: analytics.qualityDistribution.excellent, trend: '+2' },
        { label: 'Good Pages', value: analytics.qualityDistribution.good, trend: '+1' },
        { label: 'Needs Work', value: analytics.qualityDistribution.needsWork, trend: '-1' }
      ]
    },
    {
      id: 'readability',
      title: 'Readability',
      icon: Eye,
      color: 'purple',
      metrics: [
        { label: 'Flesch Score', value: analytics.readabilityScore, trend: '+2' },
        { label: 'Avg Words/Page', value: analytics.averageWordsPerPage, trend: '+15' },
        { label: 'Consistency', value: `${analytics.consistency}%`, trend: '+3%' },
        { label: 'Pacing', value: 'Good', trend: 'Stable' }
      ]
    },
    {
      id: 'engagement',
      title: 'Engagement',
      icon: MessageSquare,
      color: 'orange',
      metrics: [
        { label: 'Hook Score', value: `${analytics.engagementScore}%`, trend: '+7%' },
        { label: 'Dialogue Ratio', value: '23%', trend: '+2%' },
        { label: 'Action Scenes', value: '8', trend: '+1' },
        { label: 'Cliffhangers', value: '5', trend: '+2' }
      ]
    }
  ];

  const recommendations = [
    {
      type: 'success',
      icon: CheckCircle,
      title: 'Strong Character Development',
      description: 'Your character arcs are well-developed and engaging.',
      action: 'Continue this approach'
    },
    {
      type: 'warning',
      icon: AlertTriangle,
      title: 'Pacing Variation Needed',
      description: 'Consider adding more varied scene lengths for better rhythm.',
      action: 'Review chapters 8-12'
    },
    {
      type: 'info',
      icon: Zap,
      title: 'Add More Conflict',
      description: 'Internal conflict could be strengthened in the middle section.',
      action: 'Focus on character struggles'
    },
    {
      type: 'success',
      icon: Target,
      title: 'Great Opening Hook',
      description: 'Your first chapter has strong reader engagement potential.',
      action: 'Maintain this energy'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Book Analytics</h2>
          <p className="text-gray-600">Insights and metrics for your book's content quality and structure</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="all">All Time</option>
          </select>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Generate Report
          </motion.button>
        </div>
      </div>

      {/* Metric Categories */}
      <div className="flex gap-2 mb-6">
        {metricCards.map((category) => {
          const Icon = category.icon;
          const isActive = selectedMetric === category.id;
          
          return (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedMetric(category.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? `bg-${category.color}-100 text-${category.color}-700 border-${category.color}-300`
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              } border`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{category.title}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Selected Metric Details */}
      <motion.div
        key={selectedMetric}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {metricCards.find(card => card.id === selectedMetric)?.metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">{metric.label}</span>
              <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {metric.trend}
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (typeof metric.value === 'number' ? metric.value : 65))}%` }}
              ></div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Content Analysis Chart */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Quality Distribution</h3>
        <div className="space-y-4">
          {Object.entries(analytics.qualityDistribution).map(([quality, count], index) => {
            const colors = {
              excellent: 'bg-green-500',
              good: 'bg-blue-500',
              average: 'bg-yellow-500',
              needsWork: 'bg-red-500'
            };
            
            const percentage = currentPageCount > 0 ? (count / currentPageCount) * 100 : 0;
            
            return (
              <motion.div
                key={quality}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className="flex items-center gap-4"
              >
                <div className="w-24 text-sm font-medium text-gray-700 capitalize">
                  {quality.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-3 relative overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                    className={`h-full ${colors[quality as keyof typeof colors]} rounded-full`}
                  />
                </div>
                <div className="w-16 text-sm font-semibold text-gray-900 text-right">
                  {count} pages
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec, index) => {
            const Icon = rec.icon;
            const typeColors: Record<string, string> = {
              success: 'text-green-600 bg-green-50 border-green-200',
              warning: 'text-yellow-600 bg-yellow-50 border-yellow-200',
              info: 'text-blue-600 bg-blue-50 border-blue-200'
            };
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className={`p-4 rounded-lg border ${typeColors[rec.type]}`}
              >
                <div className="flex items-start gap-3">
                  <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{rec.title}</h4>
                    <p className="text-sm mb-2 opacity-80">{rec.description}</p>
                    <button className="text-xs font-medium hover:underline">
                      {rec.action} →
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
