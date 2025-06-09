import { create } from 'zustand';
import { supabase } from '../supabaseClient'; // Import Supabase client

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
  error: string | null; // New error state
  setCurrentStory: (story: Story | null) => Promise<boolean>;
  setActiveTab: (tab: string) => void;
  updateStoryCover: (coverUrl: string) => Promise<boolean>;
  updateStoryChapters: (chapters: any[]) => Promise<boolean>;
  fetchStory: (storyId: string) => Promise<boolean>;
  clearError: () => void; // New action to clear error
}

export const useStoryStore = create<StoryStore>()(
  (set, get) => ({
    currentStory: null,
    activeTab: 'overview',
    error: null,
    setCurrentStory: async (story) => {
      set({ error: null }); // Clear previous errors
      if (story === null) {
        set({ currentStory: null });
        return true;
      }
      try {
        const { data, error: supabaseError } = await supabase
          .from('stories')
          .upsert(story, { onConflict: 'id' })
          .select()
          .single(); // Assuming upsert of a single story

        if (supabaseError) {
          throw supabaseError;
        }
        if (data) {
          set({ currentStory: data as Story });
          return true;
        }
        return false; // Should not happen if no error and no data
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An unknown error occurred';
        console.error('Error upserting story:', message, err);
        set({ error: `Failed to save story: ${message}` });
        return false;
      }
    },
    setActiveTab: (tab) => set({ activeTab: tab, error: null }), // Clear error on tab change
    updateStoryCover: async (coverUrl) => {
      set({ error: null });
      const currentStory = get().currentStory;
      if (!currentStory) {
        set({ error: 'No current story to update.' });
        return false;
      }
      if (!currentStory.id) {
        set({ error: 'Current story has no ID.' });
        return false;
      }

      try {
        const { data, error: supabaseError } = await supabase
          .from('stories')
          .update({ cover: coverUrl })
          .eq('id', currentStory.id)
          .select()
          .single();

        if (supabaseError) {
          throw supabaseError;
        }
        if (data) {
          set({ currentStory: data as Story });
          return true;
        }
        return false;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An unknown error occurred';
        console.error('Error updating story cover:', message, err);
        set({ error: `Failed to update cover: ${message}` });
        return false;
      }
    },
    updateStoryChapters: async (chapters) => {
      set({ error: null });
      const currentStory = get().currentStory;
      if (!currentStory) {
        set({ error: 'No current story to update.' });
        return false;
      }
       if (!currentStory.id) {
        set({ error: 'Current story has no ID.' });
        return false;
      }

      try {
        const { data, error: supabaseError } = await supabase
          .from('stories')
          .update({ chapters: chapters })
          .eq('id', currentStory.id)
          .select()
          .single();

        if (supabaseError) {
          throw supabaseError;
        }
        if (data) {
          set({ currentStory: data as Story });
          return true;
        }
        return false;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An unknown error occurred';
        console.error('Error updating story chapters:', message, err);
        set({ error: `Failed to update chapters: ${message}` });
        return false;
      }
    },
    fetchStory: async (storyId: string) => {
      set({ error: null, currentStory: null }); // Clear previous story and error
      try {
        const { data, error: supabaseError } = await supabase
          .from('stories')
          .select('*')
          .eq('id', storyId)
          .single();

        if (supabaseError) {
          if (supabaseError.code === 'PGRST116') { // PostgREST error code for "Not Found"
            set({ error: 'Story not found.' });
            return false;
          }
          throw supabaseError;
        }
        if (data) {
          // Instead of calling get().setCurrentStory, directly set here to avoid loop and manage return
          set({ currentStory: data as Story });
          return true;
        }
        return false;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An unknown error occurred';
        console.error('Error fetching story:', message, err);
        set({ error: `Failed to fetch story: ${message}` });
        return false;
      }
    },
    clearError: () => set({ error: null }),
  })
); 