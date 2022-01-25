// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration
// noinspection JSValidateJSDoc

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    src: "/",
  },
  plugins: [
    /* ... */
  ],
  packageOptions: {
    /* ... */
  },
  devOptions: {
    out: "test",
  },
  buildOptions: {
    out: "dist",
  },
  exclude: ["**/node_modules/**/*"],
};
