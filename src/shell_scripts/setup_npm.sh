project_directory="$1"
dot_directory="$2"

cd "$project_directory" || exit

npm init -y &> /dev/null

# Install all of our default NPM packages
npm i snowpack --save-dev
npm i npm-run-all --save-dev &>/dev/null
npm i prettier --save-dev

echo "Testing!!!!"
echo "If you get an error below this from NPM about not being able to find the set-script command, please update your NPM version to be >=7.x.x"
echo "You can run 'npm install -g npm@latest' to fix this issue"
npm set-script something "echo 'feel free to get rid of this! (left over from setup)'"
echo "Done Testing!!!!"

# create all of our NPM scripts
npm set-script dist-snowpack "snowpack build"
npm set-script compile "npm-run-all *-compile"
npm set-script dist "npm run-script compile"
npm set-script prettier "npx prettier --write src/"