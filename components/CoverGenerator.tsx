'use client';

import { useState } from 'react';

export default function CoverGenerator() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [originalPrompt, setOriginalPrompt] = useState<string>('');
  const [enhancedPrompt, setEnhancedPrompt] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isPlaceholder, setIsPlaceholder] = useState<boolean>(false);
  const [useEnhancedPrompt, setUseEnhancedPrompt] = useState<boolean>(true);

  const generateImage = async () => {
    setLoading(true);
    setImageUrl(null);
    setOriginalPrompt('');
    setEnhancedPrompt('');
    setMessage('');
    setIsPlaceholder(false);
    
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt,
          useEnhancedPrompt 
        }),
      });

      const data = await res.json();
      
      if (data.originalPrompt) {
        setOriginalPrompt(data.originalPrompt);
      }
      if (data.enhancedPrompt) {
        setEnhancedPrompt(data.enhancedPrompt);
      }
      if (data.message) {
        setMessage(data.message);
      }
      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
      }
      if (data.isPlaceholder !== undefined) {
        setIsPlaceholder(data.isPlaceholder);
      }
    } catch (err) {
      console.error(err);
      setMessage('An error occurred while generating the cover image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-4">
      <h2 className="text-2xl font-bold mb-6">Book Cover Generator</h2>
      
      <div className="mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
          {/* Original Prompt Input */}
          <div className="w-full">
            <label className="block text-sm font-medium mb-2">
              Your Original Prompt:
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A mystery novel about a detective in 1920s New York, dark and moody atmosphere..."
              className="w-full p-3 border border-gray-300 rounded-lg h-72 resize-none text-base"
            />
          </div>

          {/* Enhanced Prompt Display */}
          <div className="w-full">
            <label className="block text-sm font-medium mb-2">
              Enhanced Prompt:
            </label>
            <textarea
              value={enhancedPrompt}
              readOnly
              placeholder="Enhanced prompt will appear here..."
              className="w-full p-3 border border-gray-300 rounded-lg h-72 resize-none bg-gray-50 text-base"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <button
            onClick={generateImage}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition-colors"
            disabled={loading || !prompt.trim()}
          >
            {loading ? 'Generating...' : 'Generate Book Cover'}
          </button>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Use:</label>
            <select
              value={useEnhancedPrompt ? 'enhanced' : 'original'}
              onChange={(e) => setUseEnhancedPrompt(e.target.value === 'enhanced')}
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
            >
              <option value="enhanced">Enhanced Prompt</option>
              <option value="original">Original Prompt</option>
            </select>
          </div>
        </div>
      </div>

      {message && (
        <div className={`mb-6 p-4 border rounded-lg ${isPlaceholder ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
          <p className={isPlaceholder ? 'text-yellow-800' : 'text-green-800'}>{message}</p>
          {isPlaceholder && (
            <p className="text-yellow-700 text-sm mt-2">
              💡 Tip: Add a Hugging Face API key as HUGGINGFACE_API_KEY environment variable for AI-generated images.
            </p>
          )}
        </div>
      )}

      {/* Image Display */}
      <div className="max-w-2xl mx-auto">
        <h3 className="text-lg font-semibold mb-3">Generated Cover</h3>
        <div id="image-output" className="border rounded-lg p-4 bg-white">
          <div className="relative w-full" style={{ paddingBottom: '133.33%' }}> {/* 4:3 ratio = 133.33% */}
            <div className="absolute inset-0 flex justify-center items-center">
              {loading && (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <span>Generating your book cover...</span>
                </div>
              )}
              {imageUrl && (
                <div className="text-center w-full h-full">
                  <img 
                    src={imageUrl} 
                    alt="Generated Book Cover" 
                    className="w-full h-full object-contain rounded shadow-lg" 
                  />
                  {isPlaceholder && (
                    <p className="text-sm text-gray-500 mt-2">Placeholder image - upgrade to get AI-generated covers</p>
                  )}
                </div>
              )}
              {!loading && !imageUrl && (
                <p className="text-gray-500">Your generated book cover will appear here</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
