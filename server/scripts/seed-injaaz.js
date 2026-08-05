'use strict';

const { compileStrapi, createStrapi } = require('@strapi/strapi');
const { UIDS, SINGLE_TYPE_UIDS } = require('./seed-injaaz/registry');
const { getJourneyPages, getOffers } = require('./seed-injaaz/journey-content');

const SEED_NAMESPACE = 'injaaz-bootstrap';
const SEED_VERSION = process.env.SEED_INJAAZ_BOOTSTRAP_VERSION || 'v13';
const FORCE_SEED = process.argv.includes('--force') || process.env.SEED_INJAAZ_FORCE === 'true';
const ACTIVE_LOCALES = ['en', 'ar'];
const DEFAULT_LOCALE = 'en';

const cta = (label, url, style = 'primary') => ({
  label,
  url,
  style,
  isExternal: false,
});

const listItem = (title, description, icon = '') => ({
  title,
  description,
  icon,
});

const processStep = (stepTitle, deliverables, successCriteria = '') => ({
  stepTitle,
  deliverables,
  successCriteria,
});

const metric = (value, label, hint) => ({
  value,
  label,
  hint,
});

const faq = (question, answer) => ({
  question,
  answer,
});

const siteSettingData = {
  siteName: 'Injaaz Digital',
  defaultLocale: 'en',
  header: {
    logoText: 'Injaaz Digital',
    showLanguageSwitcher: true,
    navLinks: [
      cta('Home', '/'),
      cta('About', '/about'),
      cta('Blog', '/blog'),
    ],
    servicesLabel: 'Services',
    serviceLinks: [
      cta('Growth Engine', '/growth-system'),
      cta('Website Engine', '/website-development'),
    ],
    primaryCta: cta('Start a conversation', '/book-call'),
  },
  footer: {
    tagline: 'Digital systems through which intention becomes meaningful achievement.',
    contactEmail: 'hello@injaazdigital.com',
    columns: [
      {
        title: 'Services',
        links: [
          cta('Growth Engine', '/growth-system'),
          cta('Website Engine', '/website-development'),
          cta('Book a call', '/book-call'),
        ],
      },
      {
        title: 'Company',
        links: [
          cta('Home', '/'),
          cta('About', '/about'),
          cta('Blog', '/blog'),
          cta('Book a call', '/book-call'),
        ],
      },
      {
        title: 'Resources',
        links: [
          cta('Privacy Policy', '/privacy-policy'),
          cta('Terms of Service', '/terms-of-service'),
        ],
      },
    ],
    socialLinks: [
      {
        label: 'LinkedIn',
        url: 'https://linkedin.com/company/injaaz-digital',
        isExternal: true,
        style: 'primary',
      },
      {
        label: 'Instagram',
        url: 'https://instagram.com/injaaz.digital',
        isExternal: true,
        style: 'primary',
      },
      {
        label: 'Dribbble',
        url: 'https://dribbble.com/injaazdigital',
        isExternal: true,
        style: 'primary',
      },
    ],
    legalLinks: [
      cta('Privacy', '/privacy-policy'),
      cta('Terms', '/terms-of-service'),
    ],
    copyright: '© 2026 Injaaz Digital. All rights reserved.',
  },
  defaultSeo: {
    metaTitle: 'Injaaz Digital',
    metaDescription: 'Digital systems for customer acquisition, strategic websites, and measurable business growth.',
    keywords: 'customer acquisition, website development, digital systems, business growth',
    canonicalUrl: '/',
    noIndex: false,
  },
};

const siteSettingDataAr = {
  siteName: 'إنجاز ديجيتال',
  defaultLocale: 'en',
  header: {
    logoText: 'إنجاز ديجيتال',
    showLanguageSwitcher: true,
    navLinks: [
      cta('الرئيسية', '/'),
      cta('عن إنجاز', '/about'),
      cta('المدونة', '/blog'),
    ],
    servicesLabel: 'الخدمات',
    serviceLinks: [
      cta('محرك النمو', '/growth-system'),
      cta('محرك الموقع', '/website-development'),
    ],
    primaryCta: cta('ابدأ محادثة', '/book-call'),
  },
  footer: {
    tagline: 'أنظمة رقمية تتحول عبرها النية إلى إنجاز ذي معنى.',
    contactEmail: 'hello@injaazdigital.com',
    columns: [
      {
        title: 'الخدمات',
        links: [
          cta('محرك النمو', '/growth-system'),
          cta('محرك الموقع', '/website-development'),
          cta('احجز مكالمة', '/book-call'),
        ],
      },
      {
        title: 'الشركة',
        links: [
          cta('الرئيسية', '/'),
          cta('عن إنجاز', '/about'),
          cta('المدونة', '/blog'),
          cta('احجز مكالمة', '/book-call'),
        ],
      },
      {
        title: 'روابط',
        links: [
          cta('سياسة الخصوصية', '/privacy-policy'),
          cta('شروط الخدمة', '/terms-of-service'),
        ],
      },
    ],
    socialLinks: [
      {
        label: 'LinkedIn',
        url: 'https://linkedin.com/company/injaaz-digital',
        isExternal: true,
        style: 'primary',
      },
      {
        label: 'Instagram',
        url: 'https://instagram.com/injaaz.digital',
        isExternal: true,
        style: 'primary',
      },
      {
        label: 'Dribbble',
        url: 'https://dribbble.com/injaazdigital',
        isExternal: true,
        style: 'primary',
      },
    ],
    legalLinks: [
      cta('الخصوصية', '/privacy-policy'),
      cta('الشروط', '/terms-of-service'),
    ],
    copyright: '© 2026 إنجاز ديجيتال. جميع الحقوق محفوظة.',
  },
  defaultSeo: {
    metaTitle: 'إنجاز ديجيتال',
    metaDescription: 'أنظمة رقمية لاكتساب العملاء وبناء المواقع ونمو الأعمال القابل للقياس.',
    keywords: 'اكتساب العملاء, تطوير المواقع, الأنظمة الرقمية, نمو الأعمال',
    canonicalUrl: '/',
    noIndex: false,
  },
};

