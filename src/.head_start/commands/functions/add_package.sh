#!/bin/bash

function add_package() {
  package_type="$1"
  #root_path=$(dirname `pwd`)/../
  root_path="$2../"
  file_watchers="$3"

  echo "Type : $package_type"
  case $package_type in
    html)
      mkdir "src/html"
      mkdir "dist/css"
      mkdir "dist/html"
      # pre-populate folders
      echo '' > src/html/index.html
      echo '' > dist/css/style.css
      echo '' > dist/html/index.html
      ;;
    scss | sass)
      # We are using scss so we need to install sass!
      npm i node-sass --save-dev &>/dev/null
      mkdir "src/scss"
      mkdir "dist/css"
      # pre-populate folders
      cp -r "$root_path"options/src/scss/ src/scss/
      # Create our scss compile script in our package.json file
      npm set-script scss-compile "node-sass --output-style expanded --source-map true --source-map-contents true --precision 5 src/scss/ -o dist/css/"
      npm run-script scss-compile
      if $file_watchers
      then
        npm set-script watch-scss "nodemon --watch src/scss -e scss --exec 'npm run-script css-compile'"
      fi
      ;;
    ts | typescript)
      npm i typescript --save-dev &>/dev/null
      mkdir "src/ts"
      mkdir "dist/js"
      # pre-populate folders
      echo '' > src/ts/index.ts
      echo '' > dist/js/index.js
      # Create a tsconfig.json file with the proper directories configured
      tsc --showConfig --rootDir src/ts --outDir dist/js --module commonjs > tsconfig.json
      # Create our ts compile script in our package.json file
      npm set-script ts-compile "tsc --build --force"
      npm run-script ts-compile
      if $file_watchers
      then
        npm set-script watch-ts "nodemon --watch src/ts -e ts --exec 'npm run-script ts-compile'"
      fi
      ;;
    js | javascript | node)
      mkdir "dist/js"
      ;;
    jslint)
      ;;
    electron)
      npm i electron --save-dev &>/dev/null
      ;;
    express | expressjs)
      npm i express --save-dev &>/dev/null
      ;;
    jsx | react | reactjs)
      ;;
    vue | vuejs)
      npm i vue --save-dev &>/dev/null
      ;;
    *)
      echo -n "unknown"
      ;;
  esac
}
