#!/bin/bash -e
TEMPLATE_PATH=/posixAccount.xml

if [ -f $TEMPLATE_PATH ]; then
    mv $TEMPLATE_PATH /var/www/phpldapadmin/templates/creation/posixAccount.xml
fi

exit 0