const legacyPages = [
  {
    slug: 'home',
    title: 'Home',
    seo: {
      metaTitle: 'Injaaz Digital | Websites and Growth Systems',
      metaDescription: 'Build a professional online presence and turn attention into organized leads and sales conversations.',
      keywords: 'Injaaz Digital, premium website development, digital growth system',
      canonicalUrl: '/',
      noIndex: false,
    },
    blocks: [
      {
        __component: 'blocks.hero',
        title: 'Build your online presence. Turn it into growth.',
        subtitle:
          'We help creators, consultants, and businesses build professional websites and digital growth systems that make their offer clear, capture leads, and create a smoother path from attention to sales.',
        primaryCta: cta('Book a call', '/book-call'),
        secondaryCta: cta('Explore services', '/website-development', 'secondary'),
        align: 'left',
      },
      {
        __component: 'blocks.service-overview',
        heading: 'Two focused services for a cleaner digital engine.',
        description: 'Injaaz Digital keeps the offer simple: a serious website first, then a growth system that makes demand easier to manage.',
        services: [
          listItem(
            'Premium Website Development',
            'A refined, responsive website that clarifies your positioning, improves trust, and gives prospects a direct path to contact you.',
            'website-build'
          ),
          listItem(
            'Digital Growth System',
            'A connected funnel, lead capture, tracking, and follow-up structure that turns attention into organized sales conversations.',
            'growth-dashboard'
          ),
        ],
      },
      {
        __component: 'blocks.problem',
        heading: 'A digital presence should not make prospects work this hard.',
        description: 'Most businesses lose momentum because their offer is unclear, their website feels unfinished, or leads arrive without a system.',
        items: [
          listItem('Unclear positioning', 'Visitors need to understand who you help, what you do, and why it matters within seconds.'),
          listItem('Weak conversion path', 'A polished page still underperforms when the next step is buried, vague, or disconnected.'),
          listItem('Scattered follow-up', 'Leads are easier to close when capture, tracking, and WhatsApp follow-up are structured from the start.'),
        ],
      },
      {
        __component: 'blocks.process',
        heading: 'A measured process from clarity to improvement.',
        description: 'Diagnose, Structure, Build, Launch, Improve.',
        steps: [
          processStep('Diagnose', 'Audit the current offer, audience, website, funnel, and sales path.'),
          processStep('Structure', 'Turn the offer into a clear page flow, message hierarchy, and conversion plan.'),
          processStep('Build', 'Design and implement the pages, forms, tracking, and handoff points.'),
          processStep('Launch', 'Publish the system with analytics, contact paths, and quality checks in place.'),
          processStep('Improve', 'Review performance and refine copy, content direction, and conversion points.'),
        ],
      },
      {
        __component: 'blocks.dashboard-showcase',
        heading: 'The outcome is a digital presence that feels easier to trust.',
        description: 'Every page and system is built to reduce confusion before a prospect ever reaches out.',
        items: [
          metric('Clear', 'Offer', 'Visitors understand what you do and where to go next.'),
          metric('Fast', 'Contact path', 'WhatsApp and contact actions are direct, visible, and mobile-ready.'),
          metric('Tracked', 'Growth system', 'Leads and key actions are easier to review and improve.'),
        ],
      },
      {
        __component: 'blocks.final-cta',
        heading: 'Ready to make your online presence easier to trust and easier to act on?',
        description: 'Start with a focused call. We will review the offer, the path to leads, and the most practical next build.',
        primaryCta: cta('Book a call', '/book-call'),
        secondaryCta: cta('View Growth System', '/growth-system', 'secondary'),
      },
    ],
  },
  {
    slug: 'website-development',
    title: 'Website Development',
    seo: {
      metaTitle: 'Premium Website Development | Injaaz Digital',
      metaDescription: 'A premium, conversion-focused website for a clearer offer, stronger trust, and smoother contact flow.',
      keywords: 'premium website development, conversion website, responsive website',
      canonicalUrl: '/website-development',
      noIndex: false,
    },
    blocks: [
      {
        __component: 'blocks.page-hero',
        title: 'A website that makes your business look serious, clear, and trustworthy.',
        description:
          'We design and build premium websites that clarify your positioning, present your offer with confidence, and guide visitors toward the right contact action.',
        primaryCta: cta('Book a website call', '/book-call'),
        secondaryCta: cta('See the process', '#process', 'secondary'),
        imageKeyword: 'premium-website-interface',
      },
      {
        __component: 'blocks.feature-list',
        heading: 'Everything your website needs to carry the offer with confidence.',
        description: 'The focus is not decoration. It is clarity, perceived trust, responsive execution, and a contact path that works.',
        items: [
          listItem('Clear positioning', 'Messaging that makes the audience, offer, and reason to act immediately understandable.'),
          listItem('Premium visual direction', 'A calm, elevated interface that helps the business feel credible without looking generic.'),
          listItem('Conversion-focused structure', 'Sections arranged around attention, proof, objections, and action instead of random content blocks.'),
          listItem('Responsive implementation', 'Pages are built to feel clean and usable across desktop, tablet, and mobile.'),
          listItem('WhatsApp/contact flow', 'Primary actions are direct, visible, and aligned with how prospects actually prefer to reach out.'),
          listItem('SEO/analytics basics', 'Metadata, page structure, and analytics foundations are prepared before launch.'),
        ],
      },
      {
        __component: 'blocks.process',
        heading: 'A direct build process with fewer vague handoffs.',
        description: 'Discovery, Structure, Design, Development, Launch.',
        steps: [
          processStep('Discovery', 'Clarify the offer, audience, goals, existing assets, and strongest proof points.'),
          processStep('Structure', 'Map the page hierarchy, conversion flow, section order, and calls to action.'),
          processStep('Design', 'Create a premium visual direction that matches the business and keeps the page easy to scan.'),
          processStep('Development', 'Build the responsive frontend and connect the content model cleanly through Strapi.'),
          processStep('Launch', 'Run quality checks, metadata review, analytics basics, and final contact-flow testing.'),
        ],
      },
      {
        __component: 'blocks.dashboard-showcase',
        heading: 'What the website is built to improve.',
        items: [
          metric('Trust', 'First impression', 'A serious visual system that supports the value of the offer.'),
          metric('Clarity', 'Message flow', 'Visitors can understand the business without piecing together scattered information.'),
          metric('Action', 'Contact flow', 'The next step is obvious across every important viewport.'),
        ],
      },
      {
        __component: 'legacy.faq',
        heading: 'Website development questions',
        items: [
          faq('Can the website content be edited later?', 'Yes. The page copy and sections are managed through Strapi so the frontend is not the place where marketing copy has to live.'),
          faq('Do you include mobile design?', 'Yes. Responsive implementation is part of the build, not an afterthought.'),
          faq('Do you set up tracking?', 'The launch includes SEO and analytics basics so the website can be reviewed and improved after publishing.'),
        ],
      },
      {
        __component: 'blocks.final-cta',
        heading: 'Build a website that makes the offer easier to believe.',
        description: 'Use the call to clarify scope, priorities, and the cleanest path to launch.',
        primaryCta: cta('Book a website call', '/book-call'),
        secondaryCta: cta('Explore Growth System', '/growth-system', 'secondary'),
      },
    ],
  },
  {
    slug: 'growth-system',
    title: 'Growth System',
    seo: {
      metaTitle: 'Digital Growth System | Injaaz Digital',
      metaDescription: 'Turn attention into leads and leads into organized WhatsApp and sales conversations.',
      keywords: 'digital growth system, lead capture, funnel structure, WhatsApp follow-up',
      canonicalUrl: '/growth-system',
      noIndex: false,
    },
    blocks: [
      {
        __component: 'blocks.page-hero',
        title: 'Turn attention into leads. Turn leads into organized sales conversations.',
        description:
          'We connect landing pages, lead capture, tracking, WhatsApp follow-up, and content direction into a practical system that helps demand move somewhere useful.',
        primaryCta: cta('Book a growth call', '/book-call'),
        secondaryCta: cta('View website service', '/website-development', 'secondary'),
        imageKeyword: 'growth-dashboard-sales',
      },
      {
        __component: 'blocks.feature-list',
        heading: 'A system for the full path from interest to follow-up.',
        description: 'The goal is to make lead generation more structured, visible, and reviewable.',
        items: [
          listItem('Funnel structure', 'Define the path from first touch to lead capture and sales conversation.'),
          listItem('Landing page', 'Build or refine the page that turns campaign attention into a clear next step.'),
          listItem('Lead capture', 'Create the form, routing, and confirmation experience needed to collect qualified interest.'),
          listItem('CRM/tracking', 'Organize leads and key actions so performance can be reviewed instead of guessed.'),
          listItem('WhatsApp follow-up', 'Shape a practical follow-up path that matches how many prospects prefer to communicate.'),
          listItem('Content direction', 'Connect content themes to the offer, funnel stage, and sales conversation.'),
          listItem('Analytics/review', 'Review what is happening and improve weak points after launch.'),
        ],
      },
      {
        __component: 'blocks.process',
        heading: 'A practical build path for cleaner growth operations.',
        description: 'Diagnose flow, Design journey, Build assets, Launch system, Optimize.',
        steps: [
          processStep('Diagnose flow', 'Review the current audience path, content, website, forms, and follow-up process.'),
          processStep('Design journey', 'Map the user journey from attention to lead capture to WhatsApp or sales conversation.'),
          processStep('Build assets', 'Create the landing page, capture points, tracking setup, and follow-up structure.'),
          processStep('Launch system', 'Publish the funnel with routing, analytics, and contact handoff in place.'),
          processStep('Optimize', 'Review performance and improve copy, content direction, lead quality, and conversion points.'),
        ],
      },
      {
        __component: 'blocks.dashboard-showcase',
        heading: 'What becomes easier to manage.',
        items: [
          metric('Leads', 'Captured', 'Interest has a clear destination instead of disappearing across channels.'),
          metric('Follow-up', 'Organized', 'Sales conversations are easier to track and continue.'),
          metric('Reviews', 'Actionable', 'Analytics and lead flow reveal what needs to improve next.'),
        ],
      },
      {
        __component: 'legacy.faq',
        heading: 'Growth system questions',
        items: [
          faq('Is this only for paid ads?', 'No. The system can support organic content, direct outreach, campaigns, and existing audience attention.'),
          faq('Do I need a website first?', 'A strong website helps, but the growth system can also start with a focused landing page and lead capture path.'),
          faq('What are the current services?', 'The current services are Premium Website Development and Digital Growth System.'),
        ],
      },
      {
        __component: 'blocks.final-cta',
        heading: 'Give every lead a clearer path from interest to conversation.',
        description: 'Use the call to map the current flow and identify the highest-leverage system to build first.',
        primaryCta: cta('Book a growth call', '/book-call'),
        secondaryCta: cta('View Website Development', '/website-development', 'secondary'),
      },
    ],
  },
  {
    slug: 'about',
    title: 'About',
    seo: {
      metaTitle: 'About Injaaz Digital',
      metaDescription: 'A practical digital studio helping businesses turn clearer offers into websites, funnels, and organized growth systems.',
      keywords: 'Injaaz Digital, digital studio, website development, growth systems',
      canonicalUrl: '/about',
      noIndex: false,
    },
    blocks: [
      {
        __component: 'blocks.page-hero',
        title: 'A focused digital partner for clearer websites and cleaner growth systems.',
        description:
          'Injaaz Digital helps businesses structure their offer, build a serious web presence, and connect lead capture with practical follow-up.',
        primaryCta: cta('Book a call', '/book-call'),
        secondaryCta: cta('View services', '/website-development', 'secondary'),
        imageKeyword: 'digital-studio-team',
      },
      {
        __component: 'blocks.problem',
        heading: 'Why the work stays focused.',
        description: 'Most digital projects fail when strategy, page structure, content, and follow-up are treated as separate pieces.',
        items: [
          listItem('Clear before complex', 'The offer, audience, and next action are clarified before adding more pages or tools.'),
          listItem('Built for trust', 'The visual system is shaped to make the business feel credible, current, and easy to understand.'),
          listItem('Connected to action', 'Forms, WhatsApp paths, analytics, and booking flows are treated as part of the experience.'),
        ],
      },
      {
        __component: 'blocks.dashboard-showcase',
        heading: 'What clients should feel after launch.',
        description: 'The website and growth path should be easier to explain, easier to manage, and easier to improve.',
        items: [
          metric('Sharper', 'Positioning', 'The business can explain its offer with less friction.'),
          metric('Cleaner', 'Experience', 'Visitors can scan, trust, and act without confusion.'),
          metric('Visible', 'Lead flow', 'New opportunities are easier to capture and review.'),
        ],
      },
      {
        __component: 'blocks.final-cta',
        heading: 'Start with the digital path that needs the most clarity.',
        description: 'Use a focused call to decide whether the first priority is the website, the funnel, or the full growth system.',
        primaryCta: cta('Book a call', '/book-call'),
        secondaryCta: cta('Explore Growth System', '/growth-system', 'secondary'),
      },
    ],
  },
];

