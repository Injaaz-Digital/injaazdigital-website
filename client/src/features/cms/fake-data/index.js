export const FAKE_BLOCKS = {
  'blocks.system-flow': {
    __component: 'blocks.system-flow',
    eyebrow: 'How It Works',
    heading: 'From Audit to Growth System',
    description: 'A structured three-phase process that turns your current website into a revenue-generating engine.',
    steps: [
      { title: 'Audit & Discovery', description: 'We analyze your current funnel, traffic data, and conversion gaps to find the highest-leverage opportunities.' },
      { title: 'Strategy & Design', description: 'We architect a conversion-driven experience rooted in your brand and backed by behavioral science.' },
      { title: 'Build & Optimize', description: 'We build, test, and iterate — launching a system designed to improve week over week.' },
    ],
    signals: [
      { title: 'Data-Backed Decisions', description: 'Every change is guided by real visitor behavior, not opinions.' },
      { title: 'Continuous Improvement', description: 'Post-launch, we monitor KPIs and refine for sustained growth.' },
    ],
    closingStatement: 'The result is a digital presence that works as hard as your team.',
  },

  'blocks.diagnosis': {
    __component: 'blocks.diagnosis',
    eyebrow: 'The Disconnect',
    heading: 'What Most Websites Get Wrong',
    description: 'The gap between a beautiful website and one that actually converts usually comes down to a few core issues.',
    items: [
      { visibleProblem: 'Beautiful design, low conversion', deeperSystem: 'The layout prioritizes aesthetics over decision-making flow. Visitors admire but don\'t act.' },
      { visibleProblem: 'High traffic, few booked calls', deeperSystem: 'There is no structured path from interest to commitment. CTAs compete with distractions.' },
      { visibleProblem: 'Great case studies, hidden from view', deeperSystem: 'Social proof is buried in a /case-studies page instead of placed near every decision point.' },
      { visibleProblem: 'Forms get abandoned', deeperSystem: 'Forms ask for too much too soon without building trust or showing what happens next.' },
    ],
    closingStatement: 'The fix is not a redesign. It is a re-architecture of how trust and action are woven into every scroll.',
  },

  'blocks.timeline': {
    __component: 'blocks.timeline',
    eyebrow: 'Milestones',
    heading: 'Your 90-Day Growth Timeline',
    description: 'From the first audit to a fully operational growth system, here is what you can expect.',
    stages: [
      { stepTitle: 'Discovery Sprint', deliverables: 'Funnel audit, competitor analysis, visitor behavior report, opportunity map.' },
      { stepTitle: 'Architecture Phase', deliverables: 'Wireframes, content strategy, CTA placement map, proof integration plan.' },
      { stepTitle: 'Build & Launch', deliverables: 'Fully built pages, CRM-connected forms, analytics setup, dashboard configuration.' },
      { stepTitle: 'Optimization Loop', deliverables: 'Post-launch review, KPI tracking dashboard, monthly refinement cycles.' },
    ],
  },

  'blocks.statement-pair': {
    __component: 'blocks.statement-pair',
    eyebrow: 'Our Philosophy',
    first: {
      label: 'The Belief',
      statement: 'Conversion is a byproduct of clarity.',
      explanation: '<p>When visitors understand exactly what you offer, why it matters, and what happens next — they convert. No tricks, no dark patterns. Just a system built for decision-making.</p>',
    },
    second: {
      label: 'The Commitment',
      statement: 'We build systems that compound.',
      explanation: '<p>We do not deliver a one-time redesign. We build a growth infrastructure that gets better every month — through data, iteration, and a relentless focus on the metrics that matter.</p>',
    },
  },

  'blocks.principles': {
    __component: 'blocks.principles',
    eyebrow: 'Why Injaaz Digital',
    heading: 'Built Different by Design',
    description: 'Six principles guide every decision we make — from how we structure a page to how we measure success.',
    items: [
      { title: 'Systems Over Pages', description: 'We do not build pages. We build systems that connect traffic to revenue.', image: { url: '/uploads/about_strategy_preview_31520b653a.jpg', alternativeText: 'Injaaz Digital strategy workspace' } },
      { title: 'Strategy Before Design', description: 'Every visual decision is rooted in a behavioral strategy. Form follows function.', image: { url: '/uploads/about_case_study_cover_aa228ef873.jpg', alternativeText: 'Digital strategy case study' } },
      { title: 'Technology That Serves', description: 'We use tools that amplify your team — not complicate your workflow.', image: { url: '/uploads/Generated_Image_October_06_2025_7_59_PM_2_upscayl_4x_upscayl_standard_4x_32ee5e22f1.png', alternativeText: 'Digital technology system' } },
      { title: 'Measured Relentlessly', description: 'If it cannot be tracked, it does not get built. Data is our compass.', image: { url: '/uploads/blog-demand-scorecard.png', alternativeText: 'Demand scorecard dashboard' } },
      { title: 'Built to Operate', description: 'Your team should be able to extend and update without calling us every time.', image: { url: '/uploads/blog-homepage-message-framework.png', alternativeText: 'Homepage message framework' } },
      { title: 'Feedback in the Loop', description: 'We iterate based on real user behavior, not assumptions.', image: { url: '/uploads/about_discuss_background_74716ba52a.jpg', alternativeText: 'Team discussion and feedback' } },
    ],
    directionHeading: 'Where We Are Heading',
    directionBody: '<p>We are building toward a future where every service brand has access to enterprise-grade conversion infrastructure without the enterprise price tag or complexity.</p>',
    closingStatement: 'Your growth system is the most important investment you will make this year.',
  },

  'blocks.animated-text': {
    __component: 'blocks.animated-text',
    eyebrow: 'The Vision',
    text: 'We help service brands turn attention into revenue through conversion-driven digital systems.',
    highlightedText: 'revenue conversion-driven',
    alignment: 'center',
    animationStyle: 'word-reveal',
    sticky: false,
  },

  'blocks.problem': {
    __component: 'blocks.problem',
    eyebrow: 'Where momentum gets lost',
    heading: 'The Three Places Growth Stalls',
    description: 'Most service brands face the same hidden bottlenecks — regardless of industry or size.',
    items: [
      { title: 'Message Clarity', description: 'Visitors cannot articulate what you do within 5 seconds. If they cannot say it, they cannot choose it.' },
      { title: 'Trust Architecture', description: 'Proof is scattered or absent. Visitors hesitate because they lack confidence signals near decision points.' },
      { title: 'Conversion Path', description: 'The journey from &ldquo;interested&rdquo; to &ldquo;booked&rdquo; has too many steps, too much friction, or too little guidance.' },
    ],
  },

  'blocks.service-overview': {
    __component: 'blocks.service-overview',
    eyebrow: 'What we build',
    heading: 'Two Systems, One Growth Engine',
    description: 'We offer two core services — each is a complete system, not a template.',
    services: [
      {
        title: 'Website Development',
        description: 'A conversion-optimized website built around your brand, your offer, and your ideal client journey.',
        iconKey: 'website-build',
        outcome: 'A site that converts 2-3x better within 90 days.',
        url: '/website-development',
        isActive: true,
        displayOrder: 1,
      },
      {
        title: 'Growth Dashboard',
        description: 'A real-time analytics dashboard that connects your marketing, pipeline, and revenue data in one place.',
        iconKey: 'growth-dashboard',
        outcome: 'Full visibility into what is driving revenue — updated daily.',
        url: '/growth-system',
        isActive: true,
        displayOrder: 2,
      },
    ],
  },

  'blocks.feature-list': {
    __component: 'blocks.feature-list',
    eyebrow: 'Built into the system',
    heading: 'What You Get With Every Engagement',
    description: 'Every project includes these core components — designed to work together as a unified growth system.',
    items: [
      { title: 'Conversion Architecture', description: 'Every page is structured to guide visitors toward a single meaningful action.' },
      { title: 'Proof Integration', description: 'Testimonials, case studies, and stats are woven into the experience — not hidden away.' },
      { title: 'CRM-Connected Forms', description: 'Lead capture flows directly into your CRM. No manual exports, no missed follow-ups.' },
      { title: 'Analytics Dashboard', description: 'A live dashboard shows you exactly how your site is performing — in plain language.' },
      { title: 'Mobile-First Design', description: 'Every system is built mobile-first. Over 60% of B2B research happens on mobile devices.' },
      { title: 'Ongoing Optimization', description: 'We monitor, test, and refine. Your system improves continuously based on real data.' },
    ],
  },

  'blocks.process': {
    __component: 'blocks.process',
    eyebrow: 'How it works',
    heading: 'Our Engagement Process',
    description: 'A structured partnership from discovery to long-term optimization.',
    steps: [
      { stepTitle: 'Discovery', deliverables: 'Understand your business, customers, and current digital performance.', successCriteria: 'Clear opportunity map and defined KPIs.', timeframe: 'Week 1-2' },
      { stepTitle: 'Strategy', deliverables: 'Design the information architecture, conversion paths, and content plan.', successCriteria: 'Approved wireframes and content strategy document.', timeframe: 'Week 3-4' },
      { stepTitle: 'Build', deliverables: 'Develop the full system with all pages, forms, dashboards, and integrations.', successCriteria: 'Fully functional system ready for QA.', timeframe: 'Week 5-8' },
      { stepTitle: 'Launch & Iterate', deliverables: 'Deploy, monitor, and begin optimization cycles based on real data.', successCriteria: 'System live with tracking confirmed.', timeframe: 'Week 9+' },
    ],
  },

  'blocks.final-cta': {
    __component: 'blocks.final-cta',
    eyebrow: 'Start with clarity',
    heading: 'Ready to Build a System That Actually Converts?',
    description: 'Book a 30-minute clarity call. No pitch, no pressure — just a conversation about your goals and whether we are the right fit.',
    primaryCta: { label: 'Book Your Clarity Call', url: '/book-call', style: 'default', isExternal: false },
    secondaryCta: { label: 'See Case Studies', url: '/case-studies', style: 'outline', isExternal: false },
  },

  'blocks.book-call': {
    __component: 'blocks.book-call',
    pageTitle: 'Book a Clarity Call',
    meetingName: 'Strategy Session',
    stepperKey: 'default',
    stepperVersion: 1,
    contactFields: { name: true, email: true, phone: false, company: true },
    sourcePage: '/demo',
    initialQuestions: [
      { id: 'goal', label: 'What is the primary goal for your website?', type: 'text' },
      { id: 'timeline', label: 'When are you looking to start?', type: 'select', options: ['ASAP', 'This month', 'Next quarter', 'Just exploring'] },
    ],
  },

  'blocks.hero': {
    __component: 'blocks.hero',
    title: 'Growth-First Digital Systems for Service Brands',
    subtitle: 'We build conversion-driven websites and dashboards that turn visitors into clients — predictably and at scale.',
    align: 'left',
    primaryCta: { label: 'Book a Call', url: '/book-call', style: 'default', isExternal: false },
    secondaryCta: { label: 'See How It Works', url: '/growth-engine', style: 'outline', isExternal: false },
  },

  'blocks.hero-minimal': {
    __component: 'blocks.hero-minimal',
    title: 'A Simpler Path to Better Conversions',
    subtitle: 'Minimal hero for blog pages and content-focused sections. Clean, readable, and purpose-driven.',
    align: 'center',
  },

  'blocks.dashboard-showcase': {
    __component: 'blocks.dashboard-showcase',
    badge: 'Real-time visibility',
    heading: 'Your Entire Pipeline at a Glance',
    description: 'A live dashboard that connects marketing, pipeline, and revenue data in one place — updated daily.',
    chartLabel: 'Revenue Performance',
    chartValue: '$128K',
    chartDelta: '+18% this month',
    stats: [
      { value: '$48.2K', label: 'Pipeline', hint: '+12% vs last month' },
      { value: '3.84%', label: 'CVR', hint: 'Landing to booked call' },
      { value: '126', label: 'Qualified leads', hint: 'Last 30 days' },
      { value: '19', label: 'Closed deals', hint: 'Tracked in CRM' },
    ],
    insights: [
      { title: 'Top segment', description: 'Service brands with structured offers are converting the fastest.' },
      { title: 'Best channel', description: 'Founder-led organic traffic produces the strongest close rate.' },
      { title: 'Next move', description: 'Tighten proof near CTA moments and shorten the booking path.' },
    ],
    primaryCta: { label: 'See the Dashboard', url: '/growth-system', style: 'default', isExternal: false },
    secondaryCta: { label: 'Learn More', url: '/features', style: 'outline', isExternal: false },
  },

  'blocks.problem': {
    __component: 'blocks.problem',
    eyebrow: 'The disconnect',
    heading: 'Three Reasons Visitors Do Not Convert',
    description: 'After analyzing hundreds of service brand websites, we keep seeing the same patterns.',
    bullets: [
      { title: 'Unclear Value Proposition', description: 'Visitors cannot articulate what you do within 5 seconds of landing.' },
      { title: 'Missing Trust Signals', description: 'Proof is either absent or hidden far from decision points.' },
      { title: 'High-Friction Booking Path', description: 'Too many steps, too many fields, too little reassurance along the way.' },
    ],
    insight: 'The fix is rarely a full redesign. Usually it is about restructuring what already exists around a conversion-first logic.',
  },

  'blocks.faq': {
    __component: 'blocks.faq',
    eyebrow: 'Common questions',
    heading: 'A clearer starting point.',
    description: 'Useful answers before choosing what to build.',
    items: [
      { question: 'What does Injaaz Digital build?', answer: 'Connected website and growth systems designed around clear business outcomes.' },
      { question: 'Do I need to know which service I need?', answer: 'No. The first conversation identifies the most useful place to begin.' },
      { question: 'Can you improve an existing system?', answer: 'Yes. We diagnose what works before recommending improvement or a focused rebuild.' },
    ],
  },

  'blocks.brand-proof-grid': {
    __component: 'blocks.brand-proof-grid',
    satisfactionPanel: {
      title: 'Clients Love the Process',
      description: '95% of clients say the strategic clarity alone was worth the investment.',
      ratingLabel: 'Overall satisfaction',
      reactionIcons: [
        { url: 'https://framerusercontent.com/images/9cX7K8RvwqWy3Lz1DpQdMn2mBg.svg', alt: 'heart' },
        { url: 'https://framerusercontent.com/images/9cX7K8RvwqWy3Lz1DpQdMn2mBg.svg', alt: 'fire' },
        { url: 'https://framerusercontent.com/images/9cX7K8RvwqWy3Lz1DpQdMn2mBg.svg', alt: 'star' },
      ],
    },
    strategyPanel: [
      {
        headline: 'Conversion-First Design',
        summary: 'Every pixel serves a purpose. We design for decision-making, not decoration.',
        badge: 'Our approach',
      },
      {
        headline: 'Data-Backed Decisions',
        summary: 'We measure everything so we can improve everything. No guesswork, just iteration.',
        badge: 'Continuous improvement',
      },
    ],
    consultationPanel: {
      headline: 'Talk to a Growth Architect',
      supportingNote: 'No sales pitch — just a conversation about your goals and whether we can help.',
      cta: { label: 'Book a Free Call', url: '/book-call', style: 'default', isExternal: false },
      teamMembers: [
        { fullName: 'Ayman', avatar: { url: 'https://ui-avatars.com/api/?name=Ayman&background=084299&color=fff' } },
        { fullName: 'Sarah', avatar: { url: 'https://ui-avatars.com/api/?name=Sarah&background=0b5da8&color=fff' } },
      ],
    },
    performancePanel: {
      headline: 'Real Metrics, Real Growth',
      summary: 'Average performance improvements across all client engagements.',
      metrics: [
        { label: 'CVR Improvement', value: '3.2x' },
        { label: 'Pipeline Growth', value: '+185%' },
        { label: 'Client Retention', value: '92%' },
      ],
    },
    caseStudyPanel: {
      headline: 'See a Real Transformation',
      resultLabel: 'Read the full case study →',
      cta: { label: 'View Case Study', url: '/case-studies', style: 'default' },
    },
    industriesPanel: {
      headline: 'Industries We Serve',
      items: [
        { name: 'Professional Services' },
        { name: 'B2B SaaS' },
        { name: 'Consulting' },
        { name: 'Financial Advisory' },
        { name: 'Healthcare' },
        { name: 'Real Estate' },
      ],
    },
    testimonialPanel: {
      clientName: 'Marcus Reed',
      clientRole: 'CEO, NexStep Consulting',
      quote: 'The clarity alone paid for itself in the first month.',
    },
  },

}

