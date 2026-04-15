import type { AnalysisResult } from "@/lib/schemas";

// Oatly — well-known plant-based brand
const oatlyResult: AnalysisResult = {
  facts: [
    {
      id: "f1",
      claim: "Oatly produces oat-based dairy alternatives including oat milk, ice cream, and cooking products",
      support: "direct",
      sourceUrl: "https://www.oatly.com/",
      sourceSnippet: "We make products from oats — oat drink, cooking cream, ice cream, and more.",
    },
    {
      id: "f2",
      claim: "Products are available in retail stores and coffee shops globally",
      support: "direct",
      sourceUrl: "https://www.oatly.com/",
      sourceSnippet: "Find us in your local grocery store or favorite coffee shop.",
    },
    {
      id: "f3",
      claim: "Strong sustainability positioning — lower CO2 footprint than dairy",
      support: "direct",
      sourceUrl: "https://www.oatly.com/",
      sourceSnippet: "Our products generally have a significantly lower climate footprint than dairy.",
    },
    {
      id: "f4",
      claim: "Publicly traded company (NASDAQ: OTLY)",
      support: "direct",
      sourceUrl: "https://www.oatly.com/about",
      sourceSnippet: "Oatly Group AB is publicly traded on Nasdaq.",
    },
    {
      id: "f5",
      claim: "Operates in foodservice channel with barista-edition products",
      support: "direct",
      sourceUrl: "https://www.oatly.com/products",
      sourceSnippet: "Barista Edition — made to foam and perform in coffee.",
    },
    {
      id: "f6",
      claim: "Headquartered in Malmö, Sweden",
      support: "direct",
      sourceUrl: "https://www.oatly.com/about",
      sourceSnippet: "Headquartered in Malmö, Sweden.",
    },
    {
      id: "f7",
      claim: "Expanding into new product categories like frozen desserts and spreads",
      support: "inferred",
      sourceUrl: "https://www.oatly.com/products",
      sourceSnippet: "Product listings include ice cream, spreads, and cooking creams alongside core oat drinks.",
    },
  ],
  brief: [
    {
      title: "What They Do",
      content: "Oatly is a Swedish oat-based dairy alternative company producing oat milk, ice cream, cooking products, and spreads. They position heavily around sustainability and lower environmental impact versus dairy. Publicly traded on NASDAQ (OTLY).",
      factIds: ["f1", "f3", "f4", "f6"],
    },
    {
      title: "Who They Sell To",
      content: "Two primary channels: retail (grocery stores) and foodservice (coffee shops with Barista Edition). Global presence with strong penetration in Europe and North America.",
      factIds: ["f2", "f5"],
    },
    {
      title: "Pain Points & Challenges",
      content: "As a brand scaling across channels, Oatly faces distribution complexity, shelf-space competition with established dairy brands, and the challenge of maintaining sustainability messaging at scale. Category commoditization as competitors enter plant-based.",
      factIds: ["f1", "f2", "f7"],
    },
    {
      title: "Opportunities",
      content: "Expansion into new product categories (frozen, spreads) creates cross-sell opportunities. Foodservice channel (barista edition) is a premium positioning play. Sustainability narrative is increasingly valued by retailers and consumers.",
      factIds: ["f3", "f5", "f7"],
    },
    {
      title: "Assumptions to Validate",
      content: "• What percentage of revenue comes from foodservice vs retail?\n• Are they expanding into new geographies or consolidating existing markets?\n• How is category commoditization affecting their pricing power?\n• What's their innovation pipeline beyond current product lines?",
      factIds: [],
    },
  ],
  messaging: [
    {
      label: "Sustainability as Revenue Driver",
      hook: "Your sustainability story is a competitive moat — are you capitalizing on it in every buyer conversation?",
      valueProp: "We help brands like yours translate sustainability metrics into sales enablement assets that resonate with retail buyers and foodservice partners. Turn your lower-footprint positioning into concrete shelf-space wins.",
      suggestedCta: "Let me show you how other plant-based brands are using consumer trend data to win distribution deals.",
      factIds: ["f3", "f2", "f5"],
    },
    {
      label: "Cross-Channel Intelligence",
      hook: "You're in grocery stores AND coffee shops — are you seeing what's trending across both channels?",
      valueProp: "With products in retail and foodservice, you need real-time visibility into what consumers are choosing and why. Our platform surfaces cross-channel trends so your team can spot opportunities before competitors.",
      suggestedCta: "I can pull a quick snapshot of oat-milk trends across retail and foodservice — want to see it?",
      factIds: ["f2", "f5", "f7"],
    },
    {
      label: "New Category Launch Support",
      hook: "Expanding into frozen and spreads? The difference between success and shelf-pull is launch timing.",
      valueProp: "Our consumer demand data helps brands time new product launches to match rising interest, identify the right retail partners, and avoid categories that are already peaking.",
      suggestedCta: "Let's look at consumer interest curves for your new categories — 15 minutes, no commitment.",
      factIds: ["f7", "f1"],
    },
  ],
  crmNote: {
    companyName: "Oatly",
    accountType: "brand",
    summary: "Swedish oat-based dairy alternative company (NASDAQ: OTLY). Strong sustainability positioning, dual-channel presence in retail and foodservice (barista edition). Expanding into frozen desserts and spreads.",
    keyInsights: [
      "Dual-channel: retail grocery + foodservice (coffee shops)",
      "Sustainability is core brand differentiator — lower CO2 vs dairy",
      "Barista Edition is premium foodservice play",
      "Expanding product categories: frozen, spreads, cooking",
      "Publicly traded — revenue/growth data available",
    ],
    suggestedNextSteps: [
      "Send category trend report for oat-based alternatives",
      "Schedule 15-min intro showing cross-channel consumer insights",
      "Research their latest earnings call for strategic priorities",
    ],
    tags: ["plant-based", "oat-milk", "sustainability", "retail", "foodservice", "public-company", "CPG"],
    factIds: ["f1", "f2", "f3", "f4", "f5"],
  },
  verification: {
    unsupportedClaims: [
      {
        claim: "category commoditization as competitors enter plant-based",
        location: "brief",
        reason: "No mention of competitors or commoditization on scraped pages — this is industry inference, not site evidence.",
      },
    ],
    contradictions: [],
    evidenceCoverage: 88,
    warnings: [
      "1 claim in Pain Points section is based on general industry knowledge, not page evidence.",
      "Revenue split between retail and foodservice is listed as an assumption — good, this was not fabricated.",
    ],
  },
};

