import * as path from "path";
import * as c from "../util/cmd_utils";
import { Colour } from "../util/cmd_utils";
import { Dependency } from "../interfaces/Dependency";
import { Project_Types } from "../enums/Project_Types";
import { Dependency_Types } from "../enums/Dependency_Types";
import { FG_COLOURS } from "../util/enums/STDOUT";
import { Question_Types } from "../util/enums/Question_Types";

export class Project_Structure {
  protected name: string;
  protected root_directory: string;
  protected dot_directory: string;
  protected type: Project_Types;
  protected config_options = {
    uses_typescript: false,
    uses_prettier: true,
    uses_eslint: true,
  };
  protected dependencies: Dependency[] = [];

  public get Type(): Project_Types {
    return this.type;
  }

  public get Name(): string {
    return this.name;
  }

  public get Dot_directory(): string {
    return this.dot_directory;
  }

  public get Root_directory(): string {
    return this.root_directory;
  }

  public get_dependencies(_type?: Dependency_Types) {
    if (_type) {
    } else {
      return this.dependencies;
    }
  }

  public check_dependency(_dependency) {}

  public update_directories(_new_path: string): void {
    this.root_directory = path.resolve(_new_path);
    this.dot_directory = this.root_directory + "/.head_start";
  }

  public config_set(_option: string, _value: any) {
    this.config_options[_option] = _value;
  }

  public config_get(_option: string) {
    return this.config_options[_option];
  }

  public add_dependency(_dependency: Dependency) {
    // We can do validation here too, if needed!
    this.dependencies.push(_dependency);
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
          prompt_type: Question_Types.Input_String,
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

    c.Empty;
    c.Line("Question 1:");

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
          prompt_type: Question_Types.Input_Boolean,
          default_value: true,
        })
        .then(
          (answer) => {
            if (answer.getValue() === false) {
              // No
              c.Empty;
              c.Line("Question 1.1:");
              choose_directory();
            } else {
              // Yes
              this.update_directories(path.resolve(argv["d"]));
            }
          },
          (err) => {
            c.Error("Error occurred while sorting out project directory");
          }
        );
    }

    c.Line(Colour(`Project root has been set to: ${this.root_directory}`, FG_COLOURS.FgGreen));

    /*
    Project Type: Static Website, Dynamic Website, Library, Desktop App, Mobile App, Other
     */
    c.Empty;
    c.Line("Question 2:");
    await c
      .Question({
        prompt: "What type of Node project will you be creating?",
        prompt_type: Question_Types.Select_Single,
        prompt_options: [
          { title: "Static Website", value: Project_Types.Static_Website },
          { title: "Dynamic Website", value: Project_Types.Dynamic_Website },
          { title: "Library", value: Project_Types.Library },
          { title: "Desktop App", value: Project_Types.Desktop_App },
          { title: "Mobile App", value: Project_Types.Mobile_App, disabled: true },
          { title: "Other", value: Project_Types.Other },
        ],
        default_value: 0,
      })
      .then((answer) => {
        this.type = <Project_Types>answer.getValue();
        c.Line("Setting project type to: " + this.type);
      });

    /*
    Handle project types!
    This is where you ask the user specific questions pertaining to which project type they are setting up
     */

    switch (this.type) {
      case Project_Types.Static_Website:
        /*
        Static Website
        */
        break;
      case Project_Types.Dynamic_Website:
        /*
        Dynamic Website
        */
        break;
      case Project_Types.Library:
        /*
        Library
        */
        break;
      case Project_Types.Desktop_App:
        /*
        Desktop App
        */

        /*
        Electron.js
        */
        c.Empty;
        c.Line("Question 2.1:");
        await c
          .Question({
            prompt: "Is your project an Electron.js app? (y/N) ",
            prompt_type: Question_Types.Input_Boolean,
            default_value: false,
          })
          .then((answer) => {
            if (answer.getValue() === true) {
              this.dependencies.push({
                name: "electron",
                options: {},
                type: Dependency_Types.Framework,
                version: "latest",
              });
            }
          });
        break;
      case Project_Types.Mobile_App:
        /*
        Mobile App
        */
        c.Empty;
        c.Line("Question 2.1:");
        await c
          .Question({
            prompt: "Which Mobile Development Framework will you be using?",
            prompt_type: Question_Types.Select_Single,
            prompt_options: [
              { title: "React Native", value: "react-native" },
              { title: "Flutter", value: "flutter" },
            ],
            default_value: 0,
          })
          .then((answer) => {
            this.type = <Project_Types>answer.getValue();
            c.Line("Setting project type to: " + this.type);
          });
        break;
      default:
      case Project_Types.Other:
        /*
        Other
        */
        break;
    }

    /*
    Typescript
     */
    c.Empty;
    c.Line("Question 3:");
    await c.Question({
      prompt: "Is your project using TypeScript? (y/N) ",
      prompt_type: Question_Types.Input_Boolean,
      default_value: false,
    });

    /*
    JavaScript Frameworks
    TODO: Split this into three sections
     1. All in one frameworks: Remix, Next.js
     2. Front end "javascript libraries/frameworks": react,
     3. Back end frameworks: Express
     */
    c.Line("Will you be using any of the following JavaScript frameworks?");
    await c
      .Question({
        prompt: "Will you be using any of the following JavaScript frameworks?",
        prompt_type: Question_Types.Select_Single,
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
          this.add_dependency({ name: framework, options: {}, type: Dependency_Types.Framework, version: "latest" });
        }
      });
    c.Object(this, "project");
  }
}
