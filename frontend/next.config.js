/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: "export",   // generates frontend/out/ for static hosting
  trailingSlash: true,
};

module.exports = nextConfig;
