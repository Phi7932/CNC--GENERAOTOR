# 🎯 HƯỚNG DẪN DEPLOY CNC G-CODE GENERATOR

## ✅ ĐÃ TÁCH THÀNH CÔNG!

File gốc của bạn đã được tách thành 2 nhóm:

### 📁 Nhóm 1: GIAO DIỆN (Public)
- **File:** `index.html`
- **Nội dung:** HTML, CSS, và JavaScript gọi API
- **Ai cũng xem được**, nhưng KHÔNG chứa công thức tính toán

### 🔒 Nhóm 2: CÔNG THỨC (Private - Chạy trên server)
- **File:** `api/calculate.js`
- **Nội dung:** TẤT CẢ công thức tính toán (Drilling, Hexagon, Circular)
- **Chạy trên Vercel server**, user KHÔNG thể xem source code

---

## 🚀 CÁCH DEPLOY LÊN GITHUB + VERCEL

### BƯỚC 1: Tạo Repository trên GitHub

1. Vào https://github.com
2. Click nút **"New"** (góc trên bên trái)
3. Đặt tên repo: `cnc-gcode-generator` (hoặc tên bạn thích)
4. Chọn **Public** hoặc **Private** (khuyến nghị Private nếu không muốn ai thấy)
5. **KHÔNG** tick "Add a README file"
6. Click **"Create repository"**

### BƯỚC 2: Upload Code lên GitHub

**Cách 1: Dùng GitHub Desktop (Dễ nhất)**
1. Download GitHub Desktop: https://desktop.github.com/
2. Đăng nhập GitHub
3. Click **File** → **Add Local Repository**
4. Chọn folder `cnc-generator` 
5. Click **Publish repository**

**Cách 2: Dùng Command Line**
```bash
# Mở Terminal/CMD trong folder cnc-generator
cd cnc-generator

# Khởi tạo Git
git init

# Add tất cả files
git add .

# Commit
git commit -m "Initial commit"

# Thêm remote (thay YOUR_USERNAME và REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push lên GitHub
git branch -M main
git push -u origin main
```

### BƯỚC 3: Deploy lên Vercel (MIỄN PHÍ)

1. Vào https://vercel.com
2. Click **"Sign Up"** và chọn **"Continue with GitHub"**
3. Sau khi đăng nhập, click **"Import Project"**
4. Click **"Import Git Repository"**
5. Tìm và chọn repository `cnc-gcode-generator`
6. Click **"Import"**
7. **KHÔNG** cần thay đổi gì, click **"Deploy"**

⏱️ Đợi khoảng 1-2 phút...

✅ **XONG!** Vercel sẽ cho bạn một link dạng:
```
https://cnc-gcode-generator-abc123.vercel.app
```

---

## 🎉 SỬ DỤNG

1. Mở link Vercel vừa nhận được
2. Chọn chế độ (Drilling, Hexagon, Circular, Checker)
3. Nhập thông số
4. Tự động tính toán và hiển thị G-Code
5. Click **COPY** hoặc **DOWNLOAD** để lấy file

---

## 🔐 BẢO MẬT

✅ **Công thức ĐƯỢC BẢO VỆ:**
- Chạy trên server Vercel, không phải browser
- User chỉ gọi API, không thấy code tính toán
- Kể cả mở DevTools cũng không thấy công thức

✅ **Cách kiểm tra:**
1. Mở website
2. Nhấn F12 (Developer Tools)
3. Vào tab "Sources" 
4. Chỉ thấy `index.html` với code gọi API
5. **KHÔNG** thấy công thức tính toán!

---

## 📊 CẤU TRÚC PROJECT

```
cnc-generator/
│
├── index.html          ← Giao diện (HTML + CSS + JS gọi API)
│
├── api/
│   └── calculate.js    ← CÔNG THỨC (chạy trên server Vercel)
│
├── vercel.json         ← Config Vercel
├── package.json        ← Thông tin project
├── .gitignore          ← Files không push lên Git
└── README.md           ← Hướng dẫn
```

---

## 🛠️ CHỈNH SỬA SAU NÀY

Nếu muốn sửa code:

1. Sửa file local
2. Push lên GitHub:
   ```bash
   git add .
   git commit -m "Update code"
   git push
   ```
3. Vercel tự động deploy lại (30 giây)

---

## ❓ TROUBLESHOOTING

### Lỗi: "API call failed"
- Kiểm tra file `api/calculate.js` đã được push lên GitHub chưa
- Vào Vercel Dashboard → Functions → Xem có lỗi gì không

### Lỗi: "Module not found"
- Đảm bảo file `vercel.json` đã được push lên

### Website trắng màn
- Kiểm tra Console (F12) xem lỗi gì
- Đảm bảo `index.html` đã được push lên

---

## 💡 GỢI Ý NÂNG CAO

1. **Custom Domain:**
   - Vercel → Settings → Domains
   - Thêm domain của bạn (VD: cnc.yourname.com)

2. **Analytics:**
   - Vercel → Analytics → Enable
   - Xem số người truy cập

3. **Environment Variables:**
   - Nếu cần API key, password, v.v.
   - Vercel → Settings → Environment Variables

---

## 📞 HỖ TRỢ

Nếu có lỗi:
1. Check file `README.md` trong folder
2. Xem logs trên Vercel Dashboard
3. Google search với từ khóa: "vercel deployment error [tên lỗi]"

---

**Chúc bạn deploy thành công! 🎊**

Designed by Phi7932 with ❤️
