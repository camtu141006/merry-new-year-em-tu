import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import useStore from '../../store/useStore';

// --- CONSTANTS ---
// Reduced from 35000 to 12000 for better performance
const PARTICLE_COUNT = 12000;

// --- PARTICLE TREE COMPONENT ---
const ParticleTree = () => {
    const treeState = useStore(s => s.treeState);
    const pointsRef = useRef();
    
    const particles = useMemo(() => {
        const pos = new Float32Array(PARTICLE_COUNT * 3);
        const targetPos = new Float32Array(PARTICLE_COUNT * 3);
        const dispersePos = new Float32Array(PARTICLE_COUNT * 3);
        const colors = new Float32Array(PARTICLE_COUNT * 3);
        const colorPalette = [
            new THREE.Color('#0B3B24'), 
            new THREE.Color('#D4AF37'), 
            new THREE.Color('#ffffff')
        ];

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const theta = Math.random() * Math.PI * 2 * 15;
            const y = Math.random() * 10 - 5; 
            const radius = (5 - y) * 0.4 * Math.random();
            targetPos[i * 3] = Math.cos(theta) * radius;
            targetPos[i * 3 + 1] = y;
            targetPos[i * 3 + 2] = Math.sin(theta) * radius;

            const phi = Math.acos(2 * Math.random() - 1);
            const theta2 = Math.random() * Math.PI * 2;
            const r = 12 + Math.random() * 8; 
            
            dispersePos[i * 3] = r * Math.sin(phi) * Math.cos(theta2);
            dispersePos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta2);
            dispersePos[i * 3 + 2] = r * Math.cos(phi);

            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            pos[i * 3] = targetPos[i * 3];
            pos[i * 3 + 1] = targetPos[i * 3 + 1];
            pos[i * 3 + 2] = targetPos[i * 3 + 2];
        }
        return { pos, targetPos, dispersePos, colors };
    }, []);

    useFrame((state, delta) => {
        if (!pointsRef.current) return;
        const positions = pointsRef.current.geometry.attributes.position.array;
        const target = treeState === 'assembled' ? particles.targetPos : particles.dispersePos;
        const speed = treeState === 'assembled' ? 2.5 : 1.0; 

        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const idx = i * 3;
            positions[idx] += (target[idx] - positions[idx]) * delta * speed;
            positions[idx+1] += (target[idx+1] - positions[idx+1]) * delta * speed;
            positions[idx+2] += (target[idx+2] - positions[idx+2]) * delta * speed;
            
            if (treeState === 'assembled') {
                positions[idx+1] += Math.sin(state.clock.elapsedTime + positions[idx]) * 0.005;
            } else {
                positions[idx] += Math.sin(state.clock.elapsedTime * 0.2 + idx) * 0.001;
            }
        }
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
        pointsRef.current.rotation.y += delta * 0.05;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={PARTICLE_COUNT} array={particles.pos} itemSize={3} />
                <bufferAttribute attach="attributes-color" count={PARTICLE_COUNT} array={particles.colors} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial 
                size={0.07} 
                vertexColors 
                transparent 
                opacity={0.6} 
                sizeAttenuation 
                blending={THREE.AdditiveBlending} 
                depthWrite={false} 
            />
        </points>
    );
};

export default ParticleTree;

