#!/bin/sh

set -u
set -e

# Ensure env is present
test -f .env || cp .env.example .env

yarn install
yarn dev
