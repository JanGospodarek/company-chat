#!/bin/bash

# Push the prisma schema to the database
prisma generate
prisma migrate dev --name init

# Start the server
bun start
