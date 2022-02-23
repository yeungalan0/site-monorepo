// Workaround for `fs` resolution error on front end documented here:
// https://github.com/vercel/next.js/issues/7755
module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }
    return config;
  },
};
