import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import useStore from '../../store/useStore';
import CameraRig from './CameraRig';
import HandRotationController from './HandRotationController';
import ParticleTree from './ParticleTree';
import Polaroid from './Polaroid';

// --- CHRISTMAS SCENE COMPONENT ---
const ChristmasScene = () => {
    const photos = useStore(s => s.photos);
    const { handState } = useStore();
    const controlsRef = useRef();

    // Logic: Auto Rotate is ON unless we are currently pinching to drag
    const shouldAutoRotate = handState !== 'pinch';

    return (
        <Canvas 
            shadows 
            camera={{ position: [0, 0, 12], fov: 60 }} 
            gl={{ 
                preserveDrawingBuffer: true,
                antialias: true,
                alpha: false,
                powerPreference: 'high-performance'
            }}
            dpr={[1, 1.5]}
        >
            <CameraRig />
            
            {/* Hand Rotation Controller Logic */}
            <HandRotationController controlsRef={controlsRef} />

            <color attach="background" args={['#050505']} />
            <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
            <fog attach="fog" args={['#050505', 8, 30]} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#D4AF37" />
            
            <ParticleTree />
            
            <group>
                {photos.map((photo, i) => (
                    <Polaroid key={photo.id} photo={photo} index={i} count={photos.length} />
                ))}
            </group>

            <OrbitControls 
                ref={controlsRef}
                enablePan={false} 
                minDistance={0.1} 
                maxDistance={20} 
                autoRotate={shouldAutoRotate} 
                autoRotateSpeed={0.5} 
                dampingFactor={0.05} 
                rotateSpeed={0.5}
            />
            
            <EffectComposer disableNormalPass>
                <Bloom luminanceThreshold={0.6} mipmapBlur intensity={0.8} radius={0.4} />
                <Noise opacity={0.03} />
                <Vignette eskil={false} offset={0.1} darkness={1.0} />
            </EffectComposer>
        </Canvas>
    );
};

export default ChristmasScene;

