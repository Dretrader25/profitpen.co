import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Genre = 'Fantasy' | 'Sci-Fi' | 'Mystery' | 'Romance' | 'Horror' | 'AI' | 'Adventure' | 'Drama' | 'Dystopian' | 'Thriller';
export type Tone = 'Whimsical' | 'Dark' | 'Humorous';
export type Audience = 'Children' | 'YA' | 'Adult';

interface Character {
  id: string;
  name: string;
  role: string;
  personality: string;
  motivation: string;
  relationships: any[];
}

interface StoryStructure {
  beginning: string;
  turningPoints: string;
  climax: string;
  resolution: string;
}

export interface Story {
  id: string;
  title: string;
  genre: Genre;
  tone: Tone;
  audience: Audience;
  premise: string;
  shortDraft: string;
  themes: string[];
  characters: Character[];
  worldBuilding: string;
  storyBeats: any[];
  structure: StoryStructure;
  chapters: any[];
  cover?: string;
}

interface StoryStore {
  currentStory: Story | null;
  activeTab: string;
  setCurrentStory: (story: Story | null) => void;
  setActiveTab: (tab: string) => void;
  updateStoryCover: (coverUrl: string) => void;
  updateStoryChapters: (chapters: any[]) => void;
}

export const useStoryStore = create<StoryStore>()(
  persist(
    (set) => ({
      currentStory: null,
      activeTab: 'overview',
      setCurrentStory: (story) => set({ currentStory: story }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      updateStoryCover: (coverUrl) => set((state) => ({
        currentStory: state.currentStory ? {
          ...state.currentStory,
          cover: coverUrl
        } : null
      })),
      updateStoryChapters: (chapters) => set((state) => ({
        currentStory: state.currentStory ? {
          ...state.currentStory,
          chapters
        } : null
      })),
    }),
    {
      name: 'story-storage',
      partialize: (state) => ({ currentStory: state.currentStory }),
    }
  )
); 