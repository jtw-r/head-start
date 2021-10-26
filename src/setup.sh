#!/bin/bash

# Parse arguments passed to the script
#
# ARGUMENTS:
#   $1: string  - directory to setup project in (relative to the directory the script is being called in)
#   $2: flag (b) - bypass mode
#
if [ -n "$1" ]
then
  echo "~making directory"
  mkdir "$1"
  cd "$1"
  npm init -y
else
  echo "~no directory passed"
fi

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

# Get versions
node -v
npm -v

# Let's ask the user a few questions right off the bat, so we an get a good understanding of what type of repo they are
# trying to get setup!
#
# Questions:
#   1.1: Is this being deployed to a Github-Pages service? : bool
#   1.2: What should the deployment branch's name be? : string
#   2: What type of files will you be using? : string[a]

function get_user_input()
{
  local __user_input
  read -r -p "$1 " __user_input
  __user_input="$(echo "$__user_input" | tr '[:upper:]' '[:lower:]')"
  echo "$__user_input"
}

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
echo "Branches:"
git branch --list

# Install a few dev dependencies
npm i npm-run-all --save-dev

if $bypass
then
  types_raw="ts"
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


IFS=';'
read -a TYPES_ARR <<< "$types_raw"

mkdir "src"
mkdir "build"

for i in "${TYPES_ARR[@]}"; do   # access each element of array
    echo "Type : $i"
    case $i in
      scss | sass)
        # We are using scss so we need to install sass!
        npm i node-sass --save-dev
        mkdir "src/scss"
        mkdir "build/css"
        # pre-populate folders
        echo '' > src/scss/style.scss
        echo '' > build/css/style.css
        npm set-script scss-compile "node-sass --output-style expanded --source-map true --source-map-contents true --precision 5 src/scss/ -o build/css/"
        if $file_watchers
        then
          npm i nodemon --save-dev
          npm set-script watch-scss "nodemon --watch src/scss -e scss --exec 'npm run-script css-compile'"
        fi
        ;;
      ts | typescript)
        npm i typescript --save-dev
        mkdir "src/ts"
        mkdir "build/js"
        # pre-populate folders
        echo '' > src/ts/index.ts
        echo '' > build/js/index.js
        # Create a tsconfig.json file with the proper directories configured
        tsc --showConfig --rootDir src/ts --outDir build/js --module commonjs > tsconfig.json
        echo "Testing!!!!"
        npm set-script something "something"
        echo "Done Testing!!!!"
        npm set-script ts-compile "tsc --build --force"
        npm run-script ts-compile
        if $file_watchers
        then
          npm i nodemon --save-dev
          npm set-script watch-ts "nodemon --watch src/ts -e ts --exec 'npm run-script ts-compile'"
        fi
        ;;
      js | javascript | node)
        mkdir "build/js"
        ;;
      *)
        echo -n "unknown"
        ;;
    esac
done

# Deploy time!!
echo "-:-"
echo "-:-"
ls
echo "-:-"
mkdir -p .github/workflows
cp ./src/setup_assets/deploy-to-branch.yml .github/workflows/deploy-to-branch.yml

npm set-script deployment-branch "echo $deploy_branch_name"
npm set-script compile "npm-run-all *-compile"
npm set-script build "npm run-script compile"

echo "-:-"
cd /../
ls

exit 0