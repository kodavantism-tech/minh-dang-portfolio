import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Every image is a local, pre-resized .webp committed to /public.
  // No remote hosts, no Vercel image-transform quota, nothing that breaks
  // if a store listing disappears.
  images: { unoptimized: true },
};

export default nextConfig;
