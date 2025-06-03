import { motion, AnimatePresence } from 'framer-motion';

interface PreviewSettingsProps {
  showTabs: boolean;
  activeDropdown: string | null;
  setActiveDropdown: (dropdown: string | null) => void;
  colors: string;
  layout: string;
  fontSize: string;
  onColorsChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onLayoutChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onFontSizeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const tabVariants = {
  initial: { opacity: 0, y: -20 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
      ease: "easeOut"
    }
  }),
  exit: { opacity: 0, y: -20 }
};

export default function PreviewSettings({
  showTabs,
  activeDropdown,
  setActiveDropdown,
  colors,
  layout,
  fontSize,
  onColorsChange,
  onLayoutChange,
  onFontSizeChange
}: PreviewSettingsProps) {
  return (
    <AnimatePresence>
      {showTabs && (
        <motion.div
          className="flex justify-center gap-4 mt-6"
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {['colors', 'layout', 'fontSize'].map((tab, i) => (
            <motion.div
              key={tab}
              className="relative"
              custom={i}
              variants={tabVariants}
            >
              <button 
                onClick={() => setActiveDropdown(activeDropdown === tab ? null : tab)}
                className="px-4 py-1.5 bg-gradient-to-br from-gray-800/50 to-gray-900/50 text-white rounded-lg text-sm font-medium hover:from-blue-600/80 hover:to-blue-700/80 transition-all duration-200 backdrop-blur-sm border border-gray-700/30"
              >
                {tab === 'fontSize' ? 'Font Size' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
              {activeDropdown === tab && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-gradient-to-br from-gray-800/95 to-gray-900/95 rounded-xl shadow-xl border border-gray-700/30 z-10 backdrop-blur-xl"
                >
                  <select
                    className="w-full px-4 py-2.5 bg-transparent text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    value={tab === 'colors' ? colors : tab === 'layout' ? layout : fontSize}
                    onChange={(e) => {
                      if (tab === 'colors') onColorsChange(e);
                      else if (tab === 'layout') onLayoutChange(e);
                      else onFontSizeChange(e);
                    }}
                  >
                    {tab === 'colors' && (
                      <>
                        <option value="default">Default</option>
                        <option value="sepia">Sepia</option>
                        <option value="dark">Dark</option>
                      </>
                    )}
                    {tab === 'layout' && (
                      <>
                        <option value="standard">Standard</option>
                        <option value="centered">Centered</option>
                        <option value="justified">Justified</option>
                      </>
                    )}
                    {tab === 'fontSize' && (
                      <>
                        <option value="small">Small (10px)</option>
                        <option value="medium">Medium (14px)</option>
                        <option value="large">Large (18px)</option>
                      </>
                    )}
                  </select>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
