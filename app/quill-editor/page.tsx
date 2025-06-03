'use client';

import { useEffect, useRef } from 'react';
import 'quill/dist/quill.snow.css';

const QuillEditor = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && editorRef.current) {
      import('quill').then((QuillModule) => {
        const Quill = QuillModule.default;
        if (editorRef.current) {
          quillRef.current = new Quill(editorRef.current, {
            theme: 'snow',
            modules: {
              toolbar: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['link', 'image'],
                ['clean']
              ]
            }
          });
        }
      });
    }

    return () => {
      if (quillRef.current) {
        quillRef.current = null;
      }
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div ref={editorRef} className="h-[400px]">
          <h2>Demo Content</h2>
          <p>Preset build with <code>snow</code> theme, and some common formats.</p>
        </div>
      </div>
    </div>
  );
};

export default QuillEditor;
