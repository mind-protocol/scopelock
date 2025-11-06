/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // basePath: '/deck', // Uncomment when deploying as subdirectory
  typescript: {
    // Dangerously allow production builds to complete even with type errors
    // This is needed for Vercel deployment with react-syntax-highlighter
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
