/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    esmExternals: "loose",
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/notes",
        permanent: true,
      },
    ];
  },
};

const removeImports = require("next-remove-imports")();
module.exports = removeImports(nextConfig);
