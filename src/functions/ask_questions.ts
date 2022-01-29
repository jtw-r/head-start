import * as c from "./util/cmd_utils";
import { Colour, FG_COLOURS, QuestionTypes } from "./util/cmd_utils";
import * as path from "path";

interface Dependency {
  name: string;
  version: string;
  type: "framework" | "other";
  options: { [key: string]: string | number | boolean };
}

export class Project_Structure {
  name: string;
  root_directory: string;
  dot_directory: string;
  type: string;
  config_options: { [key: string]: string | number | boolean } = {};
  dependencies: Dependency[] = [];

  public update_directories(_new_path: string): void {
    this.root_directory = path.resolve(_new_path);
    this.dot_directory = this.root_directory + "/.head_start";
  }

  public async guided_setup(argv) {
    /*
     *
     *  Let's get all of our questions out of the way beforehand, so we only have to install the tools that we actually
     *    need.
     *
     */

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

    async function choose_directory(_class_values: Project_Structure = this) {
      // Still getting used to promises!!!
      // Sorry if this isn't pretty
      await c
        .Question({
          prompt: "Choose directory (default is cwd)",
          default_value: "./",
          prompt_type: QuestionTypes.Input_String,
        })
        .then((value) => {
          if (typeof value.getValue() === "string") {
            _class_values.update_directories(<string>value.getValue());
          } else {
            c.Error("Value passed is not string");
          }
        })
        .finally(() => {});
    }

    if (argv["d"] === "" || argv["d"] === undefined) {
      // This means that the project flag "-d" has NOT been set, so we need to ask the user which directory they would
      // like to set their project root in.
      c.Line("No project directory has been set yet. Where would you like to begin?");
      await choose_directory();
    } else {
      c.Line("Below is the directory you've specified for your project root. Is this correct?");
      c.Empty();
      c.Line(path.resolve(argv["d"]).toString());

      await c
        .Question({
          prompt: "",
          prompt_type: QuestionTypes.Input_Boolean,
          default_value: true,
        })
        .then(
          (answer) => {
            if (answer.getValue() === false) {
              // No
              choose_directory();
            } else {
              // Yes
              this.root_directory = path.resolve(argv["d"]);
            }
          },
          (err) => {
            c.Error("Error occurred while sorting out project directory");
          }
        );
    }

    c.Line(Colour(`Project root has been set to: ${this.root_directory}`, FG_COLOURS.FgGreen));

    /*
    Electron.js
     */
    await c
      .Question({
        prompt: "Is your project an Electron.js app? (y/N) ",
        prompt_type: QuestionTypes.Input_Boolean,
        default_value: false,
      })
      .then((answer) => {
        if (answer.getValue() === true) {
          this.dependencies.push({ name: "electron", options: {}, type: "framework", version: "latest" });
        }
      });

    /*
    Typescript
     */
    await c.Question({
      prompt: "Is your project using TypeScript? (y/N) ",
      prompt_type: QuestionTypes.Input_Boolean,
      default_value: false,
    });

    /*
    Javascript Frameworks
     */
    c.Line("Will you be using any of the following JavaScript frameworks?");
    await c
      .Question({
        prompt: "Will you be using any of the following JavaScript frameworks?",
        prompt_type: QuestionTypes.Select_Single,
        prompt_options: [
          { title: "-None-", value: "" },
          { title: "Angular", value: "angular" },
          { title: "Backbone.js", value: "backbone" },
          { title: "Ember.js", value: "ember" },
          { title: "EJS", value: "ejs" },
          { title: "Express.js", value: "express" },
          { title: "Ionic", value: "ionic" },
          { title: "Knockout", value: "knockout" },
          { title: "Mithril.js", value: "mithril" },
          { title: "Next.js", value: "next" },
          { title: "Polymer", value: "preact" },
          { title: "React.js", value: "react" },
          { title: "Remix", value: "remix" },
          { title: "Svelt", value: "svelt" },
          { title: "Vite.js", value: "vite" },
          { title: "Vue.js", value: "vue" },
        ],
        default_value: 0,
      })
      .then((answer) => {
        let framework = answer.getValue().toString() ?? "none";
        if (framework.length > 0 && framework !== "none") {
          c.Line("Adding Framework: " + framework);
        }
      });
  }
}
