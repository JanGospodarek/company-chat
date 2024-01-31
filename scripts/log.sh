CONTAINER=$1
echo "Starting log for $CONTAINER"

docker logs -f $CONTAINER