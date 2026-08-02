import type { Metadata, Viewport } from 'next';
import { Almarai, Instrument_Serif, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { profile } from '@/data/profile';

// Global default face.
const almarai = Almarai({
  subsets: ['arabic'],
  display: 'swap',
  variable: '--font-almarai',
  weight: ['300', '400', '700', '800'],
});

// Italic accent face used inside headings.
const instrument = Instrument_Serif({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-instrument',
  weight: '400',
  style: ['normal', 'italic'],
});

// Retained for small technical labels — section numbers, chips, card details.
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono-jb',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://mohammed-salih-portfolio.vercel.app'),
  title: {
    default: `${profile.name} · ${profile.role} in Addis Ababa`,
    template: `%s · ${profile.name}`,
  },
  description: profile.subheadline,
  keywords: [
    'Mohammed Salih',
    'software engineer',
    'Addis Ababa',
    'Ethiopia',
    'full-stack developer',
    'AI integration',
    'Next.js',
    'TypeScript',
    'Laravel',
    'React',
    'AfroDigital',
    'BITS College',
  ],
  authors: [{ name: profile.name }],
  creator: profile.name,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: `${profile.name} · ${profile.role}`,
    description: profile.subheadline,
    siteName: profile.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${profile.name} · ${profile.role}`,
    description: profile.subheadline,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  jobTitle: profile.role,
  email: `mailto:${profile.email}`,
  telephone: profile.phoneHref,
  url: 'https://mohammed-salih-portfolio.vercel.app/',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Addis Ababa',
    addressCountry: 'ET',
  },
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'BITS College',
    address: { '@type': 'PostalAddress', addressLocality: 'Addis Ababa', addressCountry: 'ET' },
  },
  worksFor: {
    '@type': 'Organization',
    name: profile.company,
    url: profile.companyUrl,
  },
  knowsAbout: profile.toolbelt,
  sameAs: profile.socials.filter((s) => s.url.startsWith('http')).map((s) => s.url),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${almarai.variable} ${instrument.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body>
        {/* Runs before the body paints, so the stored theme is already on
            <html> and there is no flash of the wrong one. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='dark';}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
