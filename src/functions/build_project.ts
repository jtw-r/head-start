import * as c from "../util/cmd_utils";
import * as path from "path";
import * as fse from "fs-extra";
import * as fs from "fs";
import { Project_Structure } from "../classes/Project_Structure";

export function build_project(argv, project: Project_Structure) {
  // Check if the project directory that was passed actually exists
  if (!fs.existsSync(project.Root_directory)) {
    // If it doesnt... create it!!
    c.Line("Project directory does not exist yet--Making directory!");
    try {
      fs.mkdirSync(project.Root_directory);
      c.Line("New project directory made!");
    } catch (err) {
      c.Error("There was an error with the project folder creation, and this tool cannot continue running.");
      c.Abort(err, 2);
    }

    // Then copy our `.head_start/` folder into it
    try {
      fse.copySync(path.resolve(__dirname + "/../"), project.Root_directory + "/.head_start/", { overwrite: true });
      c.Line("Head-start setup files copied!");
    } catch (err) {
      c.Error("There was an error with the necessary file creation, and this tool cannot continue running.");
      c.Abort(err, 3);
    }
  }

  fse.copySync(path.resolve(project.Dot_directory + "/base/"), project.Root_directory, {});

  c.Paragraph(["Setting up NPM", "... this may take a second"]);
  c.Run(
    "sh " + path.resolve(__dirname) + "/setup_npm.sh " + project.Root_directory + " " + project.Dot_directory,
    (err, stdout, stderr) => {
      if (err) {
        //some err occurred
        c.Line("Unknown framework. Leave the line blank of type  none  if you aren't using one.");
        c.Error(err);
      }

      // the *entire* stdout and stderr (buffered)
      c.Line(`${stdout}`);
      c.Empty();
      c.Line("NPM Setup");
    }
  );
}
