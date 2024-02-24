#!/bin/bash

# Add neccessary variables
DB_PATH="/db"
UPLOADS_PATH="/uploads"
BACKUP_PATH_BASE="/backup/data"

# Create backup directory
CURRENT_DATE=$(date +"%Y-%m-%d-%H-%M-%S")

BACKUP_PATH="$BACKUP_PATH_BASE/$CURRENT_DATE"

mkdir -p $BACKUP_PATH
mkdir -p $BACKUP_PATH/db
mkdir -p $BACKUP_PATH/content

# Backup database into backup directory with current date and in tar format
pg_dump -h db -d miau -U postgres > $BACKUP_PATH/db/miau.sql

# Backup uploads into backup directory with current date and in tar format
tar -czf $BACKUP_PATH/content/content.tar.gz $UPLOADS_PATH

