# Base image
FROM node:18

# Set workdir
WORKDIR /app

# Copy package.json và cài dependencies
COPY package*.json ./
RUN npm install --force

# Copy toàn bộ source
COPY . .

# Tham số môi trường khi build (mặc định test)
ARG ENV_FILE=.env.test
COPY ${ENV_FILE} .env

# Expose các cổng socket
EXPOSE 3002 3003

# Start app
CMD ["node", "server.js"]
 