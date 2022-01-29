#!/usr/bin/env node

/*
 *
 * Head-start
 *
 */

import * as c from "./functions/util/cmd_utils";

// TODO: Load `yargs` from a CDN or smthn, or... find a way to package it in via the compiler.
require("yargs/yargs")(process.argv.slice(2))
  // +--- This is the default command (i.e. any input that hasn't mappend to one of the other commands).
  // v      We'll handel this as an `unknown input`.
  .command(
    "*",
    false,
    () => {},
    (argv) => {
      c.Empty();
      c.Divider();
      c.Error("Unknown command passed. Please run this script with --help appended if you are new.");
      c.Divider();
    }
  )
  // We also want to hide our default command in the help list, since it doesn't do anything useful.
  .hide("*")

  /*.commandDir("./commands", { extensions: ["ts"] })*/ /* Needed because of our compiler :\ */
  .command(require("./commands/init"))
  .command(require("./commands/uninstall"))
  .command(require("./commands/update_cli"))
  .command(require("./commands/update_project"))
  .help()
  .wrap(90).argv;
