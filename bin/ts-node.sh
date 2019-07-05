#!/bin/bash -e

exec node node_modules/ts-node/dist/bin.js --ignore false "$@"
