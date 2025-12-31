# 🎄 Interactive 3D Christmas Tree

Một ứng dụng Giáng sinh 3D tương tác với hand tracking sử dụng React, Three.js và MediaPipe.

## ✨ Tính năng

- 🌲 Cây thông 3D với 35,000 hạt particle
- 🖼️ Hiển thị ảnh dạng Polaroid xoay quanh cây
- 👋 Điều khiển bằng cử chỉ tay (Hand Tracking)
  - **Mở bàn tay**: Phân tán cây thông
  - **Nắm tay**: Tập hợp cây thông
  - **Pinch (chụm ngón tay)**: Xoay camera và chọn ảnh
- 🎨 Hiệu ứng hậu kỳ: Bloom, Vignette, Noise
- 📱 Responsive và tối ưu cho mobile

## 🚀 Cài đặt

```bash
# Clone repository hoặc tạo thư mục mới
cd my-christmas-tree-app

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build production
npm run build

# Preview production build
npm run preview
```

## 📁 Cấu trúc thư mục

```
my-christmas-tree-app/
├── public/
│   └── index.html              # File HTML gốc
├── src/
│   ├── components/
│   │   ├── 3d/                 # 3D Components
│   │   │   ├── ChristmasScene.jsx
│   │   │   ├── ParticleTree.jsx
│   │   │   ├── Polaroid.jsx
│   │   │   ├── CameraRig.jsx
│   │   │   └── HandRotationController.jsx
│   │   └── ui/                 # UI Components
│   │       ├── ImageViewer.jsx
│   │       ├── HandCursor.jsx
│   │       └── DebugOverlay.jsx
│   ├── services/
│   │   ├── HandTrackerService.js
│   │   └── storage.js
│   ├── store/
│   │   └── useStore.js         # Zustand store
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🎮 Cách sử dụng

1. Cho phép truy cập camera khi được yêu cầu
2. Sử dụng chuột để xoay cây (tự động xoay khi không tương tác)
3. Sử dụng cử chỉ tay:
   - Mở bàn tay → Cây phân tán
   - Nắm tay → Cây tập hợp
   - Pinch → Xoay camera hoặc chọn ảnh
4. Click vào ảnh để xem lớn hơn

## 🛠️ Công nghệ sử dụng

- **React 18** - UI Framework
- **Three.js** - 3D Graphics
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for R3F
- **@react-three/postprocessing** - Post-processing effects
- **Zustand** - State management
- **MediaPipe** - Hand tracking
- **Tailwind CSS** - Styling
- **Vite** - Build tool

## 📝 Ghi chú

- Ứng dụng yêu cầu quyền truy cập camera để sử dụng tính năng hand tracking
- Hand tracking hoạt động tốt nhất trong điều kiện ánh sáng tốt
- Tối ưu hiệu năng với 35,000 particles

## 📄 License

MIT

---

Made with ❤️ for Christmas 🎅


