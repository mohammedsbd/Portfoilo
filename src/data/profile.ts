import { projects } from './projects';

export const profile = {
  name: 'Mohammed Salih',
  firstName: 'Mohammed',
  role: 'Software Engineer & Founder',
  location: 'Addis Ababa, Ethiopia',
  email: 'mohammed1112ok@gmail.com',
  phone: '+251 96 607 4050',
  phoneHref: '+251966074050',
  github: 'https://github.com/mohammedsbd',
  /** Served straight out of /public, so it opens in the browser's own PDF
      viewer on click and downloads from there. */
  resume: '/Mohammed_Salih_Resume.pdf',
  company: 'AfroDigital Innovation Labs PLC',
  companyUrl: 'https://afrodigital.dev/',
  available: true,
  availabilityNote: 'Open to internships, freelance & collaborations',

  eyebrow: 'Software Engineer & Founder / Addis Ababa, Ethiopia',
  headline: 'Build What Matters',
  subheadline:
    'Software engineering student at BITS College and co-founder of AfroDigital Innovation Labs. I build full-stack products with AI at their core, from an enterprise support platform to an organ-matching system.',

  rotatingWords: [
    'AI support platforms',
    'organ-matching systems',
    'products that ship',
    'teams that deliver',
  ],

  about: [
    "I'm a software engineer based in Addis Ababa, studying Software Engineering at BITS College while running a software company with my co-CEO.",
    'Most of my work sits where full-stack engineering meets AI. I built Agentum, an enterprise-grade customer-support platform that ingests a company’s documentation and serves it back through an embeddable chat widget. I founded BioMatch, an AI organ-donor matching system that runs multi-organ compatibility analysis on real population genetics data, and pitched it to investors at the Africa Youth Forum.',
    'At AfroDigital I lead AI integration for the dev team, building features that localise client websites into other languages through APIs. Before that I interned at LaloDev shipping a Laravel and React feedback platform end to end.',
  ],

  // Every one of these is taken straight from the resume — nothing estimated.
  // `tally` is the same figure as a whole count, for the marks struck beside
  // it. The project count is read off the project list so the number and the
  // cards below it can never disagree.
  stats: [
    { value: 4, suffix: ' / 4.0', label: 'Current GPA at BITS College', decimals: 1, tally: 4 },
    {
      value: projects.length,
      suffix: '',
      label: 'Major projects shipped',
      tally: projects.length,
    },
    { value: 2, suffix: '', label: 'Professional certifications', tally: 2 },
    { value: 1, suffix: '', label: 'Company co-founded', tally: 1 },
  ],

  telegram: 'https://t.me/exoldia',
  telegramHandle: '@exoldia',

  /* The four ways to actually reach me, in the order I answer them. The
     contact section renders this list directly now that there is no form, so
     anything added here shows up as a channel there and in the footer. */
  socials: [
    { label: 'Email', handle: 'mohammed1112ok@gmail.com', url: 'mailto:mohammed1112ok@gmail.com' },
    { label: 'Telegram', handle: '@exoldia', url: 'https://t.me/exoldia' },
    { label: 'GitHub', handle: '@mohammedsbd', url: 'https://github.com/mohammedsbd' },
    { label: 'Phone', handle: '+251 96 607 4050', url: 'tel:+251966074050' },
  ],

  toolbelt: [
    'TypeScript',
    'Next.js',
    'React',
    'Laravel',
    'Node.js',
    'Tailwind',
    'Vue.js',
    'Python',
    'PHP',
    'Docker',
  ],
};

export const experience = [
  {
    period: '2025 – Present',
    role: 'Founder & Co-CEO',
    company: 'AfroDigital Innovation Labs PLC',
    location: 'Addis Ababa',
    url: 'https://afrodigital.dev/',
    summary:
      'Co-founded a software development PLC delivering software development, AI integration, cloud, and security solutions for client organizations.',
    highlights: [
      'Oversee company strategy, operations, and technical direction alongside the co-CEO',
      'Lead a team of developers building websites and AI-powered products for clients',
    ],
    stack: ['Leadership', 'Strategy', 'AI Integration'],
  },
  {
    period: '2025 – Present',
    role: 'Lead AI Integration Specialist & Developer',
    company: 'AfroDigital',
    location: 'Remote',
    url: 'https://afrodigital.dev/',
    summary:
      'Active development team member building websites for client organizations, leading AI integration across the team.',
    highlights: [
      'Integrate AI-based features to localise websites, converting content to other languages via APIs',
      'Work alongside a team of developers delivering client projects',
    ],
    stack: ['Next.js', 'React', 'AI APIs'],
  },
  {
    period: 'Dec 2024 – Apr 2025',
    role: 'Full-Stack Developer Intern',
    company: 'LaloDev',
    location: 'Addis Ababa',
    summary:
      'Built a full-stack feedback management system using Laravel and React over a four-month internship.',
    highlights: [
      'Built REST APIs to manage feedback submission, storage, and retrieval',
      'Created reusable React components for responsive, interactive UI',
      'Integrated frontend and backend systems using API-based architecture',
      'Used Git for version control and collaborative development',
    ],
    stack: ['Laravel', 'React', 'REST APIs', 'Git'],
  },
];

export const education = {
  school: 'BITS College',
  location: 'Addis Ababa, Ethiopia',
  degree: 'Bachelor of Software Engineering',
  period: '2024 – Present',
  gpa: '4.0 / 4.0',
  coursework: [
    'Data Structures and Algorithms',
    'Software Engineering',
    'Web Development',
    'Databases',
    'Object Oriented Programming',
  ],
  note: 'Active in software development projects and collaborative dev teams.',
};

export const certifications = [
  {
    title: 'Full Stack Web Development Certification',
    issuer: 'Evangadi Tech',
    period: '2023 – 2024',
    highlights: [
      'Intensive 6-month program focused on full-stack web development',
      'Built projects using JavaScript, React, Node.js, HTML, and CSS',
      'Learned Git workflows, API development, and responsive web design',
    ],
  },
  {
    title: 'Laravel & React Internship Certification',
    issuer: 'LaloDev',
    period: 'Dec 2024 – Apr 2025',
    highlights: [
      '4-month intensive program in full-stack development with Laravel and React',
      'Hands-on projects and real-world application development',
      'Learned Git workflows, API development, and responsive web design',
    ],
  },
];

export const services = [
  {
    title: 'AI Integration',
    body: 'Bringing AI into products that did not have it: document ingestion, retrieval, chat interfaces, and automatic content localisation through APIs.',
    tags: ['AI APIs', 'Next.js', 'Localisation'],
  },
  {
    title: 'Full-Stack Product Builds',
    body: 'From an empty repo to something on a real domain with real users. Next.js and React on the front, Laravel or Node behind it.',
    tags: ['Next.js', 'Laravel', 'TypeScript'],
  },
  {
    title: 'Frontend Engineering',
    body: 'Responsive, accessible interfaces built from reusable components, the kind a team can keep extending after I hand it over.',
    tags: ['React', 'Vue.js', 'Tailwind'],
  },
  {
    title: 'Team & Technical Leadership',
    body: 'Leading a dev team at AfroDigital: setting technical direction, reviewing work, and keeping client projects shipping.',
    tags: ['Leadership', 'Code Review', 'Delivery'],
  },
];

export const navItems = [
  { id: 'about', label: 'About', num: '01' },
  { id: 'work', label: 'Work', num: '03' },
  { id: 'journey', label: 'Journey', num: '04' },
];
