// Content templates for creating impressive preview experiences

export const IMPRESSIVE_OPENING_TEMPLATES = {
  thriller: {
    hooks: [
      "The last thing [CHARACTER] remembered was the sound of footsteps following them home.",
      "When [CHARACTER] woke up, they weren't in their own bed.",
      "The message was clear: they had 24 hours to comply, or everyone they loved would pay."
    ],
    atmospheres: [
      "The city never slept, but tonight it held its breath, waiting for something terrible to unfold.",
      "Shadows moved differently in this part of town, as if they knew secrets that daylight couldn't reveal.",
      "The silence was wrong—not peaceful, but predatory, like a hunter waiting for the perfect moment to strike."
    ]
  },
  romance: {
    hooks: [
      "[CHARACTER] had sworn off love completely—until they walked into the coffee shop that Tuesday morning.",
      "The wedding invitation arrived on the same day [CHARACTER] decided to leave town forever.",
      "After ten years of avoiding their hometown, [CHARACTER] had exactly one reason to return: closure."
    ],
    atmospheres: [
      "The autumn air carried promises of change, and [CHARACTER] could feel their carefully constructed walls beginning to crumble.",
      "Some places hold memories like perfume in fabric—no matter how much time passes, one breath brings everything flooding back.",
      "The town square looked exactly the same, but [CHARACTER] felt like a completely different person standing in it."
    ]
  },
  mystery: {
    hooks: [
      "The library book was returned exactly fifty years after it was due, with a note tucked inside that changed everything.",
      "[CHARACTER] found the key in their grandmother's attic, along with a warning: some doors should never be opened.",
      "The crime scene was perfect—too perfect. And [CHARACTER] was the only one who seemed to notice."
    ],
    atmospheres: [
      "The old house kept its secrets jealously, revealing them only to those brave enough to ask the right questions.",
      "Every small town has its mysteries, but this one had a mystery that refused to stay buried.",
      "The past has a way of surfacing at the most inconvenient times, usually when someone thinks they've forgotten."
    ]
  },
  fantasy: {
    hooks: [
      "The magic returned on [CHARACTER]'s eighteenth birthday, bringing with it the enemies they never knew they had.",
      "The dragon everyone said was dead had been writing letters to [CHARACTER] since childhood.",
      "When the stars disappeared from the sky, [CHARACTER] was the only one who remembered they had ever been there."
    ],
    atmospheres: [
      "Magic leaves traces like fingerprints—invisible to most, but unmistakable to those who know how to look.",
      "The forest had been whispering secrets for centuries, but [CHARACTER] was the first person who could understand its language.",
      "Ancient power runs in bloodlines like a river underground, waiting for the right moment to surface."
    ]
  },
  scifi: {
    hooks: [
      "The transmission from Earth stopped three days ago, and [CHARACTER] was the only one still listening.",
      "When [CHARACTER] woke up from cryosleep, the ship was empty and they were light-years off course.",
      "The AI had been lying to them for months, and [CHARACTER] had the proof hidden in their neural implant."
    ],
    atmospheres: [
      "Space stretched endlessly in all directions, but [CHARACTER] had never felt more trapped than they did in this moment.",
      "Technology promised to solve humanity's problems, but [CHARACTER] was beginning to suspect it had created entirely new ones.",
      "The future wasn't what anyone had expected, least of all the people who had to live in it."
    ]
  }
};

export const COMPELLING_CHAPTER_STRUCTURES = {
  actionOpener: {
    template: "[IMMEDIATE ACTION] + [CHARACTER REACTION] + [STAKES REVEAL] + [CLIFFHANGER]",
    description: "Start with immediate tension that reveals character and escalates stakes"
  },
  mysteryOpener: {
    template: "[INTRIGUING DISCOVERY] + [CHARACTER INVESTIGATION] + [DEEPER MYSTERY] + [PERSONAL STAKES]",
    description: "Hook with mystery that becomes personally important to the character"
  },
  emotionalOpener: {
    template: "[EMOTIONAL MOMENT] + [CHARACTER VULNERABILITY] + [RELATIONSHIP DYNAMICS] + [CHOICE REQUIRED]",
    description: "Create immediate emotional investment through character vulnerability"
  },
  worldBuildingOpener: {
    template: "[UNIQUE WORLD ELEMENT] + [CHARACTER INTERACTION] + [WORLD RULES] + [CONFLICT INTRODUCTION]",
    description: "Establish fascinating world through character's natural interaction with it"
  }
};

