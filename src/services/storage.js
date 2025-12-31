import { get as idbGet } from 'idb-keyval';
import { v4 as uuidv4 } from 'uuid';
import useStore from '../store/useStore';

// --- DEFAULT PHOTOS ---
// Danh sách ảnh với caption và tag
// tag: "image" (ảnh thông thường) hoặc "letter" (thư/thiệp)
export const DEFAULT_PHOTOS = [
    { url: "/photos/1.jpg", caption: "Kỷ niệm 2024", tag: "image" },
    { url: "/photos/2.jpg", caption: "Gia đình", tag: "image" },
    { url: "/photos/3.jpg", caption: "Du lịch", tag: "image" },
    { url: "/photos/4.jpg", caption: "Bạn bè", tag: "letter" },
    { url: "/photos/5.jpg", caption: "Sinh nhật", tag: "image" },
    { url: "/photos/6.jpg", caption: "Tết 2024", tag: "image" },
    { url: "/photos/7.jpg", caption: "Đà Lạt", tag: "image" },
    { url: "/photos/8.jpg", caption: "Trường cũ", tag: "letter" },
    { url: "/photos/9.jpg", caption: "Kỷ niệm", tag: "image" },
    { url: "/photos/10.jpg", caption: "Hạnh phúc", tag: "image" },
    { url: "/photos/11.jpg", caption: "Yêu thương", tag: "letter" },
    { url: "/photos/12.jpg", caption: "Vui vẻ", tag: "image" },
    { url: "/photos/13.jpg", caption: "Ấm áp", tag: "image" },
    { url: "/photos/14.jpg", caption: "Mãi mãi", tag: "letter" },
    { url: "/photos/15.jpg", caption: "Merry Xmas", tag: "image" },
    { url: "/photos/16.jpg", caption: "Khoảnh khắc", tag: "image" },
    { url: "/photos/17.jpg", caption: "Thư gửi", tag: "letter" },
    { url: "/photos/18.jpg", caption: "Đáng nhớ", tag: "image" },
    { url: "/photos/19.jpg", caption: "Tình bạn", tag: "image" },
    { url: "/photos/20.jpg", caption: "Ngày vui", tag: "image" },
    
    // Thêm ảnh mới ở đây:
    // { url: "/photos/anh-gia-dinh.jpg", caption: "Gia đình sum họp", tag: "image" },
    // { url: "/photos/thu-gui-em.jpg", caption: "Thư gửi Em", tag: "letter" },
];

// --- STORAGE INITIALIZATION ---
export const initStorage = async () => {
    const storedKeys = await idbGet('photo-keys') || [];
    if (storedKeys.length === 0) {
        const initialPhotos = DEFAULT_PHOTOS.map(photo => ({
            id: uuidv4(),
            url: photo.url,
            caption: photo.caption,
            tag: photo.tag || 'image',
            viewed: false,
            isDefault: true
        }));
        useStore.getState().setPhotos(initialPhotos);
    } else {
        useStore.getState().setPhotos(DEFAULT_PHOTOS.map(photo => ({
            id: uuidv4(),
            url: photo.url,
            caption: photo.caption,
            tag: photo.tag || 'image',
            viewed: false,
            isDefault: true
        })));
    }
};

