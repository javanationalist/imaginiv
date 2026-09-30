/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProjectItem {
  id: string;
  title: string;
  category: 'Film & Cinema' | 'Spatial Experience' | 'Brand Identity' | 'Interactive Media';
  tagline: string;
  description: string;
  fullStory: string;
  deliverables: string[];
  tags?: string[];
  client: string;
  year: string;
  accent: string;
  accentBadge: string;
  colorScheme: 'orange' | 'green' | 'blue';
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: 'Film & Video' | 'Brand Identity' | 'Spatial & Interactive' | 'Publications';
  aspectRatio: 'square' | 'portrait' | 'landscape';
  description: string;
  medium: string;
  year: string;
  colorScheme: 'orange' | 'green' | 'blue';
  gradient: string;
}

export interface CreativeTenet {
  number: string;
  title: string;
  concept: string;
  actionableTip: string;
  iconName: string;
  colorScheme: 'orange' | 'green' | 'blue';
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  discipline: string;
  bio: string;
  avatarSeed: string;
  socials: {
    portfolio?: string;
    github?: string;
    linkedin?: string;
    mail?: string;
  };
  colorScheme: 'orange' | 'green' | 'blue';
}

export interface EthicsPillar {
  number: string;
  title: string;
  summary: string;
  commitments: string[];
  iconName: string;
  colorScheme: 'orange' | 'green' | 'blue';
}

export interface InclusivityPrinciple {
  number: string;
  title: string;
  description: string;
  standards: string[];
  iconName: string;
  colorScheme: 'orange' | 'green' | 'blue';
}

// 1. Projects Data
export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: 'chronicles-of-the-haven',
    title: 'Chronicles of the Haven',
    category: 'Film & Cinema',
    tagline: 'A tactile docuseries capturing ancestral craftsmanship and oral folklore.',
    description: 'A 4-part documentary series recorded with anamorphic glass and binaural microphones, exploring community elders who preserve endangered manual crafts.',
    fullStory: 'Shot across six seasons in mountainous agricultural communities, Chronicles of the Haven combines cinematic medium format footage with oral histories. Our sound team constructed custom spatial hydrophone and binaural arrays to capture tactile audio of timber carving, copper forging, and botanical weaving.',
    deliverables: [
      'Original 4K HDR Feature Docuseries (4 x 42 mins)',
      'Immersive Dolby Atmos Sound Master & Spatial Score',
      'Archival 180-page Hardcover Companion Book',
      'Interactive Web Documentary Archive'
    ],
    client: 'Heritage Guild of Arts',
    year: '2025',
    accent: 'from-[#8B5A2B] to-[#5E3A1A]',
    accentBadge: '#8B5A2B',
    colorScheme: 'orange'
  },
  {
    id: 'aura-soundscape-pavilion',
    title: 'Aura Soundscape Pavilion',
    category: 'Spatial Experience',
    tagline: 'An architectural acoustic installation translating microclimates into music.',
    description: 'An open-air timber structure featuring 64 kinetic acoustic chimes and solar-powered synthesizers that respond live to barometric pressure and wind velocity.',
    fullStory: 'Constructed for the Biennial of Future Living, the Aura Pavilion transforms invisible atmospheric currents into continuous ambient polyphony. The architecture uses sustainably harvested larch wood and custom brass acoustic reeds tuned to pentatonic natural scales.',
    deliverables: [
      'Permanent Kinetic Timber Pavilion Architecture',
      'Custom Ambient Generative Audio Engine',
      'Real-Time Atmospheric Telemetry Interface',
      'Visitor Exhibition Companion App'
    ],
    client: 'Nordic Contemporary Art Foundation',
    year: '2025',
    accent: 'from-[#3F6D9E] to-[#254668]',
    accentBadge: '#3F6D9E',
    colorScheme: 'blue'
  },
  {
    id: 'verdant-brand-ecosystem',
    title: 'Verdant Living Brand Ecosystem',
    category: 'Brand Identity',
    tagline: 'A comprehensive botanical identity crafted with vegetable inks and tactile paper.',
    description: 'Complete brand architecture for a zero-waste botanical laboratory, including adaptive typography, physical debossed packaging, and digital guidelines.',
    fullStory: 'Rejecting generic digital minimalism, we developed a living identity system inspired by early apothecary herbariums. The visual system features custom letterpress typography, cotton rag paper packaging, and a responsive web catalog designed for maximum readability.',
    deliverables: [
      'Comprehensive Brand Architecture & Design Token System',
      'Debossed Compostable Packaging Line (14 SKUs)',
      'Custom Serif & Display Variable Typography',
      'Accessible Digital Commerce Platform'
    ],
    client: 'Verdant Botanical Labs',
    year: '2026',
    accent: 'from-[#4F7F5A] to-[#2D4D34]',
    accentBadge: '#4F7F5A',
    colorScheme: 'green'
  },
  {
    id: 'lumina-interactive-archive',
    title: 'Lumina Digital Archive',
    category: 'Interactive Media',
    tagline: 'A spatial research library visualizing 100 years of independent cinematography.',
    description: 'A WebGL and keyboard-navigable spatial archive allowing cinephiles and film historians to trace camera rigs, lenses, and lighting diagrams across cinematic history.',
    fullStory: 'Commissioned by the Cinematheque Collective, Lumina maps over 8,000 film artifacts into an intuitive relational canvas. Designed with strict accessibility standards, users can navigate the archive with full keyboard support, high-contrast screen reader tokens, and tactile audio feedback.',
    deliverables: [
      'Spatial Relational Data Explorer with Keyboard Navigation',
      'High-Resolution Historical Camera 3D Reconstructions',
      'WCAG AAA Accessible Contrast Engine',
      'Open Research API for Film Academics'
    ],
    client: 'Cinematheque Collective',
    year: '2026',
    accent: 'from-[#E8863A] to-[#A85817]',
    accentBadge: '#E8863A',
    colorScheme: 'orange'
  }
];

