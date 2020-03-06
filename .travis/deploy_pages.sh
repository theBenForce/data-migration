if [ "$TRAVIS_BRANCH" = "master" -a "$TRAVIS_PULL_REQUEST" = "false" ]; then
  ./node_modules/.bin/docpress build
  echo "data-migration.js.org" > _docpress/CNAME
  ./node_modules/.bin/git-update-ghpages -e
fi
