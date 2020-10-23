FROM ubuntu:20.04

ENV DEBIAN_FRONTEND noninteractive

# Base system setup
RUN apt-get update && \
    apt-get install -y \
        software-properties-common \
        gnupg \
        tzdata \
        locales \
        locales-all \
        unzip && \
    echo "UTC" > /etc/timezone && \
    dpkg-reconfigure -f noninteractive tzdata

# Set locale
ENV LC_ALL en_US.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US.UTF-8

# PHP
RUN add-apt-repository ppa:ondrej/php && \
    apt-get update && \
    apt-get install -y \
        php7.4 \
        php7.4-ctype \
        php7.4-curl \
        php7.4-dom \
        php7.4-fileinfo \
        php7.4-fpm \
        php7.4-gd \
        php7.4-intl \
        php7.4-json \
        php7.4-mbstring \
        php7.4-pgsql \
        php7.4-phar \
        php7.4-redis \
        php7.4-sockets \
        php7.4-simplexml \
        php7.4-sqlite3 \
        php7.4-tokenizer \
        php7.4-xml \
        php7.4-xmlwriter \
        php7.4-zip \
        php7.4-iconv \
        php7.4-dev \
        php-pear

# PHP extras
RUN pecl channel-update pecl.php.net && \
    pecl install \
        xdebug
