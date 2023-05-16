const path = require("path");
const withPWAInit = require("next-pwa");

const isDev = process.env.NODE_ENV !== "production";

/** @type {import('next').NextConfig} */
const withPWA = withPWAInit({
  dest: "public",
  // Solution: https://github.com/shadowwalker/next-pwa/issues/424#issuecomment-1399683017
  buildExcludes: [
    ({ asset }) => {
      if (
        asset.name.startsWith("server/") ||
        asset.name.match(
          /^((app-|^)build-manifest\.json|react-loadable-manifest\.json)$/
        )
      ) {
        return true;
      }
      if (isDev && !asset.name.startsWith("static/runtime/")) {
        return true;
      }
      return false;
    },
  ],
});

const generateEntry = (entry) => {
  const registerJs = path.join(__dirname, "node_modules/next-pwa/register.js");

  return entry().then((entries) => {
    // Register on page directory
    if (entries["main.js"] && !entries["main.js"].includes(registerJs)) {
      entries["main.js"].unshift(registerJs);
    }
    // Register on app directory, solution: https://github.com/shadowwalker/next-pwa/pull/427
    if (entries["main-app"] && !entries["main-app"].includes(registerJs)) {
      if (Array.isArray(entries["main-app"])) {
        entries["main-app"].unshift(registerJs);
      } else if (typeof entries["main-app"] === "string") {
        entries["main-app"] = [registerJs, entries["main-app"]];
      }
    }
    return entries;
  });
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    const entry = generateEntry(config.entry);
    config.entry = () => entry;

    return config;
  },
};

module.exports = withPWA(nextConfig);
