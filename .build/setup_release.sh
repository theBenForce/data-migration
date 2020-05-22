#!/bin/bash
set -e
# Note: do not do set -x or the passwords will leak!


# git checkout -b master origin/master

# rm -rf .git
# git init
# git clean -dfx

git config user.email "lerna@lerna.js.org"
git config user.name "Lerna"
# git remote add origin https://${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git
# git fetch
# git checkout -b master origin/master

echo "Installing Packages"
yarn install
yarn bootstrap

echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc 2> /dev/null

git fetch --tags
git fsck --full #debug
echo "npm whoami"
npm whoami #debug
echo "git config --list"
git config --list #debug
