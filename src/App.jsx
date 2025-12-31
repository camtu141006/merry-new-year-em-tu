import { useEffect, useRef } from 'react';
import ChristmasScene from './components/3d/ChristmasScene';
import ImageViewer from './components/ui/ImageViewer';
import HandCursor from './components/ui/HandCursor';
import DebugOverlay from './components/ui/DebugOverlay';
import PhotoCounter from './components/ui/PhotoCounter';
import HandTrackerService from './services/HandTrackerService';
import { initStorage } from './services/storage';

// Initialize Hand Tracker Service
const handService = new HandTrackerService();

// --- APP COMPONENT ---
const App = () => {
    const videoRef = useRef(null);

    useEffect(() => {
        initStorage();
        
        const startVideo = async () => {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                try {
                    await handService.init();
                    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        videoRef.current.addEventListener('loadeddata', () => {
                            handService.start(videoRef.current);
                        });
                    }
                } catch (err) {
                    console.error("Camera error:", err);
                }
            }
        };
        startVideo();
    }, []);

    return (
        <>
            <ChristmasScene />
            <ImageViewer />
            <HandCursor />
            <DebugOverlay />
            <PhotoCounter />
            <video 
                ref={videoRef} 
                className="fixed bottom-4 right-4 w-48 h-36 object-cover rounded-lg border-2 border-gold-500 shadow-lg opacity-90 hover:opacity-100 transition-all z-40 pointer-events-none" 
                autoPlay 
                playsInline 
                muted 
                style={{ transform: 'scaleX(-1)' }} 
            />
        </>
    );
};

export default App;

