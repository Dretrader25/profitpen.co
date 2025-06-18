'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Palette, 
  Save, 
  Zap, 
  Brain, 
  Shield, 
  Bell, 
  Monitor,
  Moon,
  Sun,
  Globe,
  FileText,
  Code,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Eye,
  EyeOff,
  Crown,
  ChevronRight
} from 'lucide-react';

interface SettingsPanelProps {
  currentStory: any;
  onTabChange: (tab: string) => void;
}

export default function SettingsPanel({
  currentStory,
  onTabChange
}: SettingsPanelProps) {
  const [activeSection, setActiveSection] = useState<'general' | 'appearance' | 'ai' | 'privacy' | 'advanced'>('general');
  const [settings, setSettings] = useState({
    // General settings
    autoSave: true,
    autoSaveInterval: 30,
    language: 'en',
    timezone: 'UTC',
    defaultGenre: 'fiction',
    
    // Appearance settings
    theme: 'light',
    sidebarCollapsed: false,
    compactMode: false,
    animations: true,
    fontSize: 'medium',
    
    // AI settings
    aiModel: 'gemini-pro',
    creativity: 7,
    lengthPreference: 'medium',
    tone: 'neutral',
    autoSuggestions: true,
    
    // Privacy settings
    analytics: true,
    crashReports: true,
    usageData: false,
    personalizedAds: false,
    
    // Advanced settings
    experimentalFeatures: false,
    debugMode: false,
    cacheSize: '100MB',
    backupFrequency: 'daily'
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const settingSections = [
    {
      id: 'general',
      title: 'General',
      icon: Settings,
      description: 'Basic application preferences and defaults' // Changed
    },
    {
      id: 'appearance',
      title: 'Appearance',
      icon: Palette,
      description: 'Customize the look and feel'
    },
    {
      id: 'ai',
      title: 'AI & Data Analysis', // Changed
      icon: Brain,
      description: 'Configure AI behavior and data processing' // Changed
    },
    {
      id: 'privacy',
      title: 'Privacy & Data',
      icon: Shield,
      description: 'Control your data and privacy settings'
    },
    {
      id: 'advanced',
      title: 'Advanced',
      icon: Code,
      description: 'Technical settings and experimental features'
    }
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Auto-save
          </label>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="text-sm text-gray-600">Automatically save changes</span>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => updateSetting('autoSave', !settings.autoSave)}
              className={`w-12 h-6 rounded-full transition-colors ${
                settings.autoSave ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <motion.div
                animate={{ x: settings.autoSave ? 24 : 0 }}
                className="w-5 h-5 bg-white rounded-full shadow-sm"
              />
            </motion.button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Auto-save Interval
          </label>
          <select
            value={settings.autoSaveInterval}
            onChange={(e) => updateSetting('autoSaveInterval', Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={10}>Every 10 seconds</option>
            <option value={30}>Every 30 seconds</option>
            <option value={60}>Every minute</option>
            <option value={300}>Every 5 minutes</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Language
          </label>
          <select
            value={settings.language}
            onChange={(e) => updateSetting('language', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="it">Italian</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Lead Type {/* Changed */}
          </label>
          <select
            value={settings.defaultGenre} // State key remains, value options change
            onChange={(e) => updateSetting('defaultGenre', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="residential">Residential Property</option> {/* Changed */}
            <option value="commercial">Commercial Property</option> {/* Changed */}
            <option value="absentee_owner">Absentee Owner</option> {/* Changed */}
            <option value="cash_buyer">Cash Buyer</option> {/* Changed */}
            <option value="pre_foreclosure">Pre-foreclosure</option> {/* Changed */}
            <option value="vacant_land">Vacant Land</option> {/* Changed */}
          </select>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Theme
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'light', name: 'Light', icon: Sun },
              { id: 'dark', name: 'Dark', icon: Moon },
              { id: 'auto', name: 'Auto', icon: Monitor }
            ].map((theme) => {
              const Icon = theme.icon;
              return (
                <motion.button
                  key={theme.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => updateSetting('theme', theme.id)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    settings.theme === theme.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5 mx-auto mb-1" />
                  <div className="text-sm font-medium">{theme.name}</div>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Font Size
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['small', 'medium', 'large'].map((size) => (
              <motion.button
                key={size}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateSetting('fontSize', size)}
                className={`p-3 rounded-lg border-2 transition-all capitalize ${
                  settings.fontSize === size
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {size}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {[
          { key: 'compactMode', label: 'Compact Mode', description: 'Reduce spacing and padding' },
          { key: 'animations', label: 'Animations', description: 'Enable smooth transitions and effects' },
          { key: 'sidebarCollapsed', label: 'Collapse Sidebar', description: 'Start with sidebar collapsed' }
        ].map((setting) => (
          <div key={setting.key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">{setting.label}</div>
              <div className="text-sm text-gray-600">{setting.description}</div>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => updateSetting(setting.key, !settings[setting.key as keyof typeof settings])}
              className={`w-12 h-6 rounded-full transition-colors ${
                settings[setting.key as keyof typeof settings] ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <motion.div
                animate={{ x: settings[setting.key as keyof typeof settings] ? 24 : 0 }}
                className="w-5 h-5 bg-white rounded-full shadow-sm"
              />
            </motion.button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAISettings = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
        <div className="flex items-center gap-2 mb-2">
          <Crown className="w-5 h-5 text-purple-600" />
          <span className="font-medium text-purple-900">AI Data Assistant</span> {/* Changed */}
        </div>
        <p className="text-sm text-purple-700">
          Configure how AI assists with data analysis and suggestions {/* Changed */}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            AI Model
          </label>
          <select
            value={settings.aiModel}
            onChange={(e) => updateSetting('aiModel', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="gemini-pro">Gemini Pro (Recommended)</option>
            <option value="gemini-standard">Gemini Standard</option>
            <option value="custom">Custom Model</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Report/Communication Style {/* Changed */}
          </label>
          <select
            value={settings.tone} // State key remains, options might change if needed
            onChange={(e) => updateSetting('tone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="neutral">Neutral</option>
            <option value="formal">Formal</option>
            <option value="concise">Concise</option>
            <option value="detailed">Detailed</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Creativity Level: {settings.creativity}/10
        </label>
        <input
          type="range"
          min="1"
          max="10"
          value={settings.creativity}
          onChange={(e) => updateSetting('creativity', Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Conservative</span>
          <span>Balanced</span>
          <span>Creative</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
          <div>
            <div className="font-medium text-gray-900">Data Auto-fill / AI Suggestions</div> {/* Changed */}
            <div className="text-sm text-gray-600">Enable AI to suggest data or complete fields</div> {/* Changed */}
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => updateSetting('autoSuggestions', !settings.autoSuggestions)}
            className={`w-12 h-6 rounded-full transition-colors ${
              settings.autoSuggestions ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <motion.div
              animate={{ x: settings.autoSuggestions ? 24 : 0 }}
              className="w-5 h-5 bg-white rounded-full shadow-sm"
            />
          </motion.button>
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-green-600" />
          <span className="font-medium text-green-900">Privacy Controls</span>
        </div>
        <p className="text-sm text-green-700">
          Control what data is collected and how it's used
        </p>
      </div>

      <div className="space-y-4">
        {[
          {
            key: 'analytics',
            label: 'Usage Analytics',
            description: 'Help improve the app by sharing anonymous usage data',
            recommended: true
          },
          {
            key: 'crashReports',
            label: 'Crash Reports',
            description: 'Automatically send crash reports to help fix bugs',
            recommended: true
          },
          {
            key: 'usageData',
            label: 'Detailed Usage Data',
            description: 'Share detailed usage patterns for feature development',
            recommended: false
          },
          {
            key: 'personalizedAds',
            label: 'Personalized Ads',
            description: 'Use your data to show more relevant advertisements',
            recommended: false
          }
        ].map((setting) => (
          <div key={setting.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">{setting.label}</span>
                {setting.recommended && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Recommended
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600 mt-1">{setting.description}</div>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => updateSetting(setting.key, !settings[setting.key as keyof typeof settings])}
              className={`w-12 h-6 rounded-full transition-colors ml-4 ${
                settings[setting.key as keyof typeof settings] ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <motion.div
                animate={{ x: settings[setting.key as keyof typeof settings] ? 24 : 0 }}
                className="w-5 h-5 bg-white rounded-full shadow-sm"
              />
            </motion.button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAdvancedSettings = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <div className="flex items-center gap-2 mb-2">
          <Code className="w-5 h-5 text-yellow-600" />
          <span className="font-medium text-yellow-900">Advanced Settings</span>
        </div>
        <p className="text-sm text-yellow-700">
          These settings are for advanced users. Change with caution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cache Size
          </label>
          <select
            value={settings.cacheSize}
            onChange={(e) => updateSetting('cacheSize', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="50MB">50 MB</option>
            <option value="100MB">100 MB</option>
            <option value="200MB">200 MB</option>
            <option value="500MB">500 MB</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Backup Frequency
          </label>
          <select
            value={settings.backupFrequency}
            onChange={(e) => updateSetting('backupFrequency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="never">Never</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {[
          {
            key: 'experimentalFeatures',
            label: 'Experimental Features',
            description: 'Enable beta features that may be unstable'
          },
          {
            key: 'debugMode',
            label: 'Debug Mode',
            description: 'Show detailed error messages and logs'
          }
        ].map((setting) => (
          <div key={setting.key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <div className="font-medium text-gray-900">{setting.label}</div>
              <div className="text-sm text-gray-600">{setting.description}</div>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => updateSetting(setting.key, !settings[setting.key as keyof typeof settings])}
              className={`w-12 h-6 rounded-full transition-colors ${
                settings[setting.key as keyof typeof settings] ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <motion.div
                animate={{ x: settings[setting.key as keyof typeof settings] ? 24 : 0 }}
                className="w-5 h-5 bg-white rounded-full shadow-sm"
              />
            </motion.button>
          </div>
        ))}
      </div>

      <div className="border-t pt-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Danger Zone</h4>
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Clear Cache</div>
                <div className="text-sm text-gray-600">Free up storage space</div>
              </div>
              <RefreshCw className="w-5 h-5" />
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full p-3 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Reset All Settings</div>
                <div className="text-sm text-red-600">This cannot be undone</div>
              </div>
              <Trash2 className="w-5 h-5" />
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'general': return renderGeneralSettings();
      case 'appearance': return renderAppearanceSettings();
      case 'ai': return renderAISettings();
      case 'privacy': return renderPrivacySettings();
      case 'advanced': return renderAdvancedSettings();
      default: return renderGeneralSettings();
    }
  };

  return (
    <div className="p-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Preferences</h2> {/* Changed */}
          <p className="text-gray-600">Customize your PropAnalyzed workspace and default settings.</p> {/* Changed */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {settingSections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                
                return (
                  <motion.button
                    key={section.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveSection(section.id as any)}
                    className={`w-full text-left p-4 rounded-lg transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'hover:bg-gray-50 text-gray-700'
                    } border`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <div>
                          <div className="font-medium">{section.title}</div>
                          <div className="text-sm opacity-75">{section.description}</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </div>
                  </motion.button>
                );
              })}
            </nav>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-xl border border-gray-200"
            >
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {settingSections.find(s => s.id === activeSection)?.title}
                </h3>
                <p className="text-gray-600">
                  {settingSections.find(s => s.id === activeSection)?.description}
                </p>
              </div>

              {renderActiveSection()}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Settings are automatically saved
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Save className="w-4 h-4" />
                      Save Changes
                    </div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
