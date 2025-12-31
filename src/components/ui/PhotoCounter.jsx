import useStore from '../../store/useStore';

// --- PHOTO COUNTER COMPONENT ---
const PhotoCounter = () => {
    const photos = useStore(s => s.photos);
    
    // Tính toán số lượng cho từng loại
    const imagePhotos = photos.filter(p => p.tag === 'image' || (p.tag === 'letter' && !p.letterId)); // Images + letters thường
    const specialLetters = photos.filter(p => p.letterId); // CHỈ 3 letters đặc biệt (có letterId)
    
    const viewedImages = imagePhotos.filter(p => p.viewed).length;
    const viewedLetters = specialLetters.filter(p => p.viewed).length; // Chỉ đếm 3 letters đặc biệt
    
    const totalImages = imagePhotos.length;
    const totalLetters = specialLetters.length; // Luôn là 3
    const totalViewed = viewedImages + viewedLetters;
    const totalPhotos = imagePhotos.length + specialLetters.length;
    
    // Check unlock status
    const needMoreImages = viewedImages < 5;
    const remainingImages = Math.max(0, 5 - viewedImages);
    
    // Check letter status
    const letter1 = photos.find(p => p.letterId === 'letter-1');
    const letter2 = photos.find(p => p.letterId === 'letter-2');
    const letter3 = photos.find(p => p.letterId === 'letter-3');
    
    const letter1Unlocked = letter1 && !letter1.locked;
    const letter1Viewed = letter1 && letter1.viewed;
    const letter2Unlocked = letter2 && !letter2.locked;
    const letter2Viewed = letter2 && letter2.viewed;
    const letter3Unlocked = letter3 && !letter3.locked;
    const letter3Viewed = letter3 && letter3.viewed;
    
    const allLettersViewed = letter1Viewed && letter2Viewed && letter3Viewed;

    return (
        <div className="fixed bottom-4 left-4 glass-panel rounded-lg p-3 z-40 pointer-events-none">
            <div className="flex flex-col gap-2 text-white font-vietnamese text-sm">
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
                    {viewedImages >= 5 && (
                        <span className="text-green-400">✓</span>
                    )}
                </div>
                
                {/* Thông báo unlock - Ưu tiên theo thứ tự */}
                {needMoreImages && (
                    <div className="mt-1 p-2 bg-yellow-500/20 rounded text-center border border-yellow-500/30">
                        <div className="text-yellow-300 text-xs font-semibold">
                            🔒 Hãy xem 5 ảnh để mở khóa lời đầu
                        </div>
                        <div className="text-yellow-200/80 text-[10px] mt-0.5">
                            ({remainingImages} ảnh nữa)
                        </div>
                    </div>
                )}
                
                {!needMoreImages && letter1Unlocked && !letter1Viewed && (
                    <div className="mt-1 p-2 bg-pink-500/20 rounded text-center border border-pink-500/30">
                        <div className="text-pink-300 text-xs font-semibold">
                            💌 Hãy xem lời đầu
                        </div>
                        <div className="text-pink-200/80 text-[10px] mt-0.5">
                            để mở khóa lời giữa
                        </div>
                    </div>
                )}
                
                {letter1Viewed && letter2Unlocked && !letter2Viewed && (
                    <div className="mt-1 p-2 bg-purple-500/20 rounded text-center border border-purple-500/30">
                        <div className="text-purple-300 text-xs font-semibold">
                            💌 Hãy xem lời giữa
                        </div>
                        <div className="text-purple-200/80 text-[10px] mt-0.5">
                            để mở khóa lời kết
                        </div>
                    </div>
                )}
                
                {letter2Viewed && letter3Unlocked && !letter3Viewed && (
                    <div className="mt-1 p-2 bg-blue-500/20 rounded text-center border border-blue-500/30 animate-pulse">
                        <div className="text-blue-300 text-xs font-semibold">
                            💌 Hãy xem lời kết
                        </div>
                        <div className="text-blue-200/80 text-[10px] mt-0.5">
                            để hoàn thành hành trình
                        </div>
                    </div>
                )}
                
                {/* Letters - Luôn hiện 0/3 từ đầu */}
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

                {/* Happy New Year - Khi xem hết 3 letters */}
                {allLettersViewed && (
                    <div className="mt-2 pt-2 border-t border-gold-luxury/30 text-center">
                        <div className="text-gold-400 font-bold text-base animate-pulse mb-1">
                            🎆 Happy New Year 🎆
                        </div>
                        <div className="text-gold-300/80 text-[10px]">
                            Chúc em năm mới hạnh phúc! ✨
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PhotoCounter;


