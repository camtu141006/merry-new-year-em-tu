import { create } from 'zustand';
import { set as idbSet, del as idbDel } from 'idb-keyval';

// --- STATE MANAGEMENT (Zustand) ---
const useStore = create((set, get) => ({
    // Scene State
    treeState: 'assembled', // 'assembled' | 'dispersed'
    toggleTree: () => set(state => ({ treeState: state.treeState === 'assembled' ? 'dispersed' : 'assembled' })),
    
    // Photo Data
    photos: [],
    selectedPhotoId: null,
    isViewerOpen: false,
    
    // Hand Tracking State
    handState: 'idle',
    handCursor: { x: 0.5, y: 0.5 },
    isHandTrackingEnabled: true,
    pinchDistance: 0,
    
    // Debug
    debugMode: false,
    
    // Actions
    addPhotos: async (newPhotos) => {
        const current = get().photos;
        // Add to IndexedDB
        for (let p of newPhotos) {
            if (p.blob) await idbSet(`photo-${p.id}`, p.blob);
        }
        set({ photos: [...current, ...newPhotos] });
    },
    removePhoto: async (id) => {
        await idbDel(`photo-${id}`);
        set(state => ({ photos: state.photos.filter(p => p.id !== id) }));
    },
    setPhotos: (photos) => set({ photos }),
    selectPhoto: (id) => {
        set(state => {
            // Đánh dấu ảnh đã xem
            let updatedPhotos = state.photos.map(p => 
                p.id === id ? { ...p, viewed: true } : p
            );

            // Logic unlock letters
            // Đếm images + letters thường (không có letterId) - phải khớp với PhotoCounter
            const images = updatedPhotos.filter(p => p.tag === 'image' || (p.tag === 'letter' && !p.letterId));
            const viewedImages = images.filter(p => p.viewed);
            const viewedImageCount = viewedImages.length;

            // Đếm xem đã xem letter nào chưa
            const letter1Viewed = updatedPhotos.find(p => p.letterId === 'letter-1')?.viewed;
            const letter2Viewed = updatedPhotos.find(p => p.letterId === 'letter-2')?.viewed;

            // Unlock letter-1 nếu đã xem 5 ảnh
            if (viewedImageCount >= 5) {
                updatedPhotos = updatedPhotos.map(p => 
                    p.letterId === 'letter-1' ? { ...p, locked: false } : p
                );
            }

            // Unlock letter-2 nếu đã xem letter-1
            if (letter1Viewed) {
                updatedPhotos = updatedPhotos.map(p => 
                    p.letterId === 'letter-2' ? { ...p, locked: false } : p
                );
            }

            // Unlock letter-3 nếu đã xem letter-2
            if (letter2Viewed) {
                updatedPhotos = updatedPhotos.map(p => 
                    p.letterId === 'letter-3' ? { ...p, locked: false } : p
                );
            }

            return {
                selectedPhotoId: id,
                isViewerOpen: true,
                photos: updatedPhotos
            };
        });
    },
    closeViewer: () => set({ isViewerOpen: false, selectedPhotoId: null }),
    updateHandState: (state, cursor, distance) => set({ 
        handState: state, 
        handCursor: cursor,
        pinchDistance: distance 
    }),
    setTreeState: (state) => set({ treeState: state }),
    toggleDebug: () => set(state => ({ debugMode: !state.debugMode })),
    toggleHandTracking: () => set(state => ({ isHandTrackingEnabled: !state.isHandTrackingEnabled }))
}));

export default useStore;

