'use client';

interface TextPreviewProps {
  content: string;
  className?: string;
}

export default function TextPreview({ content, className = '' }: TextPreviewProps) {
  return (
    <div className={`prose max-w-none ${className}`}>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
} 