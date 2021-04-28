// Workaround for `fs` resolution error on front end documented here:
// https://github.com/vercel/next.js/issues/7755
module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
  // TODO: remove after nextjs webpack 5 adoption
  future: {
    webpack5: true,
  },
};
