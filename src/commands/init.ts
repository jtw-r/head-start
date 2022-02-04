import * as c from "../util/cmd_utils";
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
  // This will create an empty project structure for us to work with.
  let proj: Project_Structure = new Project_Structure();

  // We'll call the "guided setup" function, to get our project initialized interactively through the command line.
  // I feel like we don't necessarily need to have the guided setup process nested inside the project structure class.
  proj.guided_setup(argv).then(
    (project_structure) => {
      /*
       *
       *  Then Build A Project Based Upon The Responses
       *
       */
      //build_project(argv, value.project);
      /* ^^^^ This is commented out because we haven't fully reworked the "Ask Questions First" stage.
       *        Thus, we do not want to call the next function in line, if the first one is outputting faulty data.
       */
    },
    (err) => {
      c.Error(err);
    }
  );
};
