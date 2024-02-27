#!/bin/bash

# Delay for 60 seconds to wait for the database to start
sleep 60

# Push the prisma schema to the database
prisma generate
prisma migrate deploy

# Start the server
bun start
