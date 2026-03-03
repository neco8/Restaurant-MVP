/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dpneo4oa38auagf6.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
