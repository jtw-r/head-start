import * as c from "../functions/util/cmd_utils.js";
import { QuestionTypes } from "../functions/util/cmd_utils.js";

const path = require("path");
const fs = require("fs");
const fse = require("fs-extra");
const { exec, execSync } = require("child_process");

exports.command = [
  "init [dir|d] [options]",
  "initialize [dir|d] [options]",
  "i [dir|d] [options]",
];

exports.describe = "Initialize a repository";

exports.builder = {
  d: {
    alias: ["dir", "directory"],
    default: ".",
    describe:
      "The directory that the CLI will initialize your project in. Point this at your projects root.",
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

  let project = ask_questions(argv).project;

  /*
   *
   *  Then Build A Project Based Upon The Responses
   *
   */

  let project_directory = "";
  let dot_directory = "";
  if (argv["d"] === ".") {
    c.Line(
      "You've specified your current working directory as your project root. Is this correct?"
    );
    c.Empty();
    c.Line(process.cwd().toString());
    if (
      c
        .Question({
          prompt: "^ (Y/n) ",
          prompt_type: QuestionTypes.Select_Boolean,
          default_value: true,
        })
        .getValue() === false
    ) {
      // No
      project_directory = path.resolve(
        c
          .Question({
            prompt: "Which directory would you like to use instead? ",
            prompt_type: QuestionTypes.Input_String,
          })
          .getValue()
      );
    } else {
      // Yes
      project_directory = path.resolve(process.cwd());
    }
  } else {
    c.Line(
      "Below is the directory you've specified for your project root. Is this correct?"
    );
    c.Empty();
    c.Line(path.resolve(argv["d"]));
    if (
      c
        .Question({
          prompt: "^ (Y/n) ",
          prompt_type: QuestionTypes.Select_Boolean,
          default_value: true,
        })
        .getValue() === false
    ) {
      // No
      project_directory = path.resolve(
        c
          .Question({
            prompt: "Which directory would you like to use instead? ",
            prompt_type: QuestionTypes.Input_String,
          })
          .getValue()
      );
    } else {
      // Yes
      project_directory = path.resolve(argv["d"]);
    }
  }

  // Check if the project directory that was passed actually exists
  if (!fs.existsSync(project_directory)) {
    // If it doesnt... create it!!
    c.Line("Project directory does not exist yet--Making directory!");
    try {
      fs.mkdirSync(project_directory);
      c.Line("New project directory made!");
    } catch (err) {
      c.Error(
        "There was an error with the project folder creation, and this tool cannot continue running."
      );
      c.Error(err);
      return 1;
    }

    // Then copy our `.head_start/` folder into it
    try {
      fse.copySync(
        path.resolve(__dirname + "/../"),
        project_directory + "/.head_start/",
        { overwrite: true }
      );
      c.Line("Head-start setup files copied!");
    } catch (err) {
      c.Error(
        "There was an error with the necessary file creation, and this tool cannot continue running."
      );
      c.Error(err);
      return 2;
    }
  }

  dot_directory = path.resolve(project_directory + "/.head_start/");

  fse.copySync(path.resolve(dot_directory + "/base/"), project_directory, {});

  c.Paragraph(["Setting up NPM", "... this may take a second"]);
  execSync(
    "sh " +
      path.resolve(__dirname) +
      "/setup_npm.sh " +
      project_directory +
      " " +
      dot_directory,
    (err, stdout, stderr) => {
      if (err) {
        //some err occurred
        c.Error(err);
        c.Line(
          "Unknown framework. Leave the line blank of type  none  if you aren't using one."
        );
        return framework_prompt();
      } else {
        // the *entire* stdout and stderr (buffered)
        c.Line(`${stdout}`);
        c.Empty();
        c.Line("NPM Setup");
      }
    }
  );

  c.Paragraph([
    "I have a couple of questions for you before our full setup.",
    "This will help me install the right packages, and setup the necessary file structures and build tools.",
  ]);

  let express_app_prompt = () => {
    return c.Question({
      prompt: "Is your project an Electron.js app? (y/N) ",
      prompt_type: QuestionTypes.Select_Boolean,
      default_value: false,
    });
  };

  let project_express_app;

  project_express_app = express_app_prompt().getValue();

  let typescript_prompt = () => {
    return c.Question({
      prompt: "Is your project using TypeScript? (y/N) ",
      prompt_type: QuestionTypes.Select_Boolean,
      default_value: false,
    });
  };

  let project_typescript = typescript_prompt().getValue();

  let framework_prompt = () => {
    c.Line("Will you be using any of the following JavaScript frameworks?");
    c.List([
      "Angular",
      "Backbone.js",
      "Ember.js",
      "EJS",
      "Express.js",
      "Ionic",
      "Knockout",
      "Mithril.js",
      "Meteor.js",
      "Next.js",
      "Polymer",
      "Preact",
      "React.js",
      "Remix",
      "Svelt",
      "Vite.js",
      "Vue.js",
    ]);
    let framework = c
      .Question({
        prompt: "(please specify which one) ",
        prompt_type: QuestionTypes.Input_String,
        default_value: "",
      })
      .getValue()
      .toString();
    if (framework.length > 0 && framework !== "none") {
      c.Line("Adding Framework: " + framework);
      c.Line(path.resolve(__dirname));
      exec(
        "sh " +
          path.resolve(__dirname) +
          "/add_framework.sh " +
          project_directory +
          " " /* Argument #1 */ +
          dot_directory +
          " " /* Argument #2 */ +
          framework +
          " " /* Argument #3 */ +
          project_typescript /* Argument #4 */,
        (err, stdout, stderr) => {
          if (err) {
            //some err occurred
            c.Error(err);
            c.Line(
              "Unknown framework. Leave the line blank of type  none  if you aren't using one."
            );
            return framework_prompt();
          }
          // the *entire* stdout and stderr (buffered)
          c.Line(stdout);
          c.Line("Added Framework: " + framework);
        }
      );
    }
  };

  framework_prompt();
};

function ask_questions(argv) {
  /*
   *
   *  Let's get all of our questions out of the way beforehand, so we only have to install the tools that we actually
   *    need.
   *
   */

  let response_tree = {
    project: {
      name: "",
      directory: "",
      type: "", // static site | dynamic site | library/api
      frameworks: {
        /*
        "framework": {
          version: ""
          options: { }
        }
        */
      },
      config_options: {
        use_snowpack: true,
        use_typescript: false,
      },
      dependencies: {
        /* */
      },
    },
  };

  c.Divider();
  c.Empty();

  if (argv["welcome"] === true) {
    // New User!!

    c.Paragraph([
      "Hello! :D",
      "Welcome to Head-start, a CLI tool that is aimed at making you (the developer), the fastest",
      " you can be during the initial setup of your project. Don't worry though, this tool can",
      " also be used mid-development, if you/your team realize you've missed a dependency.",
    ]);
    c.Line(
      "During this walk through, we are going to guide you through the process of setting up:"
    );
    c.List([
      "Project Folder Structures",
      "Language/Framework Dependencies like Typescript, React, Express, etc.",
      "Build tools, Project Compilers, File Watchers, Linters, Prettier, etc.",
      "NPM scripts",
      "GitHub Actions/Workflows + Build Artifact Deployment (GitHub Pages)",
      "And any addition dependencies you may need",
    ]);
  } else {
    // Returning user!!

    c.Line("Hey! Welcome back :)");
  }

  return response_tree;
}
