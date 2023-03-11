/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    esmExternals: "loose",
  },
};

const removeImports = require("next-remove-imports")();
module.exports = removeImports(nextConfig);
