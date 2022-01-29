import * as c from "./util/cmd_utils";
import * as path from "path";
import * as fse from "fs-extra";
import * as fs from "fs";

export function build_project(argv, project) {
  let project_directory = project.directory;
  let dot_directory = project.directory + "/.head_start";

  // Check if the project directory that was passed actually exists
  if (!fs.existsSync(project_directory)) {
    // If it doesnt... create it!!
    c.Line("Project directory does not exist yet--Making directory!");
    try {
      fs.mkdirSync(project_directory);
      c.Line("New project directory made!");
    } catch (err) {
      c.Error("There was an error with the project folder creation, and this tool cannot continue running.");
      c.Abort(err, 2);
    }

    // Then copy our `.head_start/` folder into it
    try {
      fse.copySync(path.resolve(__dirname + "/../"), project_directory + "/.head_start/", { overwrite: true });
      c.Line("Head-start setup files copied!");
    } catch (err) {
      c.Error("There was an error with the necessary file creation, and this tool cannot continue running.");
      c.Abort(err, 3);
    }
  }

  dot_directory = path.resolve(project_directory + "/.head_start/");

  fse.copySync(path.resolve(dot_directory + "/base/"), project_directory, {});

  c.Paragraph(["Setting up NPM", "... this may take a second"]);
  c.Run(
    "sh " + path.resolve(__dirname) + "/setup_npm.sh " + project_directory + " " + dot_directory,
    (err, stdout, stderr) => {
      if (err) {
        //some err occurred
        c.Error(err);
        c.Line("Unknown framework. Leave the line blank of type  none  if you aren't using one.");
      } else {
        // the *entire* stdout and stderr (buffered)
        c.Line(`${stdout}`);
        c.Empty();
        c.Line("NPM Setup");
      }
    }
  );
}