const legacyPagesAr = [
  {
    slug: 'home',
    title: 'الرئيسية',
    seo: {
      metaTitle: 'إنجاز ديجيتال | مواقع وأنظمة نمو',
      metaDescription: 'ابن حضورا رقميا احترافيا وحول الانتباه إلى عملاء محتملين ومحادثات بيع منظمة.',
      keywords: 'إنجاز ديجيتال, تطوير مواقع احترافية, نظام نمو رقمي',
      canonicalUrl: '/',
      noIndex: false,
    },
    blocks: [
      {
        __component: 'blocks.hero',
        title: 'ابن حضورك الرقمي. وحوله إلى نمو.',
        subtitle:
          'نساعد المبدعين والاستشاريين والشركات على بناء مواقع احترافية وأنظمة نمو رقمية توضّح العرض، تجمع العملاء المحتملين، وتجعل الطريق من الانتباه إلى البيع أكثر سلاسة.',
        primaryCta: cta('احجز مكالمة', '/book-call'),
        secondaryCta: cta('استكشف الخدمات', '/website-development', 'secondary'),
        align: 'left',
      },
      {
        __component: 'blocks.service-overview',
        heading: 'خدمتان واضحتان لبناء محرك رقمي أنظف.',
        description: 'نحافظ على بساطة العرض: موقع جاد أولا، ثم نظام نمو يجعل إدارة الطلب أسهل.',
        services: [
          listItem(
            'تطوير مواقع احترافية',
            'موقع متجاوب ومصمم بعناية يوضح تموضعك، يعزز الثقة، ويمنح العملاء المحتملين طريقا مباشرا للتواصل.',
            'website-build'
          ),
          listItem(
            'نظام نمو رقمي',
            'قمع واضح، التقاط عملاء محتملين، تتبع، ومسار متابعة يحول الانتباه إلى محادثات بيع منظمة.',
            'growth-dashboard'
          ),
        ],
      },
      {
        __component: 'blocks.problem',
        heading: 'حضورك الرقمي لا يجب أن يجعل العميل يبذل جهدا لفهمك.',
        description: 'كثير من الأعمال تخسر الزخم لأن العرض غير واضح، الموقع يبدو غير مكتمل، أو العملاء المحتملون يصلون بلا نظام.',
        items: [
          listItem('تموضع غير واضح', 'يجب أن يفهم الزائر من تخدم، ماذا تقدم، ولماذا يهم ذلك خلال ثوان قليلة.'),
          listItem('مسار تحويل ضعيف', 'حتى الصفحة الجميلة لا تحقق نتائج عندما تكون الخطوة التالية غامضة أو مخفية.'),
          listItem('متابعة مشتتة', 'إغلاق الفرص يصبح أسهل عندما يكون الالتقاط، التتبع، والمتابعة عبر واتساب منظما من البداية.'),
        ],
      },
      {
        __component: 'blocks.process',
        heading: 'عملية هادئة من الوضوح إلى التحسين.',
        description: 'نشخص، نهيكل، نبني، نطلق، نحسن.',
        steps: [
          processStep('نشخص', 'نراجع العرض الحالي، الجمهور، الموقع، القمع، ومسار البيع.'),
          processStep('نهيكل', 'نحوّل العرض إلى تدفق صفحات واضح، تسلسل رسائل، وخطة تحويل.'),
          processStep('نبني', 'نصمم وننفذ الصفحات، النماذج، التتبع، ونقاط التسليم.'),
          processStep('نطلق', 'ننشر النظام مع التحليلات، مسارات التواصل، وفحوصات الجودة.'),
          processStep('نحسن', 'نراجع الأداء ونحسن النصوص، اتجاه المحتوى، ونقاط التحويل.'),
        ],
      },
      {
        __component: 'blocks.dashboard-showcase',
        heading: 'النتيجة حضور رقمي أسهل في الفهم والثقة.',
        description: 'كل صفحة وكل نظام يبنى لتقليل الحيرة قبل أن يتواصل العميل المحتمل.',
        items: [
          metric('واضح', 'العرض', 'يفهم الزائر ما تقدمه وأين يتجه بعد ذلك.'),
          metric('سريع', 'مسار التواصل', 'إجراءات واتساب والتواصل مباشرة وواضحة ومناسبة للجوال.'),
          metric('قابل للقياس', 'نظام النمو', 'تصبح العملاء المحتملون والإجراءات المهمة أسهل في المراجعة والتحسين.'),
        ],
      },
      {
        __component: 'blocks.final-cta',
        heading: 'هل تريد حضورا رقميا أسهل في الثقة وأسهل في اتخاذ القرار؟',
        description: 'ابدأ بمكالمة مركزة. نراجع العرض، مسار العملاء المحتملين، وأفضل خطوة عملية للبناء.',
        primaryCta: cta('احجز مكالمة', '/book-call'),
        secondaryCta: cta('شاهد نظام النمو', '/growth-system', 'secondary'),
      },
    ],
  },
  {
    slug: 'website-development',
    title: 'تطوير المواقع',
    seo: {
      metaTitle: 'تطوير مواقع احترافية | إنجاز ديجيتال',
      metaDescription: 'موقع احترافي وموجه للتحويل يساعد على توضيح العرض، رفع الثقة، وتسهيل التواصل.',
      keywords: 'تطوير مواقع احترافية, موقع تحويل, موقع متجاوب',
      canonicalUrl: '/website-development',
      noIndex: false,
    },
    blocks: [
      {
        __component: 'blocks.page-hero',
        title: 'موقع يجعل عملك يبدو جادا، واضحا، وجديرا بالثقة.',
        description:
          'نصمم ونبني مواقع احترافية توضّح تموضعك، تعرض عرضك بثقة، وتوجه الزائر نحو إجراء التواصل المناسب.',
        primaryCta: cta('احجز مكالمة للموقع', '/book-call'),
        secondaryCta: cta('شاهد العملية', '#process', 'secondary'),
        imageKeyword: 'premium-website-interface',
      },
      {
        __component: 'blocks.feature-list',
        heading: 'كل ما يحتاجه موقعك ليحمل العرض بثقة.',
        description: 'التركيز ليس على الزخرفة. التركيز على الوضوح، الثقة، التنفيذ المتجاوب، ومسار تواصل يعمل.',
        items: [
          listItem('تموضع واضح', 'رسائل تجعل الجمهور، العرض، وسبب اتخاذ القرار مفهوما بسرعة.'),
          listItem('اتجاه بصري احترافي', 'واجهة هادئة وراقية تساعد العمل على الظهور بمصداقية بدون قالب عام.'),
          listItem('بنية موجهة للتحويل', 'أقسام مرتبة حول الانتباه، البرهان، الاعتراضات، والإجراء بدل محتوى عشوائي.'),
          listItem('تنفيذ متجاوب', 'صفحات تعمل بنظافة وسهولة على سطح المكتب، الجهاز اللوحي، والجوال.'),
          listItem('مسار واتساب وتواصل', 'إجراءات رئيسية واضحة ومباشرة ومتوافقة مع طريقة تواصل العملاء.'),
          listItem('أساسيات SEO والتحليلات', 'تهيئة البيانات، بنية الصفحة، وأساسيات القياس قبل الإطلاق.'),
        ],
      },
      {
        __component: 'blocks.process',
        heading: 'عملية بناء مباشرة بدون تسليمات غامضة.',
        description: 'اكتشاف، هيكلة، تصميم، تطوير، إطلاق.',
        steps: [
          processStep('اكتشاف', 'نوضح العرض، الجمهور، الأهداف، الأصول الحالية، وأقوى نقاط الإثبات.'),
          processStep('هيكلة', 'نرسم ترتيب الصفحة، مسار التحويل، ترتيب الأقسام، والدعوات إلى الإجراء.'),
          processStep('تصميم', 'نصمم اتجاها بصريا احترافيا يناسب العمل ويحافظ على سهولة التصفح.'),
          processStep('تطوير', 'نبني الواجهة المتجاوبة ونربط نموذج المحتوى بنظافة عبر Strapi.'),
          processStep('إطلاق', 'نجري فحوصات الجودة، مراجعة البيانات، أساسيات التحليلات، واختبار مسار التواصل.'),
        ],
      },
      {
        __component: 'blocks.dashboard-showcase',
        heading: 'ما الذي صمم الموقع لتحسينه؟',
        items: [
          metric('ثقة', 'الانطباع الأول', 'نظام بصري جاد يدعم قيمة العرض.'),
          metric('وضوح', 'تدفق الرسالة', 'يفهم الزائر العمل دون تجميع معلومات مشتتة.'),
          metric('إجراء', 'مسار التواصل', 'الخطوة التالية واضحة في كل شاشة مهمة.'),
        ],
      },
      {
        __component: 'legacy.faq',
        heading: 'أسئلة تطوير المواقع',
        items: [
          faq('هل يمكن تعديل محتوى الموقع لاحقا؟', 'نعم. نصوص الصفحة والأقسام تدار من Strapi، لذلك لا يجب أن يعيش النص التسويقي داخل الواجهة.'),
          faq('هل يشمل العمل تصميم الجوال؟', 'نعم. التنفيذ المتجاوب جزء من البناء، وليس إضافة لاحقة.'),
          faq('هل يتم إعداد التتبع؟', 'يشمل الإطلاق أساسيات SEO والتحليلات حتى يمكن مراجعة الموقع وتحسينه بعد النشر.'),
        ],
      },
      {
        __component: 'blocks.final-cta',
        heading: 'ابن موقعا يجعل عرضك أسهل في التصديق.',
        description: 'استخدم المكالمة لتوضيح النطاق، الأولويات، وأقصر طريق نظيف للإطلاق.',
        primaryCta: cta('احجز مكالمة للموقع', '/book-call'),
        secondaryCta: cta('استكشف نظام النمو', '/growth-system', 'secondary'),
      },
    ],
  },
  {
    slug: 'growth-system',
    title: 'نظام النمو',
    seo: {
      metaTitle: 'نظام نمو رقمي | إنجاز ديجيتال',
      metaDescription: 'حوّل الانتباه إلى عملاء محتملين، وحوّل العملاء المحتملين إلى محادثات واتساب ومبيعات منظمة.',
      keywords: 'نظام نمو رقمي, التقاط العملاء المحتملين, هيكلة القمع, متابعة واتساب',
      canonicalUrl: '/growth-system',
      noIndex: false,
    },
    blocks: [
      {
        __component: 'blocks.page-hero',
        title: 'حوّل الانتباه إلى عملاء محتملين. وحوّلهم إلى محادثات بيع منظمة.',
        description:
          'نربط صفحات الهبوط، التقاط العملاء المحتملين، التتبع، متابعة واتساب، واتجاه المحتوى داخل نظام عملي يجعل الطلب يتحرك إلى مكان مفيد.',
        primaryCta: cta('احجز مكالمة للنمو', '/book-call'),
        secondaryCta: cta('شاهد خدمة الموقع', '/website-development', 'secondary'),
        imageKeyword: 'growth-dashboard-sales',
      },
      {
        __component: 'blocks.feature-list',
        heading: 'نظام للمسار الكامل من الاهتمام إلى المتابعة.',
        description: 'الهدف أن يصبح توليد العملاء المحتملين أكثر تنظيما ووضوحا وقابلية للمراجعة.',
        items: [
          listItem('هيكلة القمع', 'تحديد الطريق من أول انتباه إلى التقاط العميل المحتمل ومحادثة البيع.'),
          listItem('صفحة هبوط', 'بناء أو تحسين الصفحة التي تحول انتباه الحملات إلى خطوة واضحة.'),
          listItem('التقاط العملاء المحتملين', 'إنشاء النموذج، التوجيه، وتجربة التأكيد لجمع اهتمام مؤهل.'),
          listItem('CRM وتتبع', 'تنظيم العملاء المحتملين والإجراءات المهمة حتى لا يعتمد الأداء على التخمين.'),
          listItem('متابعة واتساب', 'بناء مسار متابعة عملي يناسب طريقة تواصل كثير من العملاء.'),
          listItem('اتجاه المحتوى', 'ربط موضوعات المحتوى بالعرض، مرحلة القمع، ومحادثة البيع.'),
          listItem('تحليلات ومراجعة', 'مراجعة ما يحدث وتحسين نقاط الضعف بعد الإطلاق.'),
        ],
      },
      {
        __component: 'blocks.process',
        heading: 'طريق بناء عملي لعمليات نمو أوضح.',
        description: 'تشخيص التدفق، تصميم الرحلة، بناء الأصول، إطلاق النظام، التحسين.',
        steps: [
          processStep('تشخيص التدفق', 'نراجع مسار الجمهور الحالي، المحتوى، الموقع، النماذج، وعملية المتابعة.'),
          processStep('تصميم الرحلة', 'نرسم رحلة المستخدم من الانتباه إلى التقاط العميل المحتمل ثم واتساب أو محادثة البيع.'),
          processStep('بناء الأصول', 'ننشيء صفحة الهبوط، نقاط الالتقاط، إعداد التتبع، وهيكل المتابعة.'),
          processStep('إطلاق النظام', 'ننشر القمع مع التوجيه، التحليلات، وتسليمات التواصل.'),
          processStep('التحسين', 'نراجع الأداء ونحسن النصوص، اتجاه المحتوى، جودة العملاء المحتملين، ونقاط التحويل.'),
        ],
      },
      {
        __component: 'blocks.dashboard-showcase',
        heading: 'ما الذي يصبح أسهل في الإدارة؟',
        items: [
          metric('عملاء محتملون', 'يتم التقاطهم', 'الاهتمام يصبح له وجهة واضحة بدل أن يضيع بين القنوات.'),
          metric('متابعة', 'منظمة', 'تصبح محادثات البيع أسهل في التتبع والاستمرار.'),
          metric('مراجعات', 'قابلة للتنفيذ', 'تكشف التحليلات وتدفق العملاء ما يجب تحسينه لاحقا.'),
        ],
      },
      {
        __component: 'legacy.faq',
        heading: 'أسئلة نظام النمو',
        items: [
          faq('هل هذا مخصص للإعلانات المدفوعة فقط؟', 'لا. يمكن للنظام دعم المحتوى العضوي، التواصل المباشر، الحملات، والانتباه الموجود من الجمهور.'),
          faq('هل أحتاج إلى موقع أولا؟', 'وجود موقع قوي يساعد، لكن يمكن أن يبدأ نظام النمو بصفحة هبوط مركزة ومسار التقاط واضح.'),
          faq('ما هي الخدمات الحالية؟', 'الخدمات الحالية هي تطوير المواقع الاحترافية ونظام النمو الرقمي.'),
        ],
      },
      {
        __component: 'blocks.final-cta',
        heading: 'امنح كل عميل محتمل طريقا أوضح من الاهتمام إلى المحادثة.',
        description: 'استخدم المكالمة لرسم التدفق الحالي وتحديد أعلى نظام عملي يجب بناؤه أولا.',
        primaryCta: cta('احجز مكالمة للنمو', '/book-call'),
        secondaryCta: cta('شاهد تطوير المواقع', '/website-development', 'secondary'),
      },
    ],
  },
  {
    slug: 'about',
    title: 'عن إنجاز ديجيتال',
    seo: {
      metaTitle: 'عن إنجاز ديجيتال',
      metaDescription: 'استوديو رقمي عملي يساعد الأعمال على تحويل العروض الواضحة إلى مواقع، قنوات تحويل، وأنظمة نمو منظمة.',
      keywords: 'إنجاز ديجيتال, استوديو رقمي, تطوير المواقع, أنظمة النمو',
      canonicalUrl: '/about',
      noIndex: false,
    },
    blocks: [
      {
        __component: 'blocks.page-hero',
        title: 'شريك رقمي مركز لمواقع أوضح وأنظمة نمو أنظف.',
        description:
          'تساعد إنجاز ديجيتال الأعمال على هيكلة العرض، بناء حضور ويب جاد، وربط التقاط العملاء المحتملين بمتابعة عملية.',
        primaryCta: cta('احجز مكالمة', '/book-call'),
        secondaryCta: cta('شاهد الخدمات', '/website-development', 'secondary'),
        imageKeyword: 'digital-studio-team',
      },
      {
        __component: 'blocks.problem',
        heading: 'لماذا يبقى العمل مركزا؟',
        description: 'تفشل كثير من المشاريع الرقمية عندما يتم فصل الاستراتيجية، بنية الصفحة، المحتوى، والمتابعة عن بعضها.',
        items: [
          listItem('الوضوح قبل التعقيد', 'نوضح العرض، الجمهور، والخطوة التالية قبل إضافة صفحات أو أدوات أكثر.'),
          listItem('مبني للثقة', 'يتشكل النظام البصري ليجعل العمل يبدو موثوقا، حديثا، وسهل الفهم.'),
          listItem('مرتبط بالإجراء', 'النماذج، مسارات واتساب، التحليلات، والحجز تعتبر جزءا من التجربة.'),
        ],
      },
      {
        __component: 'blocks.dashboard-showcase',
        heading: 'ما الذي يجب أن يشعر به العميل بعد الإطلاق؟',
        description: 'يجب أن يصبح الموقع ومسار النمو أسهل في الشرح، الإدارة، والتحسين.',
        items: [
          metric('أوضح', 'تموضع', 'يمكن للعمل شرح عرضه باحتكاك أقل.'),
          metric('أنظف', 'تجربة', 'يستطيع الزائر التصفح، الثقة، واتخاذ الإجراء بدون حيرة.'),
          metric('مرئي', 'تدفق العملاء', 'تصبح الفرص الجديدة أسهل في الالتقاط والمراجعة.'),
        ],
      },
      {
        __component: 'blocks.final-cta',
        heading: 'ابدأ بالمسار الرقمي الذي يحتاج إلى أكبر قدر من الوضوح.',
        description: 'استخدم مكالمة مركزة لتحديد هل الأولوية هي الموقع، القمع، أو نظام النمو الكامل.',
        primaryCta: cta('احجز مكالمة', '/book-call'),
        secondaryCta: cta('استكشف نظام النمو', '/growth-system', 'secondary'),
      },
    ],
  },
];

