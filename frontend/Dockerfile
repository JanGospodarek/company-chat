FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY app ./app
COPY public ./public
COPY next.config.mjs .
COPY tsconfig.json .

CMD ["yarn", "dev"]