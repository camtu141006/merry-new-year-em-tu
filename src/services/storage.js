import { get as idbGet } from 'idb-keyval';
import { v4 as uuidv4 } from 'uuid';
import useStore from '../store/useStore';

// --- DEFAULT PHOTOS ---
// Danh sách ảnh với caption và tag
// tag: "image" (ảnh thông thường) hoặc "letter" (thư/thiệp)
export const DEFAULT_PHOTOS = [
    { url: "/photos/1.jpg", caption: "you make me smile", tag: "image" },
    { url: "/photos/2.jpg", caption: "í! Anh còn giữ cái tai thỏ này!", tag: "image" },
    { url: "/photos/3.jpg", caption: "Em phồng má ^^", tag: "image" },
    { url: "/photos/4.jpg", caption: "Nó to z nè", tag: "letter" },
    { url: "/photos/5.jpg", caption: "lạy anh TIến cho em học", tag: "image" },
    { url: "/photos/6.jpg", caption: "Anh chuẩn bị ra mắt em ^^!", tag: "image" },
    { url: "/photos/7.jpg", caption: "Nàng thơ ngẩn ngơ", tag: "image" },
    { url: "/photos/8.jpg", caption: "\"Anh nhìn kĩ chưa?\"", tag: "image" },
    { url: "/photos/9.jpg", caption: "\"Im lặng cho em\"", tag: "image" },
    { url: "/photos/10.jpg", caption: "Quý's tộc's", tag: "image" },
    { url: "/photos/11.jpg", caption: "Anh thích nhất là nhìn em cười đó ^^", tag: "image" },
    { url: "/photos/12.jpg", caption: "Anh thích tấm này nhất luôn đó", tag: "image" },
    { url: "/photos/13.jpg", caption: "Làm trò với em", tag: "image" },
    { url: "/photos/14.jpg", caption: "Anh thích tấm này nữa!", tag: "image" },
    { url: "/photos/15.jpg", caption: "Cùng em ôn bài đi thi", tag: "image" },
    { url: "/photos/16.jpg", caption: "Dễ thương! Dễ thương! Dễ thương!", tag: "image" },
    { url: "/photos/17.jpg", caption: "Nắng làm má em thêm hồng", tag: "letter" },
    { url: "/photos/18.jpg", caption: "Em tạo dáng đáng iu ghê", tag: "image" },
    { url: "/photos/19.jpg", caption: "Thế này khối anh đổ em mất ^^", tag: "image" },
    { url: "/photos/20.jpg", caption: "Quậy nhưng mà vui ^^", tag: "image" },
    { url: "/photos/21.jpg", caption: "Vườn thú của em Tú", tag: "image" },
    // 3 Letters ẩn - cần xem 15 ảnh để unlock
    { url: "/photos/22.jpg", caption: "Lời đầu", tag: "letter", letterId: "letter-1", locked: true },
    { url: "/photos/23.jpg", caption: "Lời giữa", tag: "letter", letterId: "letter-2", locked: true },
    { url: "/photos/24.jpg", caption: "Lời kết", tag: "letter", letterId: "letter-3", locked: true },
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
            letterId: photo.letterId, // letter-1, letter-2, letter-3
            locked: photo.locked || false, // Letters bị khóa ban đầu
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
            letterId: photo.letterId,
            locked: photo.locked || false,
            viewed: false,
            isDefault: true
        })));
    }
};

