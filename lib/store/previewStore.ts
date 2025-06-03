import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PreviewState {
  theme: 'modern' | 'classic' | 'minimal';
  font: 'roboto' | 'merriweather' | 'opensans';
  cover: string;
  pages: string[];
  setTheme: (theme: PreviewState['theme']) => void;
  setFont: (font: PreviewState['font']) => void;
  setCover: (cover: string) => void;
  setPages: (pages: string[]) => void;
}

export const useStore = create<PreviewState>()(
  persist(
    (set) => ({
      theme: 'modern',
      font: 'roboto',
      cover: '',
      pages: [],
      setTheme: (theme) => set({ theme }),
      setFont: (font) => set({ font }),
      setCover: (cover) => set({ cover }),
      setPages: (pages) => set({ pages }),
    }),
    {
      name: 'preview-storage',
    }
  )
); 