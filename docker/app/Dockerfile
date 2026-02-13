FROM php:8.3.0-apache-bullseye
RUN docker-php-ext-install mysqli

# Install Node.js
RUN apt-get update && apt-get install -y curl \
&& curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
&& apt-get install -y nodejs \
&& apt-get clean


# (Optional) install npm packages like puppeteer
RUN npm install puppeteer -g