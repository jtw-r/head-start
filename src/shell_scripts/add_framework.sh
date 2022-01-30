#!/bin/bash

project_directory="$1"
dot_directory="$2"
framework="$3"
typescript="$4"

cd "$project_directory" || exit

echo "$framework"
case "$framework" in
  react | react.js)
    npm i react react-dom
    npm i @snowpack/plugin-sass
    echo "Testing node script"
    node "$dot_directory/commands/modifysnowpack.js add plugin"
    npm set-script compile-react "snowpack build"
    npm set-script watch-react "nodemon --watch src -e jsx --exec 'npm compile-react'"
    cp -r "$dot_directory/options/src/react/" "$project_directory/src/"
    mkdir "public"
    cp -r "$dot_directory/options/public/react/" "$project_directory/public/"
    ;;
  *)
    exit 1
    ;;
esac