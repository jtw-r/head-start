import * as c from "../functions/util/cmd_utils";
import { Project_Structure } from "../classes/Project_Structure";

exports.command = ["init [dir|d] [options]", "initialize [dir|d] [options]", "i [dir|d] [options]"];

exports.describe = "Initialize a repository";

exports.builder = {
  d: {
    alias: ["dir", "directory"],
    default: "",
    describe: "The directory that the CLI will initialize your project in. Point this at your projects root.",
  },
  debug: {
    type: "boolean",
    default: false,
    hidden: true,
  },
  welcome: {
    type: "boolean",
    default: false,
    describe: "Run with this flag to get a guided walk-through if you are new!",
  },
  config: {
    default: "",
  },
};

exports.handler = function (argv) {
  /*
   *
   *  Ask Questions First
   *
   */

  let proj = new Project_Structure();

  proj.guided_setup(argv).then(
    (project_structure) => {
      /*
       *
       *  Then Build A Project Based Upon The Responses
       *
       */
      //build_project(argv, value.project);
    },
    (err) => {
      c.Error(err);
    }
  );
};
