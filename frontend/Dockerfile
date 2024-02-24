FROM node:20-alpine

WORKDIR /shared

COPY shared/package.json ./
RUN yarn install
COPY shared/api.ts ./
COPY shared/types.ts ./


WORKDIR /app

COPY package.json ./

RUN yarn install

COPY app ./app
COPY public ./public
COPY contexts ./contexts
COPY components ./components
COPY lib ./lib

COPY next.config.mjs .
COPY tsconfig.json .
COPY .env . 
COPY tailwind.config.ts .
COPY postcss.config.js .

RUN yarn build

CMD ["yarn", "start"]