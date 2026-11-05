/** @type {import("next").NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.(wav|mp3|ogg)$/i,
      type: "asset/resource",
    });

    return config;
  },
};

module.exports = nextConfig;
