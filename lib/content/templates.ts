// lib/content/templates.ts
// Content templates for real estate lead generation and property analysis

export const REAL_ESTATE_SEARCH_QUERY_EXAMPLES = {
  distressedProperties: {
    examples: [
      "Pre-foreclosures in 75201 last 30 days",
      "Vacant properties in Maricopa County, AZ with high equity",
      "Homes with tax liens in Tampa, FL",
      "Probate leads in King County, WA",
      "Properties with code violations in Detroit, MI"
    ],
    descriptions: [
      "Find properties facing potential foreclosure.",
      "Identify unoccupied homes that might indicate motivated sellers.",
      "Discover properties with outstanding tax debts.",
      "Locate properties involved in probate proceedings.",
      "Target properties with documented maintenance issues."
    ]
  },
  investorFocused: {
    examples: [
      "Multi-family units in Austin, TX with value-add potential",
      "Cash buyer activity in Las Vegas, NV",
      "BRRRR strategy candidates in Cleveland, OH",
      "Properties owned by LLCs in Houston, TX",
      "Fixer-uppers in areas with rising home values"
    ],
    descriptions: [
      "Search for apartment buildings or duplexes suitable for renovation.",
      "Identify active cash buyers in specific markets.",
      "Find properties ideal for the Buy, Rehab, Rent, Refinance, Repeat strategy.",
      "Discover properties held by corporate entities.",
      "Target homes that require renovation in appreciating neighborhoods."
    ]
  },
  specificFeatures: {
    examples: [
      "Homes with pools in 90210 listed for sale",
      "Properties with 3+ beds, 2+ baths under $300k in Atlanta suburbs",
      "New construction homes in Raleigh, NC",
      "Land for commercial development near major highways",
      "Waterfront properties in South Florida"
    ],
    descriptions: [
      "Filter by specific desired property amenities.",
      "Combine multiple criteria for targeted home searches.",
      "Find newly built residential properties.",
      "Search for land suitable for commercial projects.",
      "Locate properties with direct water access."
    ]
  }
};

export const LEAD_QUALIFICATION_QUESTION_SETS = {
  motivatedSeller: {
    questions: [
      "What is your main reason for selling the property at this time?",
      "How quickly are you looking to sell?",
      "What is your desired sale price for the property?",
      "Are there any major repairs or issues with the property I should be aware of?",
      "Is there an existing mortgage or any liens on the property?"
    ],
    purpose: "To identify seller motivation, timeline, and potential pain points."
  },
  cashBuyer: {
    questions: [
      "What types of properties are you currently looking to purchase?",
      "What is your typical budget or price range for acquisitions?",
      "How quickly can you close on a property once a deal is agreed upon?",
      "Are you primarily interested in fix-and-flip, buy-and-hold, or other strategies?",
      "How many properties have you purchased with cash in the last 12 months?"
    ],
    purpose: "To assess the seriousness and capacity of a potential cash buyer."
  },
  propertyEnquiry: {
    questions: [
      "Can you provide more details about the property's current condition?",
      "What is the occupancy status of the property (owner-occupied, tenant, vacant)?",
      "Are there any HOA fees or restrictions associated with the property?",
      "When was the last major renovation or update (e.g., roof, HVAC)?",
      "What is the seller's flexibility on price and terms?"
    ],
    purpose: "To gather more in-depth information about a specific property."
  }
};

export const PROPERTY_DATA_POINTS_CHECKLIST = [
  "Owner Name(s) & Contact Info",
  "Full Property Address (Street, City, State, ZIP)",
  "Property Type (SFR, Condo, Multi-family, etc.)",
  "Bedrooms / Bathrooms / Square Footage / Lot Size",
  "Year Built / Last Renovation Date",
  "Assessed Value / Estimated Market Value",
  "Last Sale Date & Price",
  "Mortgage Information (Loan Amount, Lender, Interest Rate - if available)",
  "Tax Assessment & History",
  "Presence of Liens (Tax, HOA, Mechanic, etc.)",
  "Occupancy Status (Owner-occupied, Tenant, Vacant)",
  "School District Information",
  "Comparable Sales (Comps) in the Area",
  "Neighborhood Demographics & Trends",
  "Property Condition Notes / Photos (if available)"
];

export const FOLLOW_UP_MESSAGE_TEMPLATES = {
  initialContactSeller: {
    subject: "Regarding your property at [Property Address]",
    body: "Hi [Seller Name],\n\nMy name is [Your Name] and I'm interested in your property at [Property Address]. I came across it and wanted to see if you might be open to discussing a potential sale.\n\nWould you have a few minutes to chat this week?\n\nBest regards,\n[Your Name]\n[Your Contact Info]",
    channel: "Email"
  },
  initialContactBuyer: {
    subject: "Potential investment property: [Property Address]",
    body: "Hi [Buyer Name],\n\nI found a property at [Property Address] that seems to fit your investment criteria for [Criteria e.g., 'fix-and-flips in Anytown']. It features [Key Feature 1] and [Key Feature 2].\n\nAre you interested in learning more?\n\nThanks,\n[Your Name]\n[Your Contact Info]",
    channel: "Email"
  },
  genericFollowUp: {
    subject: "Following up on [Property Address / Lead Name]",
    body: "Hi [Contact Name],\n\nJust wanted to follow up on our previous conversation regarding [Property Address / Lead Name]. Do you have any updates or further questions for me at this time?\n\nLooking forward to hearing from you.\n\nSincerely,\n[Your Name]",
    channel: "Email/SMS"
  }
};

// This function can be updated or removed if not directly applicable.
// For now, it returns a generic set of techniques for "data analysis"
// instead of "genre specific enhancements".
export function getRealEstateAnalysisTechniques(analysisType: string) {
  const techniques: Record<string, {
    focus: string;
    methods: string[];
    dataSources: string[];
  }> = {
    marketAnalysis: {
      focus: "Understanding market trends and property values",
      methods: ["Comparable sales analysis (comps)", "Absorption rate calculation", "Price trend analysis"],
      dataSources: ["MLS data", "Public records", "Local market reports"]
    },
    leadQualification: {
      focus: "Identifying motivated sellers or serious buyers",
      methods: ["Asking probing questions", "Assessing financial capacity", "Understanding timelines and motivation"],
      dataSources: ["Direct communication", "Public records (liens, probate)", "Property data"]
    },
    propertyValuation: {
      focus: "Estimating the current market value of a property",
      methods: ["Sales comparison approach", "Income approach (for rentals)", "Cost approach (less common for MSP)"],
      dataSources: ["Recent sales data", "Rental income data", "Construction cost data"]
    }
  };
  return techniques[analysisType.toLowerCase()] || techniques.marketAnalysis;
}
