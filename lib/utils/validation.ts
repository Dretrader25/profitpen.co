import { StoryFormData, ValidationError, StoryValidation } from '../types/story';

export const validateStoryForm = (formData: StoryFormData): StoryValidation => {
  const errors: ValidationError[] = [];

  // Validate idea
  if (!formData.idea || formData.idea.trim().length === 0) {
    errors.push({
      field: 'idea',
      message: 'Please enter a story idea'
    });
  } else if (formData.idea.trim().length < 10) {
    errors.push({
      field: 'idea',
      message: 'Story idea should be at least 10 characters long'
    });
  }

  // Validate genre
  if (!formData.genre) {
    errors.push({
      field: 'genre',
      message: 'Please select a genre'
    });
  }

  // Validate tone
  if (!formData.tone) {
    errors.push({
      field: 'tone',
      message: 'Please select a tone'
    });
  }

  // Validate audience
  if (!formData.audience) {
    errors.push({
      field: 'audience',
      message: 'Please select a target audience'
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}; 