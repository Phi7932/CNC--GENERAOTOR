# ⚡ QUICK START - 3 BƯỚC ĐƠN GIẢN

## 🎯 Mục tiêu
Deploy CNC G-Code Generator lên Vercel MIỄN PHÍ trong 5 phút!

---

## 📋 CHUẨN BỊ

✅ Tài khoản GitHub (đăng ký tại: https://github.com)  
✅ Folder `cnc-generator` này  

**KHÔNG** cần cài đặt gì khác!

---

## 🚀 3 BƯỚC ĐƠN GIẢN

### BƯỚC 1: Upload lên GitHub (2 phút)

**Cách 1: GitHub Web (Dễ nhất - Không cần code)**

1. Vào https://github.com → Click **"New"** (nút xanh góc trên)
2. Đặt tên: `cnc-generator`
3. Chọn **Private** (để giấu code)
4. Click **"Create repository"**
5. Kéo toàn bộ files trong folder `cnc-generator` vào trình duyệt
6. Gõ message: `Initial commit`
7. Click **"Commit changes"**

**Cách 2: GitHub Desktop (Dễ, có giao diện)**

1. Tải GitHub Desktop: https://desktop.github.com
2. Đăng nhập GitHub
3. **File** → **Add Local Repository** → Chọn folder `cnc-generator`
4. Click **"Publish repository"**
5. Chọn **Private** → Click **"Publish"**

✅ **XONG BƯỚC 1!**

---

### BƯỚC 2: Deploy lên Vercel (2 phút)

1. Vào https://vercel.com
2. Click **"Sign Up"** → Chọn **"Continue with GitHub"**
3. Click **"Import Project"** (hoặc **"Add New"** → **"Project"**)
4. Tìm repo `cnc-generator` → Click **"Import"**
5. **KHÔNG** sửa gì cả → Click **"Deploy"**

⏱️ Đợi 1-2 phút...

🎉 Thấy màn hình **"Congratulations"** → **XONG!**

---

### BƯỚC 3: Sử dụng (30 giây)

1. Click vào link Vercel vừa cho (dạng: `https://cnc-generator-xxx.vercel.app`)
2. Chọn mode (Drilling/Hexagon/Circular/Checker)
3. Nhập số liệu
4. Nhận G-Code ngay!

---

## ✅ KẾT QUẢ

- ✅ Website chạy 24/7 miễn phí
- ✅ Công thức tính toán **ĐƯỢC BẢO VỆ** (chạy trên server)
- ✅ Có link chia sẻ cho đồng nghiệp
- ✅ Cập nhật code dễ dàng (push lên GitHub → tự deploy)

---

## 🔧 TEST LOCAL (Tùy chọn)

Nếu muốn test trước khi deploy:

```bash
# Cài Vercel CLI
npm i -g vercel

# Chạy local
cd cnc-generator
vercel dev
```

Mở http://localhost:3000

---

## 📱 CHIA SẺ

Sau khi deploy, bạn có thể:
- ✅ Gửi link cho đồng nghiệp
- ✅ Lưu vào bookmark
- ✅ Thêm vào Home Screen (mobile)
- ✅ Đổi domain custom (nếu muốn)

---

## ❓ LỖI THƯỜNG GẶP

### "Failed to deploy"
→ Check xem tất cả files đã push lên GitHub chưa

### "API call failed"  
→ Đảm bảo file `api/calculate.js` đã có trên GitHub

### Website trắng màn
→ F12 → Console → xem lỗi gì, thường là thiếu file

---

## 🎁 BONUS

### Custom Domain (Tùy chọn)
1. Vercel Dashboard → Settings → Domains
2. Thêm domain của bạn (VD: `cnc.yourdomain.com`)
3. Cập nhật DNS theo hướng dẫn

### Analytics (Xem lượng truy cập)
1. Vercel Dashboard → Analytics
2. Click **"Enable"**

---

**Hết rồi! Đơn giản phải không? 😊**

Nếu gặp khó khăn, đọc file `HUONG_DAN.md` để biết chi tiết hơn.

---

Made with ❤️ by Phi7932
