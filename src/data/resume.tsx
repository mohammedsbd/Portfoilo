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
    "Senior Software Developer, Applied AI Specialist, and QA Engineer. I build AI-native backends and autonomous agents, engineered to scale and tested to hold.",
  summary:
    "I'm a senior software developer with five years of experience building real products. Great AI products start with solid architecture. System design is my strongest skill, and it is where I’m most comfortable and do my best work.\n\nI'm the Co-Founder and AI Backend Lead of [AfroDigital Innovation Labs](https://afrodigital.dev/), one of Ethiopia's most prominent digital agencies, where I've led for five years. There, I architect the intelligent systems behind our products, turning complex ideas into platforms that businesses and institutions rely on every day.\n\nOutside AfroDigital, I build and launch my own products. I founded [Parsim](https://parsim-landing.vercel.app), a drop-in proxy that manages context for long-running AI agents, and [Agentum](https://agentum-xwf6.onrender.com/), an enterprise AI customer-support platform, along with several other independent products.\n\nMy craft lives in the backend. I architect with Node.js, NestJS, and Hono, and I hold every release to the standard of a professional QA engineer, because I am one. I write the code, then I try to break it.\n\nCurrently the most active GitHub user in Ethiopia, and building from Addis Ababa. If you're working on something ambitious, I'd like to hear about it.",
  avatarUrl: "/mohammed.jpg",
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
        navbar: true,
      },
    },
  },

  work: [
    {
      company: "AfroDigital Innovation Labs PLC",
      href: "https://afrodigital.dev/",
      badges: [],
      location: "Addis Ababa, Ethiopia",
      title: "Co-Founder & AI Backend Lead",
      logoUrl: "https://res.cloudinary.com/dksnuwud/image/upload/f_auto/q_auto/afro.png",
      start: "2021",
      end: "Present",
      description:
        "Co-founded a software development PLC delivering web, AI, cloud, and security solutions for client organizations. Lead AI integration across client projects, from designing LLM-powered features and autonomous agents to shipping them into production, and guide a team of developers building AI-powered products.",
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
        "Lab assistant teaching Python to first-year students and Data Structures & Algorithms to second-year students. I also lead real development teams building software at BITS College.",
    },
    {
      school: "Evangadi Tech",
      href: "#",
      degree: "Full Stack Web Development Certification",
      logoUrl: "https://res.cloudinary.com/dksnuwud/image/upload/f_auto/q_auto/eva.png",
      start: "2023",
      end: "2024",
      description:
        "An intensive, hands-on program where I built real full-stack projects from start to finish and learned the fundamentals that shaped how I engineer software today.",
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
      href: "https://agentum-xwf6.onrender.com/",
      dates: "",
      active: true,
      description:
        "An enterprise-grade AI customer-support platform built on Next.js 16 and React 19. Businesses ingest docs, PDFs, CSVs, or websites into custom sections and embed an AI chat widget anywhere.",
      technologies: ["Next.js 16", "React 19", "TypeScript", "AI"],
      links: [
        {
          type: "Website",
          href: "https://agentum-xwf6.onrender.com/",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "https://res.cloudinary.com/dksnuwud/video/upload/v1792310650/agentum.jpg",
    },
    {
      title: "Amazon Clone",
      href: "https://github.com/mohammedsbd/amazon-frontend-deploy",
      dates: "2024",
      active: true,
      description:
        "A from-scratch rebuild of the Amazon storefront in React and Tailwind, with no UI kit and no AI. Built for fun in my free time, because cloning a familiar interface keeps you honest: the layout holds at every breakpoint or visibly doesn't.",
      technologies: ["React", "Tailwind CSS"],
      links: [
        {
          type: "Source",
          href: "https://github.com/mohammedsbd/amazon-frontend-deploy",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "https://res.cloudinary.com/dksnuwud/image/upload/f_auto/q_auto/amazon_clone.png",
    },
    {
      title: "Evangadi Forum",
      href: "https://github.com/mohammedsbd/evangadi-frorum-frontend",
      dates: "2024",
      active: true,
      description:
        "A Q&A community platform for Evangadi Tech where users post questions, answer each other, and interact in a structured way. Built end to end with Laravel APIs and a React frontend.",
      technologies: ["React", "Laravel", "REST API"],
      links: [
        {
          type: "Source",
          href: "https://github.com/mohammedsbd/evangadi-frorum-frontend",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "https://res.cloudinary.com/dksnuwud/video/upload/v1792311129/evangadi.jpg",
    },
    {
      title: "Raha Tours",
      href: "https://github.com/mohammedsbd/Raha-Tours",
      dates: "",
      active: true,
      description:
        "A high-conversion tourism web app crafted for a private client with React 19 and Tailwind CSS. Features tour package discovery, destination showcases, booking inquiries, and a mobile-first UI.",
      technologies: ["React 19", "Tailwind CSS"],
      links: [
        {
          type: "Source",
          href: "https://github.com/mohammedsbd/Raha-Tours",
          icon: <Icons.github className="size-3" />,
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
