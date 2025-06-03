'use client';

import { motion } from 'framer-motion';
import { useStoryStore } from '@/lib/store/storyStore';

interface PageComponentProps {
  chapterIndex: number;
}

export default function PageComponent({ chapterIndex }: PageComponentProps) {
  const { currentStory } = useStoryStore();
  const chapter = currentStory?.chapters[chapterIndex];

  if (!chapter) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-4xl mx-auto p-6 bg-gray-800/50 rounded-lg border border-gray-700/30"
    >
      <div className="prose prose-invert max-w-none">
        <h2 className="text-xl font-semibold mb-4">{chapter.title}</h2>
        <div className="whitespace-pre-wrap">{chapter.content}</div>
      </div>
    </motion.div>
  );
} 