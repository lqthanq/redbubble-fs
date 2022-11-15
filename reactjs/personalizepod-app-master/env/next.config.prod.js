const withSass = require("@zeit/next-sass");
const withLess = require("@zeit/next-less");
const withCSS = require("@zeit/next-css");

const isProd = process.env.NODE_ENV === "production";

// fix: prevents error when .less files are required by node
if (typeof require !== "undefined") {
  require.extensions[".less"] = (file) => {};
}

module.exports = withCSS({
  env: {
    GRAPHQL_SERVER: "https://api.personalizepod.com/query",
    GRAPHQL_WS_SERVER: "wss://api.personalizepod.com/query",
    COOKIE_JWT_TOKEN: "__token",
    CDN_URL: "https://cdn.personalizepod.com/",
    ELEMENT_URL: "https://elements.personalizepod.com/",
    APP_URL: "https://seller.personalizepod.com",
  },
  cssModules: true,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: "[local]___[hash:base64:5]",
  },
  ...withLess(
    withSass({
      lessLoaderOptions: {
        javascriptEnabled: true,
      },
    })
  ),
});