// 2. Portfolio Gallery Data
export const PORTFOLIO_DATA: PortfolioItem[] = [
  {
    id: 'port-1',
    title: 'Solstice Reverie',
    category: 'Film & Video',
    aspectRatio: 'landscape',
    description: '16mm atmospheric short film capturing twilight ceremonies in seaside villages.',
    medium: '16mm Kodak Vision3 + Spatial Audio',
    year: '2025',
    colorScheme: 'orange',
    gradient: 'from-[#8B5A2B] via-[#A86935] to-[#5E3A1A]'
  },
  {
    id: 'port-2',
    title: 'Terra Botanical Monograph',
    category: 'Publications',
    aspectRatio: 'portrait',
    description: 'Editorial design system and letterpress printed compendium of wild medicinal flora.',
    medium: 'Offset Lithography & Recycled Kraft Stock',
    year: '2025',
    colorScheme: 'green',
    gradient: 'from-[#4F7F5A] via-[#3E6847] to-[#24422B]'
  },
  {
    id: 'port-3',
    title: 'Komorebi Spatial Installation',
    category: 'Spatial & Interactive',
    aspectRatio: 'square',
    description: 'Dynamic light filtering canopy that simulates sunlight passing through ancient forest canopies.',
    medium: 'Parametric Timber Lattice & Prismatic Glass',
    year: '2025',
    colorScheme: 'blue',
    gradient: 'from-[#3F6D9E] via-[#2D547D] to-[#1D3752]'
  },
  {
    id: 'port-4',
    title: 'Atelier Artisan Visual Identity',
    category: 'Brand Identity',
    aspectRatio: 'landscape',
    description: 'Monogram and visual vocabulary for an ethical ceramic and textile cooperative.',
    medium: 'Visual Identity, Seal Stamp & Web Guidelines',
    year: '2026',
    colorScheme: 'orange',
    gradient: 'from-[#E8863A] via-[#C96B23] to-[#823F0C]'
  },
  {
    id: 'port-5',
    title: 'Echoes of the Quarry',
    category: 'Film & Video',
    aspectRatio: 'portrait',
    description: 'Experimental sonic documentary set within dormant marble excavations.',
    medium: 'Binaural Audio Array & High-Speed Cinema',
    year: '2025',
    colorScheme: 'blue',
    gradient: 'from-[#345B85] via-[#2A496B] to-[#182C40]'
  },
  {
    id: 'port-6',
    title: 'Harmonics Typography Specimen',
    category: 'Publications',
    aspectRatio: 'square',
    description: 'Custom optical-size typeface crafted specifically for tactile screen and print environments.',
    medium: 'Type Design Specimen & Specimen Foldouts',
    year: '2026',
    colorScheme: 'green',
    gradient: 'from-[#5A8E67] via-[#436D4D] to-[#28472F]'
  }
];

