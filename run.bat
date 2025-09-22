@echo off
REM Script quản lý toàn bộ service bằng docker compose (Windows CMD)

set NEXTJS_COMPOSE=nextjs\docker-compose.yml
set SOCKET_COMPOSE=socket_be\docker-compose.yml
set NGINX_COMPOSE=nginx\docker-compose.yml
set NETWORK_NAME=appnet
if "%1"=="" (
    echo Usage: %0 [up^|down^|restart^|logs]
    exit /b 1
)

REM Đảm bảo network tồn tại
for /f "tokens=*" %%i in ('docker network ls --format "{{.Name}}" ^| findstr /i "%NETWORK_NAME%"') do set FOUND=%%i
if not defined FOUND (
    echo 👉 Tạo network %NETWORK_NAME% ...
    docker network create %NETWORK_NAME%
)

if "%1"=="up" (
    echo 🚀 Starting all services...
    docker compose -f %NEXTJS_COMPOSE% up -d
    docker compose -f %SOCKET_COMPOSE% up -d
    docker compose -f %NGINX_COMPOSE% up -d
    exit /b 0
)

if "%1"=="down" (
    echo 🛑 Stopping all services...
    docker compose -f %NGINX_COMPOSE% down
    docker compose -f %SOCKET_COMPOSE% down
    docker compose -f %NEXTJS_COMPOSE% down
    exit /b 0
)

if "%1"=="restart" (
    echo 🔄 Restarting all services...
    call %0 down
    call %0 up
    exit /b 0
)

if "%1"=="logs" (
    echo 📜 Logs for nginx...
    docker compose -f %NGINX_COMPOSE% logs -f
    exit /b 0
)

echo ❌ Invalid command: %1
echo Valid commands: up, down, restart, logs
exit /b 1