const siteSettingsByLocale = {
  en: siteSettingData,
  ar: siteSettingDataAr,
};

const SUPPORTED_PAGE_BLOCKS = new Set([
  'blocks.hero',
  'blocks.page-hero',
  'blocks.animated-text',
  'blocks.problem',
  'blocks.service-overview',
  'blocks.feature-list',
  'blocks.faq',
  'blocks.process',
  'blocks.final-cta',
  'blocks.book-call',
  'blocks.system-flow',
  'blocks.diagnosis',
  'blocks.timeline',
  'blocks.statement-pair',
  'blocks.principles',
  'blocks.dashboard-showcase',
  'blocks.booking-meeting',
  'blocks.brand-proof-grid',
]);

const organizePages = (locale) => getJourneyPages(locale).map((page) => {
  const supportedBlocks = page.blocks.filter((block) => SUPPORTED_PAGE_BLOCKS.has(block.__component));

  if (page.slug !== 'home') {
    return { ...page, blocks: supportedBlocks };
  }

  const pick = (uid) => supportedBlocks.find((block) => block.__component === uid);
  return {
    ...page,
    blocks: [
      pick('blocks.hero'),
      pick('blocks.animated-text'),
      pick('blocks.problem'),
      pick('blocks.service-overview'),
      pick('blocks.principles'),
      pick('blocks.faq'),
      pick('blocks.final-cta'),
    ].filter(Boolean),
  };
});

