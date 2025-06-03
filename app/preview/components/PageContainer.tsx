import { motion } from 'framer-motion';

interface PageContainerProps {
  pageNum: number;
  content: string;
  onRemove: (pageNum: number) => void;
  onRegenerate: (pageNum: number) => void;
  onZoom: (pageNum: number) => void;
  getPreviewClasses: () => string;
}

const pageVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  }
};

export default function PageContainer({ 
  pageNum, 
  content, 
  onRemove, 
  onRegenerate, 
  onZoom, 
  getPreviewClasses 
}: PageContainerProps) {
  return (
    <motion.div 
      key={`page-${pageNum}`}
      className={`preview-container ${getPreviewClasses()} backdrop-blur-xl border-gray-700/30`}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
    >
      <div className="hover-controls">
        <button 
          className="control-button remove"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove(pageNum);
          }}
          title="Remove page"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <button 
          className="control-button regenerate"
          onClick={() => onRegenerate(pageNum)}
          title="Regenerate page"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        <button 
          className="control-button zoom"
          onClick={() => onZoom(pageNum)}
          title="Zoom page"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m4-3H6" />
          </svg>
        </button>
      </div>
      <div dangerouslySetInnerHTML={{ __html: content || '' }} />
    </motion.div>
  );
}
