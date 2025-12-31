import useStore from '../../store/useStore';

// --- DEBUG OVERLAY COMPONENT ---
const DebugOverlay = () => {
    const { handState, handCursor, debugMode, pinchDistance } = useStore();
    if (!debugMode) return null;

    return (
        <div className="fixed top-4 right-4 bg-black/80 p-4 rounded text-xs text-green-400 font-mono z-50 pointer-events-none border border-green-900">
            <div>Hand State: {handState}</div>
            <div>Cursor X: {handCursor.x.toFixed(2)}</div>
            <div>Cursor Y: {handCursor.y.toFixed(2)}</div>
            <div>Pinch Dist: {pinchDistance.toFixed(3)}</div>
        </div>
    );
};

export default DebugOverlay;