const pages = organizePages('en');
const pagesAr = organizePages('ar');
const offers = getOffers('en');
const offersAr = getOffers('ar');
const offersByLocale = { en: offers, ar: offersAr };

const pagesByLocale = {
  en: pages,
  ar: pagesAr,
};

const bookCallBlockSettingsByLocale = {
  en: {
    introEyebrow: 'Injaaz Digital',
    pageTitle: 'Book a Strategy Call',
    qualificationIntroTitle: 'Fit questions',
    contactStepTitle: 'Your contact details',
    contactStepHelp: 'Used only to prepare and confirm your booking.',
    bookingTitle: 'Choose a time',
    successTitle: 'Your strategy call is booked',
    fallbackTitle: 'We need more context before booking',
    fallbackDescription: 'Your answers were saved. We can review the request and follow up directly.',
  },
  ar: {
    introEyebrow: 'Injaaz Digital',
    pageTitle: 'احجز مكالمة استراتيجية',
    qualificationIntroTitle: 'أسئلة الملاءمة',
    contactStepTitle: 'بيانات التواصل',
    contactStepHelp: 'تستخدم فقط للتحضير للحجز وتأكيده.',
    bookingTitle: 'اختر الوقت المناسب',
    successTitle: 'تم حجز المكالمة بنجاح',
    fallbackTitle: 'نحتاج سياقا إضافيا قبل الحجز',
    fallbackDescription: 'تم حفظ إجاباتك. يمكننا مراجعة الطلب والتواصل معك مباشرة.',
  },
};

