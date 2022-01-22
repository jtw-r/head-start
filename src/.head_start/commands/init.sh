#!/bin/bash

SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

source "$SCRIPT_DIR/"functions/add_package.sh
source "$SCRIPT_DIR/"functions/get_user_input.sh

# Parse arguments passed to the script
#
# ARGUMENTS:
#   $1: string  - directory to setup project in (relative to the directory the script is being called in)
#   $2: flag (b) - bypass mode
#

# Get versions
node -v
npm -v

# Check if a custom directory is passed through the script's argument $1
if [ -n "$1" ]
then
  echo "~making directory"
  mkdir "$1"
  cd "$1"
else
  echo "~no directory passed"
fi

npm init -y &> /dev/null

# Install all of our default NPM packages
npm i snowpack --save-dev
npm i npm-run-all --save-dev &>/dev/null

# Copy all of our base files into our current directory
cp -a "$SCRIPT_DIR/../"base/. .

# Copy options over to our current directory
cp "$SCRIPT_DIR/../"options/.github/workflows/deploy-to-ghpages.yml .github/workflows/deploy-to-ghpages.yml

# Do a quick test to see if we get an error when making an NPM script
echo "Testing!!!!"
echo "If you get an error below this from NPM about not being able to find the set-script command, please update your NPM version to be >=7.x.x"
echo "You can run 'npm install -g npm@latest' to fix this issue"
npm set-script something "something"
npm set-script something ""
echo "Done Testing!!!!"

# create all of our NPM scripts
npm set-script dist-snowpack "snowpack build"
npm set-script compile "npm-run-all *-compile"
npm set-script dist "npm run-script compile"

echo "$2"
bypass=false
if [ -n "$2" ]
then
  case "$2" in
    -b | --bypass)
      echo "~bypass activated"
      bypass=true
      ;;
    *)
      echo "Unknown option passed: $2"
      ;;
  esac
fi

if ! $bypass
then
  first_time=$(get_user_input "Is it your first time using Head-start? (Y/n)")

  case "$first_time" in
      "y" | "yes" | "sure is" | "yep" | "yessir")
        # Looks like it's the user's first time!! So let's show them around :D
        echo "Oooooh!! Well goodness, welcome to Head-start! We're happy that you're hear and using our tool 8)"
        echo "The aim of this CLI is to make it dead-easy to get all of the necessary folder structures, dependencies,"
        echo "build tools/compilers/file watchers, NPM scripts, etc. setup. so that you can get a head-start on your coding!!"
      ;;
      *)
        # A returning user 🤩🤩🤩
        echo "Welcome back old friend! How've you been?"
        ;;
    esac
fi

# Let's ask the user a few questions right off the bat, so we an get a good understanding of what type of repo they are
# trying to get setup!
#
# Questions:
#   1.1: Is this being deployed to a Github-Pages service? : bool
#   1.2: What should the deployment branch's name be? : string
#   2: What type of files will you be using? : string[a]


deploy_branch_name=""

if $bypass
then
  deploy_branch_name="gh_pages"
else
  gh_pages=$(get_user_input "Are you deploying to Github-Pages?")
  echo "$gh_pages"

  case "$gh_pages" in
    "true" | "yes")
      deploy_branch_name="gh_pages"
    ;;
    *)
      # Everything else
      deploy_branch_name=$(get_user_input "What should the deployment branch be named?")
      ;;
  esac
fi

git branch "$deploy_branch_name"

if $bypass
then
  types_raw="ts;scss"
  file_watchers=true
else
  echo "What types of files will you be using? (Please separate types with ; )"
  read types_raw

  file_watchers=$(get_user_input "Would you like file watchers?")
  case "$file_watchers" in
    true | yes)
      file_watchers=true
      ;;
    *)
      file_watchers=false
      ;;
  esac
fi

if $file_watchers
then
  npm i nodemon --save-dev &>/dev/null
fi


IFS=';'
read -a TYPES_ARR <<< "$types_raw"


for i in "${TYPES_ARR[@]}"; do   # access each element of array
    add_package "$i" "$SCRIPT_DIR/" "$file_watchers"
done



exit 0