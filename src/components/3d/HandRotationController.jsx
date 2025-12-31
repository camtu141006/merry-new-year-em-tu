import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import useStore from '../../store/useStore';

// --- HAND ROTATION CONTROLLER with Smoothing (Lerp) to prevent Jitter ---
const HandRotationController = ({ controlsRef }) => {
    const { handState, handCursor, isHandTrackingEnabled, isViewerOpen } = useStore();
    const { camera } = useThree();
    const prevCursor = useRef({ x: 0, y: 0 });
    const isPinchingRef = useRef(false);
    
    // NEW: Smoothed Cursor State to filter noise
    const smoothedCursor = useRef({ x: 0.5, y: 0.5 });
    
    // Reusable temporary objects to avoid GC
    const spherical = useMemo(() => new THREE.Spherical(), []);
    const offset = useMemo(() => new THREE.Vector3(), []);

    useFrame((state, delta) => {
        if (!isHandTrackingEnabled || isViewerOpen || !controlsRef.current) return;

        // 1. SMOOTHING ALGORITHM
        // We Lerp the smoothed cursor towards the real cursor
        // Factor 5.0 * delta creates a smooth but responsive feel (approx 0.1 per frame at 60fps)
        // Lower value = smoother but more lag. Higher = more responsive but more jitter.
        const smoothFactor = 5.0 * delta; 
        
        smoothedCursor.current.x = THREE.MathUtils.lerp(smoothedCursor.current.x, handCursor.x, smoothFactor);
        smoothedCursor.current.y = THREE.MathUtils.lerp(smoothedCursor.current.y, handCursor.y, smoothFactor);

        if (handState === 'pinch') {
            if (!isPinchingRef.current) {
                // Start of pinch - reset delta tracking to the current SMOOTHED position
                isPinchingRef.current = true;
                prevCursor.current = { ...smoothedCursor.current };
            } else {
                // Dragging - Use SMOOTHED delta
                const deltaX = smoothedCursor.current.x - prevCursor.current.x;
                const deltaY = smoothedCursor.current.y - prevCursor.current.y;

                // Sensitivity Multiplier (Adjusted for smoothed input)
                const rotateSpeed = 3.5; 

                // DEADZONE: Ignore microscopic movements to avoid shaking when holding still
                if (Math.abs(deltaX) > 0.0005 || Math.abs(deltaY) > 0.0005) {
                    
                    // Manual Camera Rotation using Spherical Coordinates (Robust method)
                    const target = controlsRef.current.target;
                    
                    // 1. Calculate offset vector (Camera - Target)
                    offset.copy(camera.position).sub(target);
                    
                    // 2. Convert Cartesian to Spherical (Radius, Phi, Theta)
                    spherical.setFromVector3(offset);
                    
                    // 3. Apply rotation
                    // Note: Theta is horizontal (left/right), Phi is vertical (up/down)
                    spherical.theta += deltaX * rotateSpeed;
                    spherical.phi -= deltaY * rotateSpeed;
                    
                    // 4. Restrict phi to avoid flipping at poles
                    spherical.makeSafe();
                    
                    // 5. Convert back to Cartesian
                    offset.setFromSpherical(spherical);
                    
                    // 6. Apply new position to camera
                    camera.position.copy(target).add(offset);
                    camera.lookAt(target);

                    // Update previous position ONLY if we moved (outside deadzone)
                    prevCursor.current = { ...smoothedCursor.current };
                }
            }
        } else {
            isPinchingRef.current = false;
            // When not pinching, keep the smoothed cursor synced slightly loosely
            // This ensures that when we start pinching again, we aren't too far off
        }
    });

    return null;
};

export default HandRotationController;