// 3. 10 Being Creative Principles
export const BEING_CREATIVE_TENETS: CreativeTenet[] = [
  {
    number: '01',
    title: 'Begin with Genuine Curiosity',
    concept: 'Great media does not start with an answer or an algorithm. It begins with an honest, lingering question about the human condition.',
    actionableTip: 'Before opening software or writing a brief, spend an hour observing the physical context and interviewing the people at the core of the story.',
    iconName: 'Compass',
    colorScheme: 'orange'
  },
  {
    number: '02',
    title: 'Honor the Tactile & the Material',
    concept: 'Pixels become unforgettable when they carry the memory of paper, wood grain, light refraction, and acoustic friction.',
    actionableTip: 'Prototype ideas on real paper, record physical foley sounds, and borrow textures from nature rather than purely synthetic assets.',
    iconName: 'Layers',
    colorScheme: 'green'
  },
  {
    number: '03',
    title: 'Protect the Human Soul in Technology',
    concept: 'Tools are chisels; humans are sculptors. Never outsource empathy, moral clarity, or artistic discernment to automated prompts.',
    actionableTip: 'Ensure every creative choice has an intentional human rationale that can be articulated to an audience.',
    iconName: 'HeartHandshake',
    colorScheme: 'blue'
  },
  {
    number: '04',
    title: 'Embrace Generous Negative Space',
    concept: 'Silence gives shape to melody; whitespace gives dignity to thoughts. Do not fear stillness in layouts, films, or compositions.',
    actionableTip: 'Review every screen or timeline cut. Remove the least necessary element until only the essential heartbeat remains.',
    iconName: 'Maximize2',
    colorScheme: 'orange'
  },
  {
    number: '05',
    title: 'Build for Universal Accessibility',
    concept: 'Inclusivity is not a compliance checkbox; it is the ultimate measure of our empathy as storytellers and visual craftsmen.',
    actionableTip: 'Test high-contrast typography (WCAG AA/AAA), add descriptive captions, and guarantee comfortable keyboard navigation by default.',
    iconName: 'Eye',
    colorScheme: 'green'
  },
  {
    number: '06',
    title: 'Treat Every Project as a Shared Village',
    concept: 'Creative work thrives when directors, designers, artisans, and clients sit around the same table with mutual respect.',
    actionableTip: 'Eliminate toxic agency silos. Invite developers to script reads and writers to spatial layout reviews.',
    iconName: 'UsersRound',
    colorScheme: 'blue'
  },
  {
    number: '07',
    title: 'Prioritize Longevity Over Temporary Hype',
    concept: 'Design trends fade in six months; honest typography, balanced proportions, and profound narrative last for decades.',
    actionableTip: 'Ask: Will this project feel dignified and purposeful when revisited ten years from now?',
    iconName: 'Clock',
    colorScheme: 'orange'
  },
  {
    number: '08',
    title: 'Cultivate Daily Craft Rest & Reflection',
    concept: 'Burnout produces hollow output. Creative inspiration requires walks in nature, books outside your field, and quiet reflection.',
    actionableTip: 'Protect time for non-commercial exploration, reading physical books, and stepping away from digital screens.',
    iconName: 'Sun',
    colorScheme: 'green'
  },
  {
    number: '09',
    title: 'Be Transparent in Process & Attribution',
    concept: 'True mastery shares its methods. Acknowledge collaborators, respect source materials, and credit inspirations openly.',
    actionableTip: 'Document case studies with full collaborator lists, raw sketches, and honest retrospective takeaways.',
    iconName: 'Scale',
    colorScheme: 'blue'
  },
  {
    number: '10',
    title: 'Create What Brings Warmth to the World',
    concept: 'Media shapes culture. Use your talent to foster wonder, healing, community resilience, and deeper understanding between strangers.',
    actionableTip: 'Choose projects that leave communities stronger, more informed, and more connected than before.',
    iconName: 'Sun',
    colorScheme: 'orange'
  }
];

