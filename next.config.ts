import type { NextConfig } from "next";

if (!process.env.NEXTAUTH_URL && process.env.VERCEL_URL) {
  process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
} else if (process.env.NEXTAUTH_URL === "") {
  delete process.env.NEXTAUTH_URL;
}

const nextConfig: NextConfig = {
  env: {
    NEXTAUTH_URL:
      process.env.NEXTAUTH_URL && process.env.NEXTAUTH_URL.trim() !== ""
        ? process.env.NEXTAUTH_URL
        : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000",
  },
};

export default nextConfig;
