FROM oven/bun

WORKDIR /app

COPY package.json ./

RUN bun install

COPY src ./src
COPY prisma ./prisma
COPY tsconfig.json .
COPY .env .
COPY startup.sh .
RUN mkdir -p /app/temp

# Install node for prisma
RUN apt-get update && apt-get install -y curl

RUN curl -fsSL https://deb.nodesource.com/setup_21.x | bash - &&\
    apt-get install -y nodejs

# Make sure that Windows doesn't mess up the line endings
RUN  apt-get update && apt-get install -y dos2unix && dos2unix ./startup.sh

RUN npm install -g prisma
RUN chmod +x ./startup.sh

CMD ["./startup.sh"]
