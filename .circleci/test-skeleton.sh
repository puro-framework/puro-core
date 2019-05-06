#!/bin/bash
PROJECT_PATH='.circleci/tmp/'

yarn link

# Create a new project
yarn add @puro/cli
`yarn bin`/puro create-project "${PROJECT_PATH}"

# Set up the project
cd "${PROJECT_PATH}"

cat << EOF > config/params.json
{
  "app": {
    "secret": "c2VjcmV0"
  },
  "database": {
    "type": "mariadb",
    "host": "127.0.0.1",
    "port": 3306,
    "username": "root",
    "password": "password",
    "database": "database",
    "entities": [
      "lib/*/entities/*.js"
    ],
    "synchronize": false,
    "logging": false
  }
}
EOF

yarn link @puro/core
yarn add mysql --save
yarn add migrate

# Execute the server
yarn start &
PID=$!
sleep 5

curl \
  -X POST \
  -H 'Content-Type: application/json' \
  -d '{ "title": "Title 1", "description": "Description 1" }' \
  --fail \
  http://127.0.0.1:8080/api/books

kill -9 $PID
