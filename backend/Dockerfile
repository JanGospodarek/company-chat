FROM oven/bun

WORKDIR /app

COPY package.json bun.lockb ./

RUN bun install --frozen-lockfile

COPY src ./src
COPY tsconfig.json .

EXPOSE 5000


CMD ["bun", "dev"]
