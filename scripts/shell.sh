CONTAINER=$1
echo "Starting shell for $CONTAINER"

docker exec -it $CONTAINER /bin/bash