/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // This enables static export
  distDir: 'out', // Optional: Specifies the output directory
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
