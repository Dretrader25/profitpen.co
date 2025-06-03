import { useEffect, useRef } from 'react';
import { Story } from '../types/story';
import { useStoryStore } from '../store/storyStore';

const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

export const useAutoSave = () => {
  const { currentStory, setCurrentStory } = useStoryStore();
  const lastSavedRef = useRef<Date | null>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!currentStory) return;

    // Clear any existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Set up new timeout
    autoSaveTimeoutRef.current = setTimeout(() => {
      const now = new Date();
      setCurrentStory({
        ...currentStory,
        lastSaved: now,
        isDirty: false
      });
      lastSavedRef.current = now;
    }, AUTO_SAVE_INTERVAL);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [currentStory, setCurrentStory]);

  const forceSave = () => {
    if (!currentStory) return;
    
    const now = new Date();
    setCurrentStory({
      ...currentStory,
      lastSaved: now,
      isDirty: false
    });
    lastSavedRef.current = now;
  };

  return {
    lastSaved: lastSavedRef.current,
    forceSave
  };
}; 