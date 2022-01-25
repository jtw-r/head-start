# head-start

## About

#### One once per project, so you can get a head-start on your coding

The aim of this CLI is to make it as easy as possible to get these features setup at the beginning of your project

- Folder structures
- Language/Framework Dependencies (Typescript, React, Express, etc.)
- Build tools, Project Compilers, File Watchers, Linters, Prettier, etc.
- NPM scripts
- GitHub Actions/Workflows + Build Artifact Deployment (GitHub Pages)

### There is one remaining question... what if I realize midway through development, that I need to add another big dependency to my project? I will require me to set up a lot of build scripts as well.

After you initially run our CLI program, the tool will copy a reusable version of itself to the `.head_start/` directory in your project's root.
You can then run the tool again like you normally would, and it will steer clear of any dependencies/additions that it has already made.

If you ever want to completely uninstall the tool, or remove all traces of it in a production zip, you can delete the `.head_start/` directory in your project's root.

## Install/First Run

You've most likely gotten this from a template.

```shell
# Open up your terminal and navigate to your project root (where the .js scripts are located).
# Run the cli script

# If you are using Node
$ node cli.ts init --welcome
```

You can also run a script with the parameters set already
