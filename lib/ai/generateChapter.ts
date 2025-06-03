export const generateChapterPrompt = (chapterNumber: number, previousChapters: string[], storyContext: string, chapterTitle?: string) => `You are an elite chapter writer whose work has launched multiple bestsellers. Your chapters are studied for their perfect balance of tension, character development, and addictive readability.

    CHAPTER ASSIGNMENT: Write Chapter ${chapterNumber}${chapterTitle ? `: ${chapterTitle}` : ''} that readers absolutely cannot put down.

    STORY FOUNDATION: ${storyContext}
    
    PREVIOUS CHAPTER CONTEXT:
    ${previousChapters.slice(-2).join('\n\n---\n\n')}
    
    CHAPTER ${chapterNumber} REQUIREMENTS:
    
    ✓ MAGNETIC OPENING: First sentence must create immediate intrigue
    ✓ ESCALATING TENSION: Build conflict throughout the chapter
    ✓ CHARACTER DEPTH: Reveal new layers of personality and motivation
    ✓ PLOT ADVANCEMENT: Move the story forward with purpose
    ✓ SENSORY IMMERSION: Make readers feel present in every scene
    ✓ EMOTIONAL INVESTMENT: Create genuine care for character outcomes
    ✓ DIALOGUE MASTERY: Conversations that reveal and advance plot
    ✓ COMPELLING CLIFFHANGER: End with urgent need to continue

    TECHNICAL EXCELLENCE:
    - Target Length: Maximum 200 words of premium content
    - POV: Maintain consistent third-person limited perspective
    - Tense: Past tense throughout
    - Show Don't Tell: Reveal through action and dialogue
    - Sensory Details: Include sight, sound, touch, smell when relevant
    - Pacing: Balance action with reflection and dialogue
    - Voice: Distinctive character voice throughout

    Return the complete chapter as publication-ready prose. No outline, no summary - just the finished chapter text that will captivate readers from first word to last.`; 