'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Download, 
  FileText, 
  Tablet, 
  Smartphone, 
  Monitor, 
  Share2, 
  Globe, 
  BookOpen,
  Settings,
  Check,
  ExternalLink,
  Upload,
  Package,
  Zap,
  Crown
} from 'lucide-react';

interface PublishingToolsProps {
  currentStory: any;
  persistedContent: any[];
  currentPageCount: number;
  onTabChange: (tab: string) => void;
}

export default function PublishingTools({
  currentStory,
  persistedContent,
  currentPageCount,
  onTabChange
}: PublishingToolsProps) {
  const router = useRouter();
  const [exportFormat, setExportFormat] = useState<'pdf' | 'epub' | 'docx' | 'txt'>('pdf');
  const [publishingPlatform, setPublishingPlatform] = useState<'kindle' | 'apple' | 'google' | 'custom'>('kindle');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const exportFormats = [
    {
      id: 'pdf',
      name: 'PDF',
      description: 'Perfect for printing and sharing',
      icon: FileText,
      fileSize: '2.1 MB',
      compatibility: 'Universal'
    },
    {
      id: 'epub',
      name: 'EPUB',
      description: 'Standard e-book format',
      icon: BookOpen,
      fileSize: '1.8 MB',
      compatibility: 'E-readers, tablets'
    },
    {
      id: 'docx',
      name: 'Word Document',
      description: 'For further editing',
      icon: FileText,
      fileSize: '1.2 MB',
      compatibility: 'Microsoft Word'
    },
    {
      id: 'txt',
      name: 'Plain Text',
      description: 'Simple text format',
      icon: FileText,
      fileSize: '0.3 MB',
      compatibility: 'Any device'
    }
  ];

  const publishingPlatforms = [
    {
      id: 'kindle',
      name: 'Kindle Direct Publishing',
      description: 'Amazon\'s self-publishing platform',
      icon: BookOpen,
      requirements: ['EPUB or PDF', 'Cover image', 'Metadata'],
      marketShare: '70%'
    },
    {
      id: 'apple',
      name: 'Apple Books',
      description: 'Apple\'s book publishing platform',
      icon: Tablet,
      requirements: ['EPUB', 'Cover image', 'ISBN'],
      marketShare: '15%'
    },
    {
      id: 'google',
      name: 'Google Play Books',
      description: 'Google\'s publishing platform',
      icon: Globe,
      requirements: ['PDF or EPUB', 'Cover image'],
      marketShare: '10%'
    },
    {
      id: 'custom',
      name: 'Custom Website',
      description: 'Direct sales from your website',
      icon: Monitor,
      requirements: ['Any format', 'Payment system'],
      marketShare: '5%'
    }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    // Simulate export progress
    const steps = ['Formatting content', 'Generating layout', 'Adding metadata', 'Creating file', 'Finalizing'];
    
    for (let i = 0; i <= steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setExportProgress((i / steps.length) * 100);
    }

    setIsExporting(false);
    
    // Trigger download (simulated)
    const link = document.createElement('a');
    link.href = '#'; // In real implementation, this would be the file URL
    link.download = `${currentStory?.title || 'book'}.${exportFormat}`;
    link.click();
  };

  const handlePublish = (platform: string) => {
    // In real implementation, this would integrate with publishing APIs
    console.log(`Publishing to ${platform}`);
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Reporting & Export Tools</h2> {/* Changed */}
          <p className="text-gray-600">Export your leads and property data and manage integrations</p> {/* Changed */}
        </div>
        
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            <Settings className="w-4 h-4 inline mr-2" />
            Advanced Settings
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/preview')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Preview Report {/* Changed */}
          </motion.button>
        </div>
      </div>

      {/* Data Status */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Data Ready for Export</h3> {/* Changed */}
              <p className="text-gray-600">
                Your current list has {currentPageCount} records and is ready for export {/* Changed */}
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{currentPageCount}</div>
            <div className="text-sm text-gray-600">Total Records</div> {/* Changed */}
          </div>
        </div>
      </div>

      {/* Export Formats */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Export Formats</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Updated export formats for real estate */}
          {[
            { id: 'csv', name: 'CSV', description: 'Comma-separated values for spreadsheets', icon: FileText, fileSize: '0.5 MB', compatibility: 'Excel, Google Sheets' },
            { id: 'pdf', name: 'PDF Report', description: 'Formatted PDF property reports', icon: FileText, fileSize: '1.5 MB', compatibility: 'Universal' },
            { id: 'xlsx', name: 'Excel XLSX', description: 'Native Excel format for analysis', icon: FileText, fileSize: '0.8 MB', compatibility: 'Microsoft Excel' },
            { id: 'json', name: 'JSON', description: 'For developers and integrations', icon: FileText, fileSize: '0.4 MB', compatibility: 'APIs, Dev Tools' }
          ].map((format) => {
            const Icon = format.icon;
            const isSelected = exportFormat === format.id;
            
            return (
              <motion.div
                key={format.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setExportFormat(format.id as any)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Icon className={`w-6 h-6 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                  <span className={`font-semibold ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                    {format.name}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{format.description}</p>
                
                <div className="space-y-1 text-xs text-gray-500">
                  <div>Est. Size: {format.fileSize}</div> {/* Changed */}
                  <div>Use with: {format.compatibility}</div> {/* Changed */}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Export Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleExport}
          disabled={isExporting}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
        >
          {isExporting ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Exporting... {Math.round(exportProgress)}%</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              <span>Export as {exportFormat.toUpperCase()}</span>
            </div>
          )}
        </motion.button>

        {isExporting && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${exportProgress}%` }}
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            />
          </div>
        )}
      </div>

      {/* CRM / Marketing Integrations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">CRM / Marketing Integrations</h3> {/* Changed */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Crown className="w-4 h-4 text-yellow-500" />
            Pro features available
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Example Integrations - update as needed */}
          {[
            { id: 'salesforce', name: 'Salesforce', description: 'Sync leads with Salesforce CRM', icon: Upload, requirements: ['API Key', 'Object Mapping'], marketShare: 'Popular' },
            { id: 'mailchimp', name: 'Mailchimp', description: 'Add leads to email campaigns', icon: Share2, requirements: ['API Key', 'Audience ID'], marketShare: 'Widely Used' }
          ].map((platform) => {
            const Icon = platform.icon;
            const isSelected = publishingPlatform === platform.id; // publishingPlatform state might be repurposed or renamed
            
            return (
              <motion.div
                key={platform.id}
                whileHover={{ scale: 1.01 }}
                onClick={() => setPublishingPlatform(platform.id as any)}
                className={`p-6 rounded-xl border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Icon className={`w-8 h-8 ${isSelected ? 'text-blue-600' : 'text-gray-600'}`} />
                    <div>
                      <h4 className={`font-semibold ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                        {platform.name}
                      </h4>
                      <p className="text-sm text-gray-600">{platform.description}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {platform.marketShare}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="text-sm font-medium text-gray-700">Setup:</div>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {platform.requirements.map((req, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="w-3 h-3 text-green-500" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePublish(platform.id); // This function would need to be adapted
                  }}
                  className="w-full py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  <div className="flex items-center justify-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Configure {platform.name.split(' ')[0]}
                  </div>
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Advanced Settings */}
      {showAdvanced && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gray-50 p-6 rounded-xl border border-gray-200"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Advanced Export Settings</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Layout {/* Changed */}
                </label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Standard Property Report</option>
                  <option>Lead Summary Sheet</option>
                  <option>Full Data Export</option>
                  <option>Custom Layout</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Fields to Include {/* Changed */}
                </label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Core Data</option>
                  <option>Extended Data</option>
                  <option>All Available Data</option>
                  <option>Custom Field Selection</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CSV Delimiter {/* Changed */}
                </label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Comma (,)</option>
                  <option>Semicolon (;)</option>
                  <option>Tab</option>
                </select>
              </div>
              
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="includeTableOfContents"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  defaultChecked
                />
                <label htmlFor="includeTableOfContents" className="text-sm font-medium text-gray-700">
                  Include Summary Section {/* Changed */}
                </label>
              </div>
              
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="includePageNumbers"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  defaultChecked
                />
                <label htmlFor="includePageNumbers" className="text-sm font-medium text-gray-700">
                  Include Record IDs {/* Changed */}
                </label>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <Share2 className="w-6 h-6 text-blue-600 mb-2" />
            <div className="font-medium text-gray-900">Share Report Link</div> {/* Changed */}
            <div className="text-sm text-gray-600">Generate shareable link for reports</div> {/* Changed */}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <Package className="w-6 h-6 text-green-600 mb-2" />
            <div className="font-medium text-gray-900">Bulk Export</div> {/* Changed */}
            <div className="text-sm text-gray-600">Export multiple records or lists</div> {/* Changed */}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <Zap className="w-6 h-6 text-purple-600 mb-2" />
            <div className="font-medium text-gray-900">Send to CRM</div> {/* Changed */}
            <div className="text-sm text-gray-600">Push selected leads to integrated CRM</div> {/* Changed */}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
