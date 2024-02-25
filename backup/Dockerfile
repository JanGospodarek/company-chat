FROM postgres:16-bookworm

# Install pg_dump v 16  and cron
RUN apt-get update && apt-get install -y cron

# Add the backup script
ADD backup.sh /backup.sh
RUN chmod +x /backup.sh

# Add the crontab file
RUN touch /etc/cron.d/backup
RUN echo "0 3 * * * root /backup.sh" > /etc/cron.d/backup
RUN chmod 0644 /etc/cron.d/backup

# Create the .pgpass file
RUN touch /root/.pgpass
RUN chmod 0600 /root/.pgpass
RUN echo "db:5432:miau:postgres:postgres" > /root/.pgpass

# Run the command on container start
CMD cron -f
