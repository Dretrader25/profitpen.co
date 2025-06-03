import { motion, AnimatePresence } from 'framer-motion';
import PageContainer from './PageContainer';

interface PageGridProps {
  visiblePages: number[];
  persistedContent: Record<string, string>;
  onRemovePage: (pageNum: number) => void;
  onRegeneratePage: (pageNum: number) => void;
  onZoomPage: (pageNum: number) => void;
  getPreviewClasses: () => string;
}

export default function PageGrid({
  visiblePages,
  persistedContent,
  onRemovePage,
  onRegeneratePage,
  onZoomPage,
  getPreviewClasses
}: PageGridProps) {
  return (
    <div className="w-full grid grid-cols-3 gap-6 mt-8">
      <AnimatePresence mode="popLayout">
        {visiblePages.map((pageNum) => (
          <PageContainer
            key={`page-${pageNum}`}
            pageNum={pageNum}
            content={persistedContent[`container${pageNum}`]}
            onRemove={onRemovePage}
            onRegenerate={onRegeneratePage}
            onZoom={onZoomPage}
            getPreviewClasses={getPreviewClasses}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
