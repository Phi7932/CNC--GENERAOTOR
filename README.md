# CNC G-Code Generator

Công cụ tạo G-Code cho CNC với các chế độ: Drilling, Hexagon Milling, Circular Milling và G-Code Checker.

## 🚀 Deploy lên Vercel

### Bước 1: Push code lên GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO-NAME.git
git push -u origin main
```

### Bước 2: Deploy trên Vercel

1. Truy cập https://vercel.com
2. Đăng nhập bằng GitHub
3. Click "Import Project"
4. Chọn repository của bạn
5. Click "Deploy"

**Xong!** Vercel sẽ tự động:
- Build project
- Setup serverless functions từ folder `api/`
- Cấp cho bạn một URL miễn phí

### Bước 3: Sử dụng

Sau khi deploy xong, bạn sẽ có URL dạng: `https://your-project.vercel.app`

## 📁 Cấu trúc Project

```
cnc-generator/
├── index.html          # Giao diện người dùng
├── api/
│   └── calculate.js    # Serverless function (công thức tính toán)
├── vercel.json         # Cấu hình Vercel
├── .gitignore          
└── README.md
```

## 🔒 Bảo mật

- **Công thức tính toán** được giấu trong `api/calculate.js` 
- Chạy trên server của Vercel, user không thể xem source code
- File `index.html` chỉ chứa giao diện và gọi API

## ⚙️ Cách hoạt động

1. User nhập dữ liệu trên `index.html`
2. JavaScript gọi API `/api/calculate` với dữ liệu đầu vào
3. Serverless function xử lý tính toán trên server
4. Trả về kết quả G-Code cho client
5. Hiển thị kết quả và visualization

## 🛠️ Phát triển local

```bash
# Cài Vercel CLI
npm i -g vercel

# Chạy local
vercel dev
```

## 📝 Ghi chú

- **KHÔNG** commit file có công thức quan trọng vào public repository
- Có thể thêm authentication nếu cần
- Có thể thêm rate limiting để tránh abuse
