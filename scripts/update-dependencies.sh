#!/bin/bash

set -e

cd $(dirname "$0")
cd ..

command_exists(){
  command -v "$1" &> /dev/null
}

if ! command_exists "ncu"; then
    echo "npm-check-updates is not installed"
    npm i -g npm-check-updates
else
    echo "ncu is installed"
fi

function updateDependencies {
  echo "updating dependencies..."
  ncu -u -x typescript
}

updateDependencies

for packageDirectory in packages/*; do
  (
    cd "$packageDirectory"
    updateDependencies
  )
done

rm -rf node_modules packages/*/node_modules dist
npm install

echo "Great Success!"
