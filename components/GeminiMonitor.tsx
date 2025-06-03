'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GeminiCall {
  id: string;
  timestamp: Date;
  function: string;
  status: 'pending' | 'success' | 'error';
  inputTokens: number;
  outputTokens: number;
  cost: number;
  duration?: number;
  error?: string;
}

interface GeminiMonitorState {
  calls: GeminiCall[];
  totalCost: number;
  totalCalls: number;
  isMinimized: boolean;
}

// Gemini 2.0 Flash pricing (approximate)
const PRICING = {
  INPUT_TOKEN_COST: 0.000000075, // $0.075 per 1M tokens
  OUTPUT_TOKEN_COST: 0.0000003,  // $0.30 per 1M tokens
};

export default function GeminiMonitor() {
  const [state, setState] = useState<GeminiMonitorState>({
    calls: [],
    totalCost: 0,
    totalCalls: 0,
    isMinimized: false,
  });

  // Estimate token count (rough approximation: 1 token ≈ 4 characters)
  const estimateTokens = (text: string): number => {
    return Math.ceil(text.length / 4);
  };

  // Calculate cost based on tokens
  const calculateCost = (inputTokens: number, outputTokens: number): number => {
    return (inputTokens * PRICING.INPUT_TOKEN_COST) + (outputTokens * PRICING.OUTPUT_TOKEN_COST);
  };

  // Mock function to simulate intercepting Gemini calls
  useEffect(() => {
    // Override the global fetch to intercept Gemini API calls
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      const [url, options] = args;
      
      // Check if this is a Gemini API call
      if (typeof url === 'string' && url.includes('generativelanguage.googleapis.com')) {
        const callId = Date.now().toString();
        const startTime = Date.now();
        
        // Extract function name from the request
        let functionName = 'generateContent';
        try {
          const requestBody = options?.body ? JSON.parse(options.body as string) : {};
          const prompt = requestBody?.contents?.[0]?.parts?.[0]?.text || '';
          
          // Try to determine function type from prompt
          if (prompt.includes('story concept')) functionName = 'generateStoryConcept';
          else if (prompt.includes('Chapter')) functionName = 'generateChapter';
          else if (prompt.includes('character development')) functionName = 'generateCharacter';
          else if (prompt.includes('world-building')) functionName = 'generateWorldBuilding';
          else if (prompt.includes('story structure')) functionName = 'generateStoryStructure';
          else if (prompt.includes('complete ebook')) functionName = 'generateCompleteEbook';
          else if (prompt.includes('enhance')) functionName = 'enhanceContent';
          else if (prompt.includes('quality')) functionName = 'validateQuality';
          
          const inputTokens = estimateTokens(prompt);
          
          // Add pending call
          setState(prev => ({
            ...prev,
            calls: [{
              id: callId,
              timestamp: new Date(),
              function: functionName,
              status: 'pending',
              inputTokens,
              outputTokens: 0,
              cost: 0,
            }, ...prev.calls.slice(0, 9)], // Keep only last 10 calls
            totalCalls: prev.totalCalls + 1,
          }));
          
        } catch (error) {
          console.error('Error parsing request:', error);
        }
        
        try {
          const response = await originalFetch(...args);
          const endTime = Date.now();
          const duration = endTime - startTime;
          
          // Clone response to read it without consuming the stream
          const responseClone = response.clone();
          const responseText = await responseClone.text();
          const outputTokens = estimateTokens(responseText);
          
          setState(prev => {
            const updatedCalls = prev.calls.map(call => 
              call.id === callId 
                ? {
                    ...call,
                    status: response.ok ? 'success' as const : 'error' as const,
                    outputTokens,
                    cost: calculateCost(call.inputTokens, outputTokens),
                    duration,
                    error: response.ok ? undefined : `HTTP ${response.status}`,
                  }
                : call
            );
            
            const newTotalCost = updatedCalls.reduce((sum, call) => sum + call.cost, 0);
            
            return {
              ...prev,
              calls: updatedCalls,
              totalCost: newTotalCost,
            };
          });
          
          return response;
        } catch (error) {
          const endTime = Date.now();
          const duration = endTime - startTime;
          
          setState(prev => ({
            ...prev,
            calls: prev.calls.map(call => 
              call.id === callId 
                ? {
                    ...call,
                    status: 'error',
                    duration,
                    error: error instanceof Error ? error.message : 'Network error',
                  }
                : call
            ),
          }));
          
          throw error;
        }
      }
      
      return originalFetch(...args);
    };
    
    // Cleanup function
    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  const clearCalls = () => {
    setState(prev => ({
      ...prev,
      calls: [],
      totalCost: 0,
      totalCalls: 0,
    }));
  };

  const toggleMinimize = () => {
    setState(prev => ({
      ...prev,
      isMinimized: !prev.isMinimized,
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-500';
      case 'success': return 'text-green-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '⚪';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-semibold text-gray-900 dark:text-gray-100">Gemini Monitor</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={clearCalls}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-1"
            title="Clear calls"
          >
            🗑️
          </button>
          <button
            onClick={toggleMinimize}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-1"
            title={state.isMinimized ? "Expand" : "Minimize"}
          >
            {state.isMinimized ? '⬆️' : '⬇️'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="p-3 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-2 text-center">
          <div>
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {state.totalCalls}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Total Calls</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600 dark:text-green-400">
              ${state.totalCost.toFixed(6)}
            </div>
            <div className="text-gray-600 dark:text-gray-400">Est. Cost</div>
          </div>
        </div>
      </div>

      {/* Call List */}
      <AnimatePresence>
        {!state.isMinimized && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="max-h-96 overflow-y-auto"
          >
            {state.calls.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No API calls yet...
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {state.calls.map((call) => (
                  <motion.div
                    key={call.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-2 border border-gray-200 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-1">
                        <span>{getStatusIcon(call.status)}</span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {call.function}
                        </span>
                      </div>
                      <span className={`text-xs ${getStatusColor(call.status)}`}>
                        {call.status}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                      <span>
                        {call.timestamp.toLocaleTimeString()}
                      </span>
                      {call.duration && (
                        <span>{call.duration}ms</span>
                      )}
                    </div>
                    
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-blue-600 dark:text-blue-400">
                        In: {call.inputTokens.toLocaleString()}
                      </span>
                      <span className="text-green-600 dark:text-green-400">
                        Out: {call.outputTokens.toLocaleString()}
                      </span>
                      <span className="text-purple-600 dark:text-purple-400">
                        ${call.cost.toFixed(6)}
                      </span>
                    </div>
                    
                    {call.error && (
                      <div className="text-xs text-red-500 mt-1 truncate">
                        Error: {call.error}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live indicator */}
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse">
        <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75"></div>
      </div>
    </div>
  );
}
