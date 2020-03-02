#!/bin/bash
set -e
# Note: do not do set -x or the passwords will leak!

echo Branch: $TRAVIS_BRANCH

if [ "$TRAVIS_PULL_REQUEST" != "false" ]; then
  echo "We are in a pull request, not setting up release"
  exit 0
fi

if [[ $TRAVIS_BRANCH == 'master' ]]; then
  rm -rf .git
  git init
  git clean -dfx

  git config user.email "travis@travis-ci.org"
  git config user.name "Travis CI"
  git remote set-url origin https://${GITHUB_TOKEN}@github.com/${TRAVIS_REPO_SLUG}.git
  git checkout $TRAVIS_BRANCH

  echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc 2> /dev/null

  git fetch --tags
  git branch -u origin/$TRAVIS_BRANCH
  git fsck --full #debug
  echo "npm whoami"
  npm whoami #debug
  echo "git config --list"
  git config --list #debug
fi
