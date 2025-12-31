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
        // Đánh dấu ảnh đã xem
        set(state => ({
            selectedPhotoId: id,
            isViewerOpen: true,
            photos: state.photos.map(p => 
                p.id === id ? { ...p, viewed: true } : p
            )
        }));
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