export const DIALOGUE_ENHANCEMENT_PATTERNS = {
  subtext: [
    "Characters say one thing but mean another",
    "Emotional subtext revealed through word choice and hesitation",
    "Power dynamics shown through speaking patterns"
  ],
  authenticity: [
    "Each character has distinctive speech patterns",
    "Dialogue reveals character background and education",
    "Natural interruptions and overlapping conversations"
  ],
  advancement: [
    "Every conversation moves plot forward",
    "Dialogue reveals new information naturally",
    "Character relationships evolve through speech"
  ]
};

export const SENSORY_IMMERSION_GUIDES = {
  visual: [
    "Use specific colors, shapes, and lighting details",
    "Show movement and gesture, not just static description",
    "Include contrasts that create visual tension"
  ],
  auditory: [
    "Layer background sounds with dialogue and action",
    "Use sound to create mood and atmosphere",
    "Include the absence of expected sounds for tension"
  ],
  tactile: [
    "Describe texture, temperature, and physical sensation",
    "Show character comfort/discomfort through physical detail",
    "Use touch to convey emotion and relationship dynamics"
  ],
  emotional: [
    "Show physical manifestations of emotions",
    "Use sensory details to trigger emotional memory",
    "Connect character feelings to environmental elements"
  ]
};

export const PACING_TECHNIQUES = {
  fastPaced: {
    sentences: "Short, punchy sentences for action and tension",
    paragraphs: "Brief paragraphs that create rapid movement",
    structure: "Quick scene changes and immediate consequences"
  },
  mediumPaced: {
    sentences: "Varied sentence length for natural rhythm",
    paragraphs: "Balanced paragraphs mixing action with reflection",
    structure: "Steady progression with breathing room for character development"
  },
  slowPaced: {
    sentences: "Longer, more complex sentences for immersion",
    paragraphs: "Fuller paragraphs that allow for detailed exploration",
    structure: "Deliberate pacing that builds atmosphere and depth"
  }
};

export const EMOTIONAL_IMPACT_STRATEGIES = {
  immediateConnection: [
    "Start with universal emotions readers can relate to",
    "Show character vulnerability early",
    "Create empathy through character struggle"
  ],
  escalatingInvestment: [
    "Gradually reveal character depth and complexity",
    "Increase personal stakes as story progresses",
    "Make character choices increasingly difficult"
  ],
  payoffMoments: [
    "Reward reader investment with emotional catharsis",
    "Show character growth through action, not exposition",
    "Create moments of triumph that feel earned"
  ]
};

export const PREVIEW_OPTIMIZATION_CHECKLIST = [
  "✓ Hook readers within first 25 words",
  "✓ Establish compelling character voice immediately",
  "✓ Create questions readers must have answered",
  "✓ Show world through action, not description",
  "✓ Include at least one unexpected element",
  "✓ End chapters with irresistible forward momentum",
  "✓ Balance mystery with clarity",
  "✓ Create emotional investment in character outcome",
  "✓ Use sensory details to create immersion",
  "✓ Ensure every sentence serves story purpose"
];

export function getGenreSpecificEnhancements(genre: string) {
  const enhancements: Record<string, {
    focus: string;
    techniques: string[];
    avoid: string[];
  }> = {
    thriller: {
      focus: "Immediate tension and escalating stakes",
      techniques: ["Start with action", "Short, punchy sentences", "Constant forward momentum"],
      avoid: ["Slow exposition", "Long descriptive passages", "Predictable patterns"]
    },
    romance: {
      focus: "Emotional connection and character chemistry",
      techniques: ["Strong character voice", "Emotional vulnerability", "Sensory attraction"],
      avoid: ["Instant love", "Cliched meet-cutes", "Passive protagonists"]
    },
    mystery: {
      focus: "Intriguing questions and clever revelations",
      techniques: ["Plant clues naturally", "Red herrings", "Character investigation"],
      avoid: ["Withholding obvious information", "Coincidental solutions", "Passive detection"]
    },
    fantasy: {
      focus: "World-building through character interaction",
      techniques: ["Magic through action", "Unique world elements", "Character-driven exploration"],
      avoid: ["Info-dumping", "Generic magic systems", "Passive world tours"]
    },
    scifi: {
      focus: "Technology's impact on human experience",
      techniques: ["Tech through character need", "Future implications", "Human consequences"],
      avoid: ["Technical exposition", "Tech-solves-everything", "Ignoring human element"]
    }
  };

  return enhancements[genre.toLowerCase()] || enhancements.thriller;
}
