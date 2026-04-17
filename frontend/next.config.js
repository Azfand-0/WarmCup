/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",   // generates frontend/out/ for static hosting
  trailingSlash: true,
};

module.exports = nextConfig;
