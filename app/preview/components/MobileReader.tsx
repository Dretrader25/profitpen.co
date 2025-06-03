'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useStoryStore } from '@/lib/store/storyStore';

export default function MobileReader() {
  const { currentStory } = useStoryStore();
  const [currentChapter, setCurrentChapter] = useState(0);

  return (
    <div className="w-full h-full bg-gray-900 text-white p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">{currentStory?.title}</h1>
        <div className="prose prose-invert">
          {currentStory?.chapters[currentChapter]?.content}
        </div>
      </div>
    </div>
  );
} 