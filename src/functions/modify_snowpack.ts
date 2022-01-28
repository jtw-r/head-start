#!usr/bin/env node

const c = require("./util/cmd_utils.js");
const spc = require("../../resources/.head_start/base/snowpack.config");
const fs = require("fs");
const util = require("util");
const yargs = require("yargs");
require("yargs/yargs")(process.argv.slice(2))
  .command(
    "add <plugin> <config>",
    "Adds a new plugin to the snowpack.config.js file",
    (yargs) => {
      yargs
        .positional("plugin", {
          type: "string",
        })
        .positional("config_path", {
          type: "string",
        });
    },
    (args) => {
      console.log("Snowpack plugins:");
      console.log(spc.plugins);

      // Make any changes you want here!
      spc.plugins.push(args["plugin"]);

      // Re-write the config
      rewrite_snowpack_config(spc, args["config_path"]);
    }
  )
  .demandCommand()
  .help()
  .wrap(90).argv;

function rewrite_snowpack_config(_modified_config_obj, _write_path, _options = "utf-8") {
  let temp_config_obj = {
    mount: _modified_config_obj.mount,
    plugins: _modified_config_obj.plugins,
    packageOptions: _modified_config_obj.packageOptions,
    devOptions: _modified_config_obj.devOptions,
    buildOptions: _modified_config_obj.buildOptions,
    exclude: _modified_config_obj.exclude,
  };

  let output =
    "// Snowpack Configuration File\n" +
    "// Automatically Generated by Head-start\n" +
    "\n" +
    '/** @type {import("snowpack").SnowpackUserConfig } */\n' +
    "module.exports = " +
    util.inspect(temp_config_obj);

  try {
    fs.writeFileSync(_write_path, output, "utf-8");
    return 0;
  } catch (err) {
    c.Error("An error occurred when updating the snowpack.config.js");
    c.Error(err);
    return 1;
  }
}
