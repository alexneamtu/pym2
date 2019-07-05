FROM node:current-alpine

RUN apk add --no-cache redis

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app
RUN rm -rf node_modules
RUN npm i

EXPOSE 7000 8000
ENTRYPOINT  /usr/bin/redis-server --daemonize yes && node node_modules/ts-node/dist/bin.js --ignore false app.ts
