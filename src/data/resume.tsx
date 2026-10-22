import { Icons } from "@/components/icons";
import { HomeIcon } from "lucide-react";
import { ReactLight } from "@/components/ui/svgs/reactLight";
import { NextjsIconDark } from "@/components/ui/svgs/nextjsIconDark";
import { Typescript } from "@/components/ui/svgs/typescript";
import { Nodejs } from "@/components/ui/svgs/nodejs";
import { Python } from "@/components/ui/svgs/python";
import { Postgresql } from "@/components/ui/svgs/postgresql";
import { Docker } from "@/components/ui/svgs/docker";
import { Kubernetes } from "@/components/ui/svgs/kubernetes";

export const DATA = {
  name: "Mohammed Salih",
  initials: "MS",
  url: "https://portfoilo-eight-indol.vercel.app",
  location: "Addis Ababa, Ethiopia",
  locationLink: "https://www.google.com/maps/place/addisababa",
  description:
    "Senior Software Developer and Professional QA Engineer. I design and ship real products that just work.",
  summary:
    "I'm Mohammed, a senior software developer with five years of experience designing, building, and shipping production systems. Great AI products start with solid architecture. System design is my strongest skill, and it is where I’m most comfortable and do my best work.\n\nSince 2022, I've been CTO and Backend/AI Lead at [AfroDigital Innovation Labs](https://afrodigital.dev/), one of Ethiopia's most prominent digital agencies. I oversee AI engineering across our client portfolio, from LLM-driven features to autonomous agents, and build the scalable backend infrastructure that takes them into production for businesses and institutions.\n\nOutside AfroDigital, I build and launch my own products. I founded [Parsim](https://parsim-landing.vercel.app), a drop-in proxy that manages context for long-running AI agents, and [Agentum](https://agentum.afrodigital.dev/), an enterprise AI customer-support platform, along with several other independent products.\n\nI'm also a professional QA engineer with a strong background in software testing, so I care as much about how systems fail as how they work. Selected for my academic performance, I work as a lab teaching assistant at BITS College, the same college where I'm studying, teaching Data Structures and Algorithms and Python to junior students.\n\nCurrently the top-ranked GitHub contributor in Ethiopia, working from Addis Ababa with teams worldwide. Have an ambitious idea that needs solid engineering behind it? Let's talk.",
  avatarUrl: "https://res.cloudinary.com/dksnuwud/image/upload/f_auto/q_auto/photo_2026-10-19_13-57-53.jpg",
  resumeUrl: "/Mohammed_Salih_Resume.pdf",
  languages: [
    { name: "TypeScript", icon: Typescript },
    { name: "Ruby", icon: "/tech/ruby.svg" },
    { name: "PHP", icon: "/tech/php.svg" },
    { name: "Python", icon: Python },
  ],
  stack: [
    { name: "NestJS", icon: "/tech/nestjs.svg" },
    { name: "Hono", icon: "/tech/hono.svg" },
    { name: "Node.js", icon: Nodejs },
    { name: "Next.js", icon: NextjsIconDark },
    { name: "React", icon: ReactLight },
    { name: "Laravel", icon: "/tech/laravel.svg" },
    { name: "Ruby on Rails", icon: "/tech/rails.svg" },
    { name: "Django", icon: "/tech/django.svg" },
  ],
  testing: [
    { name: "Cypress", icon: "/tech/cypress.svg" },
    { name: "Selenium", icon: "/tech/selenium.svg" },
  ],
  tools: [
    { name: "PostgreSQL", icon: Postgresql },
    { name: "MySQL", icon: "/tech/mysql.svg" },
    { name: "Redis", icon: "/tech/redis.svg" },
    { name: "Supabase", icon: "/tech/supabase.svg" },
    { name: "Docker", icon: Docker },
    { name: "Kubernetes", icon: Kubernetes },
    { name: "Git & GitHub", icon: "/tech/git.svg" },
    { name: "GitHub Actions", icon: "/tech/github-actions.svg" },
    { name: "LangChain", icon: "/tech/langchain.svg" },
  ],
  navbar: [{ href: "/", icon: HomeIcon, label: "Home" }],
  contact: {
    email: "mohammed1112ok@gmail.com",
    tel: "+251966074050",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/mohammedsbd",
        icon: Icons.github,
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/mohammedsalihhh",
        icon: Icons.linkedin,
        navbar: true,
      },
      X: {
        name: "X",
        url: "https://x.com/mohammedsbdd",
        icon: Icons.x,
        navbar: true,
      },
      email: {
        name: "Send Email",
        url: "mailto:mohammed1112ok@gmail.com",
        icon: Icons.email,
        navbar: false,
      },
    },
  },

  work: [
    {
      company: "AfroDigital Innovation Labs PLC",
      href: "https://afrodigital.dev/",
      badges: [],
      location: "Addis Ababa, Ethiopia",
      title: "CTO & Backend/AI Lead",
      logoUrl: "https://res.cloudinary.com/dksnuwud/image/upload/f_auto/q_auto/afro.png",
      start: "2022",
      end: "Present",
      description:
        "Lead technology and engineering at a software development PLC delivering web, AI, cloud, and security solutions for client organizations. Drive AI integration across client projects, from designing LLM-powered features and autonomous agents to shipping them into production, and guide a team of developers building AI-powered products.",
    },
  ],
  education: [
    {
      school: "BITS College of Systems and Technology",
      href: "https://www.bitscollege.edu.et/",
      degree: "B.Sc. Software Engineering, Third Year · GPA 4.0 / 4.0",
      logoUrl: "https://res.cloudinary.com/dksnuwud/image/upload/f_auto/q_auto/10001.png",
      start: "2024",
      end: "Present",
      description:
        "I'm not only a student at BITS College, I also teach here. Selected for my academic performance, I serve as a lab teaching assistant, teaching Python to first-year students and Data Structures & Algorithms to second-year students. I also lead development teams building real software for the college.",
    },
    {
      school: "Evangadi Tech",
      href: "https://evangadi.com/",
      degree: "Full Stack Web Development Certification",
      logoUrl: "https://res.cloudinary.com/dksnuwud/image/upload/f_auto/q_auto/eva.png",
      start: "2023",
      end: "2024",
      description:
        "Although much of my skill set is self-taught, I completed this intensive 7-month full-stack program to formally validate it. Along the way, I built and shipped real full-stack products from start to finish, strengthening the engineering fundamentals I rely on today.",
    },
  ],
  projects: [
    {
      title: "YeneSchool",
      href: "https://www.yeneschool.me/",
      dates: "",
      active: true,
      description:
        "An AI-Director-driven school operating system for complete school management. An autonomous AI Director runs nightly audits, morning briefings, and 24/7 multilingual parent communication.",
      technologies: ["AI", "School Management", "Multilingual"],
      links: [
        {
          type: "Website",
          href: "https://www.yeneschool.me/",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "https://res.cloudinary.com/dksnuwud/image/upload/f_auto/q_auto/yene.png",
    },
    {
      title: "Parsim",
      href: "https://parsim-landing.vercel.app",
      dates: "",
      active: true,
      description:
        "A drop-in proxy that garbage-collects context for long-running AI agents, speaking the OpenAI and Anthropic APIs. It keeps, compresses, archives, or drops context per request and tracks tokens saved.",
      technologies: ["TypeScript", "OpenAI API", "Anthropic API", "AI Agents"],
      links: [
        {
          type: "Website",
          href: "https://parsim-landing.vercel.app",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "https://res.cloudinary.com/dksnuwud/image/upload/f_auto/q_auto/newparsim.png",
    },
    {
      title: "Agentum",
      href: "https://agentum.afrodigital.dev/",
      dates: "",
      active: true,
      description:
        "An enterprise-grade AI customer-support platform built on Next.js 16 and React 19. Businesses ingest docs, PDFs, CSVs, or websites into custom sections and embed an AI chat widget anywhere.",
      technologies: ["Next.js 16", "React 19", "TypeScript", "AI"],
      links: [
        {
          type: "Website",
          href: "https://agentum.afrodigital.dev/",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "https://res.cloudinary.com/dksnuwud/video/upload/v1792310650/agentum.jpg",
    },
    {
      title: "Amazon Storefront",
      href: "https://amazon-clone-mohammedsalih.netlify.app/",
      dates: "2024",
      active: true,
      description:
        "A from-scratch rebuild of the Amazon storefront in React and Tailwind, with no UI kit and no AI. Built for fun in my free time, because cloning a familiar interface keeps you honest: the layout holds at every breakpoint or visibly doesn't.",
      technologies: ["React", "Tailwind CSS"],
      links: [
        {
          type: "Website",
          href: "https://amazon-clone-mohammedsalih.netlify.app/",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "https://res.cloudinary.com/dksnuwud/image/upload/f_auto/q_auto/amazon_clone.png",
    },
    {
      title: "Evangadi Forum",
      href: "https://evangadi-forummame.netlify.app",
      dates: "2024",
      active: true,
      description:
        "A Q&A community platform for Evangadi Tech where users post questions, answer each other, and interact in a structured way. Built end to end with Laravel APIs and a React frontend.",
      technologies: ["React", "Laravel", "REST API"],
      links: [
        {
          type: "Website",
          href: "https://evangadi-forummame.netlify.app",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "https://res.cloudinary.com/dksnuwud/image/upload/f_auto/q_auto/forum.png",
    },
    {
      title: "Raha Tours",
      href: "https://raha-tourss.vercel.app/",
      dates: "",
      active: true,
      description:
        "A high-conversion tourism web app crafted for a private client with React 19 and Tailwind CSS. Features tour package discovery, destination showcases, booking inquiries, and a mobile-first UI.",
      technologies: ["React 19", "Tailwind CSS"],
      links: [
        {
          type: "Website",
          href: "https://raha-tourss.vercel.app/",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "https://res.cloudinary.com/dksnuwud/image/upload/f_auto/q_auto/raha.png",
    },
    {
      title: "BioMatch",
      href: "https://bio-match-tau.vercel.app/",
      dates: "2025",
      active: true,
      description:
        "An AI-powered organ donor matching startup using real population genetics data for multi-organ compatibility analysis. Pitched at Lead Business 2025 and to investors at the Africa Youth Forum.",
      technologies: ["Next.js", "TypeScript", "Laravel", "AI"],
      links: [
        {
          type: "Website",
          href: "https://bio-match-tau.vercel.app/",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "https://res.cloudinary.com/dksnuwud/image/upload/f_auto/q_auto/bio.png",
    },
  ],
} as const;
