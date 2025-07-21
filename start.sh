# set -e

# BASE_PORT=4000
# INSTANCES=1

# for ((i=0; i<$INSTANCES; i++)); do
#   PORT=$((BASE_PORT + i))
#   echo "Starting server on port $PORT..."
#   node dist/src/server.js $PORT &
# done




# #!/bin/bash

# BASE_PORT=3002
# INSTANCES=4

# for ((i=0; i<$INSTANCES; i++)); do
#   PORT=$((BASE_PORT + i))
#   echo "Starting server on port $PORT..."
#   PORT=$PORT pm2 start dist/src/server.js --name "server-$PORT"
# done
