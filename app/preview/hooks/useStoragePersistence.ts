import { useState, useEffect } from 'react';
import { useStoryStore } from '@/lib/store/storyStore';

export function useStoragePersistence() {
  const { currentStory } = useStoryStore();
  const [persistedContent, setPersistedContent] = useState<Record<string, string>>({});

  // Initialize content from localStorage after mount
  useEffect(() => {
    const saved = localStorage.getItem('previewContent');
    const savedStoryId = localStorage.getItem('currentStoryId');
    const savedPageCount = localStorage.getItem('currentPageCount');
    
    // Only load saved content if it belongs to the current story
    if (saved && savedStoryId === currentStory?.id) {
      try {
        setPersistedContent(JSON.parse(saved));
      } catch (error) {
        console.error('Error parsing saved content:', error);
      }
    }
  }, [currentStory?.id]);

  // Save content to localStorage whenever it changes
  useEffect(() => {
    if (currentStory?.id) {
      localStorage.setItem('previewContent', JSON.stringify(persistedContent));
      localStorage.setItem('currentStoryId', currentStory.id);
    }
  }, [persistedContent, currentStory?.id]);

  // Initialize content when component mounts or story changes
  useEffect(() => {
    if (currentStory?.id) {
      const savedStoryId = localStorage.getItem('currentStoryId');
      
      // If this is a new story or the saved content is for a different story
      if (savedStoryId !== currentStory.id) {
        const initialContent = {
          container1: `
            <div class="page empty-page">
            </div>
          `,
          container2: `
            <div class="page">
              <div class="page-header">
                <span class="page-number">2</span>
                <span class="chapter-title">Table of Contents</span>
              </div>
              <div class="page-content">
                <h2 class="chapter-heading">Table of Contents</h2>
                <div class="toc-content">
                  <div class="toc-section">
                    <h3 class="toc-title">Introduction</h3>
                    <p class="toc-description">An overview of the key concepts and themes that will be explored throughout this book.</p>
                  </div>
                  <div class="toc-section">
                    <h3 class="toc-title">Chapter 1: ${currentStory.themes?.[0] || 'Main Theme'}</h3>
                    <p class="toc-description">Essential concepts and foundational principles that form the basis of our narrative.</p>
                  </div>
                  <div class="toc-section">
                    <h3 class="toc-title">Chapter 2: ${currentStory.themes?.[1] || 'Core Concept'}</h3>
                    <p class="toc-description">Building upon the foundation with key developments and character evolution.</p>
                  </div>
                  <div class="toc-section">
                    <h3 class="toc-title">Chapter 3: ${currentStory.themes?.[2] || 'Key Principles'}</h3>
                    <p class="toc-description">Critical developments and turning points in our narrative journey.</p>
                  </div>
                  <div class="toc-section">
                    <h3 class="toc-title">Chapter 4: ${currentStory.themes?.[3] || 'Implementation Guide'}</h3>
                    <p class="toc-description">The convergence of narrative threads and deeper implications of our story.</p>
                  </div>
                  <div class="toc-section">
                    <h3 class="toc-title">Chapter 5: ${currentStory.themes?.[4] || 'Case Studies'}</h3>
                    <p class="toc-description">Practical applications and real-world examples of our core concepts.</p>
                  </div>
                  <div class="toc-section">
                    <h3 class="toc-title">Chapter 6: ${currentStory.themes?.[5] || 'Conclusion'}</h3>
                    <p class="toc-description">Bringing together all themes and concepts for a meaningful conclusion.</p>
                  </div>
                </div>
              </div>
              <div class="page-footer">
                <span class="footer-text">ProfitPen.co</span>
              </div>
            </div>
          `,
          container3: `
            <div class="page">
              <div class="page-header">
                <span class="page-number">3</span>
                <span class="chapter-title">Chapter 1: ${currentStory.themes?.[0] || 'Main Theme'}</span>
              </div>
              <div class="page-content">
                <h2 class="chapter-heading">Chapter 1: ${currentStory.themes?.[0] || 'Main Theme'}</h2>
                <p class="chapter-text">This opening chapter introduces the fundamental concepts and themes that will guide our narrative journey. We establish the foundation upon which the entire story will be built. Through careful exploration of these core ideas, we set the stage for a comprehensive understanding of the principles that will be developed throughout the book. The concepts presented here form the bedrock of our narrative, providing essential context for the deeper explorations to come.</p>
                <div class="chapter-divider"></div>
                <h3 class="chapter-subheading">Overview</h3>
                <p class="chapter-text">This chapter introduces the main concepts and themes that drive the story forward. We examine how these foundational elements interact and influence one another, creating a rich tapestry of ideas that will be explored in greater depth throughout the book. The careful consideration of these fundamental principles ensures that readers have a solid understanding of the core concepts before moving forward.</p>
                <p class="chapter-text">As we progress through these initial concepts, we'll discover how they interconnect and influence one another, forming a complex web of ideas that will be explored in greater depth throughout the book. The practical application of these concepts becomes evident as we examine real-world scenarios and case studies, providing concrete examples of how these principles manifest in practice.</p>
              </div>
              <div class="page-footer">
                <span class="footer-text">ProfitPen.co</span>
              </div>
            </div>
          `,
          container4: `
            <div class="page">
              <div class="page-header">
                <span class="page-number">4</span>
                <span class="chapter-title">Chapter 2: ${currentStory.themes?.[1] || 'Core Concept'}</span>
              </div>
              <div class="page-content">
                <h2 class="chapter-heading">Chapter 2: ${currentStory.themes?.[1] || 'Core Concept'}</h2>
                <p class="chapter-text">Building upon the foundation established in Chapter 1, we now explore the core concepts that drive our narrative forward. These essential elements form the backbone of our story's development.</p>
                <div class="chapter-divider"></div>
                <h3 class="chapter-subheading">Key Developments</h3>
                <p class="chapter-text">This chapter introduces critical developments that will shape the remainder of our journey, establishing important connections and relationships that drive the plot forward.</p>
              </div>
              <div class="page-footer">
                <span class="footer-text">ProfitPen.co</span>
              </div>
            </div>
          `,
          container5: `
            <div class="page">
              <div class="page-header">
                <span class="page-number">5</span>
                <span class="chapter-title">Chapter 3: ${currentStory.themes?.[2] || 'Key Principles'}</span>
              </div>
              <div class="page-content">
                <h2 class="chapter-heading">Chapter 3: ${currentStory.themes?.[2] || 'Key Principles'}</h2>
                <p class="chapter-text">As we progress deeper into our narrative, this chapter unveils the key principles that govern our story's universe. These fundamental rules and guidelines shape every aspect of the journey ahead.</p>
                <div class="chapter-divider"></div>
                <h3 class="chapter-subheading">Important Guidelines</h3>
                <p class="chapter-text">Understanding these principles is crucial for grasping the full scope of the narrative and the motivations that drive our characters forward.</p>
              </div>
              <div class="page-footer">
                <span class="footer-text">ProfitPen.co</span>
              </div>
            </div>
          `,
          container6: `
            <div class="page">
              <div class="page-header">
                <span class="page-number">6</span>
                <span class="chapter-title">Chapter 4: ${currentStory.themes?.[3] || 'Implementation Guide'}</span>
              </div>
              <div class="page-content">
                <h2 class="chapter-heading">Chapter 4: ${currentStory.themes?.[3] || 'Implementation Guide'}</h2>
                <p class="chapter-text">With the foundational knowledge established, this chapter focuses on the practical implementation of our core concepts. We explore how theory transforms into action within our narrative framework.</p>
                <div class="chapter-divider"></div>
                <h3 class="chapter-subheading">Step-by-Step Process</h3>
                <p class="chapter-text">Follow these guidelines to understand how the knowledge gained from previous chapters manifests in real scenarios and drives meaningful change.</p>
              </div>
              <div class="page-footer">
                <span class="footer-text">ProfitPen.co</span>
              </div>
            </div>
          `,
          container7: `
            <div class="page">
              <div class="page-header">
                <span class="page-number">7</span>
                <span class="chapter-title">Chapter 5: ${currentStory.themes?.[4] || 'Case Studies'}</span>
              </div>
              <div class="page-content">
                <h2 class="chapter-heading">Chapter 5: ${currentStory.themes?.[4] || 'Case Studies'}</h2>
                <p class="chapter-text">This chapter presents real-world examples and detailed case studies that illustrate the practical application of our story's themes. Through concrete examples, we see theory in action.</p>
                <div class="chapter-divider"></div>
                <h3 class="chapter-subheading">Practical Examples</h3>
                <p class="chapter-text">These carefully selected examples demonstrate how the concepts work in practice, providing tangible evidence of their effectiveness and impact.</p>
              </div>
              <div class="page-footer">
                <span class="footer-text">ProfitPen.co</span>
              </div>
            </div>
          `,
          container8: `
            <div class="page">
              <div class="page-header">
                <span class="page-number">8</span>
                <span class="chapter-title">Chapter 6: ${currentStory.themes?.[5] || 'Conclusion'}</span>
              </div>
              <div class="page-content">
                <h2 class="chapter-heading">Chapter 6: ${currentStory.themes?.[5] || 'Conclusion'}</h2>
                <p class="chapter-text">Bringing together all the themes and concepts explored throughout this story, we reach a meaningful conclusion that ties together every thread of our narrative journey.</p>
                <div class="chapter-divider"></div>
                <h3 class="chapter-subheading">Final Thoughts</h3>
                <p class="chapter-text">Thank you for reading. This concludes our comprehensive journey through this narrative, with all concepts integrated and resolved.</p>
              </div>
              <div class="page-footer">
                <span class="footer-text">ProfitPen.co</span>
              </div>
            </div>
          `
        };
        setPersistedContent(initialContent);
        localStorage.setItem('previewContent', JSON.stringify(initialContent));
        localStorage.setItem('currentStoryId', currentStory.id);
        localStorage.setItem('currentPageCount', '8');
      }
    }
  }, [currentStory?.id]);

  const savePageCount = (pageCount: number) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentPageCount', pageCount.toString());
    }
  };

  const getSavedPageCount = (): number => {
    if (typeof window !== 'undefined') {
      const savedPageCount = localStorage.getItem('currentPageCount');
      return savedPageCount ? Math.max(parseInt(savedPageCount), 8) : 8;
    }
    return 8;
  };

  return {
    persistedContent,
    setPersistedContent,
    savePageCount,
    getSavedPageCount
  };
}