// 4. inFra Team Data
export const INFRA_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'elena-vance',
    name: 'Elena Vance',
    role: 'Creative Director & Narrative Lead',
    discipline: 'Cinematic Storytelling & Editorial Vision',
    bio: 'Former documentary cinematographer with 14 years of experience directing non-fiction cinema across 18 countries. Guides the narrative soul of all Framedia studio commissions.',
    avatarSeed: 'Elena',
    socials: {
      portfolio: 'https://framedia.creative',
      linkedin: 'https://linkedin.com',
      mail: 'elena@framedia.creative'
    },
    colorScheme: 'orange'
  },
  {
    id: 'marcus-chen',
    name: 'Marcus Chen',
    role: 'Head of Visual Architecture & Tactile Design',
    discipline: 'Typography, Spatial Systems & Physical Print',
    bio: 'Trained in classical bookbinding and modern computational typography. Champions physical letterpress, sustainable packaging materials, and balanced bento layouts.',
    avatarSeed: 'Marcus',
    socials: {
      portfolio: 'https://framedia.creative',
      github: 'https://github.com',
      mail: 'marcus@framedia.creative'
    },
    colorScheme: 'green'
  },
  {
    id: 'soraya-al-mansoor',
    name: 'Soraya Al-Mansoor',
    role: 'Lead Sound Architect & Spatial Composer',
    discipline: 'Acoustic Foley, Field Recording & Spatial Audio',
    bio: 'Acoustic ecologist capturing organic environmental vibrations. Builds custom hydrophones and binaural microphone arrays for studio documentaries and installations.',
    avatarSeed: 'Soraya',
    socials: {
      portfolio: 'https://framedia.creative',
      linkedin: 'https://linkedin.com',
      mail: 'soraya@framedia.creative'
    },
    colorScheme: 'blue'
  },
  {
    id: 'david-kim',
    name: 'David Kim',
    role: 'Creative Technologist & Accessible Systems Engineer',
    discipline: 'Full-Stack Web Architecture, Accessibility & WebGL',
    bio: 'Passionate about WCAG AAA contrast, semantic HTML, and lightweight performant web experiences that welcome users on low-bandwidth devices.',
    avatarSeed: 'David',
    socials: {
      portfolio: 'https://framedia.creative',
      github: 'https://github.com',
      mail: 'david@framedia.creative'
    },
    colorScheme: 'orange'
  },
  {
    id: 'amara-okafor',
    name: 'Amara Okafor',
    role: 'AI Ethics & Human Authorship Coordinator',
    discipline: 'Algorithmic Auditing, Cultural IP & Ethics Charters',
    bio: 'Researcher dedicated to protecting human artists from exploitative training datasets and enforcing transparent AI disclosure in commercial workflows.',
    avatarSeed: 'Amara',
    socials: {
      portfolio: 'https://framedia.creative',
      linkedin: 'https://linkedin.com',
      mail: 'amara@framedia.creative'
    },
    colorScheme: 'green'
  },
  {
    id: 'julian-rios',
    name: 'Julian Rios',
    role: 'Exhibition Architect & Spatial Producer',
    discipline: 'Timber Construction, Physical Pavilions & Lighting',
    bio: 'Architect focused on circular timber construction and museum pavilions that merge physical tactile craft with responsive environmental acoustics.',
    avatarSeed: 'Julian',
    socials: {
      portfolio: 'https://framedia.creative',
      linkedin: 'https://linkedin.com',
      mail: 'julian@framedia.creative'
    },
    colorScheme: 'blue'
  }
];

