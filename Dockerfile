FROM node:12.16.1-alpine

RUN apk update && apk upgrade && apk add --no-cache bash git openssh

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY ./ ./

CMD ["echo", "NO COMMAND"]
