// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration
// noinspection JSValidateJSDoc

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    /* ... */
  },
  plugins: [
    /* ... */
  ],
  packageOptions: {
    /* ... */
  },
  devOptions: {
    out: "build"
  },
  buildOptions: {
    out: "build"
  },
  exclude: [
    '**/node_modules/**/*'
  ],
};
