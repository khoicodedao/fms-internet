```markdown
# 🚀 Quản lý dự án Next.js + Socket_BE + Nginx bằng Docker Compose

Dự án này gồm 3 service tách riêng, mỗi service có `docker-compose.yml` riêng:
```

/projects
├── nextjs/
│ └── docker-compose.nextjs.yml
├── socket_be/
│ └── docker-compose.socket_be.yml
├── nginx/
│ └── docker-compose.nginx.yml
├── manage.sh # Script quản lý cho Linux/macOS
└── manage.bat # Script quản lý cho Windows CMD

````

---

## 🐧 Cách chạy trên Linux / Ubuntu / macOS

### 1. Cấp quyền thực thi script
```bash
chmod +x manage.sh
````

### 2. Các lệnh sử dụng

```bash
./manage.sh up       # Chạy tất cả service
./manage.sh down     # Dừng tất cả service
./manage.sh restart  # Restart toàn bộ
./manage.sh logs     # Xem log của nginx
```

---

## 🪟 Cách chạy trên Windows (CMD)

### 1. Mở Command Prompt hoặc PowerShell

Chạy trong thư mục `/projects`.

### 2. Các lệnh sử dụng

```bat
manage.bat up       :: Chạy tất cả service
manage.bat down     :: Dừng tất cả service
manage.bat restart  :: Restart toàn bộ
manage.bat logs     :: Xem log của nginx
```

---

## 🌐 Network dùng chung

Các service đều join vào `appnet`. Nếu chưa tồn tại, script sẽ tự tạo:

```bash
docker network create appnet
```

---

## 🔑 SSL Certificates

- Chứng chỉ SSL nằm trong `nginx/certs/`
- File config `nginx.conf` đã được mount sẵn:

  - `ssl_certificate     /etc/nginx/certs/client.crt`
  - `ssl_certificate_key /etc/nginx/certs/client.key`

---

## 📜 Ghi chú

- `nextjs` chạy tại `http://nextjs:3000` trong network docker.
- `socket_be` chạy tại `http://socket_be:3002` (hoặc `3003`).
- `nginx` expose ra ngoài `80` và `443`.
- Khi truy cập từ trình duyệt: **[https://localhost/](https://localhost/)** sẽ tới Next.js.

---

```

```
