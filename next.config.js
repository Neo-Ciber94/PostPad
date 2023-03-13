/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    esmExternals: "loose",
  },
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
};

// This is required for: https://www.npmjs.com/package/@uiw/react-md-editor
const removeImports = require("next-remove-imports")();
module.exports = removeImports(nextConfig);
