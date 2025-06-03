export const bookStyles = `
  .page {
    background: white;
    padding: 2rem;
    min-height: 400px;
    margin: 0 auto;
   
    border-radius: 8px;
    font-family: 'Times New Roman', serif;
    line-height: 1.6;
    color: #333;
  }

  .preview-container-skeleton .page {
    background: transparent;
    box-shadow: none;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #ddd;
    padding-bottom: 0.5rem;
    margin-bottom: 1.5rem;
    position: relative;
  }

  .page-number {
    font-weight: bold;
    color: #666;
    font-size: 0.9rem;
    flex: 0 0 auto;
  }

  .chapter-title {
    font-style: italic;
    color: #666;
    font-size: 0.9rem;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    width: auto;
    max-width: 60%;
  }

  .page-content {
    min-height: 300px;
  }

  .book-title {
    font-size: 2.5rem;
    font-weight: bold;
    text-align: center;
    margin-bottom: 1rem;
    color: #2c3e50;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
  }

  .author-line {
    text-align: center;
    font-size: 1.2rem;
    color: #7f8c8d;
    margin-bottom: 2rem;
    font-style: italic;
  }

  .chapter-divider {
    width: 50%;
    height: 2px;
    background: linear-gradient(to right, transparent, #bdc3c7, transparent);
    margin: 2rem auto;
  }

  .chapter-heading {
    font-size: 1.8rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
    color: #34495e;
    text-align: center;
  }

  .themes-list {
    list-style: none;
    padding: 0;
  }

  .toc-item {
    padding: 0.8rem 0;
    border-bottom: 1px dotted #ddd;
    font-size: 1.1rem;
    position: relative;
    padding-left: 1.5rem;
  }

  .toc-item:before {
    content: '•';
    color: #3498db;
    font-weight: bold;
    position: absolute;
    left: 0;
  }

  /* Professional Table of Contents Styles */
  .toc-content {
    margin: 2rem 0;
    font-family: 'Times New Roman', serif;
    line-height: 1.2;
  }

  .toc-section {
    margin-bottom: 0.8rem;
    page-break-inside: avoid;
  }

  .toc-entry {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 0.6rem;
    position: relative;
    overflow: hidden;
  }

  .toc-title {
    font-size: 1rem;
    font-weight: 500;
    color: #2c3e50;
    margin: 0;
    padding-right: 0.5rem;
    background: white;
    z-index: 2;
    position: relative;
  }

  .toc-chapter-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #34495e;
  }

  .toc-dots {
    flex: 1;
    border-bottom: 1px dotted #999;
    margin: 0 0.5rem;
    height: 1px;
    position: relative;
    top: -0.3em;
  }

  .toc-page {
    font-size: 0.95rem;
    font-weight: 500;
    color: #666;
    background: white;
    padding-left: 0.5rem;
    z-index: 2;
    position: relative;
  }

  .toc-description {
    font-size: 0.85rem;
    color: #666;
    font-style: italic;
    margin: 0.2rem 0 0 0;
    line-height: 1.3;
  }

  .toc-main-title {
    font-size: 1.6rem;
    font-weight: bold;
    text-align: center;
    margin-bottom: 2rem;
    color: #2c3e50;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .toc-divider {
    width: 60%;
    height: 1px;
    background: linear-gradient(to right, transparent, #bdc3c7, transparent);
    margin: 1.5rem auto;
  }

  .page-footer {
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid #eee;
    text-align: center;
  }

  .footer-text {
    font-size: 0.8rem;
    color: #999;
  }

  .content-section {
    margin-bottom: 2rem;
  }

  .content-paragraph {
    margin-bottom: 1.2rem;
    text-align: justify;
    text-indent: 1.5rem;
  }

  .section-title {
    font-size: 1.4rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #2c3e50;
    border-left: 4px solid #3498db;
    padding-left: 1rem;
  }

  .highlight {
    background-color: #fff3cd;
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    border-left: 3px solid #ffc107;
    margin: 1rem 0;
    padding-left: 1rem;
  }

  .preview-container {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
    min-height: 400px;
  }

  .preview-container:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  }

  .placeholder-content {
    text-align: center;
    padding: 2rem 1rem;
    opacity: 0.7;
  }

  .placeholder-content .chapter-text {
    font-style: italic;
    color: #666;
    margin-bottom: 1rem;
  }

  /* Compact mode for 4-column layout */
  .compact-mode .page {
    padding: 1.2rem;
    min-height: 350px;
  }

  .compact-mode .book-title {
    font-size: 1.8rem;
    margin-bottom: 0.8rem;
  }

  .compact-mode .author-line {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }

  .compact-mode .chapter-heading {
    font-size: 1.4rem;
    margin-bottom: 1rem;
  }

  .compact-mode .chapter-subheading {
    font-size: 1.1rem;
    margin-bottom: 0.8rem;
  }

  .compact-mode .chapter-text {
    font-size: 0.85rem;
    line-height: 1.4;
    margin-bottom: 0.8rem;
  }

  .compact-mode .toc-item {
    padding: 0.5rem 0;
    font-size: 0.9rem;
    padding-left: 1.2rem;
  }

  .compact-mode .toc-content {
    margin: 1.5rem 0;
  }

  .compact-mode .toc-entry {
    margin-bottom: 0.4rem;
  }

  .compact-mode .toc-title {
    font-size: 0.9rem;
  }

  .compact-mode .toc-chapter-title {
    font-size: 1rem;
  }

  .compact-mode .toc-page {
    font-size: 0.85rem;
  }

  .compact-mode .toc-description {
    font-size: 0.8rem;
    margin-top: 0.1rem;
  }

  .compact-mode .toc-main-title {
    font-size: 1.4rem;
    margin-bottom: 1.5rem;
  }

  .compact-mode .footer-text {
    font-size: 0.7rem;
  }

  .compact-mode .section-title {
    font-size: 1.1rem;
    margin-bottom: 0.8rem;
  }

  .compact-mode .content-paragraph {
    margin-bottom: 0.8rem;
    font-size: 0.85rem;
    text-indent: 1rem;
  }

  .compact-mode .chapter-divider {
    margin: 1.2rem auto;
  }

  .chapter-text {
    font-size: 1rem;
    line-height: 1.8;
    margin-bottom: 1rem;
    text-align: justify;
    color: #2c3e50;
  }

  .chapter-text p {
    margin-bottom: 1rem;
  }

  .chapter-content {
    white-space: pre-wrap;
    font-size: 1rem;
    line-height: 1.8;
    text-align: justify;
    color: #2c3e50;
  }

  /* Compact mode for 4-column layout */
  .compact-mode .page {
    padding: 1.2rem;
    min-height: 350px;
  }

  .compact-mode .book-title {
    font-size: 1.8rem;
    margin-bottom: 0.8rem;
  }

  .compact-mode .author-line {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }

  .compact-mode .chapter-heading {
    font-size: 1.4rem;
    margin-bottom: 1rem;
  }

  .compact-mode .chapter-subheading {
    font-size: 1.1rem;
    margin-bottom: 0.8rem;
  }

  .compact-mode .chapter-text {
    font-size: 0.85rem;
    line-height: 1.4;
    margin-bottom: 0.8rem;
  }

  .compact-mode .toc-item {
    padding: 0.5rem 0;
    font-size: 0.9rem;
    padding-left: 1.2rem;
  }

  .compact-mode .toc-content {
    margin: 1.5rem 0;
  }

  .compact-mode .toc-entry {
    margin-bottom: 0.4rem;
  }

  .compact-mode .toc-title {
    font-size: 0.9rem;
  }

  .compact-mode .toc-chapter-title {
    font-size: 1rem;
  }

  .compact-mode .toc-page {
    font-size: 0.85rem;
  }

  .compact-mode .toc-description {
    font-size: 0.8rem;
    margin-top: 0.1rem;
  }

  .compact-mode .toc-main-title {
    font-size: 1.4rem;
    margin-bottom: 1.5rem;
  }

  .compact-mode .footer-text {
    font-size: 0.7rem;
  }

  .compact-mode .section-title {
    font-size: 1.1rem;
    margin-bottom: 0.8rem;
  }

  .compact-mode .content-paragraph {
    margin-bottom: 0.8rem;
    font-size: 0.85rem;
    text-indent: 1rem;
  }

  .compact-mode .chapter-divider {
    margin: 1.2rem auto;
  }

  /* Super compact mode for 5-column layout */
  .super-compact-mode .page {
    padding: 0.8rem;
    min-height: 300px;
  }

  .super-compact-mode .book-title {
    font-size: 1.4rem;
    margin-bottom: 0.6rem;
  }

  .super-compact-mode .author-line {
    font-size: 0.8rem;
    margin-bottom: 1rem;
  }

  .super-compact-mode .chapter-heading {
    font-size: 1.1rem;
    margin-bottom: 0.8rem;
  }

  .super-compact-mode .chapter-subheading {
    font-size: 0.9rem;
    margin-bottom: 0.6rem;
  }

  .super-compact-mode .chapter-text {
    font-size: 0.7rem;
    line-height: 1.3;
    margin-bottom: 0.6rem;
  }

  .super-compact-mode .toc-item {
    padding: 0.3rem 0;
    font-size: 0.7rem;
    padding-left: 1rem;
  }

  .super-compact-mode .toc-content {
    margin: 1rem 0;
  }

  .super-compact-mode .toc-entry {
    margin-bottom: 0.3rem;
  }

  .super-compact-mode .toc-title {
    font-size: 0.7rem;
  }

  .super-compact-mode .toc-chapter-title {
    font-size: 0.8rem;
  }

  .super-compact-mode .toc-page {
    font-size: 0.7rem;
  }

  .super-compact-mode .toc-description {
    font-size: 0.65rem;
    margin-top: 0.1rem;
  }

  .super-compact-mode .toc-main-title {
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }

  .super-compact-mode .footer-text {
    font-size: 0.6rem;
  }

  .super-compact-mode .section-title {
    font-size: 0.9rem;
    margin-bottom: 0.6rem;
  }

  .super-compact-mode .content-paragraph {
    margin-bottom: 0.6rem;
    font-size: 0.7rem;
    text-indent: 0.8rem;
  }

  .super-compact-mode .chapter-divider {
    margin: 0.8rem auto;
  }

  /* Book Cover Styles */
  .book-cover-page {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: 400px;
    padding: 1rem;
  }

  .book-cover-skeleton {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 400px;
    padding: 2rem;
    background: transparent;
  }

  .book-cover-skeleton .page-footer {
    background: rgba(255, 255, 255, 0.4);
    border-top: 1px solid rgba(238, 238, 238, 0.4);
    border-radius: 4px;
    margin-top: 2rem;
    padding: 0.75rem 1rem;
  }

  @keyframes skeleton-shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  .book-cover-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    position: relative;
  }

  .book-cover-image {
    max-width: 100%;
    max-height: 300px;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }

  .book-cover-overlay {
    position: absolute;
    bottom: -40px;
    left: 0;
    right: 0;
    text-align: center;
    background: rgba(255, 255, 255, 0.9);
    padding: 0.5rem;
    border-radius: 4px;
  }

  .cover-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    color: #666;
    text-align: center;
    min-height: 300px;
    position: relative;
  }

  .cover-content {
    padding: 2rem;
    z-index: 1;
    position: relative;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 12px;
    backdrop-filter: blur(5px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  .preview-container-skeleton .cover-content {
    background: transparent;
    backdrop-filter: none;
    box-shadow: none;
  }

  .cover-title {
    font-size: 1.8rem;
    font-weight: bold;
    margin-bottom: 2rem;
    color: #333;
  }

  .generate-cover-btn {
    background: #007bff;
    border: none;
    color: white;
    padding: 0.75rem 2rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);
  }

  .generate-cover-btn:hover {
    background: #0056b3;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.4);
  }

  .generate-cover-btn:disabled {
    background: #6c757d;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  /* Skeleton effect for preview containers */
  .preview-container-skeleton {
    background: linear-gradient(
      90deg,
      #f0f0f0 25%,
      #e0e0e0 50%,
      #f0f0f0 75%
    ) !important;
    background-size: 200% 100% !important;
    animation: skeleton-shimmer 2s infinite !important;
  }
`;

