#!/bin/bash

# Chack if the database is up and running using the pg_isready command
while ! pg_isready -h db -p 5432 -U postgres; do
  echo "Waiting for the database to start..."
  sleep 2
done

# Push the prisma schema to the database
prisma generate
prisma migrate deploy

# Start the server
bun start
