FROM oven/bun

WORKDIR /app

COPY package.json ./

RUN bun install

COPY src ./src
COPY prisma ./prisma
COPY tsconfig.json .
COPY .env .
COPY startup.sh .

# Install node for prisma
RUN apt-get update && apt-get install -y curl

RUN curl -fsSL https://deb.nodesource.com/setup_21.x | bash - &&\
    apt-get install -y nodejs

RUN npm install -g prisma


CMD ["./startup.sh"]
