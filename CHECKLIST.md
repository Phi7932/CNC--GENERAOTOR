# ✅ DEPLOYMENT CHECKLIST

## 📦 Files cần thiết

- [x] `index.html` - Giao diện chính (92KB)
- [x] `api/calculate.js` - Công thức tính toán (556 dòng)
- [x] `vercel.json` - Config Vercel
- [x] `package.json` - Package info
- [x] `.gitignore` - Git ignore rules
- [x] `README.md` - Documentation (tiếng Anh)
- [x] `HUONG_DAN.md` - Hướng dẫn chi tiết (tiếng Việt)
- [x] `QUICK_START.md` - Quick start (tiếng Việt)
- [x] `test-api.html` - API tester (optional)

## 🔍 Kiểm tra trước khi deploy

### 1. Kiểm tra cấu trúc files
```bash
cd cnc-generator
ls -la
```
Phải thấy:
- ✅ index.html
- ✅ api/ (folder)
- ✅ vercel.json
- ✅ package.json

### 2. Kiểm tra API file
```bash
node -c api/calculate.js
```
Phải không có lỗi

### 3. Kiểm tra index.html
Mở file `index.html` bằng text editor:
- ✅ Phải có dòng: `const API_URL = window.location.hostname === 'localhost'`
- ✅ Phải có các function: `calculate()`, `drawDrillingVisualization()`, etc.
- ✅ KHÔNG được có các function tính toán (đã chuyển sang API)

### 4. Kiểm tra api/calculate.js
Mở file `api/calculate.js`:
- ✅ Phải có: `export default function handler(req, res)`
- ✅ Phải có: `calculateDrilling()`, `calculateMilling()`, `calculateCircular()`
- ✅ Có tất cả templates cho 4 máy: takisawa, robodrill, f54, mitsu

## 🚀 Deployment Steps

### Bước 1: Git Init (nếu chưa có)
```bash
git init
git add .
git commit -m "Initial commit"
```

### Bước 2: Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Bước 3: Import vào Vercel
1. https://vercel.com → Import Project
2. Chọn repo → Deploy
3. Đợi build xong

## ✅ Verification sau khi deploy

### 1. Test homepage
- [ ] Mở URL Vercel
- [ ] Trang load được
- [ ] Không có lỗi trong Console (F12)

### 2. Test Drilling mode
- [ ] Chọn mode "Drilling"
- [ ] Nhập PCD = 100, Holes = 6
- [ ] Click vào input khác
- [ ] G-Code tự động xuất hiện
- [ ] Có visualization (canvas vẽ được)

### 3. Test Hexagon Milling mode
- [ ] Chọn mode "Hexagon Milling"
- [ ] Nhập Hex Height = 10
- [ ] G-Code tự động xuất hiện
- [ ] Có hexagon visualization

### 4. Test Circular Milling mode
- [ ] Chọn mode "Circular Milling"
- [ ] Nhập PCD = 100
- [ ] G-Code tự động xuất hiện
- [ ] Có circular visualization

### 5. Test G-Code Checker mode
- [ ] Chọn mode "G-Code Checker"
- [ ] Upload một file .tap hoặc paste code
- [ ] Click "CHECK"
- [ ] Hiện kết quả phân tích
- [ ] Click "FIX" hoạt động
- [ ] Click "SAVE" download được file

### 6. Test Download/Copy
- [ ] Click "COPY" → code copy vào clipboard
- [ ] Click "DOWNLOAD" → file .tap tải về
- [ ] Mở file .tap bằng text editor → nội dung đúng

## 🔒 Security Check

### 1. Kiểm tra source code public
- [ ] Vào website → F12 → Sources
- [ ] Chỉ thấy `index.html`
- [ ] KHÔNG thấy file `calculate.js` hoặc công thức tính toán

### 2. Kiểm tra Network requests
- [ ] F12 → Network tab
- [ ] Nhập số liệu → trigger calculation
- [ ] Thấy request POST đến `/api/calculate`
- [ ] Response chỉ có G-Code, không thấy công thức

## 📊 Performance Check

- [ ] Website load < 3 giây
- [ ] Tính toán tức thì (< 1 giây)
- [ ] Không có memory leak (test nhiều lần)
- [ ] Mobile responsive (test trên điện thoại)

## 🎉 Success Criteria

✅ Tất cả checklist items trên passed  
✅ Không có error trong Console  
✅ API hoạt động 100%  
✅ Công thức được bảo vệ  
✅ Có thể share link cho người khác dùng  

---

## 📝 Notes

- Vercel miễn phí: 100GB bandwidth/tháng
- Serverless functions: 100 giờ execution/tháng
- Với tool này, bandwidth usage rất thấp → đủ dùng cả năm
- Nếu cần custom domain: Settings → Domains

---

**Nếu tất cả checklist passed → Deployment thành công! 🎊**
