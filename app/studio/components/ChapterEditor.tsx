'use client';

import { useQuillEditor } from '@/lib/hooks/useQuillEditor';

interface Chapter {
  id: string;
  title: string;
  content: string;
  pageNumbers: number[];
  wordCount: number;
  status: 'draft' | 'review' | 'final';
  quality: number;
}

interface ChapterEditorProps {
  chapter: Chapter;
  onSave: (content: string) => void;
  isSaving: boolean;
}

export default function ChapterEditor({ chapter, onSave, isSaving }: ChapterEditorProps) {
  // Extract the chapter text content from the HTML structure
  const extractChapterContent = (html: string): string => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Get all chapter-text paragraphs
    const paragraphs = tempDiv.querySelectorAll('.chapter-text');
    if (paragraphs.length > 0) {
      return Array.from(paragraphs)
        .map(p => p.innerHTML)
        .join('\n\n');
    }
    
    // Fallback: if no chapter-text paragraphs found, return the whole content
    return html;
  };

  const { editorRef, getContent, isInitialized } = useQuillEditor({
    initialContent: extractChapterContent(chapter.content),
    onBlur: (content: string) => {
      onSave(content);
    },
    onContentChange: (content: string) => {
      // Optional: Handle real-time changes
    }
  });

  return (
    <div className="prose max-w-none">
      <div className="bg-white border border-gray-200 rounded-lg p-8">
        <div className="relative">
          {/* Quill Editor with built-in toolbar */}
          <div
            ref={editorRef}
            id={`quill-editor-${chapter.id}`} // Unique ID for each editor
            className="text-gray-800 leading-relaxed text-base font-normal min-h-[500px] prose max-w-none"
          />
          
          {/* Loading state while Quill initializes */}
          {!isInitialized && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-4 h-4 border border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                Loading editor...
              </div>
            </div>
          )}
          
          {/* Saving indicator */}
          {isSaving && (
            <div className="absolute top-4 right-4 flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm border">
              <div className="w-4 h-4 border border-gray-500 border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