// Sysco — major foodservice distributor
const syscoResult: AnalysisResult = {
  facts: [
    {
      id: "f1",
      claim: "Sysco is the world's largest foodservice distributor",
      support: "direct",
      sourceUrl: "https://www.sysco.com/",
      sourceSnippet: "Sysco is the global leader in selling, marketing and distributing food products to restaurants, healthcare and educational facilities.",
    },
    {
      id: "f2",
      claim: "Serves restaurants, healthcare, education, and hospitality",
      support: "direct",
      sourceUrl: "https://www.sysco.com/",
      sourceSnippet: "We serve restaurants, healthcare, educational facilities, lodging, and other foodservice customers.",
    },
    {
      id: "f3",
      claim: "Offers Sysco-branded products alongside national brands",
      support: "direct",
      sourceUrl: "https://www.sysco.com/products",
      sourceSnippet: "Sysco Brand products deliver quality and value across every category.",
    },
    {
      id: "f4",
      claim: "Provides business consulting and technology solutions to customers",
      support: "direct",
      sourceUrl: "https://www.sysco.com/",
      sourceSnippet: "Beyond products — we offer technology, business consulting, and supply chain solutions.",
    },
    {
      id: "f5",
      claim: "Operates across the United States and internationally",
      support: "direct",
      sourceUrl: "https://www.sysco.com/about",
      sourceSnippet: "With operations in the U.S., Canada, the United Kingdom, France, and Sweden.",
    },
  ],
  brief: [
    {
      title: "What They Do",
      content: "Sysco is the world's largest foodservice distributor, selling and marketing food products along with technology and consulting services. They carry both national brands and their own Sysco-branded product lines.",
      factIds: ["f1", "f3", "f4"],
    },
    {
      title: "Who They Sell To",
      content: "Primarily serves restaurants, healthcare facilities, educational institutions, and hospitality/lodging. Multi-vertical customer base across the US and internationally (Canada, UK, France, Sweden).",
      factIds: ["f2", "f5"],
    },
    {
      title: "Pain Points & Challenges",
      content: "At their scale, key challenges include supply chain optimization across geographies, helping customers manage food costs amid inflation, and differentiating their value-add services (consulting, technology) from commodity distribution.",
      factIds: ["f4", "f5"],
    },
    {
      title: "Opportunities",
      content: "Their technology and consulting arm is a value-add differentiator that opens doors for data-driven partnerships. Sysco-brand products create private-label margins. Multi-country presence enables cross-border trend insights.",
      factIds: ["f3", "f4", "f5"],
    },
    {
      title: "Assumptions to Validate",
      content: "• What technology stack do they use for customer-facing tools?\n• How do they currently gather consumer trend data for their customers?\n• What's their appetite for AI-powered tools in sales enablement?\n• Which customer segments are growing fastest?",
      factIds: [],
    },
  ],
  messaging: [
    {
      label: "Data-Powered Distribution",
      hook: "Your customers rely on you for products — imagine if they relied on you for market intelligence too.",
      valueProp: "Consumer trend data helps your sales reps have smarter conversations with restaurant owners and institutional buyers. When you can show a chef what's trending before they ask, you're not just a distributor — you're a strategic partner.",
      suggestedCta: "Let me show you a trend snapshot for your top restaurant customer segment — takes 10 minutes.",
      factIds: ["f1", "f2", "f4"],
    },
    {
      label: "Private Label Optimization",
      hook: "Sysco Brand is your margin play — are you launching the right products at the right time?",
      valueProp: "Our platform identifies rising consumer demand signals that map to private-label opportunities. Launch Sysco-brand products into categories with growing demand and less competition.",
      suggestedCta: "Want to see which food categories are trending up in your top 3 verticals?",
      factIds: ["f3", "f2"],
    },
    {
      label: "Cross-Market Intelligence",
      hook: "You operate in 5+ countries — consumer trends don't respect borders, but most analytics tools do.",
      valueProp: "With operations spanning the US, Canada, UK, France, and Sweden, you have a unique opportunity to spot trends early in one market and capitalize in others. We provide cross-market consumer intelligence that travels with your supply chain.",
      suggestedCta: "I can pull a quick comparison of trending ingredients across your US and European markets.",
      factIds: ["f5", "f1"],
    },
  ],
  crmNote: {
    companyName: "Sysco",
    accountType: "distributor",
    summary: "World's largest foodservice distributor. Serves restaurants, healthcare, education, and hospitality across US and international markets. Differentiates via Sysco-brand products and technology/consulting services.",
    keyInsights: [
      "Largest foodservice distributor globally — massive reach",
      "Multi-vertical: restaurants, healthcare, education, hospitality",
      "Sysco Brand private label = margin opportunity",
      "Technology/consulting arm exists — open to data-driven tools",
      "International presence: US, Canada, UK, France, Sweden",
    ],
    suggestedNextSteps: [
      "Identify their current consumer insights tools/vendors",
      "Schedule intro targeting their technology/innovation team",
      "Prepare cross-market trend demo for US vs Europe",
    ],
    tags: ["foodservice", "distributor", "enterprise", "multi-vertical", "international", "private-label"],
    factIds: ["f1", "f2", "f3", "f4", "f5"],
  },
  verification: {
    unsupportedClaims: [],
    contradictions: [],
    evidenceCoverage: 92,
    warnings: [
      "Pain Points section includes reasonable industry inferences but the specific challenges (inflation, commodity differentiation) are not stated on the website.",
    ],
  },
};

export const DEMO_FIXTURES: Record<string, { result: AnalysisResult; accountType: string }> = {
  "oatly.com": { result: oatlyResult, accountType: "brand" },
  "www.oatly.com": { result: oatlyResult, accountType: "brand" },
  "sysco.com": { result: syscoResult, accountType: "distributor" },
  "www.sysco.com": { result: syscoResult, accountType: "distributor" },
};

export function getDemoFixture(url: string): AnalysisResult | null {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    const key = Object.keys(DEMO_FIXTURES).find(
      (k) => k.replace(/^www\./, "") === hostname
    );
    return key ? DEMO_FIXTURES[key].result : null;
  } catch {
    return null;
  }
}

export function isDemoUrl(url: string): boolean {
  return getDemoFixture(url) !== null;
}
