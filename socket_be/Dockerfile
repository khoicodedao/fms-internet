FROM node:18

WORKDIR /app

# Copy package.json từ parent (app/) để cài dependencies chung (nếu dùng chung)
COPY ../package*.json ./
RUN npm install --force

COPY . .

EXPOSE 3001 3002

CMD ["node", "server.js"]
