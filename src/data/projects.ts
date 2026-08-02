export type ProjectArt = 'orbit' | 'grid' | 'wave' | 'nodes' | 'stack' | 'pulse';

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: 'ai' | 'fullstack' | 'frontend';
  categoryLabel: string;
  year: string;
  role: string;
  stack: string[];
  /** Factual highlights, not invented performance numbers. */
  metrics: { value: string; label: string }[];
  featured: boolean;
  status: 'Live' | 'Open source' | 'Archived' | 'In progress';
  links: { label: string; url: string }[];
  palette: [string, string];
  art: ProjectArt;
  video?: string;
}

export const projects: Project[] = [
  {
    slug: 'agentum',
    title: 'Agentum',
    tagline: 'AI customer-support platform',
    description:
      'A modern, enterprise-grade AI customer-support platform. Businesses ingest their documentation (PDF, CSV, raw text, or scraped straight from their website), group it into custom sections with their own specialised tones, and embed an AI chat widget on any third-party site.',
    category: 'ai',
    categoryLabel: 'AI Platform',
    year: '2025',
    role: 'Creator',
    stack: ['Next.js 16', 'React 19', 'TypeScript', 'App Router'],
    metrics: [
      { value: 'Next.js 16', label: 'App Router + React 19' },
      { value: '4 sources', label: 'PDF, CSV, text, scraping' },
      { value: 'Embeddable', label: 'widget for any site' },
    ],
    featured: true,
    status: 'Live',
    links: [{ label: 'Visit Agentum', url: 'https://agentum-xwf6.onrender.com/' }],
    palette: ['#dedbc8', '#3a382e'],
    art: 'nodes',
    video: '/media/agentum.webm',
  },
  {
    slug: 'biomatch',
    title: 'BioMatch',
    tagline: 'AI-powered organ donation platform & startup',
    description:
      'An advanced AI organ-donor matching system I founded and built. It uses real population genetics data to run multi-organ compatibility analysis with predictive analytics, simulating the transplant coordination tools hospitals use professionally.',
    category: 'ai',
    categoryLabel: 'AI / Startup',
    year: '2025',
    role: 'Founder & developer',
    stack: ['Next.js', 'TypeScript', 'Laravel'],
    metrics: [
      { value: 'Multi-organ', label: 'compatibility analysis' },
      { value: 'Genetics', label: 'real population data' },
      { value: 'Nov 2025', label: 'pitched at Africa Youth Forum' },
    ],
    featured: true,
    status: 'Live',
    links: [{ label: 'Visit BioMatch', url: 'https://bio-match-tau.vercel.app/' }],
    palette: ['#c9c5ab', '#2c2f28'],
    art: 'pulse',
    video: '/media/biomatch.webm',
  },
  {
    slug: 'gugut-growth-center',
    title: 'Gugut Growth Center',
    tagline: 'Interactive learning platform for kids',
    description:
      'An interactive website for children to engage in STEM and afterschool activities. Built as a client-ready solution that combines educational content with genuinely fun, interactive design.',
    category: 'frontend',
    categoryLabel: 'Frontend',
    year: '2025',
    role: 'Frontend developer',
    stack: ['React', 'Tailwind CSS'],
    metrics: [
      { value: 'STEM', label: 'afterschool activities' },
      { value: 'Responsive', label: 'React + Tailwind' },
      { value: 'Delivered', label: 'client-ready build' },
    ],
    featured: false,
    status: 'Live',
    links: [{ label: 'Visit Gugut', url: 'https://gugut-growth.netlify.app/' }],
    palette: ['#e1d9bd', '#3b3327'],
    art: 'grid',
    video: '/media/screen-capture.webm',
  },
  {
    slug: 'raha-tours',
    title: 'Raha Tours',
    tagline: 'Modern travel & tourism web platform',
    description:
      'A sleek, high-conversion tourism web application crafted for a private client. Built with React 19 and Tailwind CSS, featuring interactive tour package discovery, destination showcases, dynamic booking inquiries, and a responsive mobile-first UI tailored for travel enthusiasts.',
    category: 'frontend',
    categoryLabel: 'Frontend / Client Work',
    year: '2025',
    role: 'Frontend Engineer',
    stack: ['React 19', 'Tailwind CSS', 'TypeScript', 'Framer Motion'],
    metrics: [
      { value: 'React 19', label: 'Modern component architecture' },
      { value: 'Tailwind CSS', label: 'Custom responsive design system' },
      { value: 'Client Work', label: 'Private tourism client' },
    ],
    featured: true,
    status: 'Live',
    links: [{ label: 'Visit Raha Tours', url: 'https://raha-tourss.vercel.app/' }],
    palette: ['#d9e1bd', '#2e3b27'],
    art: 'orbit',
    video: '/media/raha.webm',
  },
  {
    slug: 'amazon-clone',
    title: 'Amazon Clone',
    tagline: 'Storefront rebuilt from scratch',
    description:
      'A from-scratch rebuild of the Amazon storefront in React and Tailwind, with no UI kit or component library underneath it. Cloning an interface everybody already knows is a good way to be honest with yourself: the layout either holds at every breakpoint or it visibly does not, and there is nowhere to hide behind original design.',
    category: 'frontend',
    categoryLabel: 'Frontend',
    year: '2025',
    role: 'Solo build',
    stack: ['React', 'Tailwind CSS'],
    metrics: [
      { value: 'From scratch', label: 'no UI kit or template' },
      { value: 'React', label: 'component-driven storefront' },
      { value: 'Tailwind CSS', label: 'responsive at every breakpoint' },
    ],
    featured: false,
    status: 'Live',
    links: [{ label: 'Visit Amazon Clone', url: 'https://amazon-clone-mohammedsalih.netlify.app/' }],
    palette: ['#e6d3ae', '#3a3125'],
    art: 'wave',
    video: '/media/amazon.webm',
  },
  {
    slug: 'evangadi-forum',
    title: 'Evangadi Forum',
    tagline: 'Q&A community platform',
    description:
      'A forum for the Evangadi Tech community where users post questions, answer each other, and interact in a structured way. Built end to end: backend APIs in Laravel, frontend in React.',
    category: 'fullstack',
    categoryLabel: 'Full-stack',
    year: '2024',
    role: 'Full-stack developer',
    stack: ['Laravel', 'React', 'REST APIs'],
    metrics: [
      { value: 'Auth', label: 'user authentication' },
      { value: 'Q&A', label: 'posts and commenting' },
      { value: 'Community', label: 'for Evangadi Tech' },
    ],
    featured: false,
    status: 'Live',
    links: [{ label: 'Visit Evangadi Forum', url: 'https://evangadi-forummame.netlify.app/' }],
    palette: ['#b8b6a6', '#2a2a26'],
    art: 'stack',
    video: '/media/evangadi.webm',
  },
];

export const projectFilters = [
  { id: 'all', label: 'All work' },
  { id: 'ai', label: 'AI' },
  { id: 'fullstack', label: 'Full-stack' },
  { id: 'frontend', label: 'Frontend' },
];
