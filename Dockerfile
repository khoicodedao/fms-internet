# Sử dụng Node.js để build ứng dụng
FROM node:18 AS builder

# Thiết lập thư mục làm việc
WORKDIR /app

# Sao chép package.json và package-lock.json
COPY package.json package-lock.json ./

# Cài đặt dependencies
RUN npm install --force

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Build ứng dụng Next.js
RUN npm run build

# Sử dụng Nginx để phục vụ ứng dụng
FROM nginx:alpine

# Sao chép file build từ giai đoạn trước vào thư mục Nginx
COPY --from=builder /app/.next /usr/share/nginx/html

# Sao chép file cấu hình Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Sao chép chứng chỉ SSL và đổi tên thành .pem
COPY client.crt /etc/nginx/ssl/cert.pem
COPY client.key /etc/nginx/ssl/key.pem

# Expose port 443
EXPOSE 443

# Khởi chạy Nginx
CMD ["nginx", "-g", "daemon off;"]