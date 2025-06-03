import { Genre, Tone, Audience } from '@/lib/store/storyStore';

export interface Character {
  id: string;
  name: string;
  role: string;
  personality: string;
  motivation: string;
  relationships: string[];
}

export interface StoryStructure {
  beginning: string;
  turningPoints: string;
  climax: string;
  resolution: string;
}

export interface WorldBuilding {
  setting: string;
  geography: string;
  rules: string[];
  cultures: string[];
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  order: number;
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
  worldBuilding: WorldBuilding;
  storyBeats: any[];
  structure: StoryStructure;
  chapters: Chapter[];
  cover?: string;
  lastSaved?: Date;
  isDirty?: boolean;
}

export interface StoryFormData {
  idea: string;
  genre: Genre;
  tone: Tone;
  audience: Audience;
}

export interface StoryGenerationState {
  isLoading: boolean;
  progress: number;
  error: string | null;
  isFadingOut: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface StoryValidation {
  isValid: boolean;
  errors: ValidationError[];
} 