const leadQuestionsByLocale = {
  en: [
    {
      key: 'service_interest',
      title: 'What do you want help with first?',
      type: 'radio',
      order: 1,
      weight: 0,
      required: true,
      active: true,
      category: 'qualification',
      helpText: 'Choose the closest priority. We can refine the scope during the call.',
      options: [
        { label: 'Growth Engine', value: 'growth-system', score: 3 },
        { label: 'Website Engine', value: 'website-development', score: 3 },
        { label: 'A connected combination', value: 'connected-engines', score: 4 },
        { label: 'I am not sure yet', value: 'not-sure', score: 1 },
      ],
    },
    {
      key: 'project_stage',
      title: 'Where is the business or project today?',
      type: 'radio',
      order: 2,
      weight: 0,
      required: true,
      active: true,
      category: 'qualification',
      helpText: 'This helps us understand how much structure already exists.',
      options: [
        { label: 'Established business with an active offer', value: 'established-business', score: 3 },
        { label: 'Already getting leads or sales, but the system is messy', value: 'active-leads', score: 4 },
        { label: 'Launching soon with a clear offer', value: 'launching-soon', score: 2 },
        { label: 'Still validating the idea', value: 'idea-stage', score: 0 },
      ],
    },
    {
      key: 'current_problem',
      title: 'What is the main business-system problem you want to solve?',
      type: 'textarea',
      order: 3,
      weight: 1,
      required: true,
      active: true,
      category: 'qualification',
      helpText: 'Write the business problem, not only the feature request.',
      placeholder: 'Example: our offer is unclear, leads are scattered, the site does not convert...',
    },
    {
      key: 'budget_range',
      title: 'What investment range are you prepared to discuss?',
      type: 'radio',
      order: 4,
      weight: 0,
      required: true,
      active: true,
      category: 'qualification',
      helpText: 'A realistic range helps keep the call practical.',
      options: [
        { label: 'Less than $1,000', value: 'under-1000', score: 0 },
        { label: '$1,000 - $3,000', value: '1000-3000', score: 2 },
        { label: '$3,000 - $7,000', value: '3000-7000', score: 3 },
        { label: '$7,000+', value: '7000-plus', score: 4 },
        { label: 'Not sure yet', value: 'not-sure', score: 1 },
      ],
    },
    {
      key: 'timeline',
      title: 'When do you want to start?',
      type: 'radio',
      order: 5,
      weight: 0,
      required: true,
      active: true,
      category: 'qualification',
      helpText: 'Timing tells us whether the next step should be planning, build, or cleanup.',
      options: [
        { label: 'Immediately', value: 'immediately', score: 3 },
        { label: 'Within 30-60 days', value: '30-60-days', score: 3 },
        { label: 'In 2-3 months', value: '2-3-months', score: 2 },
        { label: 'No clear timeline yet', value: 'no-clear-timeline', score: 0 },
      ],
    },
    {
      key: 'decision_owner',
      title: 'Who will decide on the project?',
      type: 'radio',
      order: 6,
      weight: 0,
      required: true,
      active: true,
      category: 'qualification',
      helpText: 'The call works best when the decision maker or owner is involved.',
      options: [
        { label: 'I am the owner or decision maker', value: 'owner-decision-maker', score: 2 },
        { label: 'I decide with one partner or manager', value: 'shared-decision', score: 1 },
        { label: 'I am researching for someone else', value: 'researching', score: 0 },
      ],
    },
  ],
  ar: [
    {
      key: 'service_interest',
      title: 'ما الذي تريد المساعدة فيه أولا؟',
      type: 'radio',
      order: 1,
      weight: 0,
      required: true,
      active: true,
      category: 'qualification',
      helpText: 'اختر الأولوية الأقرب. يمكننا توضيح النطاق أثناء المكالمة.',
      options: [
        { label: 'محرك النمو', value: 'growth-system', score: 3 },
        { label: 'محرك الموقع', value: 'website-development', score: 3 },
        { label: 'مجموعة مترابطة', value: 'connected-engines', score: 4 },
        { label: 'لست متأكدا بعد', value: 'not-sure', score: 1 },
      ],
    },
    {
      key: 'project_stage',
      title: 'أين يقف العمل أو المشروع اليوم؟',
      type: 'radio',
      order: 2,
      weight: 0,
      required: true,
      active: true,
      category: 'qualification',
      helpText: 'يساعدنا هذا على فهم مقدار الهيكلة الموجودة حاليا.',
      options: [
        { label: 'عمل قائم لديه عرض واضح', value: 'established-business', score: 3 },
        { label: 'تصلنا عملاء أو مبيعات لكن النظام غير منظم', value: 'active-leads', score: 4 },
        { label: 'نستعد للإطلاق مع عرض واضح', value: 'launching-soon', score: 2 },
        { label: 'ما زلنا نتحقق من الفكرة', value: 'idea-stage', score: 0 },
      ],
    },
    {
      key: 'current_problem',
      title: 'ما مشكلة نظام العمل الرئيسية التي تريد حلها؟',
      type: 'textarea',
      order: 3,
      weight: 1,
      required: true,
      active: true,
      category: 'qualification',
      helpText: 'اكتب مشكلة العمل، وليس فقط الميزة المطلوبة.',
      placeholder: 'مثال: العرض غير واضح، العملاء المحتملون مشتتون، الموقع لا يحول...',
    },
    {
      key: 'budget_range',
      title: 'ما نطاق الاستثمار الذي أنت مستعد لمناقشته؟',
      type: 'radio',
      order: 4,
      weight: 0,
      required: true,
      active: true,
      category: 'qualification',
      helpText: 'النطاق الواقعي يجعل المكالمة عملية.',
      options: [
        { label: 'أقل من 1,000 دولار', value: 'under-1000', score: 0 },
        { label: '1,000 - 3,000 دولار', value: '1000-3000', score: 2 },
        { label: '3,000 - 7,000 دولار', value: '3000-7000', score: 3 },
        { label: 'أكثر من 7,000 دولار', value: '7000-plus', score: 4 },
        { label: 'لست متأكدا بعد', value: 'not-sure', score: 1 },
      ],
    },
    {
      key: 'timeline',
      title: 'متى تريد البدء؟',
      type: 'radio',
      order: 5,
      weight: 0,
      required: true,
      active: true,
      category: 'qualification',
      helpText: 'التوقيت يوضح هل الخطوة التالية تخطيط أم بناء أم ترتيب.',
      options: [
        { label: 'فورا', value: 'immediately', score: 3 },
        { label: 'خلال 30-60 يوما', value: '30-60-days', score: 3 },
        { label: 'خلال شهرين إلى ثلاثة', value: '2-3-months', score: 2 },
        { label: 'لا يوجد توقيت واضح بعد', value: 'no-clear-timeline', score: 0 },
      ],
    },
    {
      key: 'decision_owner',
      title: 'من سيتخذ قرار المشروع؟',
      type: 'radio',
      order: 6,
      weight: 0,
      required: true,
      active: true,
      category: 'qualification',
      helpText: 'تكون المكالمة أفضل عندما يكون صاحب القرار أو صاحب العمل مشاركا.',
      options: [
        { label: 'أنا صاحب العمل أو صاحب القرار', value: 'owner-decision-maker', score: 2 },
        { label: 'أقرر مع شريك أو مدير', value: 'shared-decision', score: 1 },
        { label: 'أبحث نيابة عن شخص آخر', value: 'researching', score: 0 },
      ],
    },
  ],
};

const calendarSettingData = {
  calendarName: 'Strategy calls',
  googleCalendarId: 'primary',
  weeklyAvailability: [
    { day: 'monday', enabled: true, startTime: '09:00', endTime: '17:00' },
    { day: 'tuesday', enabled: true, startTime: '09:00', endTime: '17:00' },
    { day: 'wednesday', enabled: true, startTime: '09:00', endTime: '17:00' },
    { day: 'thursday', enabled: true, startTime: '09:00', endTime: '17:00' },
    { day: 'friday', enabled: true, startTime: '09:00', endTime: '16:00' },
    { day: 'saturday', enabled: false, startTime: '09:00', endTime: '17:00' },
    { day: 'sunday', enabled: false, startTime: '09:00', endTime: '17:00' },
  ],
  workingDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  startTime: '09:00',
  endTime: '17:00',
  slotDuration: 30,
  bufferBefore: 0,
  bufferAfter: 15,
  bufferTime: 15,
  timezone: 'Africa/Casablanca',
  minNoticeHours: 4,
  maxDaysAhead: 21,
  maxBookingsPerDay: 4,
  questionsBeforeBookingEnabled: true,
  qualificationThreshold: 8,
  meetingTitle: 'Injaaz Digital Strategy Call',
  meetingDuration: 30,
  meetingLocation: 'Google Meet',
  autoCreateGoogleMeet: true,
  calendarId: 'primary',
};

pages.push({
  slug: 'book-call',
  title: 'Book a Strategy Call',
  seo: {
    metaTitle: 'Book a Strategy Call | Injaaz Digital',
    metaDescription: 'Answer a few fit questions and choose a time for an Injaaz Digital strategy call.',
    keywords: 'book strategy call, digital growth consultation, website consultation',
    canonicalUrl: '/book-call',
    noIndex: false,
  },
  blocks: [
    {
      __component: 'blocks.book-call',
      ...bookCallBlockSettingsByLocale.en,
    },
  ],
});

pagesAr.push({
  slug: 'book-call',
  title: 'احجز مكالمة استراتيجية',
  seo: {
    metaTitle: 'احجز مكالمة استراتيجية | إنجاز ديجيتال',
    metaDescription: 'أجب عن أسئلة الملاءمة واختر وقتا لمكالمة استراتيجية مع إنجاز ديجيتال.',
    keywords: 'احجز مكالمة, استشارة نمو رقمي, استشارة موقع',
    canonicalUrl: '/book-call',
    noIndex: false,
  },
  blocks: [
    {
      __component: 'blocks.book-call',
      ...bookCallBlockSettingsByLocale.ar,
    },
  ],
});

const SINGLE_PAGE_SLUGS = new Set(['home', 'about']);
const REQUIRED_PAGE_SLUGS = new Set(pages.filter((page) => !SINGLE_PAGE_SLUGS.has(page.slug)).map((page) => page.slug));

const nowIso = () => new Date().toISOString();

const toTimestamp = (value) => {
  const dateValue = value ? new Date(value).getTime() : 0;
  return Number.isFinite(dateValue) ? dateValue : 0;
};

const pickCanonicalSingleTypeDocument = (rows) => {
  const grouped = rows.reduce((accumulator, row) => {
    const key = row.documentId;
    if (!key) {
      return accumulator;
    }

    if (!accumulator[key]) {
      accumulator[key] = {
        documentId: key,
        locales: new Set(),
        hasDefaultLocale: false,
        latestUpdatedAt: 0,
      };
    }

    accumulator[key].locales.add(row.locale);
    accumulator[key].hasDefaultLocale = accumulator[key].hasDefaultLocale || row.locale === 'en';
    accumulator[key].latestUpdatedAt = Math.max(accumulator[key].latestUpdatedAt, toTimestamp(row.updatedAt));
    return accumulator;
  }, {});

  const candidates = Object.values(grouped);
  if (candidates.length === 0) {
    return null;
  }

  candidates.sort((left, right) => {
    const localeCountDiff = right.locales.size - left.locales.size;
    if (localeCountDiff !== 0) {
      return localeCountDiff;
    }

    if (left.hasDefaultLocale !== right.hasDefaultLocale) {
      return right.hasDefaultLocale ? 1 : -1;
    }

    return right.latestUpdatedAt - left.latestUpdatedAt;
  });

  return candidates[0].documentId;
};

async function ensureSingleTypeCanonicalDocuments(strapi, uid) {
  const rows = await strapi.db.query(uid).findMany({
    select: ['id', 'documentId', 'locale', 'updatedAt'],
  });

  const documentIds = [...new Set((rows || []).map((row) => row.documentId).filter(Boolean))];
  if (documentIds.length <= 1) {
    return;
  }

  const canonicalDocumentId = pickCanonicalSingleTypeDocument(rows);
  const obsoleteDocumentIds = documentIds.filter((documentId) => documentId !== canonicalDocumentId);

  for (const documentId of obsoleteDocumentIds) {
    const localesForDocument = [...new Set(rows.filter((row) => row.documentId === documentId).map((row) => row.locale))];

    for (const locale of localesForDocument) {
      await strapi.documents(uid).delete({
        documentId,
        locale,
      });
    }
  }
}

