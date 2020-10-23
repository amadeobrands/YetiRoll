#!/bin/sh

# Exit immediately if something goes wrong, and disallow unset params
set -e
set -u

# Ensure env file is present
test -f .env || cp .env.example .env

# Wait for database to come alive
/data/appbuild/scripts/wait-for-it.sh "${1}" -t 60

# Set environments for dev environment
export INVOICE_COMPOSER_INSTALL_DEV=1

# Run project build script
bash ./build.sh