// 5. AI Ethics Pillars
export const AI_ETHICS_PILLARS: EthicsPillar[] = [
  {
    number: '01',
    title: 'Human Authorship Guarantee',
    summary: 'Every core creative idea, emotional thesis, and narrative arc is conceived and directed by human artists.',
    commitments: [
      'Zero 100% automated asset generation presented as original client work.',
      'Explicit artist attribution preserved across every production stage.',
      'Preserving emotional subtlety that only lived human experience can convey.'
    ],
    iconName: 'Users',
    colorScheme: 'orange'
  },
  {
    number: '02',
    title: 'Copyright & Intellectual Property Integrity',
    summary: 'We strictly reject models trained on scraping unconsented artist portfolios or private archives.',
    commitments: [
      'Verification that all computational tools use ethically licensed source datasets.',
      'Guarantee that client assets will never be ingested into public third-party model training loops.',
      'Active defense of freelance illustrators, writers, and musicians against unauthorized style cloning.'
    ],
    iconName: 'ShieldCheck',
    colorScheme: 'green'
  },
  {
    number: '03',
    title: 'Full Transparency & Client Disclosure',
    summary: 'Clients and audiences deserve complete honesty regarding what tools were utilized in production.',
    commitments: [
      'Clear production footnotes detailing when computational assistance (e.g., audio cleanup, de-noising) is applied.',
      'Transparent documentation included in all project delivery handoffs.',
      'Client opt-in requirement before applying any generative tool to brand assets.'
    ],
    iconName: 'FileText',
    colorScheme: 'blue'
  },
  {
    number: '04',
    title: 'Sustainable Computational Craft',
    summary: 'We remain mindful of the energy and environmental footprint of excessive generative computing.',
    commitments: [
      'Prioritizing lightweight, local, energy-efficient algorithms over massive brute-force clouds.',
      'Offsetting computational server loads with verifiable forest regeneration partners.',
      'Choosing deliberate handcrafted production over endless generative iterations.'
    ],
    iconName: 'Leaf',
    colorScheme: 'green'
  }
];

// 6. Inclusivity Principles
export const INCLUSIVITY_PRINCIPLES: InclusivityPrinciple[] = [
  {
    number: '01',
    title: 'Universal Sensory Accessibility',
    description: 'We believe media should welcome all sensory capabilities without creating second-class experiences.',
    standards: [
      'Strict WCAG AA and AAA color contrast verification for all typography.',
      'Multi-sensory closed captioning and comprehensive audio descriptions for all video productions.',
      'Fully keyboard-navigable web experiences with visible, high-contrast focus indicators.'
    ],
    iconName: 'Eye',
    colorScheme: 'green'
  },
  {
    number: '02',
    title: 'Representation of Diverse Cultural Narratives',
    description: 'A creative village must reflect the true richness and diversity of human civilization.',
    standards: [
      'Centering indigenous and historically underrepresented storytellers in cultural projects.',
      'Fair compensation and co-authorship recognition for all community cultural consultants.',
      'Active rejection of cultural appropriation and stereotyping across narrative and visual design.'
    ],
    iconName: 'HeartHandshake',
    colorScheme: 'orange'
  },
  {
    number: '03',
    title: 'Neurodivergent-Friendly Collaborative Spaces',
    description: 'Creativity flourishes when diverse cognitive styles are celebrated rather than forced into rigid molds.',
    standards: [
      'Clean interfaces free of aggressive flashing, auto-playing audio, or anxiety-inducing timers.',
      'Quiet studio workspaces and asynchronous collaboration options for deep focus.',
      'Clear, predictable navigation patterns and plain-language project descriptions.'
    ],
    iconName: 'HeartHandshake',
    colorScheme: 'blue'
  }
];