async function ensureLocales(strapi) {
  try {
    const localeQuery = strapi.db.query('plugin::i18n.locale');
    const existing = await localeQuery.findMany({
      where: {
        code: {
          $in: ACTIVE_LOCALES,
        },
      },
    });

    const existingCodes = new Set((existing || []).map((entry) => entry.code));

    if (!existingCodes.has('en')) {
      await localeQuery.create({
        data: {
          name: 'English (en)',
          code: 'en',
          isDefault: true,
        },
      });
    }

    if (!existingCodes.has('ar')) {
      await localeQuery.create({
        data: {
          name: 'Arabic (ar)',
          code: 'ar',
          isDefault: false,
        },
      });
    }
  } catch (error) {
    strapi.log.warn(`Locale setup skipped: ${error.message}`);
  }
}

async function ensurePublicReadPermissions(strapi) {
  const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
    where: {
      type: 'public',
    },
  });

  if (!publicRole?.id) {
    return;
  }

  const actions = [
    `${UIDS.siteSetting}.find`,
    `${UIDS.blogPage}.find`,
    `${UIDS.homePage}.find`,
    `${UIDS.aboutPage}.find`,
    `${UIDS.page}.find`,
    `${UIDS.page}.findOne`,
    `${UIDS.article}.find`,
    `${UIDS.article}.findOne`,
    `${UIDS.author}.find`,
    `${UIDS.author}.findOne`,
    `${UIDS.tag}.find`,
    `${UIDS.tag}.findOne`,
    `${UIDS.category}.find`,
    `${UIDS.category}.findOne`,
    `${UIDS.offer}.find`,
    `${UIDS.offer}.findOne`,
  ];

  const permissionQuery = strapi.db.query('plugin::users-permissions.permission');

  for (const action of actions) {
    const existing = await permissionQuery.findOne({
      where: {
        action,
        role: publicRole.id,
      },
    });

    if (existing?.id) {
      if (!existing.enabled) {
        await permissionQuery.update({
          where: { id: existing.id },
          data: { enabled: true },
        });
      }
      continue;
    }

    await permissionQuery.create({
      data: {
        action,
        role: publicRole.id,
        enabled: true,
      },
    });
  }
}

async function publishDocument(strapi, uid, documentId, locale = DEFAULT_LOCALE) {
  if (!documentId) {
    return;
  }

  try {
    await strapi.documents(uid).publish({
      documentId,
      locale,
    });
  } catch (error) {
    strapi.log.debug(`Publish skipped for ${uid}:${documentId}: ${error.message}`);
  }
}

async function upsertDocumentLocale(strapi, uid, documentId, locale, data) {
  const saved = await strapi.documents(uid).update({
    documentId,
    locale,
    data,
    status: 'published',
  });

  await publishDocument(strapi, uid, saved?.documentId || documentId, locale);
  return saved;
}

async function upsertSingleTypeLocales(strapi, uid, dataByLocale) {
  const rows = await strapi.db.query(uid).findMany({
    select: ['documentId', 'locale', 'updatedAt'],
  });

  let documentId = pickCanonicalSingleTypeDocument(rows || []);
  const service = strapi.documents(uid);
  const defaultData = dataByLocale[DEFAULT_LOCALE];

  if (!documentId) {
    const saved = await service.create({
      locale: DEFAULT_LOCALE,
      data: defaultData,
      status: 'published',
    });
    documentId = saved?.documentId;
    await publishDocument(strapi, uid, documentId, DEFAULT_LOCALE);
  } else {
    await upsertDocumentLocale(strapi, uid, documentId, DEFAULT_LOCALE, defaultData);
  }

  for (const locale of ACTIVE_LOCALES.filter((entry) => entry !== DEFAULT_LOCALE)) {
    if (!dataByLocale[locale]) continue;
    await upsertDocumentLocale(strapi, uid, documentId, locale, dataByLocale[locale]);
  }
}

async function upsertSingleType(strapi, uid, data) {
  const existing = await strapi.entityService.findMany(uid);

  if (existing?.id) {
    await strapi.entityService.update(uid, existing.id, {
      data,
    });
    return;
  }

  await strapi.entityService.create(uid, {
    data,
  });
}

const toPageData = (page) => ({
  title: page.title,
  slug: page.slug,
  seo: page.seo,
  blocks: page.blocks,
});

const toSinglePageData = (page) => ({
  title: page.title,
  seo: page.seo,
  blocks: page.blocks,
});

async function deleteDuplicateSlugDocuments(strapi, uid, slug, canonicalDocumentId) {
  const rows = await strapi.db.query(uid).findMany({
    select: ['documentId', 'locale'],
    where: {
      slug,
    },
  });

  const duplicates = (rows || []).filter((row) => row.documentId && row.documentId !== canonicalDocumentId);
  const seen = new Set();

  for (const duplicate of duplicates) {
    const key = `${duplicate.documentId}:${duplicate.locale}`;
    if (seen.has(key)) continue;
    seen.add(key);

    await strapi.documents(uid).delete({
      documentId: duplicate.documentId,
      locale: duplicate.locale,
    });
  }
}

async function findDocumentIdBySlug(strapi, uid, slug) {
  const rows = await strapi.db.query(uid).findMany({
    select: ['documentId', 'locale', 'updatedAt'],
    where: {
      slug,
    },
  });

  if (!rows?.length) {
    return null;
  }

  const defaultLocaleRow = rows.find((row) => row.locale === DEFAULT_LOCALE && row.documentId);
  if (defaultLocaleRow?.documentId) {
    return defaultLocaleRow.documentId;
  }

  return rows.find((row) => row.documentId)?.documentId || null;
}

async function deleteDuplicateFieldDocuments(strapi, uid, fieldName, fieldValue, canonicalDocumentId) {
  const rows = await strapi.db.query(uid).findMany({
    select: ['documentId', 'locale'],
    where: {
      [fieldName]: fieldValue,
    },
  });

  const duplicates = (rows || []).filter((row) => row.documentId && row.documentId !== canonicalDocumentId);
  const seen = new Set();

  for (const duplicate of duplicates) {
    const key = `${duplicate.documentId}:${duplicate.locale}`;
    if (seen.has(key)) continue;
    seen.add(key);

    await strapi.documents(uid).delete({
      documentId: duplicate.documentId,
      locale: duplicate.locale,
    });
  }
}

async function findDocumentIdByField(strapi, uid, fieldName, fieldValue) {
  const rows = await strapi.db.query(uid).findMany({
    select: ['documentId', 'locale', 'updatedAt'],
    where: {
      [fieldName]: fieldValue,
    },
  });

  if (!rows?.length) {
    return null;
  }

  const defaultLocaleRow = rows.find((row) => row.locale === DEFAULT_LOCALE && row.documentId);
  if (defaultLocaleRow?.documentId) {
    return defaultLocaleRow.documentId;
  }

  return rows.find((row) => row.documentId)?.documentId || null;
}

async function upsertLocalizedEntry(strapi, uid, defaultEntry, localizedEntriesByLocale, uniqueField) {
  const service = strapi.documents(uid);
  const uniqueValue = defaultEntry[uniqueField];
  let documentId = await findDocumentIdByField(strapi, uid, uniqueField, uniqueValue);

  if (!documentId) {
    const saved = await service.create({
      locale: DEFAULT_LOCALE,
      data: defaultEntry,
      status: 'published',
    });
    documentId = saved?.documentId;
    await publishDocument(strapi, uid, documentId, DEFAULT_LOCALE);
  } else {
    await deleteDuplicateFieldDocuments(strapi, uid, uniqueField, uniqueValue, documentId);
    await upsertDocumentLocale(strapi, uid, documentId, DEFAULT_LOCALE, defaultEntry);
  }

  for (const locale of ACTIVE_LOCALES.filter((entry) => entry !== DEFAULT_LOCALE)) {
    const localizedEntry = localizedEntriesByLocale[locale]?.find((entry) => entry[uniqueField] === uniqueValue);
    if (!localizedEntry) continue;

    await upsertDocumentLocale(strapi, uid, documentId, locale, localizedEntry);
  }
}

