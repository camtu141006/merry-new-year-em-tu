import useStore from '../../store/useStore';

// --- IMAGE VIEWER COMPONENT ---
const ImageViewer = () => {
    const { isViewerOpen, selectedPhotoId, photos, closeViewer } = useStore();
    const photo = photos.find(p => p.id === selectedPhotoId);

    if (!isViewerOpen || !photo) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md" onClick={closeViewer}>
            <div className="relative p-4 bg-white transform rotate-1 transition-all duration-300 scale-100 max-w-4xl max-h-[90vh] shadow-[0_0_50px_rgba(212,175,55,0.5)]" onClick={e => e.stopPropagation()}>
                <div className="border-8 border-white border-b-[60px] shadow-2xl">
                    <img 
                        src={photo.url} 
                        alt="Memory" 
                        className="max-h-[70vh] object-contain" 
                        onError={(e) => { 
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWRlZGVkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjMzMzIj5JbWFnZSBFcnJvcjwvdGV4dD48L3N2Zz4='; 
                        }} 
                    />
                    <div className="absolute bottom-[-50px] left-0 w-full text-center font-vietnamese text-white text-2xl font-semibold drop-shadow-lg">
                        {photo.caption || "Merry Christmas"}
                    </div>
                </div>
                <button onClick={closeViewer} className="absolute -top-10 right-0 text-white hover:text-gold-400 text-4xl">&times;</button>
            </div>
        </div>
    );
};

export default ImageViewer;

