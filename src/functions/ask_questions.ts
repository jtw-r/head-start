import * as c from "./util/cmd_utils";
import { Colour, FG_COLOURS, QuestionTypes } from "./util/cmd_utils";
import * as path from "path";
import * as util from "util";

interface Dependency {
  name: string;
  version: string;
  type: "framework" | "other";
  options: { [key: string]: string | number | boolean };
}

export class Project_Structure {
  name: string;
  directory: string;
  type: string;
  config_options: { [key: string]: string | number | boolean };
  dependencies: Dependency[];

  public async guided_setup(argv) {
    /*
     *
     *  Let's get all of our questions out of the way beforehand, so we only have to install the tools that we actually
     *    need.
     *
     */

    let proj = new Project_Structure();

    console.log(util.inspect(proj));

    c.Divider();
    c.Empty();

    if (argv["welcome"] === true) {
      // New User!!

      c.Line("Hello :D");
      c.Empty();
      c.Paragraph([
        "Welcome to Head-start, a CLI tool that is aimed at making you (the developer), the fastest",
        " you can be during the initial setup of your project. Don't worry though, this tool can",
        " also be used mid-development, if you/your team realize you've missed a dependency.",
      ]);
      c.Line("During this walk through, we are going to guide you through the process of setting up:");
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

    c.Empty();
    c.Line(Colour("Let's get started on your new project!", FG_COLOURS.FgGreen));
    c.Empty();

    let project_directory = "";
    let dot_directory = "";

    async function choose_directory() {
      // Still getting used to promises!!!
      // Sorry if this isn't pretty
      return await c
        .Question({
          prompt: "Choose directory (default is cwd)",
          default_value: "./",
          prompt_type: QuestionTypes.Input_String,
        })
        .then(
          (value) => {
            if (typeof value.getValue() === "string") {
              project_directory = path.resolve(value.getValue().toString());
            } else {
              c.Error("Value passed is not string");
            }
          },
          (err) => {
            c.Line("Error occurred while sorting out project directory");
            c.Error(err);
          }
        );
    }

    if (argv["d"] === "" || argv["d"] === undefined) {
      // This means that the project flag "-d" has NOT been set, so we need to ask the user which directory they would
      // like to set their project root in.
      c.Line("Which no project directory has been set yet. Where would you like to begin?");
      await choose_directory().catch((err) => {
        c.Line("Error occurred while sorting out project directory:");
        if (err.code === "ERR_INVALID_ARG_TYPE") {
          c.Error("Empty passed to path. Aborting!");
        } else {
          c.Error(err);
        }
      });
    } else {
      c.Line("Below is the directory you've specified for your project root. Is this correct?");
      c.Empty();
      c.Line(path.resolve(argv["d"]).toString());

      await c
        .Question({
          prompt: "",
          prompt_type: QuestionTypes.Select_Boolean,
          default_value: true,
        })
        .then(
          (answer) => {
            if (answer.getValue() === false) {
              // No
              return choose_directory();
            } else {
              // Yes
              project_directory = path.resolve(argv["d"]);
            }
          },
          (err) => {
            c.Error("Error occurred while sorting out project directory");
          }
        );
    }

    c.Line(Colour(`Project root has been set to: ${project_directory}`, FG_COLOURS.FgGreen));

    /*
    Electron.js
     */
    await c
      .Question({
        prompt: "Is your project an Electron.js app? (y/N) ",
        prompt_type: QuestionTypes.Select_Boolean,
        default_value: false,
      })
      .then((answer) => {
        if (answer.getValue() === true) {
          proj.frameworks = {
            express: {
              version: "latest",
              options: {},
            },
          };
        }
        proj.frameworks.push({});
      });

    /*
    Typescript
     */
    await c.Question({
      prompt: "Is your project using TypeScript? (y/N) ",
      prompt_type: QuestionTypes.Select_Boolean,
      default_value: false,
    });

    /*
    Javascript Frameworks
     */
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
      }
    };

    framework_prompt();

    //return proj;
  }
}
