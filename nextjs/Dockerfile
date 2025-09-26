# Base image
FROM node:18

# Set workdir
WORKDIR /app

# Copy package.json và cài dependencies
COPY package*.json ./
RUN npm install --force

# Copy toàn bộ source
COPY . .

# Build project (Next.js / Node)
RUN npm run build

# Tham số môi trường khi build
ARG ENV_FILE=.env.test
COPY ${ENV_FILE} .env

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]
