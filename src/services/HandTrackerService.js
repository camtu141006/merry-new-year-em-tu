import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import useStore from '../store/useStore';

// --- HAND TRACKING SERVICE ---
class HandTrackerService {
    constructor() {
        this.handLandmarker = undefined;
        this.video = null;
        this.lastVideoTime = -1;
        this.rafId = null;
        this.pinchThresholdOn = 0.05;
        this.pinchThresholdOff = 0.08;
        this.isPinching = false;
    }

    async init() {
        const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.9/wasm"
        );
        this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
                delegate: "GPU"
            },
            runningMode: "VIDEO",
            numHands: 1
        });
    }

    async start(videoElement) {
        this.video = videoElement;
        this.loop();
    }

    loop = () => {
        if (useStore.getState().isHandTrackingEnabled && this.video && this.handLandmarker) {
            let startTimeMs = performance.now();
            if (this.video.currentTime !== this.lastVideoTime) {
                this.lastVideoTime = this.video.currentTime;
                const results = this.handLandmarker.detectForVideo(this.video, startTimeMs);
                this.processResults(results);
            }
        }
        this.rafId = requestAnimationFrame(this.loop);
    }

    processResults(results) {
        if (results.landmarks && results.landmarks.length > 0) {
            const landmarks = results.landmarks[0];
            const indexTip = landmarks[8];
            const thumbTip = landmarks[4];
            const wrist = landmarks[0];
            
            const cursorX = 1 - indexTip.x; // Mirror
            const cursorY = indexTip.y;

            // 1. Calculate Pinch Distance
            const distance = Math.sqrt(
                Math.pow(indexTip.x - thumbTip.x, 2) + 
                Math.pow(indexTip.y - thumbTip.y, 2) +
                Math.pow(indexTip.z - thumbTip.z, 2)
            );

            // 2. Helper: Check if a finger is curled (Tip closer to Wrist than PIP joint)
            const isFingerCurled = (tipIdx, pipIdx) => {
                const dTip = Math.hypot(landmarks[tipIdx].x - wrist.x, landmarks[tipIdx].y - wrist.y);
                const dPip = Math.hypot(landmarks[pipIdx].x - wrist.x, landmarks[pipIdx].y - wrist.y);
                return dTip < dPip;
            };

            const indexCurled = isFingerCurled(8, 6);
            const middleCurled = isFingerCurled(12, 10);
            const ringCurled = isFingerCurled(16, 14);
            const pinkyCurled = isFingerCurled(20, 18);

            // 3. Determine Gesture Priority
            let gesture = 'idle';

            // PRIORITY 1: VICTORY GESTURE ✌️ (Index + Middle extended, Ring + Pinky curled)
            // Used for selecting photos
            const isVictory = !indexCurled && !middleCurled && ringCurled && pinkyCurled;

            if (isVictory) {
                gesture = 'victory';
                this.isPinching = false;
            } else {
                // PRIORITY 2: CLOSED FIST (All main fingers curled)
                const isFist = indexCurled && middleCurled && ringCurled && pinkyCurled;

                if (isFist) {
                    gesture = 'closed_fist';
                    this.isPinching = false;
                } else {
                    // PRIORITY 3: PINCH (for rotating camera only)
                    // Hysteresis logic
                    if (!this.isPinching && distance < this.pinchThresholdOn) {
                        this.isPinching = true;
                    } else if (this.isPinching && distance > this.pinchThresholdOff) {
                        this.isPinching = false;
                    }

                    if (this.isPinching) {
                        gesture = 'pinch';
                    } else {
                        // PRIORITY 4: OPEN PALM
                        // If not fist and not pinch, check if fingers are extended
                        // Require at least 3 fingers to be extended to trigger disperse
                        const extendedCount = (!indexCurled ? 1 : 0) + (!middleCurled ? 1 : 0) + (!ringCurled ? 1 : 0) + (!pinkyCurled ? 1 : 0);
                        if (extendedCount >= 3) {
                            gesture = 'open_palm';
                        }
                    }
                }
            }

            // Update Store
            useStore.getState().updateHandState(gesture, { x: cursorX, y: cursorY }, distance);

            // Trigger Actions based on Gesture
            if (gesture === 'open_palm') {
                useStore.getState().setTreeState('dispersed');
                if (useStore.getState().isViewerOpen) useStore.getState().closeViewer();
            }
            if (gesture === 'closed_fist') {
                useStore.getState().setTreeState('assembled');
            }
        } else {
            // Keep last cursor position
        }
    }
}

export default HandTrackerService;

