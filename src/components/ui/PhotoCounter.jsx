import useStore from '../../store/useStore';

// --- PHOTO COUNTER COMPONENT ---
const PhotoCounter = () => {
    const photos = useStore(s => s.photos);
    
    // Tính toán số lượng cho từng loại
    const imagePhotos = photos.filter(p => p.tag === 'image');
    const letterPhotos = photos.filter(p => p.tag === 'letter');
    
    const viewedImages = imagePhotos.filter(p => p.viewed).length;
    const viewedLetters = letterPhotos.filter(p => p.viewed).length;
    
    const totalImages = imagePhotos.length;
    const totalLetters = letterPhotos.length;
    const totalViewed = viewedImages + viewedLetters;
    const totalPhotos = photos.length;

    return (
        <div className="fixed bottom-4 left-4 glass-panel rounded-lg p-3 z-40 pointer-events-none">
            <div className="flex flex-col gap-2 text-white font-sans text-sm">
                {/* Tổng quan */}
                <div className="flex items-center gap-2 pb-2 border-b border-gold-luxury/30">
                    <span className="text-gold-400 font-bold text-lg">
                        {totalViewed}/{totalPhotos}
                    </span>
                    <span className="text-gray-300 text-xs">Đã xem</span>
                </div>
                
                {/* Images */}
                <div className="flex items-center gap-2">
                    <span className="text-xl">🖼️</span>
                    <span className="text-blue-400 font-semibold">
                        {viewedImages}/{totalImages}
                    </span>
                    <span className="text-gray-400 text-xs">Images</span>
                    {viewedImages === totalImages && totalImages > 0 && (
                        <span className="text-green-400">✓</span>
                    )}
                </div>
                
                {/* Letters */}
                <div className="flex items-center gap-2">
                    <span className="text-xl">✉️</span>
                    <span className="text-pink-400 font-semibold">
                        {viewedLetters}/{totalLetters}
                    </span>
                    <span className="text-gray-400 text-xs">Letters</span>
                    {viewedLetters === totalLetters && totalLetters > 0 && (
                        <span className="text-green-400">✓</span>
                    )}
                </div>

                {/* Hoàn thành 100% */}
                {totalViewed === totalPhotos && totalPhotos > 0 && (
                    <div className="mt-2 pt-2 border-t border-gold-luxury/30 text-center">
                        <span className="text-gold-400 font-bold text-sm animate-pulse">
                            🎉 Đã xem hết!
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PhotoCounter;


