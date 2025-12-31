# 📸 Hướng dẫn thêm/thay đổi ảnh

## 🎯 Nhanh chóng:

### Bước 1: Thêm ảnh vào folder
```
my-christmas-tree-app/
└── public/
    └── photos/
        ├── anh-em-tu.jpg          ← Đặt ảnh vào đây
        ├── gia-dinh.jpg
        ├── ky-niem-dep.jpg
        └── ... (tên bất kỳ)
```

### Bước 2: Khai báo trong code
Mở file: `src/services/storage.js`

Thêm ảnh + text vào mảng `DEFAULT_PHOTOS`:

```javascript
export const DEFAULT_PHOTOS = [
    { url: "/photos/anh-em-tu.jpg", caption: "Em và Tú" },
    { url: "/photos/gia-dinh.jpg", caption: "Gia đình sum họp" },
    { url: "/photos/ky-niem-dep.jpg", caption: "Kỷ niệm đẹp" },
    { url: "/photos/top.jpg", caption: "⭐ Đặc biệt" },
    // Thêm bao nhiêu ảnh cũng được
];
```

**Lưu ý:** Text sẽ hiển thị màu **trắng** dưới mỗi polaroid.

### Bước 3: Reload trình duyệt
Nhấn `F5` hoặc `Ctrl + R`

---

## ✅ Lưu ý:

### Tên file:
- ✅ Được: `anh-gia-dinh.jpg`, `ky-niem-2024.png`
- ❌ Tránh: `ảnh gia đình.jpg` (có dấu, có khoảng trắng)

### Định dạng hỗ trợ:
- `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`

### Hiệu năng:
- **10-15 ảnh**: Mượt mà ⚡
- **20-25 ảnh**: Chấp nhận được ✅
- **30+ ảnh**: Có thể lag ⚠️

---

## 🎨 Ví dụ thực tế:

```javascript
export const DEFAULT_PHOTOS = [
    { url: "/photos/top.jpg", caption: "⭐ Đặc biệt" },
    { url: "/photos/gia-dinh-tet-2024.jpg", caption: "Tết 2024" },
    { url: "/photos/du-lich-da-lat.jpg", caption: "Đà Lạt mộng mơ" },
    { url: "/photos/sinh-nhat-em.jpg", caption: "Happy Birthday" },
    { url: "/photos/truong-xua.jpg", caption: "Ký ức tuổi thơ" },
    { url: "/photos/ban-be.jpg", caption: "Hội bạn thân" },
];
```

### 💡 Tips cho Caption:
- ✅ Ngắn gọn (2-4 từ)
- ✅ Có thể dùng emoji: ⭐ ❤️ 🎄 🎉
- ✅ Hỗ trợ tiếng Việt có dấu
- ✅ Màu trắng, dễ đọc

Dễ nhớ, dễ quản lý! 🎄

