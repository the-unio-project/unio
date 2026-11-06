const BACKEND_URL =
  process.env.BACKEND_URL ?? "https://unio-production-4e4a.up.railway.app";

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['26.70.44.6'],
  skipTrailingSlashRedirect: true,
};

export default nextConfig;