export const BLOCK_META = {
  'blocks.system-flow': { name: 'System Flow', description: 'Step-by-step flow with optional signals section.' },
  'blocks.diagnosis': { name: 'Diagnosis', description: 'Problem-diagnosis comparison rows.' },
  'blocks.timeline': { name: 'Timeline', description: 'Horizontal/vertical timeline of stages.' },
  'blocks.statement-pair': { name: 'Statement Pair', description: 'Two-column belief/commitment statements.' },
  'blocks.principles': { name: 'Principles', description: 'Principles list with mosaic or numbered layout.' },
  'blocks.animated-text': { name: 'Animated Text', description: 'Scroll-triggered word reveal animation.' },
  'blocks.problem': { name: 'Problem', description: 'Problem statement with indicator cards.' },
  'blocks.service-overview': { name: 'Service Overview', description: 'Services/offering overview with cards.' },
  'blocks.feature-list': { name: 'Feature List', description: 'Bulleted feature list with icons.' },
  'blocks.faq': { name: 'FAQ', description: 'Accessible expandable questions and answers.' },
  'blocks.process': { name: 'Process', description: 'Section-level process / phase breakdown.' },
  'blocks.final-cta': { name: 'Final CTA', description: 'Closing call-to-action with blinking squares.' },
  'blocks.book-call': { name: 'Book Call', description: 'Booking / caldendly-style call block.' },
  'blocks.hero': { name: 'Hero Default', description: 'Full hero with 3D cube and CTA.' },
  'blocks.hero-minimal': { name: 'Hero Minimal', description: 'Minimal hero variant for content pages.' },
  'blocks.dashboard-showcase': { name: 'Dashboard Showcase', description: 'Dashboard / analytics preview and stats.' },
  'blocks.problem': { name: 'Problem Block', description: 'Problem statement with bullet cards.' },
  'blocks.brand-proof-grid': { name: 'Brand Proof Grid', description: 'Full brand proof mosaic (7 panels).' },
}
