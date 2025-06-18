import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useRef, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import styles from './ReadingModal.module.css';

interface ReadingModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: Record<string, string>;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
  onSave?: (content: string) => void;
  initialPage?: number;
}

interface PageProps {
  number: number;
  content: string;
  fontSize: number;
  lineHeight: number;
}

const Cover = React.forwardRef((props: any, ref: any) => {
  return (
    <div className={styles.cover} ref={ref}>
      <div>
        <h1>Detailed Report View</h1> {/* Changed */}
        <p>Click to view details</p> {/* Changed */}
      </div>
    </div>
  );
});

const Page = React.forwardRef((props: PageProps, ref: any) => {
  return (
    <div className={styles.page} ref={ref}>
      <div 
        className=" h-full"
        style={{ 
          fontSize: `${props.fontSize}px`,
          lineHeight: props.lineHeight
        }}
      >
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: props.content }}
        />
        <div className={styles['page-number']}>
          {props.number}
        </div>
      </div>
    </div>
  );
});

export default function ReadingModal({
  isOpen,
  onClose,
  content,
  onNext,
  onPrevious,
  hasNext = false,
  hasPrevious = false,
  onSave,
  initialPage
}: ReadingModalProps) {
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [maxWidth, setMaxWidth] = useState(800);
  const bookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [initialPageSet, setInitialPageSet] = useState(false);

  // Convert content object to array of pages
  const pages = Object.entries(content)
    .sort(([keyA], [keyB]) => {
      const numA = parseInt(keyA.replace('container', ''));
      const numB = parseInt(keyB.replace('container', ''));
      return numA - numB;
    })
    .map(([_, content], index) => {
      // Make the first content page empty
      if (index === 0) return '';
      return content;
    });

  // Handle page flip
  const handlePageFlip = (e: any) => {
    setCurrentPage(e.data);
  };

  // Handle next/previous navigation
  useEffect(() => {
    if (bookRef.current && bookRef.current.pageFlip) {
      const timeoutId = setTimeout(() => {
        if (onNext && hasNext && currentPage === pages.length - 1) {
          onNext();
        } else if (onPrevious && hasPrevious && currentPage === 0) {
          onPrevious();
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [currentPage, onNext, onPrevious, hasNext, hasPrevious, pages.length]);

  // Handle initial page when modal opens
  useEffect(() => {
    if (isOpen && bookRef.current && bookRef.current.pageFlip && !initialPageSet) {
      const timeoutId = setTimeout(() => {
        if (typeof initialPage === 'number' && initialPage >= 0) {
          bookRef.current.pageFlip().flip(initialPage);
          setInitialPageSet(true);
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [isOpen, initialPage, initialPageSet]);

  // Reset initialPageSet when modal closes
  useEffect(() => {
    if (!isOpen) {
      setInitialPageSet(false);
    }
  }, [isOpen]);

  const modalVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    exit: { 
      opacity: 0, 
      y: 20,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 1, 1]
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants}
        >
          <div className="relative w-full h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-white/95 backdrop-blur-sm border-b border-gray-200">
              <div className="flex items-center gap-4">
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFontSize(prev => Math.max(12, prev - 1))}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="text-sm font-medium">{fontSize}px</span>
                  <button
                    onClick={() => setFontSize(prev => Math.min(24, prev + 1))}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLineHeight(prev => Math.max(1.2, prev - 0.1))}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h10M7 16h10" />
                    </svg>
                  </button>
                  <span className="text-sm font-medium">{lineHeight.toFixed(1)}</span>
                  <button
                    onClick={() => setLineHeight(prev => Math.min(2, prev + 0.1))}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h10M7 16h10" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMaxWidth(prev => Math.max(600, prev - 100))}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <span className="text-sm font-medium">{maxWidth}px</span>
                  <button
                    onClick={() => setMaxWidth(prev => Math.min(1200, prev + 100))}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {hasPrevious && (
                  <button
                    onClick={onPrevious}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                {hasNext && (
                  <button
                    onClick={onNext}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Book Content */}
            <div className="flex-1 overflow-hidden bg-gray-100 flex items-end justify-center ">
              <div className={styles['book-container']} style={{ width: '1200px', height: '950px', paddingTop: '50px' }}>
                <HTMLFlipBook
                  width={700}
                  height={950}
                  size="stretch"
                  minWidth={600}
                  maxWidth={700}
                  minHeight={700}
                  maxHeight={950}
                  maxShadowOpacity={0.5}
                  showCover={true}
                  mobileScrollSupport={true}
                  ref={bookRef}
                  className="book"
                  style={{ margin: '0 auto' }}
                  startPage={0}
                  drawShadow={true}
                  flippingTime={1000}
                  usePortrait={true}
                  startZIndex={0}
                  autoSize={true}
                  clickEventForward={false}
                  useMouseEvents={true}
                  swipeDistance={0}
                  showPageCorners={true}
                  disableFlipByClick={false}
                  onFlip={handlePageFlip}
                >
                  <Cover />
                  {pages.map((pageContent, index) => (
                    <Page
                      key={index}
                      number={index + 1}
                      content={pageContent}
                      fontSize={fontSize}
                      lineHeight={lineHeight}
                    />
                  ))}
                </HTMLFlipBook>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 