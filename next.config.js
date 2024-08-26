/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // This line is important for static exports
  distDir: 'out',
}

module.exports = nextConfig