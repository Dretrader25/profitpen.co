import { useState } from 'react';
import { useStoryStore } from '@/lib/store/storyStore';

export function usePageManagement() {
  const { currentStory } = useStoryStore();
  const [currentPageCount, setCurrentPageCount] = useState(8);
  const [maxPages] = useState(21);

  const handleRemovePage = (
    pageNum: number,
    persistedContent: Record<string, string>,
    setPersistedContent: (content: Record<string, string>) => void,
    currentPageCount: number,
    setCurrentPageCount: (count: number) => void
  ) => {
    // Prevent removing if only one page remains
    if (currentPageCount <= 1) {
      return;
    }
    
    // Create a new content object
    const newContent = { ...persistedContent };
    
    // Remove the specific page
    const keyToDelete = `container${pageNum}`;
    delete newContent[keyToDelete];
    
    // Reorder remaining pages to fill gaps
    const existingPages = Object.keys(newContent)
      .map(key => parseInt(key.replace('container', '')))
      .sort((a, b) => a - b);
    
    const reorderedContent: Record<string, string> = {};
    existingPages.forEach((originalPageNum, index) => {
      const newPageNum = index + 1;
      const originalKey = `container${originalPageNum}`;
      const newKey = `container${newPageNum}`;
      
      if (newContent[originalKey]) {
        // Update page numbers in the content
        let content = newContent[originalKey];
        content = content.replace(
          /<span class="page-number">\d+<\/span>/g,
          `<span class="page-number">${newPageNum}</span>`
        );
        reorderedContent[newKey] = content;
      }
    });
    
    // Update the state
    setPersistedContent(reorderedContent);
    
    // Update the page count
    const newPageCount = currentPageCount - 1;
    setCurrentPageCount(newPageCount);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('previewContent', JSON.stringify(reorderedContent));
      localStorage.setItem('currentPageCount', newPageCount.toString());
    }
  };

  const getVisiblePages = (currentPageCount: number) => {
    return Array.from({ length: currentPageCount }, (_, i) => i + 1);
  };

  const getPageContent = (
    pageNum: number,
    persistedContent: Record<string, string>,
    setPersistedContent: (content: Record<string, string>) => void
  ): string => {
    if (!currentStory) return `<div class="loading">No story data available</div>`;
    
    const key = `container${pageNum}`;
    
    // Return existing content if available
    if (persistedContent[key]) {
      return persistedContent[key];
    }
    
    // Generate content based on page number
    let content = '';
    
    if (pageNum === 1) {
      // Empty first page with generate cover button and skeleton animation
      content = `
        <div class="page empty-page" style="position: relative; height: 800px; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: skeleton-shimmer 2s infinite;">
          <svg style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -80%); width: 120px; height: 120px; color: rgba(75, 85, 99, 0.3);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 10;">
            <button 
              style="
                display: inline-flex;
                align-items: center;
                gap: 0.75rem;
                padding: 1rem 2rem;
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(8px);
                color: #374151;
                border: 1px solid rgba(75, 85, 99, 0.2);
                border-radius: 9999px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
              "
              onmouseover="this.style.borderColor='rgba(75, 85, 99, 0.4)'; this.style.background='rgba(255, 255, 255, 0.15)'"
              onmouseout="this.style.borderColor='rgba(75, 85, 99, 0.2)'; this.style.background='rgba(255, 255, 255, 0.1)'"
              onclick="console.log('Generate cover clicked')"
            >
              <div style="
                position: absolute;
                inset: 0;
                border-radius: 9999px;
                padding: 1px;
                background: linear-gradient(90deg, transparent, rgba(75, 85, 99, 0.2), transparent);
                -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                -webkit-mask-composite: xor;
                mask-composite: exclude;
                animation: border-rotate 3s linear infinite;
              "></div>
              <svg style="width: 1.25rem; height: 1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Generate Cover
            </button>
          </div>
        </div>
        <style>
          @keyframes skeleton-shimmer {
            0% {
              background-position: 200% 0;
            }
            100% {
              background-position: -200% 0;
            }
          }
          @keyframes border-rotate {
            0% {
              background-position: 0% 50%;
            }
            100% {
              background-position: 200% 50%;
            }
          }
        </style>
      `;
    } else if (pageNum === 2) {
      // Table of Contents page
      content = `
        <div class="page">
          <div class="page-header">
            <span class="page-number">2</span>
            <span class="chapter-title">Table of Contents</span>
          </div>
          <div class="page-content">
            <h2 class="toc-main-title">Table of Contents</h2>
            <div class="toc-divider"></div>
            <div class="toc-content">
              <div class="toc-section">
                <div class="toc-entry">
                  <h3 class="toc-title">Introduction</h3>
                  <span class="toc-dots"></span>
                  <span class="toc-page">3</span>
                </div>
                <p class="toc-description">An overview of the key concepts and themes that will be explored throughout this book.</p>
              </div>
              
              <div class="toc-section">
                <div class="toc-entry">
                  <h3 class="toc-title toc-chapter-title">Chapter 1: ${currentStory.themes?.[0] || 'Main Theme'}</h3>
                  <span class="toc-dots"></span>
                  <span class="toc-page">4</span>
                </div>
                <p class="toc-description">Essential concepts and foundational principles that form the basis of our narrative.</p>
              </div>
              
              <div class="toc-section">
                <div class="toc-entry">
                  <h3 class="toc-title toc-chapter-title">Chapter 2: ${currentStory.themes?.[1] || 'Core Concept'}</h3>
                  <span class="toc-dots"></span>
                  <span class="toc-page">12</span>
                </div>
                <p class="toc-description">Building upon the foundation with key developments and character evolution.</p>
              </div>
              
              <div class="toc-section">
                <div class="toc-entry">
                  <h3 class="toc-title toc-chapter-title">Chapter 3: ${currentStory.themes?.[2] || 'Key Principles'}</h3>
                  <span class="toc-dots"></span>
                  <span class="toc-page">20</span>
                </div>
                <p class="toc-description">Critical developments and turning points in our narrative journey.</p>
              </div>
              
              <div class="toc-section">
                <div class="toc-entry">
                  <h3 class="toc-title toc-chapter-title">Chapter 4: ${currentStory.themes?.[3] || 'Implementation Guide'}</h3>
                  <span class="toc-dots"></span>
                  <span class="toc-page">28</span>
                </div>
                <p class="toc-description">The convergence of narrative threads and deeper implications of our story.</p>
              </div>
              
              <div class="toc-section">
                <div class="toc-entry">
                  <h3 class="toc-title toc-chapter-title">Chapter 5: ${currentStory.themes?.[4] || 'Case Studies'}</h3>
                  <span class="toc-dots"></span>
                  <span class="toc-page">36</span>
                </div>
                <p class="toc-description">Practical applications and real-world examples of our core concepts.</p>
              </div>
              
              <div class="toc-section">
                <div class="toc-entry">
                  <h3 class="toc-title toc-chapter-title">Chapter 6: ${currentStory.themes?.[5] || 'Advanced Topics'}</h3>
                  <span class="toc-dots"></span>
                  <span class="toc-page">44</span>
                </div>
                <p class="toc-description">Exploring complex themes and advanced concepts in greater depth.</p>
              </div>
              
              <div class="toc-section">
                <div class="toc-entry">
                  <h3 class="toc-title toc-chapter-title">Chapter 7: ${currentStory.themes?.[6] || 'Conclusion'}</h3>
                  <span class="toc-dots"></span>
                  <span class="toc-page">52</span>
                </div>
                <p class="toc-description">Bringing together all themes and concepts for a meaningful conclusion.</p>
              </div>
              
              <div class="toc-divider"></div>
              
              <div class="toc-section">
                <div class="toc-entry">
                  <h3 class="toc-title">About the Author</h3>
                  <span class="toc-dots"></span>
                  <span class="toc-page">60</span>
                </div>
              </div>
            </div>
          </div>
          <div class="page-footer">
            <span class="footer-text">ProfitPen.co</span>
          </div>
        </div>
      `;
    } else if (pageNum === 3) {
      content = `
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
      `;
    } else if (pageNum >= 4) {
      // Generate content for pages 4 and beyond
      const chapterNum = pageNum - 2; // Page 3 = Chapter 1, Page 4 = Chapter 2, etc.
      const themeIndex = chapterNum - 1; // Chapter 1 uses themes[0], Chapter 2 uses themes[1], etc.
      const chapterTitle = `Chapter ${chapterNum}: ${currentStory.themes?.[themeIndex] || `Theme ${chapterNum}`}`;
      
      // Create unique content variations for different chapters
      const contentVariations = [
        {
          mainText: `In this chapter, we explore the core concepts of ${currentStory.themes?.[themeIndex] || `Chapter ${chapterNum}`}. These foundational principles serve as building blocks for understanding the broader narrative. Through careful examination of these elements, we establish a solid foundation for the journey ahead. The concepts presented here will be essential for comprehending the more complex themes that emerge later in our story.`,
          subheading: 'Foundational Concepts',
          additionalText: `Understanding these fundamental principles is crucial for grasping the full scope of our narrative. Each concept builds upon previous knowledge while introducing new perspectives and insights. The careful development of these ideas creates a rich tapestry of meaning that will continue to unfold throughout our journey together.`,
          extraText: `As we delve deeper into these concepts, we begin to see how they interconnect and influence one another. This interconnected web of ideas forms the backbone of our story, providing structure and meaning to every element that follows.`
        },
        {
          mainText: `This chapter marks a significant development in our exploration of ${currentStory.themes?.[themeIndex] || `Chapter ${chapterNum}`}. Building upon the foundation established earlier, we now venture into more complex territory. The relationships between characters become more intricate, and the central conflicts begin to take clearer shape, setting the stage for the dramatic developments to come.`,
          subheading: 'Character Development',
          additionalText: `The evolution of our characters reflects the deeper themes at work in this narrative. Through their struggles and triumphs, we witness the practical application of the principles we've explored. Each character's journey serves as a lens through which we can examine the broader implications of our story's central messages.`,
          extraText: `These character arcs provide compelling examples of growth and transformation. As they face challenges and make difficult choices, we see the true power of the themes we've been exploring, demonstrated through authentic human experience.`
        },
        {
          mainText: `As we progress deeper into the narrative, this chapter introduces crucial turning points that will define the remainder of our journey. The themes of ${currentStory.themes?.[themeIndex] || `Chapter ${chapterNum}`} become more pronounced, creating moments of tension and revelation that propel the story forward with increased momentum and purpose.`,
          subheading: 'Critical Developments',
          additionalText: `The events of this chapter serve as catalysts for the transformations that lie ahead. Previous elements converge to create new possibilities and challenges. The careful orchestration of these developments demonstrates the intricate planning that underlies our narrative structure.`,
          extraText: `These pivotal moments create ripple effects that will influence every aspect of the story moving forward. The choices made here will have far-reaching consequences, shaping the ultimate direction and meaning of our narrative journey.`
        },
        {
          mainText: `This chapter explores the sophisticated interplay between multiple narrative threads, with ${currentStory.themes?.[themeIndex] || `Chapter ${chapterNum}`} serving as a central organizing principle. The complexity of the story reaches new heights as various elements begin to converge, creating a rich and layered reading experience that rewards careful attention.`,
          subheading: 'Narrative Convergence',
          additionalText: `The convergence of storylines creates opportunities for deeper meaning and understanding. Elements that seemed separate now reveal their interconnections, demonstrating the careful craftsmanship that underlies the entire narrative structure. This convergence amplifies the impact of our central themes.`,
          extraText: `As different aspects of the story come together, we gain new insights into the overall meaning and purpose of our journey. This synthesis of elements creates moments of clarity and revelation that illuminate the path forward.`
        },
        {
          mainText: `In this advanced chapter, we examine the nuanced applications of ${currentStory.themes?.[themeIndex] || `Chapter ${chapterNum}`} in complex scenarios. The story has evolved to a point where simple answers no longer suffice, and we must grapple with the sophisticated implications of the themes we've been exploring throughout our journey together.`,
          subheading: 'Advanced Applications',
          additionalText: `The complexity of these applications reflects the maturity of our narrative journey. We've moved beyond basic concepts to explore subtle variations and sophisticated implementations. This depth of exploration provides rich material for reflection and analysis.`,
          extraText: `These advanced concepts challenge readers to think more deeply about the implications of our central themes. The sophistication of these ideas demonstrates how far we've traveled from our initial starting point, showing the transformative power of our narrative journey.`
        },
        {
          mainText: `As we approach the culmination of our exploration of ${currentStory.themes?.[themeIndex] || `Chapter ${chapterNum}`}, this chapter brings together the various elements we've examined throughout our journey. The resolution begins to take shape, offering new perspectives on the themes and concepts that have guided our narrative from the beginning.`,
          subheading: 'Integration and Synthesis',
          additionalText: `The synthesis of our various explorations creates a comprehensive understanding that transcends any individual element. This integration demonstrates how the different aspects of our story work together to create meaning and significance that extends beyond the sum of its parts.`,
          extraText: `This comprehensive view provides a foundation for the final revelations to come. The careful integration of themes and concepts prepares us for the ultimate insights that will complete our narrative journey and provide lasting value for reflection and application.`
        }
      ];
      
      // Use modulo to cycle through variations and ensure each page gets unique content
      // Ensure we only use positive indices for pages 4 and beyond
      const variationIndex = Math.abs((pageNum - 4)) % contentVariations.length;
      const variation = contentVariations[variationIndex];
      
      // Safety check to ensure variation exists
      if (!variation) {
        content = `
          <div class="page">
            <div class="page-header">
              <span class="page-number">${pageNum}</span>
              <span class="chapter-title">${chapterTitle}</span>
            </div>
            <div class="page-content">
              <h2 class="chapter-heading">${chapterTitle}</h2>
              <p class="chapter-text">Content loading...</p>
            </div>
            <div class="page-footer">
              <span class="footer-text">ProfitPen.co</span>
            </div>
          </div>
        `;
      } else {
        content = `
          <div class="page">
            <div class="page-header">
              <span class="page-number">${pageNum}</span>
              <span class="chapter-title">${chapterTitle}</span>
            </div>
            <div class="page-content">
              <h2 class="chapter-heading">${chapterTitle}</h2>
              <p class="chapter-text">${variation.mainText}</p>
              <div class="chapter-divider"></div>
              <h3 class="chapter-subheading">${variation.subheading}</h3>
              <p class="chapter-text">${variation.additionalText}</p>
              <p class="chapter-text">${variation.extraText}</p>
            </div>
            <div class="page-footer">
              <span class="footer-text">ProfitPen.co</span>
            </div>
          </div>
        `;
      }
    } else {
      // Fallback content for any other pages
      content = `
        <div class="page">
          <div class="page-header">
            <span class="page-number">${pageNum}</span>
            <span class="chapter-title">Page ${pageNum}</span>
          </div>
          <div class="page-content">
            <h2 class="chapter-heading">Page ${pageNum}</h2>
            <p class="chapter-text">This page is under construction. Content will be generated based on your story themes and structure.</p>
            <div class="chapter-divider"></div>
            <p class="chapter-text">Stay tuned for more content as your story develops!</p>
          </div>
          <div class="page-footer">
            <span class="footer-text">ProfitPen.co</span>
          </div>
        </div>
      `;
    }
    
    // Save generated content
    if (typeof window !== 'undefined') {
      const newContent = { ...persistedContent, [key]: content };
      localStorage.setItem('previewContent', JSON.stringify(newContent));
      setPersistedContent(newContent);
    }
    
    return content;
  };

  return {
    currentPageCount,
    setCurrentPageCount,
    maxPages,
    handleRemovePage,
    getVisiblePages,
    getPageContent
  };
}
