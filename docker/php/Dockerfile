# added by Katie for postgres
FROM php:7.4-fpm-alpine

ADD ./docker/php/www.conf /usr/local/etc/php-fpm.d/www.conf

RUN addgroup -g 1000 exbuilder && adduser -G exbuilder -g exbuilder -s /bin/sh -D exbuilder

RUN mkdir -p /var/www/html

RUN chown exbuilder:exbuilder /var/www/html

WORKDIR /var/www/html

RUN set -ex \
  && apk --no-cache add \
    postgresql-dev

RUN docker-php-ext-install pdo pdo_pgsql pgsql

# RUN apk update

# RUN apk add -y libpq-dev \
#     && docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql \
#     && docker-php-ext-install pdo pdo_pgsql pgsql