async function upsertLocalizedPage(strapi, uid, defaultPage, localizedPagesByLocale) {
  const service = strapi.documents(uid);
  const defaultData = toPageData(defaultPage);
  let documentId = await findDocumentIdBySlug(strapi, uid, defaultPage.slug);

  if (!documentId) {
    const saved = await service.create({
      locale: DEFAULT_LOCALE,
      data: defaultData,
      status: 'published',
    });
    documentId = saved?.documentId;
    await publishDocument(strapi, uid, documentId, DEFAULT_LOCALE);
  } else {
    await deleteDuplicateSlugDocuments(strapi, uid, defaultPage.slug, documentId);
    await upsertDocumentLocale(strapi, uid, documentId, DEFAULT_LOCALE, defaultData);
  }

  for (const locale of ACTIVE_LOCALES.filter((entry) => entry !== DEFAULT_LOCALE)) {
    const localizedPage = localizedPagesByLocale[locale]?.find((page) => page.slug === defaultPage.slug);
    if (!localizedPage) continue;

    await upsertDocumentLocale(strapi, uid, documentId, locale, toPageData(localizedPage));
  }
}

async function deleteObsoletePages(strapi) {
  const rows = await strapi.db.query(UIDS.page).findMany({
    select: ['documentId', 'locale', 'slug'],
  });
  const seen = new Set();

  for (const row of rows || []) {
    if (!row.documentId || REQUIRED_PAGE_SLUGS.has(row.slug)) {
      continue;
    }

    const key = `${row.documentId}:${row.locale}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);

    await strapi.documents(UIDS.page).delete({
      documentId: row.documentId,
      locale: row.locale,
    });
  }
}

async function getHomepageOfferRelationsByLocale(strapi) {
  const rows = await strapi.db.query(UIDS.offer).findMany({
    select: ['documentId', 'locale', 'displayOrder'],
    where: {
      isActive: true,
      featuredOnHomepage: true,
      publishedAt: { $notNull: true },
    },
    orderBy: [{ displayOrder: 'asc' }, { id: 'asc' }],
  });

  return Object.fromEntries(ACTIVE_LOCALES.map((locale) => [
    locale,
    (rows || [])
      .filter((offerEntry) => offerEntry.locale === locale && offerEntry.documentId)
      .map((offerEntry) => ({ documentId: offerEntry.documentId, locale })),
  ]));
}

const PRINCIPLE_MEDIA_MATCHES = [
  'about_strategy_preview_31520b653a',
  'about_case_study_cover_aa228ef873',
  'Generated_Image_October_06_2025_7_59_PM_2_upscayl_4x_upscayl_standard_4x_32ee5e22f1',
  'blog-demand-scorecard',
  'blog-homepage-message-framework',
  'about_discuss_background_74716ba52a',
];

async function getPrincipleMediaIds(strapi) {
  const files = await strapi.db.query('plugin::upload.file').findMany({
    select: ['id', 'name', 'url'],
  });

  return PRINCIPLE_MEDIA_MATCHES.map((match) => (
    (files || []).find((file) => `${file.name || ''} ${file.url || ''}`.includes(match))?.id
  )).filter(Boolean);
}

function attachPrincipleMedia(block, mediaIds) {
  if (block.__component !== 'blocks.principles') {
    return block;
  }

  return {
    ...block,
    items: (block.items || []).map((entry, index) => {
      const image = mediaIds.length > 0 ? mediaIds[index % mediaIds.length] : null;
      return {
        ...(entry.label ? { label: entry.label } : {}),
        title: entry.title,
        description: entry.description,
        ...(image ? { image } : {}),
      };
    }),
  };
}

async function ensureCmsContent(strapi) {
  await upsertSingleTypeLocales(strapi, UIDS.siteSetting, siteSettingsByLocale);
  await upsertSingleType(strapi, UIDS.calendarSetting, calendarSettingData);

  for (const entry of offersByLocale[DEFAULT_LOCALE]) {
    await upsertLocalizedEntry(strapi, UIDS.offer, entry, offersByLocale, 'slug');
  }

  const homepageOfferRelationsByLocale = await getHomepageOfferRelationsByLocale(strapi);
  const principleMediaIds = await getPrincipleMediaIds(strapi);

  if (principleMediaIds.length === 0) {
    strapi.log.warn('No Media Library images were found for the Principles block. Cards will use their visual fallback.');
  }

  let defaultStepper = await strapi.db.query('plugin::booking.stepper').findOne({
    where: { key: 'default-website-qualification' },
  });
  const stepperData = {
    name: 'Default Website Qualification',
    key: 'default-website-qualification',
    description: 'General qualification flow used by the main website.',
    qualificationEnabled: true,
    qualificationThreshold: 8,
    contactFields: {
      name: { visible: true, required: true }, email: { visible: true, required: true },
      phone: { visible: true, required: false }, companyName: { visible: true, required: false }, websiteUrl: { visible: true, required: false },
    },
  };
  defaultStepper = defaultStepper
    ? await strapi.db.query('plugin::booking.stepper').update({ where: { id: defaultStepper.id }, data: stepperData })
    : await strapi.db.query('plugin::booking.stepper').create({ data: { ...stepperData, status: 'draft', version: 0 } });

  const stepperPagesByLocale = Object.fromEntries(Object.entries(pagesByLocale).map(([locale, localePages]) => [
    locale,
    localePages.map((page) => ({
      ...page,
      blocks: page.blocks.map((block) => {
        const blockWithPrincipleMedia = attachPrincipleMedia(block, principleMediaIds);

        if (blockWithPrincipleMedia.__component === 'blocks.book-call') {
          // The main website follows the booking service's configured default.
          // Campaign landing pages set questionFlowKey explicitly in Strapi.
          return blockWithPrincipleMedia;
        }

        if (blockWithPrincipleMedia.__component === 'blocks.service-overview') {
          return {
            ...blockWithPrincipleMedia,
            services: { connect: homepageOfferRelationsByLocale[locale] || [] },
          };
        }

        return blockWithPrincipleMedia;
      }),
    })),
  ]));

  const singlePageDataByUid = {
    [UIDS.homePage]: Object.fromEntries(ACTIVE_LOCALES.map((locale) => {
      const page = stepperPagesByLocale[locale].find((entry) => entry.slug === 'home');
      return [locale, toSinglePageData(page)];
    })),
    [UIDS.aboutPage]: Object.fromEntries(ACTIVE_LOCALES.map((locale) => {
      const page = stepperPagesByLocale[locale].find((entry) => entry.slug === 'about');
      return [locale, toSinglePageData(page)];
    })),
  };

  await upsertSingleTypeLocales(strapi, UIDS.homePage, singlePageDataByUid[UIDS.homePage]);
  await upsertSingleTypeLocales(strapi, UIDS.aboutPage, singlePageDataByUid[UIDS.aboutPage]);

  for (const page of stepperPagesByLocale[DEFAULT_LOCALE].filter((entry) => !SINGLE_PAGE_SLUGS.has(entry.slug))) {
    await upsertLocalizedPage(strapi, UIDS.page, page, stepperPagesByLocale);
  }

  for (const question of leadQuestionsByLocale[DEFAULT_LOCALE]) {
    const localizedQuestions = Object.fromEntries(Object.entries(leadQuestionsByLocale).map(([locale, items]) => [locale, items.map((item) => ({ ...item, stepper: defaultStepper.id }))]));
    await upsertLocalizedEntry(strapi, UIDS.leadQuestion, { ...question, stepper: defaultStepper.id }, localizedQuestions, 'key');
  }

  await deleteObsoletePages(strapi);

  try {
    await strapi.plugin('booking').service('stepper').publish(defaultStepper.id);
  } catch (error) {
    if (error?.message !== 'STEPPER_TRANSLATIONS_MISMATCH') {
      throw error;
    }

    strapi.log.warn(
      `Skipped booking stepper publication because existing editor-created questions have unmatched translations: ${JSON.stringify(error.details || {})}`
    );
  }
}

async function runSeed(strapi) {
  const lockKey = `${SEED_NAMESPACE}.${SEED_VERSION}.completed`;
  const seedStore = strapi.store({
    type: 'core',
    name: 'seed',
    environment: strapi.config.environment,
  });

  const existingLock = await seedStore.get({ key: lockKey });

  if (existingLock && !FORCE_SEED) {
    strapi.log.info(`Seed ${SEED_NAMESPACE}@${SEED_VERSION} already completed. Use --force to rerun.`);
    return;
  }

  await ensureLocales(strapi);

  for (const singleTypeUid of SINGLE_TYPE_UIDS) {
    await ensureSingleTypeCanonicalDocuments(strapi, singleTypeUid);
  }

  await ensurePublicReadPermissions(strapi);
  await ensureCmsContent(strapi);

  await seedStore.set({
    key: lockKey,
    value: {
      namespace: SEED_NAMESPACE,
      version: SEED_VERSION,
      locales: ACTIVE_LOCALES,
      completedAt: nowIso(),
      forced: FORCE_SEED,
    },
  });

  strapi.log.info(`Seed ${SEED_NAMESPACE}@${SEED_VERSION} completed.`);
}

async function run() {
  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();

  try {
    await runSeed(app);
  } finally {
    await app.destroy();
  }
}

run()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('[seed:injaaz] failed:', error);
    process.exit(1);
  });
