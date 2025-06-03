import { create } from 'zustand';

interface AppState {
  theme: 'light' | 'dark';
  currentPage: string;
  isEditorOpen: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  setCurrentPage: (page: string) => void;
  toggleEditor: () => void;
}

export const useStore = create<AppState>((set) => ({
  theme: 'light',
  currentPage: 'home',
  isEditorOpen: false,
  setTheme: (theme) => set({ theme }),
  setCurrentPage: (page) => set({ currentPage: page }),
  toggleEditor: () => set((state) => ({ isEditorOpen: !state.isEditorOpen })),
})); 