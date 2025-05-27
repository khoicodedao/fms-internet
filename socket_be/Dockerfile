# Dockerfile for socket_be
FROM node:18

WORKDIR /app

# Copy package.json, package-lock.json
COPY package.json package-lock.json ./

RUN npm install --force

# Copy toàn bộ mã nguồn và thư mục certs, file .env, file sqlite
COPY . .

# Expose port cho WebSocket và REST API
EXPOSE 3001
CMD ["node", "server.js"] 