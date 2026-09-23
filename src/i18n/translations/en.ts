import type { Translations } from './es';

const en: Translations = {
  // ============================================================
  // COMMON / SHARED
  // ============================================================
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    copy: 'Copy',
    view: 'View',
    close: 'Close',
    back: 'Back',
    next: 'Continue',
    create: 'Create',
    pro: 'PRO',
    free: 'Free',
    yes: 'Yes',
    no: 'No',
    none: 'None',
    total: 'Total',
    name: 'Name',
    or: 'or',
    and: 'and',
  },

  // ============================================================
  // HEADER / NAVIGATION
  // ============================================================
  nav: {
    myPages: 'My Pages',
    createPage: 'Create page',
    createPageFree: 'Create page for free',
    createNew: 'Create New',
    templates: 'Templates',
    games: 'Games',
    contact: 'Contact',
    upgradePro: 'Upgrade PRO',
    upgradeAPro: 'Upgrade to PRO',
    closeSession: 'Log Out',
    authError: 'Authentication error',
    sessionClosed: 'Logged out',
    sessionCloseError: 'Error logging out',
  },

  // ============================================================
  // AUTH / LOGIN
  // ============================================================
  auth: {
    continueWithGoogle: 'Continue with Google',
    firebaseNotInitialized: 'Error: Firebase is not initialized',
    welcome: 'Welcome!',
    loginError: 'Error logging in',
    loginToSave: 'Sign in with Google to save your page',
  },

  // ============================================================
  // LANDING PAGE
  // ============================================================
  landing: {
    badge: '+2,000 pages created this month',
    heroTitle1: 'Tell them how you feel',
    heroTitle2: 'in a unique way',
    heroDescription: 'Create personalized pages with animations, stickers and the escape button. Share a unique link and see their response in real time.',
    ctaCreate: 'Create my page for free',
    ctaDemo: 'See demo',
    unlimitedPages: 'Unlimited pages',
    proPrice: 'PRO for $9 a year',
    aiDesign: 'AI Design',

    // Showcase
    showcaseTitle: 'See what you can create',
    showcaseDesc: 'From love declarations to invitations. Every page is unique.',
    tryPressNo: '👆 Try pressing "No"!',

    // How it works
    howItWorksTitle: 'It\'s this easy',
    howItWorksDesc: 'In less than 2 minutes your page is ready',
    step1Title: 'Customize your page',
    step1Desc: 'Write your message, choose a theme, stickers, animations and button text.',
    step2Title: 'Share the link',
    step2Desc: 'Send the unique URL via WhatsApp, Instagram, or wherever you prefer.',
    step3Title: 'See the response',
    step3Desc: 'When they respond, you\'ll get a notification with their answer in real time.',

    // Features
    featuresTitle: 'Everything you need',
    feature1Title: '8+ Themes',
    feature1Desc: 'Romantic, ocean, elegant and more',
    feature2Title: 'Animations',
    feature2Desc: 'Hearts, confetti, snow...',
    feature3Title: 'Escape button',
    feature3Desc: 'The "No" runs from the cursor!',
    feature4Title: '16 Stickers',
    feature4Desc: 'Hearts, roses, rings...',
    feature5Title: 'Fonts',
    feature5Desc: '16 fonts to customize',
    feature6Title: 'Statistics',
    feature6Desc: 'Live views and responses',

    // PRO upsell
    proUpsellTitle: 'Want something even more special?',
    proUpsellDesc: 'With PRO you unlock AI design, personalized URL with their name, background music, premium animations and unlimited pages. All for <strong>$9 USD a year</strong>.',
    getPro: 'Get PRO',

    // Demo
    demoInteractive: 'Interactive demo',
    demoTitle: 'Try how your page will look',
    demoDesc: 'Customize the content below and see changes in real time. No account needed!',

    // Testimonials
    testimonialsTitle: 'What our users say',
    testimonial1: 'I sent the page to my girlfriend and she said yes! The escape button was the best part 😂💕',
    testimonial2: 'Super easy to use and it looked beautiful. I used it for Valentine\'s Day.',
    testimonial3: 'The AI design in the PRO version is incredible. Totally worth it.',
    testimonial4: 'I created one to propose to my boyfriend. He said yes! 💍',

    // Final CTA
    finalCtaTitle1: 'Ready to tell them',
    finalCtaTitle2: 'how you feel?',
    finalCtaDesc: 'Create your first page for free in less than 2 minutes. No credit card required.',
    goToMyPages: 'Go to My Pages',
    createPageFree: 'Create Free Page',
    freeLimitReached: 'You already have an active page. Deactivate it from your pages, or go PRO for unlimited at once.',

    // Demo builder
    demoPageTitle: 'Your page title',
    demoPageTitlePlaceholder: 'Will you be my Valentine?',
    demoFor: 'For',
    demoNamePlaceholder: 'Name',
    demoAnimation: 'Animation',
    demoNoAnimation: 'No animation',
    demoHearts: '💕 Hearts',
    demoConfetti: '🎊 Confetti',
    demoMessage: 'Message',
    demoMessagePlaceholder: 'Your special message...',
    demoTheme: 'Theme',
    demoStickers: 'Stickers',
    demoYesButton: '"Yes" Button',
    demoNoButton: '"No" Button',
    demoNoEscapes: 'The "No" button escapes the cursor 😄',
    demoLikeIt: 'Like how it looks? Create your real page for free 👇',
    demoLivePreview: 'Live preview',

    // Mini preview
    thanks: 'Thank you!',
    understood: 'Understood',
    restartDemo: 'Restart demo',
    madeWith: 'Made with Love Pages 💕',

    // Showcase pages
    showcasePage1Title: 'Will you be my Valentine?',
    showcasePage1Message: 'Every moment with you is special...',
    showcasePage2Title: 'Dinner tonight?',
    showcasePage2Message: 'I have something special planned 🌹',
    showcasePage3Title: 'Will you forgive me?',
    showcasePage3Message: 'I promise it won\'t happen again...',

    // Demo theme names
    themeRomantic: 'Romantic',
    themeSunset: 'Sunset',
    themeOcean: 'Ocean',
    themeElegant: 'Elegant',
    themeGarden: 'Garden',
    themeDark: 'Dark',

    // Demo defaults
    defaultTitle: 'Will you be my Valentine?',
    defaultRecipient: 'Maria',
    defaultMessage: 'Every day by your side is a gift... 💕',
    defaultYesText: 'Yes, I do! 💖',
    defaultNoText: 'Let me think about it',

    // Landing — masthead
    navDemo: 'How it works',
    navPricing: 'Pricing',
    pillarsLine1: 'The hard parts,',
    pillarsLine2: 'already solved',

    // Landing — templates
    templatesEyebrow: 'Templates',
    templatesLine1: 'Don\'t start from',
    templatesLine2: 'a blank page',
    templatesDesc: '22 templates ready to personalize: you only swap the words and the photos. Each one is a whole idea, not just a color theme.',
    templatesCount: '22 templates',
    templatesCta: 'See every template',
    templatesFeaturedLabel: 'Most requested',
    templatesFeaturedName: 'Netflix & Love',
    templatesFeaturedDesc: 'Your story cut like a series: every moment is an episode with its own cover, its date and its match percentage.',
    templatesFeaturedCta: 'Use this template',
    templatesOthers: 'Also: Love Wrapped in Spotify style, WhatsApp chat, Time Capsule, Scratch and Win, Message in a Bottle…',

    // Netflix template mockup
    tplHeroTitle: 'The Story of Us',
    tplHeroMeta: '99% for you · 2025 · Season 1',
    tplHeroDesc: 'Two people who met by chance and found out it was exactly what was missing.',
    tplRowTitle: 'Our moments',
    tplMoment1: 'The first chapter',
    tplMoment2: 'Our first adventure',
    tplMoment3: 'The day I knew',
    mastheadVol: 'Why it works',
    mastheadPrice: 'Free to start',
    mastheadEdition: 'Ready in 5 minutes',

    // Landing — hero
    heroBadge: 'Over 2 million pages have already moved someone.',
    heroLine1: 'Love letters',
    heroLine2: 'that',
    heroLine2Italic: 'respond',
    heroDesc: 'Design an unforgettable page, share the link, and see in real time what the other person answers.',
    heroDescAccent: 'Romantic, cheesy and inevitable.',
    ctaCreateRiso: 'Create my page free',
    ctaDemoRiso: 'See the demo',
    livePreviewAnnotation: 'Live preview',
    noEscapesAnnotation: 'The "no" escapes',
    statsPagesLabel: 'Pages created',
    statsSiLabel: 'Say yes',
    statsProLabel: 'Pro, per year',

    // Landing — demo phone
    demoCardBadge: 'A letter for you',
    demoCardTitle1: 'Will you be',
    demoCardTitle2Italic: 'my girlfriend?',
    demoCardSubtitle: 'After 247 coffees and 31 movies...',
    demoYesBtn: 'Yes ♥',
    demoNoBtn: 'No',
    demoAnsweredYes: 'yes!',
    demoReset: 'Back',

    // Landing — pillars
    pillar1Title: 'Design without knowing design',
    pillar1Body: 'Curated templates, beautiful typography, palettes that match on their own and smooth animations.',
    pillar2Title: 'Share a link, get a response',
    pillar2Body: 'Every page lives at its own URL. They open it, answer yes or no, and you see it instantly.',
    pillar3Title: 'Stats that matter',
    pillar3Body: 'Visits, time spent and the answer. With notifications whenever someone drops by.',

    // Landing — testimonial
    testimonialBadge: 'Ana P., Guadalajara',
    testimonialLine1: 'I said yes',
    testimonialLine2: 'before reading',
    testimonialLine3Italic: 'the last paragraph.',
    testimonialName: 'Ana Patricia M.',
    testimonialDate: 'Received a proposal · Feb 2026',

    // Landing — demo section
    demoSectionLine1: 'Try it',
    demoSectionLine2: 'yourself, now',
    demoSectionBadge: 'Demo',
    demoCtaBtn: 'Create my page free',

    // Landing — pricing
    pricingLine1: 'A fair price,',
    pricingLine2: 'forever',
    pricingBadge: 'Pricing',
    pricingRecommended: 'Recommended',
    freePlanPitch: 'Enough for that one important letter.',
    freePlanFeature1: '1 active page at a time',
    freePlanFeature2: 'Basic animations',
    freePlanFeature3: 'URL lovepages.ink/p/xxxx',
    freePlanFeature4: 'Subtle watermark',
    freePlanCtaLabel: 'Start free',
    proPlanSub: 'per year, renewable',
    proPlanPitch: 'For those who fall in love often.',
    proPlanFeature1: 'Unlimited pages',
    proPlanFeature2: 'AI design',
    proPlanFeature3: 'Custom URL',
    proPlanFeature4: 'No watermark',
    proPlanFeature5: 'Unlimited music',
    proPlanFeature6: 'Advanced stats',
    proPlanCtaLabel: 'Upgrade',

    // Landing — final CTA
    finalLine1: 'And you,',
    finalLine2Italic: 'who are you writing to?',
    finalCtaUser: 'Go to my pages',
    finalCtaGuest: 'Start my page',

    // Riso redesign — footer
    footerAbout: 'About',
    footerPrivacy: 'Privacy',
    footerTerms: 'Terms',
  },

  // ============================================================
  // DASHBOARD
  // ============================================================
  dashboard: {
    hello: 'Hello, {name}! 👋',
    goodMorning: 'Good morning',
    goodAfternoon: 'Good afternoon',
    goodEvening: 'Good evening',
    yourLetters: 'Your letters',
    sectionTitle: 'Your pages',
    viewPage: 'View',
    continuePage: 'Continue',
    draft: 'Draft',
    copyBtn: 'Copy link',
    statsViews: 'Visits',
    statsSi: 'Yes',
    statsNo: 'No',
    noPublished: 'Unpublished',
    limitModalTitle: "You've used your free page",
    limitModalDesc: 'The free plan allows 1 active page at a time. Go PRO for $9 a year for unlimited pages, no expiry, music and effects.',
    limitModalCta: 'See PRO plan',
    limitModalDecline: 'Not now',
    proUser: 'PRO User - Premium features unlocked',
    pagesCreated: 'You\'ve created {count} page{plural}',
    createPage: 'Create Page',
    viewTemplates: 'View Templates',
    pages: 'Pages',
    views: 'Views',
    responses: 'Responses',
    created: 'Created',
    myPages: 'My Pages',
    noPages: 'You haven\'t created any pages yet',
    noPagesDesc: 'Create your first personalized page for a special occasion',
    createFirstPage: 'Create My First Page',
    useTemplate: 'Use a Template',
    forRecipient: 'For: {name}',
    viewsCount: '{count} views',
    responsesCount: '{count} responses',
    activate: 'Activate',
    deactivate: 'Deactivate',
    active: 'Active',
    inactive: 'Deactivated',

    // Dashboard page (not logged in)
    heroTitle: 'Create personalized pages for special occasions',
    heroDesc: 'Design unique pages with animations, stickers and the escape button. Share a unique link and see the response in real time.',
    createPageFree: 'Create Free Page',

    // Toasts
    loadError: 'Error loading pages',
    linkCopied: 'Link copied!',
    pageDeactivated: 'Page deactivated',
    pageActivated: 'Page activated',
    statusChangeError: 'Error changing status',
    confirmDelete: 'Are you sure you want to delete this page?',
    pageDeleted: 'Page deleted',
    deleteError: 'Error deleting page',

    // Header / hero (logged in)
    hereYourPages: '{name}, here are your pages',
    activeCount: '{count} active',
    managePages: 'Manage your links, check their status and share faster.',

    // Push notifications
    pushAlertsActive: 'Alerts on',
    pushAlertsTitle: 'Visit alerts',
    pushAlertsActiveDesc: 'We\'ll notify you when someone opens your page.',
    pushAlertsBlockedDesc: 'The browser blocked this permission.',
    pushAlertsInactiveDesc: 'Turn them on to track visits in real time.',
    pushTitleBlocked: 'Notifications blocked in the browser',
    pushTitleDeactivate: 'Disable notifications',
    pushTitleActivate: 'Enable visit notifications',
    pushToastDeactivated: 'Notifications disabled',
    pushToastActivated: 'Notifications enabled. We\'ll notify you when someone views your page.',
    pushToastDenied: 'You blocked notifications in your browser. Enable them from the site settings.',

    // Page card
    cardExpired: 'Expired',
    cardExpires: 'Expires {time}',
    cardCreated: 'Created {time}',
    cardResult: 'Result',
    cardResponseCount: '{count} response',
    cardResponseCountPlural: '{count} responses',
    cardYesNoCount: '{yes} yes / {no} no',
  },

  // ============================================================
  // CREATE PAGE
  // ============================================================
  create: {
    title: 'Create New Page',
    subtitle: 'Customize every detail of your page',
    proActive: 'PRO active',

    // Steps
    stepContent: 'Content',
    stepDesign: 'Design',
    stepMedia: 'Images',
    stepEffects: 'Effects',
    stepPublish: 'Publish',

    // Content step
    contentTitle: 'Content',
    contentDesc: 'Write the message for that special person',
    titleLabel: 'Title *',
    titlePlaceholder: 'Will you be my Valentine?',
    starterTitle: 'Will you be my Valentine?',
    starterMessage: 'Ever since you showed up, ordinary days stopped being ordinary.\n\nThank you for every silly laugh, every last-minute plan and every comfortable silence. I do not know how you do it, but everything is better with you.',
    starterNotice: 'We started a letter for you. Change all of it, it is yours.',
    starterClear: 'Start from scratch',
    recipientLabel: 'Recipient name *',
    recipientPlaceholder: 'Maria',
    messageLabel: 'Message (optional)',
    messagePlaceholder: 'Every day by your side is a gift...',
    yesButtonLabel: '"Yes" button text',
    yesButtonPlaceholder: 'Yes, I do!',
    noButtonLabel: '"No" button text',
    noButtonPlaceholder: 'Let me think about it',
    noEscapes: 'The "No" button escapes the cursor 😄',
    useAI: 'Generate complete design with AI',
    useAIDesc: 'Upload a reference image and AI will create a unique design',
    requiredFields: 'Please fill in the required fields',

    // Design step
    designTitle: 'Design',
    designDesc: 'Choose theme, colors and typography',
    themeLabel: 'Theme',
    colorsLabel: 'Colors',
    colorBg: 'Background',
    colorText: 'Text',
    colorAccent: 'Accent',
    titleFontLabel: 'Title font',

    // Media step
    mediaTitle: 'Images & Stickers',
    mediaDesc: 'Add images and decorations to your page',
    bgImageLabel: 'Background image (optional)',
    bgImageDrop: 'Drag or select a background image',
    bgImageFormat: 'PNG, JPG, GIF, WEBP (max. 5MB)',
    bgImageChange: 'Click to change',
    bgImageRemove: 'Remove background',
    decorativeLabel: 'Decorative images',
    decorativeProHint: 'PRO: up to 5',
    decorativeAdd: 'Add image',
    stickersLabel: 'Stickers',
    stickersProHint: 'PRO: more stickers',

    // Effects step
    effectsTitle: 'Effects & Animations',
    effectsDesc: 'Bring your page to life with animations and music',
    animationLabel: 'Background animation',
    musicLabel: 'Background music',

    // Watermark
    watermarkNote: 'Your page will include "Made with Love Pages"',
    watermarkUpgrade: 'Upgrade to PRO to remove the watermark and unlock all features',

    // Preview / Publish step
    readyTitle: 'All set!',
    readyDesc: 'Review your page and publish it',
    customUrl: 'Custom URL',
    recipientWillSee: '{name} will see this first!',
    wantNameInLink: 'Want their name in the link? 💕',
    yourPageWillHave: 'Your page will have:',
    withProCouldBe: 'With PRO it could be:',
    makeMoreSpecial: 'Make it more special – $9/yr',
    summaryTitle: 'Title',
    summaryFor: 'For',
    summaryMessage: 'Message',
    summaryTheme: 'Theme',
    summaryFont: 'Font',
    summaryAnimation: 'Animation',
    summaryStickers: 'Stickers',
    summaryBgImage: 'Background image',
    summaryIncluded: '✓ Included',
    summaryDecorativeImages: 'Decorative images',
    summaryImageCount: '✓ {count} image(s)',
    aiNote: 'AI will generate a unique design based on your reference image',
    publishPage: '🚀 Publish Page',
    livePreview: 'Preview',
    yourTitleHere: 'Your title here',

    // Toasts
    titleRequired: 'Title is required',
    recipientRequired: 'Recipient name is required',
    needProPlan: 'You need the PRO plan',
    freeLimitReached: 'You already have an active page. Deactivate it from your pages, or go PRO for unlimited at once.',
    pageCreated: 'Page created successfully!',
    createError: 'Error creating page',
    imageTooLarge: 'Image must not exceed 5MB',
    maxStickers: 'Maximum {count} stickers',
    maxStickersProHint: ' (PRO: up to 10)',
    maxDecorativeImages: 'Maximum {count} decorative image{plural}{plural2}',
    maxDecorativeProHint: ' (PRO: up to 5)',
    refImageChange: 'Click to change image',
    refImageUpload: 'Upload reference image for AI',
    refImageFormat: 'PNG, JPG, GIF or WEBP (max. 5MB)',

    // Upgrade modal
    unlockPro: 'Unlock Love Pages PRO',
    unlockProDesc: 'Take your pages to the next level',
    proFeature1: 'Exclusive themes (Neon, Aurora, Vintage...)',
    proFeature2: 'Premium fonts',
    proFeature3: 'Up to 5 decorative images',
    proFeature4: 'Up to 10 stickers',
    proFeature5: 'Premium animations (confetti, fireworks...)',
    proFeature6: 'Background music',
    proFeature7: 'No watermark',
    proFeature8: 'AI-generated design',
    proFeature9: 'Unlimited pages',
    viewProPlans: 'View PRO plans',
    stayFree: 'Stay with free plan',
    unlockProBadge: 'Unlock PRO',

    // Desktop builder — top bar
    backToPages: 'My pages',
    newLetter: 'New letter',
    draftBadge: 'Draft',
    limitReached: 'Limit reached',
    unsaved: 'Unsaved',
    previewBtn: 'Preview',
    previewBackToEdit: 'Keep editing',
    publishing: 'Publishing...',
    publishBtn: 'Publish',
    readyToPublish: 'Ready to publish',
    customizeTitle: 'Customize',
    customizeDesc: 'Optional. Your letter already works without touching any of this.',

    // Panel tabs
    tabContent: 'Content',
    tabDesign: 'Theme',
    tabMedia: 'Media',
    tabEffects: 'Effects',
    tabLink: 'Link',

    // DField labels
    fieldTitle: 'Title',
    fieldRecipient: 'For who',
    fieldMessage: 'Your message',
    fieldYesBtn: 'Yes button',
    fieldNoBtn: 'No button',
    fieldPalette: 'Palette',
    fieldColors: 'Custom colors',
    fieldFont: 'Typography',
    fieldBgImage: 'Background image',
    fieldStickers: 'Stickers',
    fieldDecorative: 'Decorative images',
    fieldParticles: 'Particles',
    fieldMusic: 'Music',
    fieldVideo: 'Video embed',
    fieldUrlCustom: 'Custom URL',
    fieldPrivacy: 'Privacy',
    fieldOccasion: 'Date of the occasion',
    occasionHint: 'Optional',
    occasionHelp: 'Save it and we will remind you 3 days before the next anniversary, so it does not slip by.',

    // Preview panel
    previewForLabel: 'A letter for',
    previewMessagePlaceholder: 'Write your special message here for the person you love most…',
    previewFrom: 'With love',
    previewFooter: 'Made with Love Pages',
    previewBadge: 'Preview',
    previewDefaultTitle: 'My letter for you',
    previewDefaultRecipient: 'you',

    // Expiration notice
    expirationDays: '7 days',
    expirationUpgradeLink: 'upgrade to PRO',
    expirationMobile: 'Your page will expire in 7 days.',
    expirationMobileUpgrade: 'Upgrade to PRO',
    expirationLinkTitle: 'this link lives for 7 days',
    expirationLinkDesc: 'After that week the letter stops opening. With PRO it stays forever.',
    expirationLinkCta: 'make it permanent · $9/yr',

    // Local draft
    draftSavedNow: 'saved just now',
    draftSavedSeconds: 'saved {n}s ago',
    draftSavedMinutes: 'saved {n} min ago',
    draftRestored: 'We brought your draft back',
    draftRestoredImages: 'We brought your draft back. Please re-upload your images: they cannot be stored in the browser.',
    draftDiscard: 'start over',
    draftDiscarded: 'Draft discarded',

    // Validation
    requiredMark: 'required',
    missingOne: '{field} is missing',
    missingMany: 'Missing: {fields}',
    missingHint: 'missing {fields}',

    // Trying PRO options
    proTrialToast: 'Try it here. It unlocks when you publish.',
    proTrialBarOne: "You're trying 1 PRO option",
    proTrialBarMany: "You're trying {n} PRO options",
    proTrialBarCta: 'see which',

    // Login on publish
    loginGateTitle: 'Save your letter.',
    loginGateDesc: 'Sign in with Google to publish it and see who opens it and what they answer.',

    // Canvas (desktop)
    canvasDevice: 'device',

    // Privacy options
    privacyPublic: 'public',
    privacyPublicDesc: 'anyone with the link',
    privacyCode: 'with code',
    privacyCodeDesc: 'requires PIN (coming soon)',

    // Summary labels (publish tab)
    summaryTitleKey: 'title',
    summaryForKey: 'for',
    summaryThemeKey: 'theme',
    summaryAnimKey: 'animation',

    // PRO URL upsell
    proUrlYour: 'Your page:',
    proUrlWithPro: 'With PRO:',
    proUrlUpgrade: 'Make it more special with PRO',

    // Submit buttons
    publishPageBtn: 'Publish page',

    // Hints
    decorativeHintFree: '1 free',
    decorativeHintPro: '5 pro',
    videoHint: 'youtube / tiktok — PRO only',
  },

  // ============================================================
  // THEMES & ANIMATIONS
  // ============================================================
  themes: {
    romantic: 'Romantic',
    sunset: 'Sunset',
    ocean: 'Ocean',
    garden: 'Garden',
    playful: 'Playful',
    elegant: 'Elegant',
    minimal: 'Minimal',
    dark: 'Dark',
    neon: 'Neon',
    vintage: 'Vintage',
    aurora: 'Aurora',
    cherry: 'Cherry Blossom',
  },

  animations: {
    none: 'No animation',
    'hearts-falling': 'Falling hearts',
    'fade-in': 'Fade in',
    'float-up': 'Float up',
    confetti: 'Confetti',
    particles: 'Particles',
    fireworks: 'Fireworks',
    snow: 'Snow',
    petals: 'Petals',
    bubbles: 'Bubbles',
  },

  music: {
    none: 'No music',
    'romantic-piano': '🎹 Romantic piano',
    'acoustic-guitar': '🎸 Acoustic guitar',
    'love-song': '🎵 Love song',
    'music-box': '🎶 Music box',
    orchestra: '🎻 Soft orchestra',
  },

  // ============================================================
  // TEMPLATES
  // ============================================================
  templates: {
    title: 'Templates',
    badgeLabel: 'Curated templates',
    heroTitle: 'Find your letter',
    useBtn: 'Use',
    usesLabel: '{count} uses',
    searchPlaceholder: 'Search templates...',
    categoryAll: 'All',
    categoryValentine: "Valentine's Day",
    categoryDeclaration: 'Declaration',
    categoryBirthday: 'Birthday',
    categoryAnniversary: 'Anniversary',
    categoryFriendship: 'Friendship',
    categoryChristmas: 'Christmas',
    categoryOther: 'Other',
    templateCount: '{count} template{plural}',
    gridView: 'Grid view',
    listView: 'List view',
    noTemplates: 'No templates available',
    tryOtherSearch: 'Try a different search',
    moreComingSoon: 'More templates coming soon',
    viewTemplate: 'View template',
    requiresPro: 'Requires PRO',
    uses: 'uses',
    loadError: 'Error loading templates',
  },

  // ============================================================
  // GAMES
  // ============================================================
  games: {
    title: 'Games',
    subtitle: 'Have fun with your friends and partner 🎉',
    badgeLabel: 'Games',
    heroTitle: 'Play with who you love',
    gameCount: '{count} game{plural}',
    gridView: 'Grid view',
    listView: 'List view',
    playNow: 'Play now',
    open: 'Open',
    new: 'New',

    // Featured mobile app
    appBadge: 'Our app',
    appName: 'Gisus',
    appTagline: 'Meet whoever is right next to you, right now',
    appDesc: 'No endless scrolling, no profiles from across the country. Turn on the radar and Gisus shows you who is nearby over Bluetooth. If you both like each other, you match and the chat opens.',
    appPoint1: 'No GPS: it detects proximity, never your exact location',
    appPoint2: 'Instant match and unlocked chat',
    appPoint3: '7 days of Premium free',
    appCta: 'Download on the App Store',
    appPlatform: 'Free · iPhone and iPad · iOS 17 or later',

    // Game names
    tuttiFrutti: 'Tutti Frutti',
    tuttiFruttiDesc: 'The classic word game by categories. Compete with your friends in real time!',
    howWellKnow: 'How well do you know each other?',
    howWellKnowDesc: 'Answer the same questions and discover how compatible you are. For couples and friends!',
    wouldYouRather: 'Would You Rather?',
    wouldYouRatherDesc: 'Fun dilemmas to discover how alike you think. Choose between two options and compare.',
    drawGuess: 'Draw & Guess',
    drawGuessDesc: 'Draw, guess and have fun. Pick a word, make your best drawing and see if they can guess it.',
    pixelAdventure: 'Pixel Adventure',
    pixelAdventureDesc: 'Real-time multiplayer game with dice, events, traps and special powers. Reach the finish line first and win!',
    minesweeper: 'Competitive Minesweeper',
    minesweeperDesc: 'Clear the same board competing for points. Reveal cells, place flags and don\'t step on mines. 2-8 players.',
    anonQuestions: 'Anonymous Questions',
    anonQuestionsDesc: 'Write questions secretly, everyone answers, and guess who asked what. The best deceiver wins!',
    puzzle: 'Puzzle',
    puzzleDesc: 'Compete solving the same puzzle against your opponent. The fastest wins! 3 difficulty levels with real photos.',
    wordSearch: 'Word Search',
    wordSearchDesc: 'Find hidden words before your rivals. Compete in real time with up to 8 players!',
    ludo: 'Ludo',
    ludoDesc: 'The classic board game. Get your 4 pieces home before anyone else. 2-4 players.',
  },

  // ============================================================
  // UPGRADE
  // ============================================================
  upgrade: {
    title: 'Unlock PRO Features',
    badge: 'upgrade',
    heroTitle: 'A fair price, forever',
    processing: 'processing...',
    oncePayment: 'USD · one time',
    proIncludesLabel: 'what pro includes',
    alreadyPro: "You're already a PRO user!",
    paymentError: 'Error processing payment',
    subtitle: 'Take your pages to the next level with premium tools',
    specialOffer: 'Special Offer!',
    oneTimePayment: 'One-time payment',
    featuresProTitle: 'PRO Features',
    permanentAccess: 'One-time payment • Permanent access',
    freeLimitBanner: 'You already used your 1 free page. With PRO you can create unlimited pages.',

    feature1Title: 'Premium Themes & Animations',
    feature1Desc: 'Neon, Aurora, Vintage, confetti, fireworks, snow and more',
    feature2Title: 'AI Design',
    feature2Desc: 'Upload an image and AI will create a unique personalized design',
    feature3Title: 'Personalized URL with their name 💕',
    feature3Desc: 'Instead of a random link, it will be something like:',
    feature4Title: 'Background music',
    feature4Desc: 'Romantic piano, acoustic guitar, music box and more',
    feature5Title: 'Premium templates + No watermark',
    feature5Desc: 'Access professionally designed templates and remove the "Made with Love Pages"',
    feature6Title: 'More stickers & images',
    feature6Desc: 'Up to 10 stickers and 5 decorative images per page',
    feature7Title: 'Pages without expiration',
    feature7Desc: 'PRO pages never expire. Free plan pages are removed after 7 days.',

    selectPayment: 'Select your payment method:',
    mercadoPagoDesc: 'Cards, cash and more',
    paypalDesc: 'PayPal, cards',
    unlockProPrice: 'Unlock PRO — $9 USD/yr',
    securePayment: 'Secure payment processed by',

    freePlan: 'Free Plan',
    currentPlan: 'What you currently have',
    freeFeature1: '1 free page',
    freeFeature2: 'You cannot create a second page without upgrading to PRO',
    freeFeature3: '8 basic themes',
    freeFeature4: '4 basic animations',
    freeFeature5: '3 stickers, 1 decorative image',
    freeFeature6: 'No AI design',
    freeFeature7: 'No custom URL',
    freeFeature8: 'No background music',
    freeFeature9: 'Includes watermark',
    freeFeature10: 'Pages expire after 7 days',
    recommended: 'Recommended',
    unlockPotential: 'Unlock the full potential',
    proIncludes: 'Everything in the free plan',
    proFeature1: 'Premium themes and animations',
    proFeature2: 'AI design',
    proFeature3: 'Custom URL',
    proFeature4: 'Background music',
    proFeature5: '10 stickers, 5 images',
    proFeature6: 'No watermark',
    proFeature7: 'Premium templates',
    proFeature8: 'Pages without expiration',
  },

  // ============================================================
  // CONTACT
  // ============================================================
  contact: {
    title: 'Contact Us',
    subtitle: 'Have an idea? Need help? We\'re here for you',
    formTitle: 'Send us a message',
    formDesc: 'Fill out the form and we\'ll get back to you soon',

    // Contact types
    typeGeneral: 'General Comment',
    typeGeneralDesc: 'Share your opinion or suggestions',
    typeCustomPage: 'Custom Page',
    typeCustomPageDesc: 'Request a unique and special page',
    typeSupport: 'Technical Support',
    typeSupportDesc: 'Help with technical issues',
    typeOther: 'Other',
    typeOtherDesc: 'Any other inquiry',

    // Form fields
    nameLabel: 'Name *',
    namePlaceholder: 'Your name',
    emailLabel: 'Email *',
    emailPlaceholder: 'you@email.com',
    subjectLabel: 'Subject *',
    subjectPlaceholder: 'How can we help you?',
    messageLabel: 'Message *',
    messagePlaceholder: 'Tell us more details...',
    submitButton: 'Send Message',
    directContact: 'Prefer direct contact?',

    // Validation
    fillAllFields: 'Please fill in all fields',
    messageTooLong: 'Message cannot exceed 2000 characters',

    // Success
    messageSent: 'Message Sent!',
    thankYou: 'Thank you for contacting us. We\'ll respond as soon as possible.',
    goToDashboard: 'Go to Dashboard',
    sendAnother: 'Send Another Message',
    sentToast: 'Message sent! We\'ll get back to you soon.',

    // Custom page note
    customPageTitle: 'Premium Custom Pages',
    customPageDesc: 'Describe your vision and we\'ll create a unique page for that special occasion. Includes: custom design, exclusive animations, and everything you need.',
  },

  // ============================================================
  // NOTIFICATIONS
  // ============================================================
  notifications: {
    title: 'Notifications',
    markAllRead: 'Mark all as read',
    readAll: 'Read all',
    allUpToDate: 'All caught up!',
    noNotifications: 'No notifications',
    noPending: 'You have no pending notifications',
    willAppearHere: 'Your notifications will appear here',
    loadMore: 'Load more',
    loadError: 'Error loading notifications',
    markError: 'Error marking notification',
    markAllError: 'Error marking notifications',
    allMarkedRead: 'All marked as read',
    noNotificationsShort: 'You have no notifications',
    viewAll: 'View all notifications',
    markAll: 'Mark all',

    // Types
    typeInfo: 'Info',
    typeSuccess: 'Success',
    typeWarning: 'Warning',
    typePromo: 'Promo',
    typeUpdate: 'Update',
    typeResponse: 'Response',
    typeSystem: 'System',

    // Filters
    filterAll: 'All',
    filterUnread: 'Unread',
    filterPromos: 'Promos',
    filterUpdates: 'Updates',
    filterResponses: 'Responses',
  },

  // ============================================================
  // PAYMENT
  // ============================================================
  payment: {
    successTitle: 'Payment Successful! 🎉',
    nowProMember: 'You are now a PRO member',
    benefitsActivated: 'Benefits Activated',
    benefit1: 'Unlimited pages available',
    benefit2: 'AI design activated',
    benefit3: 'Full customization unlocked',
    createProPage: 'Create PRO Page',
    goToDashboard: 'Go to Dashboard',
    closeNote: 'You can close this window or continue exploring',

    // PayPal processing
    processing: 'Processing your payment...',
    confirmingPaypal: 'We\'re confirming your payment with PayPal',
    dontCloseWindow: 'Don\'t close this window',
  },

  // ============================================================
  // PUBLIC PAGE
  // ============================================================
  publicPage: {
    joyResponse: 'How wonderful! 💕',
    responseRegistered: 'Response registered',
    responseError: 'Error sending response',
    pageNotFound: 'Page not found',
    pageNotFoundDesc: 'This page doesn\'t exist or has been deleted',
    thanks: 'Thank you!',
    understood: 'Understood',
    responseRecorded: 'Your response has been recorded',
    madeWith: 'Made with Love Pages 💕',
    // Recipient loop: whoever just received a letter is the likeliest person
    // to create one, and until now this screen offered them nothing.
    answeredYes: 'yes.',
    answeredNo: 'maybe.',
    answeredYesNote: '{name} already got the news.',
    answeredNoNote: '{name} already saw your answer.',
    ctaHeading: 'and you, who are you writing to?',
    ctaBody: 'Make your letter in two minutes. Free, no card needed.',
    ctaButton: 'create my letter',
    seeAgain: '← read the letter again',
    brandFooter: 'made with love pages',
  },

  // ============================================================
  // PAGE DETAIL
  // ============================================================
  pageDetail: {
    pageNotFound: 'Page not found',
    loadError: 'Error loading details',
    linkCopied: 'Link copied!',
    qrCode: 'QR Code',
    backToPages: 'Back to my pages',
    saidYes: 'said yes',
    qrDesc: 'Generate and download a QR to share your page',
    qrShareDesc: 'Share your page with a printable QR code',
    generateQR: 'Generate QR',
    unlock: 'Unlock',
    proExclusive: 'PRO exclusive feature',
    generatingQR: 'Generating QR code...',
    scanToOpen: 'Scan this code to open',
    download: 'Download',

    // Stats
    views: 'Views',
    responses: 'Responses',
    yesLabel: 'Yes',
    noLabel: 'No',

    // QR Modal
    qrProDesc: 'With PRO you can generate a QR code for your page to print on cards, gifts or invitations 💌',
    getProPrice: 'Get PRO — $9 USD/yr',
    notNow: 'Not now',

    // Page info
    pageInfo: 'Page information',
    messageLabel: 'Message:',
    yesButton: 'Yes button:',
    noButton: 'No button:',
    escapeButton: 'Escape button:',
    status: 'Status:',
    active: 'Active',
    inactive: 'Inactive',
    createdAt: 'Created:',

    // Responses section
    responsesTitle: 'Responses',
    noResponses: 'No responses yet',
    shareToGetResponses: 'Share the link to receive responses',
    yesResponse: 'Yes! 💕',
    noResponse: 'No 😢',

    // Buttons
    copyLink: 'Copy link',
    viewPage: 'View page',

    // QR toasts
    qrDownloaded: 'QR downloaded!',
    qrCopied: 'QR copied to clipboard!',
    qrCopyError: 'Could not copy. Download it instead.',
  },

  // ============================================================
  // CUSTOM SLUG
  // ============================================================
  customSlug: {
    title: 'Custom URL',
    titleOptional: 'Custom URL (optional)',
    preview: 'Your page will be:',
    minChars: 'Minimum 3 characters',
    maxChars: 'Maximum 30 characters',
    onlyLowercase: 'Only lowercase, numbers and hyphens',
    noStartEndHyphen: 'Cannot start or end with hyphen',
    noConsecutiveHyphens: 'Cannot have consecutive hyphens',
    available: '✓ Available',
    verifyError: 'Error verifying',
    wantNameInLink: 'Want their name in the link? 😍',
    firstImpression: 'It\'s the first thing they\'ll see when they receive your page. Make it more special and personal.',
    genericUrl: 'Generic URL:',
    hardToRemember: 'Hard to remember 😕',
    customUrlLabel: 'Custom URL:',
    memorableSpecial: 'Memorable and special!',
    benefit1: '💕 More personal and romantic',
    benefit2: '✨ Easy to remember and share',
    benefit3: '🎯 Professional and unique',
    benefit4: '💌 Makes a better impression',
    unlockCustomUrls: 'Unlock Custom URLs',
    includedInPro: 'Included in the PRO plan with all premium features',
    testimonial: 'When she saw the link had her name, she got excited before even opening it. The PRO was totally worth it!',
    rules: 'Only lowercase letters, numbers and hyphens',
    charRange: 'Between 3 and 30 characters',
    autoGenerate: 'If left empty, an automatic URL will be generated',
    perfectUrl: 'Perfect! Your URL will be:',
    easyToShare: 'Easy to remember and share!',
    suggestion: 'Suggestion: use',
  },

  // ============================================================
  // REWARDED ADS
  // ============================================================
  rewardedAds: {
    dailyLimitReached: 'You\'ve used your 3 daily rewards. Come back tomorrow or upgrade to PRO for unlimited pages.',
    wantAnotherPage: 'Want another free page?',
    watchAdForPage: 'Watch a short ad and earn 1 extra page',
    watchAd: 'Watch ad',
    earnExtraPage: 'Earn a free extra page! 🎁',
    usedFreePage: 'You\'ve used your free page. Watch a short ad and unlock 1 additional page instantly.',
    watchAd15s: 'Watch ad (~15 sec)',
    loadingAd: 'Loading ad...',
    rewardsAvailable: 'rewards available today',
    preferNoAds: 'Prefer no ads?',
    goProUnlimited: 'Go PRO — $9/yr, unlimited pages',
    watchAdToEarn: 'Watch the ad to earn 1 page',
    waitSeconds: 'Wait {seconds} seconds to claim your reward',
    adCompleted: 'Ad completed!',
    claimReward: 'Claim 1 extra page',
    wonExtraPage: '🎉 You earned 1 extra page!',
    rewardError: 'Error processing reward',
    confirmError: 'Error confirming reward',
    adNotCompleted: 'Ad not completed. No reward granted.',
    extraPageUnlocked: 'Extra page unlocked!',
    canCreateNewPage: 'You can now create a new page',
  },

  // ============================================================
  // MYDIESS AD
  // ============================================================
  mydiessAd: {
    adLabel: 'Ad',
    info: 'Ad for an app by the creator of Love Pages',
    close: 'Close ad',
    description: 'The app for couples: keep your photos, notes, places and special dates together.',
    meta: 'Free · App Store',
    cta: 'Install',
  },

  // ============================================================
  // LANGUAGE
  // ============================================================
  language: {
    es: 'Español',
    en: 'English',
    switchLanguage: 'Language',
  },
};

export default en;

