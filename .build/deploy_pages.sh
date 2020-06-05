
yarn install
yarn bootstrap

yarn docs:build
echo "data-migration.js.org" > _docpress/CNAME
mkdir _docpress/.well-known
cp ./docs/.well-known/brave-rewards-verification.txt _docpress/.well-known/brave-rewards-verification.txt
