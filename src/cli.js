#!/usr/bin/env node

let o = require("./functions/util/cmd_utils");
require("yargs/yargs")(process.argv.slice(2))
  .command(
    "*",
    false,
    () => {},
    (argv) => {
      o.Empty();
      o.Divider();
      o.Error(
        "Unknown command passed. Please run this script with --help appended if you are new."
      );
      o.Divider();
    }
  )
  .hide("*")
  /*.commandDir("./commands", { extensions: ["js"] })*/
  .command(require("./commands/init"))
  .command(require("./commands/uninstall"))
  .command(require("./commands/update_cli"))
  .command(require("./commands/update_project"))
  .help()
  .wrap(90).argv;
