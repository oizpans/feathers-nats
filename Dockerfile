FROM node:14.15.3-stretch-slim
RUN apt update && apt upgrade -y && apt install -y git
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY ./ ./
CMD ["echo", "NO COMMAND"]