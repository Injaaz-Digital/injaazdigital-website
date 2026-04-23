import path from 'path';

const defaultRemoteOrigins = ['http://127.0.0.1:1337', 'http://localhost:1337', process.env.NEXT_PUBLIC_STRAPI_URL].filter(Boolean);
const repoRoot = path.resolve(process.cwd(), '..');

const remotePatterns = defaultRemoteOrigins.flatMap((origin) => {
  try {
    const url = new URL(origin);
    return [
      {
        protocol: url.protocol.replace(':', ''),
        hostname: url.hostname,
        port: url.port,
        pathname: '/**',
      },
    ];
  } catch {
    return [];
  }
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns,
  },
  turbopack: {
    root: repoRoot,
  },
};

export default nextConfig;
