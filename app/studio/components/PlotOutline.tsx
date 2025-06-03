'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PlotPoint {
  id: string;
  title: string;
  description: string;
  type: 'setup' | 'conflict' | 'climax' | 'resolution';
  order: number;
  chapter?: number;
  characters: string[];
  status: 'planned' | 'drafted' | 'complete';
}

interface PlotOutlineProps {
  currentStory: any;
  onTabChange: (tab: string) => void;
}

export default function PlotOutline({ currentStory, onTabChange }: PlotOutlineProps) {
  const [plotPoints, setPlotPoints] = useState<PlotPoint[]>([
    {
      id: '1',
      title: 'Opening Scene',
      description: 'Elena discovers the mysterious letter hidden in her grandmother\'s attic, revealing clues about her parents\' disappearance.',
      type: 'setup',
      order: 1,
      chapter: 1,
      characters: ['Elena', 'Grandmother'],
      status: 'complete'
    },
    {
      id: '2',
      title: 'The Mentor Appears',
      description: 'Kai Thompson arrives at Elena\'s door, claiming to have known her parents and offering guidance.',
      type: 'setup',
      order: 2,
      chapter: 2,
      characters: ['Elena', 'Kai'],
      status: 'drafted'
    },
    {
      id: '3',
      title: 'First Challenge',
      description: 'Elena faces her first supernatural encounter while following the clues from the letter.',
      type: 'conflict',
      order: 3,
      chapter: 3,
      characters: ['Elena', 'Kai'],
      status: 'planned'
    },
    {
      id: '4',
      title: 'The Truth Revealed',
      description: 'Elena learns the devastating truth about her family\'s connection to the ancient order.',
      type: 'climax',
      order: 4,
      chapter: 5,
      characters: ['Elena', 'Kai', 'Marcus'],
      status: 'planned'
    }
  ]);

  const [selectedPlotPoint, setSelectedPlotPoint] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPlotPoint, setEditingPlotPoint] = useState<PlotPoint | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewMode, setViewMode] = useState<'timeline' | 'board'>('timeline');

  const handleEditPlotPoint = (plotPoint: PlotPoint) => {
    setEditingPlotPoint({ ...plotPoint });
    setIsEditing(true);
  };

  const handleSavePlotPoint = () => {
    if (editingPlotPoint) {
      setPlotPoints(prev => 
        prev.map(pp => pp.id === editingPlotPoint.id ? editingPlotPoint : pp)
      );
      setIsEditing(false);
      setEditingPlotPoint(null);
    }
  };

  const handleDeletePlotPoint = (plotPointId: string) => {
    if (confirm('Are you sure you want to delete this plot point?')) {
      setPlotPoints(prev => prev.filter(pp => pp.id !== plotPointId));
      if (selectedPlotPoint === plotPointId) {
        setSelectedPlotPoint(null);
      }
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'setup': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'conflict': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'climax': return 'bg-red-100 text-red-800 border-red-200';
      case 'resolution': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return 'bg-green-100 text-green-800';
      case 'drafted': return 'bg-yellow-100 text-yellow-800';
      case 'planned': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'setup': return '🎬';
      case 'conflict': return '⚔️';
      case 'climax': return '🔥';
      case 'resolution': return '🏆';
      default: return '📍';
    }
  };

  const sortedPlotPoints = [...plotPoints].sort((a, b) => a.order - b.order);

  return (
    <div className="h-full flex flex-col">
      {/* Header Controls */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Plot Structure</h2>
            <p className="text-sm text-gray-600">{plotPoints.length} plot points • Story progression</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  viewMode === 'timeline' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Timeline
              </button>
              <button
                onClick={() => setViewMode('board')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  viewMode === 'board' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Board
              </button>
            </div>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Add Plot Point
            </button>
          </div>
        </div>

        {/* Plot Stats */}
        <div className="grid grid-cols-4 gap-4 text-center">
          {['setup', 'conflict', 'climax', 'resolution'].map(type => (
            <div key={type} className={`p-3 rounded-lg border ${getTypeColor(type)}`}>
              <div className="text-lg font-semibold">
                {plotPoints.filter(pp => pp.type === type).length}
              </div>
              <div className="text-xs font-medium capitalize">{type}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Plot Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === 'timeline' ? (
          <div className="h-full overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                
                <div className="space-y-6">
                  {sortedPlotPoints.map((plotPoint, index) => (
                    <motion.div
                      key={plotPoint.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative flex items-start gap-6"
                    >
                      {/* Timeline marker */}
                      <div className={`w-4 h-4 rounded-full border-4 bg-white z-10 ${
                        plotPoint.status === 'complete' ? 'border-green-500' :
                        plotPoint.status === 'drafted' ? 'border-yellow-500' :
                        'border-gray-400'
                      }`}></div>
                      
                      {/* Plot point card */}
                      <div 
                        className={`flex-1 bg-white border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                          selectedPlotPoint === plotPoint.id ? 'ring-2 ring-blue-500 border-blue-200' : 'border-gray-200'
                        }`}
                        onClick={() => setSelectedPlotPoint(plotPoint.id)}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{getTypeIcon(plotPoint.type)}</span>
                            <div>
                              <h3 className="font-medium text-gray-900">{plotPoint.title}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(plotPoint.type)}`}>
                                  {plotPoint.type}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(plotPoint.status)}`}>
                                  {plotPoint.status}
                                </span>
                                {plotPoint.chapter && (
                                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                                    Ch. {plotPoint.chapter}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditPlotPoint(plotPoint);
                              }}
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                            >
                              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePlotPoint(plotPoint.id);
                              }}
                              className="p-1 hover:bg-red-100 rounded transition-colors"
                            >
                              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                          {plotPoint.description}
                        </p>
                        
                        {plotPoint.characters.length > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Characters:</span>
                            <div className="flex flex-wrap gap-1">
                              {plotPoint.characters.map((character, idx) => (
                                <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                  {character}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {['setup', 'conflict', 'climax', 'resolution'].map(type => (
                <div key={type} className="space-y-4">
                  <h3 className={`font-semibold text-sm uppercase tracking-wide p-3 rounded-lg ${getTypeColor(type)}`}>
                    {getTypeIcon(type)} {type}
                  </h3>
                  
                  <div className="space-y-3">
                    {plotPoints
                      .filter(pp => pp.type === type)
                      .sort((a, b) => a.order - b.order)
                      .map((plotPoint, index) => (
                        <motion.div
                          key={plotPoint.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`bg-white border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                            selectedPlotPoint === plotPoint.id ? 'ring-2 ring-blue-500 border-blue-200' : 'border-gray-200'
                          }`}
                          onClick={() => setSelectedPlotPoint(plotPoint.id)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-900 text-sm">{plotPoint.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(plotPoint.status)}`}>
                              {plotPoint.status}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 text-xs mb-3 line-clamp-3">
                            {plotPoint.description}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            {plotPoint.chapter && (
                              <span className="text-xs text-gray-500">Ch. {plotPoint.chapter}</span>
                            )}
                            <div className="flex items-center gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditPlotPoint(plotPoint);
                                }}
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                              >
                                <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {(isEditing || showCreateModal) && (
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
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {isEditing ? 'Edit Plot Point' : 'Create New Plot Point'}
                </h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={editingPlotPoint?.title || ''}
                    onChange={(e) => setEditingPlotPoint(prev => prev ? { ...prev, title: e.target.value } : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Plot point title"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={editingPlotPoint?.type || 'setup'}
                      onChange={(e) => setEditingPlotPoint(prev => prev ? { ...prev, type: e.target.value as any } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="setup">Setup</option>
                      <option value="conflict">Conflict</option>
                      <option value="climax">Climax</option>
                      <option value="resolution">Resolution</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      value={editingPlotPoint?.status || 'planned'}
                      onChange={(e) => setEditingPlotPoint(prev => prev ? { ...prev, status: e.target.value as any } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="planned">Planned</option>
                      <option value="drafted">Drafted</option>
                      <option value="complete">Complete</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Chapter</label>
                    <input
                      type="number"
                      value={editingPlotPoint?.chapter || ''}
                      onChange={(e) => setEditingPlotPoint(prev => prev ? { ...prev, chapter: parseInt(e.target.value) || undefined } : null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editingPlotPoint?.description || ''}
                    onChange={(e) => setEditingPlotPoint(prev => prev ? { ...prev, description: e.target.value } : null)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe what happens in this plot point..."
                  />
                </div>
              </div>
              
              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setShowCreateModal(false);
                    setEditingPlotPoint(null);
                  }}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePlotPoint}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {isEditing ? 'Save Changes' : 'Create Plot Point'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
