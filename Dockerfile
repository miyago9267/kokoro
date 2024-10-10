FROM node:18.0.0-alpine

WORKDIR /app

RUN npm install -g yarn@latest && \
    yarn install

COPY . .

CMD ["yarn", "start"]