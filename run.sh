#!/bin/bash
# Script quản lý toàn bộ service bằng docker compose (cú pháp mới)

NEXTJS_COMPOSE="nextjs/docker-compose.yml"
SOCKET_COMPOSE="socket_be/docker-compose.yml"
NGINX_COMPOSE="nginx/docker-compose.yml"
NETWORK_NAME="appnet"
CMD=$1   # up | down | restart | logs

if [ -z "$CMD" ]; then
  echo "Usage: $0 [up|down|restart|logs]"
  exit 1
fi
if ! docker network ls | grep -q "$NETWORK_NAME"; then
  echo "👉 Tạo network $NETWORK_NAME ..."
  docker network create $NETWORK_NAME
fi
case $CMD in
  up)
    echo "🚀 Starting all services..."
    docker compose -f $NEXTJS_COMPOSE up -d
    docker compose -f $SOCKET_COMPOSE up -d
    docker compose -f $NGINX_COMPOSE up -d
    ;;
  down)
    echo "🛑 Stopping all services..."
    docker compose -f $NGINX_COMPOSE down
    docker compose -f $SOCKET_COMPOSE down
    docker compose -f $NEXTJS_COMPOSE down
    ;;
  restart)
    echo "🔄 Restarting all services..."
    $0 down
    $0 up
    ;;
  logs)
    echo "📜 Logs for nginx..."
    docker compose -f $NGINX_COMPOSE logs -f
    ;;
  *)
    echo "❌ Invalid command: $CMD"
    echo "Valid commands: up, down, restart, logs"
    ;;
esac