export const focusModeStyles = `
  .focus-mode {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.95);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .focus-content {
    background: white;
    border-radius: 12px;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
  }

  .focus-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }
`;

export const hoverControlsStyles = `
  .hover-controls {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    gap: 1rem;
    padding: 1rem;
    opacity: 0;
    transition: opacity 0.2s ease;
    z-index: 10;
  }

  .preview-container:hover .hover-controls {
    opacity: 1;
  }

  .control-button {
    width: 44px;
    height: 44px;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: white;
    transition: all 0.2s ease;
  }

  .control-button:hover {
    transform: scale(1.1);
    background: rgba(0, 0, 0, 0.8);
  }

  .control-button.remove:hover {
    background: rgba(239, 68, 68, 0.8);
  }

  .control-button.regenerate:hover {
    background: rgba(59, 130, 246, 0.8);
  }

  .control-button.zoom:hover {
    background: rgba(16, 185, 129, 0.8);
  }
`;

export const qualityIndicatorStyles = `
  .quality-indicator {
    z-index: 10;
  }
  
  .quality-badge {
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .quality-tooltip {
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }
  
  .quality-stats {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
  }
  
  .quality-tag {
    padding: 0.25rem 0.5rem;
    border-radius: 0.375rem;
    font-size: 0.65rem;
    font-weight: 500;
  }
  
  .quality-tag.strength {
    background: rgba(34, 197, 94, 0.2);
    color: rgb(74, 222, 128);
    border: 1px solid rgba(34, 197, 94, 0.3);
  }
  
  .quality-tag.issue {
    background: rgba(251, 191, 36, 0.2);
    color: rgb(252, 211, 77);
    border: 1px solid rgba(251, 191, 36, 0.3);
  }
  
  .preview-container {
    position: relative;
    overflow: hidden;
  }
  
  .preview-container .quality-indicator {
    transition: opacity 0.2s ease-in-out;
  }
  
  .preview-container:hover .quality-indicator {
    opacity: 1 !important;
  }
`;
