#!/bin/sh

# Exit immediately if something goes wrong, and dissalow unset params
set -e
set -u

# Log helper function
function say { echo "[BUILD (./build.sh)] $1"; }

say "BUILD STARTED ==============="

# Ensure composer exists
say "Checking if composer.phar is present"
if [ -f composer.phar ]; then
    say "Found. Running self-update"
    php composer.phar self-update
else
    say "Not found. Installing"
    curl -sL https://getcomposer.org/composer-stable.phar > composer.phar
fi

## Fix file permissions
chmod -R 777 storage bootstrap/cache || true

# Clear cache
rm -f bootstrap/cache/*.php bootstrap/cache/*.json

# Install composer dependencies
# Set INVOICE_COMPOSER_INSTALL_DEV to install everything
say "Installing composer dependencies"
if [ ! -z ${INVOICE_COMPOSER_INSTALL_DEV+x} ]; then
    say "Installing all dependencies (YETI_COMPOSER_INSTALL_DEV is set)"
    php composer.phar install
else
    say "Installing only non dev dependencies"
    php composer.phar install --no-dev
fi
#
## TODO:
##   Run migrations: php artisan migrate
##   Install passport: php artisan passport:install
##   Generate ide helper for lighthouse: php artisan lighthouse:ide-helper


say "BUILD FINISHED ==============="
