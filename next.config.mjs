/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  experimental: {
    // Tree-shakes framer-motion's barrel export so only what is used ships.
    optimizePackageImports: ['framer-motion'],
  },
  async headers() {
    return [
      {
        // Files in /public are served with `max-age=0` by default, so every
        // visit re-validates every clip. Let browsers and the CDN keep them.
        source: '/:dir(media|posters)/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=86400' },
        ],
      },
      {
        source: '/noise.png',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

export default nextConfig;
