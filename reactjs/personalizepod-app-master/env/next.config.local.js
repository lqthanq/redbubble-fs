const withLess = require("@zeit/next-less");
const withSass = require("@zeit/next-sass");
const withCSS = require("@zeit/next-css");
const isProd = process.env.NODE_ENV === "production";

// fix: prevents error when .less files are required by node
if (typeof require !== "undefined") {
  require.extensions[".less"] = (file) => {};
}

module.exports = withCSS({
  env: {
    GRAPHQL_SERVER: "http://localhost:8889/api/query",
    GRAPHQL_WS_SERVER: "ws://localhost:8889/api/query",
    COOKIE_JWT_TOKEN: "__token",
    CDN_URL: "https://v8inhglqwk.execute-api.ap-southeast-1.amazonaws.com/",
    ELEMENT_URL: "https://elements.personalizepod.com/",
    APP_URL: "http://localhost:3000",
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
