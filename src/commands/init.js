const o = require("./functions/txtutils");
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
    o.Line(
      "You've specified your current working directory as your project root. Is this correct?"
    );
    o.Empty();
    o.Line(path.resolve(process.cwd()));
    if (o.Question("^ (Y/n) ", "y").toLowerCase() === "n") {
      // No
      project_directory = path.resolve(
        o.Question("Which directory would you like to use instead? ")
      );
    } else {
      // Yes
      project_directory = path.resolve(process.cwd());
    }
  } else {
    o.Line(
      "Below is the directory you've specified for your project root. Is this correct?"
    );
    o.Empty();
    o.Line(path.resolve(argv["d"]));
    if (o.Question("^ (Y/n) ", "y").toLowerCase() === "n") {
      // No
      project_directory = path.resolve(
        o.Question("Which directory would you like to use instead? ")
      );
    } else {
      // Yes
      project_directory = path.resolve(argv["d"]);
    }
  }

  // Check if the project directory that was passed actually exists
  if (!fs.existsSync(project_directory)) {
    // If it doesnt... create it!!
    o.Line("Project directory does not exist yet--Making directory!");
    try {
      fs.mkdirSync(project_directory);
      o.Line("New project directory made!");
    } catch (err) {
      o.Error(
        "There was an error with the project folder creation, and this tool cannot continue running."
      );
      o.Error(err);
      return 1;
    }

    // Then copy our `.head_start/` folder into it
    try {
      fse.copySync(
        path.resolve(__dirname + "/../"),
        project_directory + "/.head_start/",
        { overwrite: true }
      );
      o.Line("Head-start setup files copied!");
    } catch (err) {
      o.Error(
        "There was an error with the necessary file creation, and this tool cannot continue running."
      );
      o.Error(err);
      return 2;
    }
  }

  dot_directory = path.resolve(project_directory + "/.head_start/");

  fse.copySync(path.resolve(dot_directory + "/base/"), project_directory, {});

  o.Paragraph(["Setting up NPM", "... this may take a second"]);
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
        o.Error(err);
        o.Line(
          "Unknown framework. Leave the line blank of type  none  if you aren't using one."
        );
        return framework_prompt();
      } else {
        // the *entire* stdout and stderr (buffered)
        o.Line(`${stdout}`);
        o.Empty();
        o.Line("NPM Setup");
      }
    }
  );

  o.Paragraph([
    "I have a couple of questions for you before our full setup.",
    "This will help me install the right packages, and setup the necessary file structures and build tools.",
  ]);

  let express_app_prompt = () => {
    return o.Question("Is your project an Electron.js app? (y/N) ", "n");
  };

  let project_express_app;

  switch (express_app_prompt().toLowerCase()) {
    default:
    case "n" | "no" | "nope" | "false":
      project_express_app = false;
      break;
    case "y" | "yes" | "yep" | "true" | "yessir":
      project_express_app = true;
      break;
  }

  let typescript_prompt = () => {
    return o.Question("Is your project using TypeScript? (y/N) ", "n");
  };

  let project_typescript;

  switch (typescript_prompt().toLowerCase()) {
    default:
    case "n" | "no" | "nope" | "false":
      project_typescript = false;
      break;
    case "y" | "yes" | "yep" | "true" | "yessir":
      project_typescript = true;
      break;
  }

  let framework_prompt = () => {
    o.Line("Will you be using any of the following JavaScript frameworks?");
    o.List([
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
    let framework = o.Question("(please specify which one) ", "").toLowerCase();
    if (framework.length > 0 && framework !== "none") {
      o.Line("Adding Framework: " + framework);
      o.Line(path.resolve(__dirname));
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
            o.Error(err);
            o.Line(
              "Unknown framework. Leave the line blank of type  none  if you aren't using one."
            );
            return framework_prompt();
          }
          // the *entire* stdout and stderr (buffered)
          o.Line(stdout);
          o.Line("Added Framework: " + framework);
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

  o.Divider();
  o.Empty();

  if (argv["welcome"] === true) {
    // New User!!

    o.Paragraph([
      "Hello! :D",
      "Welcome to Head-start, a CLI tool that is aimed at making you (the developer), the fastest",
      " you can be during the initial setup of your project. Don't worry though, this tool can",
      " also be used mid-development, if you/your team realize you've missed a dependency.",
    ]);
    o.Line(
      "During this walk through, we are going to guide you through the process of setting up:"
    );
    o.List([
      "Project Folder Structures",
      "Language/Framework Dependencies like Typescript, React, Express, etc.",
      "Build tools, Project Compilers, File Watchers, Linters, Prettier, etc.",
      "NPM scripts",
      "GitHub Actions/Workflows + Build Artifact Deployment (GitHub Pages)",
      "And any addition dependencies you may need",
    ]);
  } else {
    // Returning user!!

    o.Line("Hey! Welcome back :)");
  }

  return response_tree;
}
