FROM php:8.3-cli

RUN apt-get update && apt-get install -y \
    wget \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install Xdebug
RUN pecl install xdebug \
    && docker-php-ext-enable xdebug

# Enable Xdebug and set it to coverage mode
RUN echo "xdebug.mode=coverage" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && echo "xdebug.start_with_request=no" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini

# Download PHPUnit PHAR
RUN wget -O /usr/local/bin/phpunit \
    https://phar.phpunit.de/phpunit-10.phar \
    && chmod +x /usr/local/bin/phpunit

# Verify
RUN phpunit --version