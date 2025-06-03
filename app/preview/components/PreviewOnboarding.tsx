'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  targetSelector?: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: string;
  highlight?: boolean;
}

const onboardingSteps: OnboardingStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Your Book Preview! 📚',
    description: 'Your personalized book has been generated. Let\'s explore what you can do here.',
    position: 'center'
  },
  {
    id: 'pages',
    title: 'Your Book Pages',
    description: 'Each page shows your generated content. Quality indicators help you see what\'s ready to publish.',
    position: 'center'
  },
  {
    id: 'quality',
    title: 'Quality Indicators',
    description: 'Green badges mean excellent content, blue means good, yellow means draft quality that might need regeneration.',
    position: 'top'
  },
  {
    id: 'hover-controls',
    title: 'Page Controls',
    description: 'Hover over any page to remove it, regenerate content, or zoom in for a closer look.',
    action: 'Try hovering over a page now',
    position: 'bottom'
  },
  {
    id: 'view-modes',
    title: 'View Modes',
    description: 'Switch between 3-column and 4-column layouts to find your preferred viewing style.',
    position: 'bottom'
  },
  {
    id: 'settings',
    title: 'Customize Appearance',
    description: 'Click Settings to change colors, layout, and font size to match your preferences.',
    position: 'bottom'
  },
  {
    id: 'generate-more',
    title: 'Expand Your Book',
    description: 'Generate additional pages to complete your book. Free users get up to 21 pages.',
    position: 'top'
  },
  {
    id: 'export',
    title: 'Export Your Book',
    description: 'When you\'re happy with your content, export to PDF, EPUB, or even audio format!',
    position: 'bottom'
  }
];

interface PreviewOnboardingProps {
  onComplete: () => void;
}

export default function PreviewOnboarding({ onComplete }: PreviewOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // Check if user has seen onboarding before
    const hasSeenOnboarding = localStorage.getItem('preview-onboarding-completed');
    if (!hasSeenOnboarding) {
      setIsVisible(true);
    }
  }, []);

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipOnboarding = () => {
    completeOnboarding();
  };

  const startOnboarding = () => {
    setHasStarted(true);
    setCurrentStep(0);
  };

  const completeOnboarding = () => {
    localStorage.setItem('preview-onboarding-completed', 'true');
    setIsVisible(false);
    onComplete();
  };

  const currentStepData = onboardingSteps[currentStep];
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
      >
        {/* Main Onboarding Modal */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700/50 p-8 max-w-md w-full backdrop-blur-xl shadow-2xl"
          >
            {!hasStarted ? (
              // Welcome Screen
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl">📚</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  Welcome to Your Book Preview!
                </h2>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Your book has been generated! Take a quick tour to discover all the powerful features available to perfect your content.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={skipOnboarding}
                    className="flex-1 px-4 py-3 bg-gray-700/50 text-gray-300 rounded-xl hover:bg-gray-600/50 transition-colors"
                  >
                    Skip Tour
                  </button>
                  <button
                    onClick={startOnboarding}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors font-medium"
                  >
                    Start Tour
                  </button>
                </div>
              </div>
            ) : (
              // Tour Steps
              <div>
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">
                      Step {currentStep + 1} of {onboardingSteps.length}
                    </span>
                    <button
                      onClick={skipOnboarding}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      Skip
                    </button>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>

                {/* Step Content */}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-white mb-3">
                    {currentStepData.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {currentStepData.description}
                  </p>
                  {currentStepData.action && (
                    <p className="text-blue-400 mt-3 font-medium">
                      {currentStepData.action}
                    </p>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex gap-3">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="px-4 py-3 bg-gray-700/50 text-gray-300 rounded-xl hover:bg-gray-600/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={nextStep}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors font-medium"
                  >
                    {currentStep === onboardingSteps.length - 1 ? 'Finish' : 'Next'}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Highlight Overlays for Specific Elements */}
        {hasStarted && currentStepData.highlight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* This would highlight specific UI elements based on the step */}
            {currentStepData.id === 'hover-controls' && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="w-64 h-96 border-4 border-blue-500 rounded-xl shadow-lg shadow-blue-500/20"
                />
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('preview-onboarding-completed');
    if (!hasSeenOnboarding) {
      // Small delay to let the page load first
      setTimeout(() => {
        setShowOnboarding(true);
      }, 1000);
    }
  }, []);

  const resetOnboarding = () => {
    localStorage.removeItem('preview-onboarding-completed');
    setShowOnboarding(true);
  };

  const completeOnboarding = () => {
    setShowOnboarding(false);
  };

  return {
    showOnboarding,
    resetOnboarding,
    completeOnboarding
  };
}
