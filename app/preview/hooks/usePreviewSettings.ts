import { useState } from 'react';

export function usePreviewSettings() {
  const [colors, setColors] = useState('default');
  const [layout, setLayout] = useState('standard');
  const [fontSize, setFontSize] = useState('medium');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showTabs, setShowTabs] = useState(false);

  // Add new styles for book formatting
  const getPreviewClasses = () => {
    const classes = [' border p-4 mt-6 shadow-lg'];
    
    // Color classes
    switch (colors) {
      case 'default':
        classes.push('bg-white text-gray-800');
        break;
      case 'sepia':
        classes.push('bg-amber-50 text-gray-900');
        break;
      case 'dark':
        classes.push('bg-gray-900 text-gray-100');
        break;
    }

    // Layout classes
    switch (layout) {
      case 'standard':
        classes.push('text-left');
        break;
      case 'centered':
        classes.push('text-center');
        break;
      case 'justified':
        classes.push('text-justify');
        break;
    }

    return classes.join(' ');
  };

  const handleColorsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setColors(e.target.value);
    setActiveDropdown(null);
  };

  const handleLayoutChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLayout(e.target.value);
    setActiveDropdown(null);
  };

  const handleFontSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFontSize(e.target.value);
    setActiveDropdown(null);
  };

  return {
    colors,
    layout,
    fontSize,
    activeDropdown,
    showTabs,
    setActiveDropdown,
    setShowTabs,
    getPreviewClasses,
    handleColorsChange,
    handleLayoutChange,
    handleFontSizeChange
  };
}
