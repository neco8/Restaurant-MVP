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

if (process.env.DEMO_MODE === "true") {
  nextConfig.pageExtensions = ["demo.ts", "demo.tsx", "ts", "tsx", "js", "jsx"];
}

export default nextConfig;
