import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import useStore from '../../store/useStore';

// --- CAMERA CONTROLLER ---
const CameraRig = () => {
    const treeState = useStore(s => s.treeState);
    const { camera } = useThree();

    useFrame((state, delta) => {
        const targetDist = treeState === 'assembled' ? 12 : 0.2;
        const currentPos = state.camera.position;
        const currentDist = currentPos.length();
        const newDist = THREE.MathUtils.lerp(currentDist, targetDist, delta * 1.5);
        state.camera.position.setLength(newDist);
    });
    
    return null;
};

export default CameraRig;

