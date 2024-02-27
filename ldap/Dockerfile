FROM osixia/phpldapadmin

COPY posixAccount.xml /

COPY startup.sh /container/service/phpldapadmin-additional-templates/startup.sh
# Make sure that Windows doesn't mess up the line endings
RUN  apt-get update && apt-get install -y dos2unix && dos2unix /container/service/phpldapadmin-additional-templates/startup.sh

RUN chmod +x /container/service/phpldapadmin-additional-templates/startup.sh