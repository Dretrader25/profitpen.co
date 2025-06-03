import { useEffect, useRef, useCallback, useState } from 'react';
import 'quill/dist/quill.snow.css';

interface UseQuillEditorOptions {
  initialContent?: string;
  onContentChange?: (content: string) => void;
  onBlur?: (content: string) => void;
}

export const useQuillEditor = ({ 
  initialContent = '', 
  onContentChange, 
  onBlur 
}: UseQuillEditorOptions) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeQuill = useCallback(async () => {
    if (typeof window === 'undefined' || !editorRef.current || quillRef.current) {
      return;
    }

    try {
      // Clean up any existing toolbars first
      const existingToolbars = document.querySelectorAll('.ql-toolbar');
      existingToolbars.forEach(toolbar => toolbar.remove());

      const QuillModule = await import('quill');
      const Quill = QuillModule.default;

      // Custom toolbar configuration
      const toolbarOptions = [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        ['link'],
        ['clean']
      ];

      // Initialize Quill with custom toolbar
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: toolbarOptions
        },
        formats: ['header', 'bold', 'italic', 'underline', 'list', 'indent', 'link']
      });

      // Set initial content if provided
      if (initialContent) {
        quillRef.current.root.innerHTML = initialContent;
      }

      // Set up event listeners
      quillRef.current.on('text-change', () => {
        if (onContentChange && quillRef.current) {
          const content = quillRef.current.root.innerHTML;
          onContentChange(content);
        }
      });

      quillRef.current.on('selection-change', (range: any) => {
        if (!range && onBlur && quillRef.current) {
          const content = quillRef.current.root.innerHTML;
          onBlur(content);
        }
      });

      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize Quill:', error);
      setIsInitialized(false);
    }
  }, [initialContent, onContentChange, onBlur]);

  const updateContent = useCallback((content: string) => {
    if (quillRef.current && isInitialized) {
      const currentContent = quillRef.current.root.innerHTML;
      if (currentContent !== content) {
        quillRef.current.root.innerHTML = content;
      }
    }
  }, [isInitialized]);

  const getContent = useCallback(() => {
    if (quillRef.current && isInitialized) {
      return quillRef.current.root.innerHTML;
    }
    return '';
  }, [isInitialized]);

  const cleanup = useCallback(() => {
    if (quillRef.current) {
      try {
        quillRef.current.off('text-change');
        quillRef.current.off('selection-change');
        // Only remove the toolbar, not the container
        const toolbar = document.querySelector('.ql-toolbar');
        if (toolbar) {
          toolbar.remove();
        }
        quillRef.current = null;
      } catch (e) {
        console.warn('Error during cleanup:', e);
      }
    }
    setIsInitialized(false);
  }, []);

  useEffect(() => {
    initializeQuill();

    return cleanup;
  }, [initializeQuill, cleanup]);

  // Update content when initialContent changes
  useEffect(() => {
    if (quillRef.current && initialContent !== undefined) {
      quillRef.current.root.innerHTML = initialContent;
    }
  }, [initialContent]);

  return {
    editorRef,
    updateContent,
    getContent,
    isInitialized: isInitialized
  };
};
