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

Rõ rồi 👍. Mình sẽ viết lại file README đầy đủ, bao gồm cả phần **cập nhật code** (update) sau khi bạn sửa trong repo tổng hoặc repo con.

---

# 📖 Hướng dẫn sử dụng `git subtree` cho repo nhiều project con

Repo tổng có cấu trúc:

```
.
├── nextjs/
├── nginx/
└── socket_be/
```

Mỗi project con có repo riêng trên GitLab:

- `nextjs/` → `http://10.32.116.233/khoind/fe_nextjs.git`
- `nginx/` → `http://10.32.116.233/khoind/fe_nginx.git`
- `socket_be/` → `http://10.32.116.233/khoind/fe_socket.git`

---

## 1. Thêm remote cho từng project con

Chạy 1 lần trong repo tổng:

```bash
git remote add nextjs     http://10.32.116.233/khoind/fe_nextjs.git
git remote add nginx      http://10.32.116.233/khoind/fe_nginx.git
git remote add socket_be  http://10.32.116.233/khoind/fe_socket.git
```

---

## 2. Push code ban đầu từ repo tổng sang repo con

```bash
git subtree push --prefix=nextjs nextjs main
git subtree push --prefix=nginx nginx main
git subtree push --prefix=socket_be socket_be main
```

---

## 3. Cập nhật code sau này (update)

### 🔹 Trường hợp A: bạn sửa code trong repo tổng

Ví dụ bạn thay đổi file trong `nextjs/` ở repo tổng.
Khi commit xong, chạy:

```bash
git subtree push --prefix=nextjs nextjs main
```

Tương tự cho `nginx/` và `socket_be/` nếu có thay đổi.
→ Lệnh này sẽ đồng bộ code mới từ repo tổng sang repo con trên GitLab.

---

### 🔹 Trường hợp B: bạn (hoặc team khác) sửa trực tiếp trong repo con

Ví dụ `fe_nextjs.git` có commit mới.
Muốn cập nhật về repo tổng:

```bash
git subtree pull --prefix=nextjs nextjs main
```

Tương tự với `nginx` và `socket_be`.
→ Lệnh này sẽ merge code mới từ repo con về lại thư mục con trong repo tổng.

---

## 4. Tóm tắt lệnh hay dùng

- Push từ repo tổng sang repo con:

  ```bash
  git subtree push --prefix=<folder> <remote> main
  ```

- Pull từ repo con về repo tổng:

  ```bash
  git subtree pull --prefix=<folder> <remote> main
  ```

---
