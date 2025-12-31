import { useRef, useState, Suspense } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Image as DreiImage, Text } from '@react-three/drei';
import * as THREE from 'three';
import useStore from '../../store/useStore';

// --- SAFE POLAROID IMAGE COMPONENT ---
const SafePolaroidImage = ({ url }) => (
    <DreiImage url={url} position={[0, 0.15, 0]} scale={[1, 1]} transparent />
);

// --- POLAROID COMPONENT ---
const Polaroid = ({ photo, index, count }) => {
    const meshRef = useRef();
    const [hovered, setHover] = useState(false);
    const selectPhoto = useStore(s => s.selectPhoto);
    const { camera, raycaster } = useThree();
    
    const yTree = -4.0 + ((index / count) * 7.0); 
    const angleTree = index * 2.4; 
    const radiusTree = Math.max(0.5, (5 - yTree) * 0.4 * 0.75); 
    const posTree = new THREE.Vector3(
        Math.cos(angleTree) * radiusTree,
        yTree,
        Math.sin(angleTree) * radiusTree
    );
    const scaleTree = 0.4; 

    const phi = Math.acos(1 - 2 * (index + 0.5) / count);
    const theta = Math.PI * (1 + Math.sqrt(5)) * (index + 0.5);
    const radiusSphere = 10.0; 
    const posSphere = new THREE.Vector3(
        radiusSphere * Math.sin(phi) * Math.cos(theta),
        radiusSphere * Math.cos(phi),
        radiusSphere * Math.sin(phi) * Math.sin(theta)
    );
    const scaleSphere = 2.0;

    const currentPos = useRef(posTree.clone());
    const currentScale = useRef(scaleTree);

    useFrame((state, delta) => {
        if (!meshRef.current) return;
        const { treeState, handCursor, handState, isHandTrackingEnabled, isViewerOpen } = useStore.getState();

        const targetPos = treeState === 'assembled' ? posTree : posSphere;
        const targetScale = treeState === 'assembled' ? scaleTree : scaleSphere;

        currentPos.current.lerp(targetPos, delta * 2.0);
        currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale, delta * 2.0);

        meshRef.current.position.copy(currentPos.current);
        
        if (treeState === 'assembled') {
             meshRef.current.position.y += Math.sin(state.clock.elapsedTime + index) * 0.005;
        }

        meshRef.current.lookAt(0, 0, 0); 
        
        if (treeState === 'assembled') {
            meshRef.current.rotation.y += Math.PI; 
        }

        const hoverScale = hovered ? 1.2 : 1.0;
        const finalScale = currentScale.current * hoverScale;
        meshRef.current.scale.set(finalScale, finalScale, finalScale);

        if (isHandTrackingEnabled) {
            const ndcX = (handCursor.x * 2) - 1;
            const ndcY = -(handCursor.y * 2) + 1;
            raycaster.setFromCamera({ x: ndcX, y: ndcY }, camera);
            const intersects = raycaster.intersectObject(meshRef.current, true);
            const isIntersected = intersects.length > 0;
            if (isIntersected !== hovered) setHover(isIntersected);
            // Chỉ chọn ảnh khi có Pinch gesture 🤏
            if (isIntersected && handState === 'pinch' && !isViewerOpen) {
                selectPhoto(photo.id);
            }
        }
    });

    return (
        <group 
            ref={meshRef}
            onClick={(e) => { e.stopPropagation(); selectPhoto(photo.id); }}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
        >
            <mesh position={[0, 0, -0.01]}>
                <planeGeometry args={[1.2, 1.5]} />
                <meshStandardMaterial color="#fdfdfd" roughness={0.8} />
            </mesh>
            <Suspense fallback={<mesh><planeGeometry args={[1,1]} /><meshBasicMaterial color="gray"/></mesh>}>
                <SafePolaroidImage url={photo.url} />
            </Suspense>
            <mesh position={[0, -0.5, 0]}>
                 <planeGeometry args={[1, 0.2]} />
                 <meshBasicMaterial color="#f0f0f0" />
            </mesh>
            {/* Text Caption - White color */}
            {photo.caption && (
                <Text
                    position={[0, -0.5, 0.01]}
                    fontSize={0.08}
                    color="#ffffff"
                    anchorX="center"
                    anchorY="middle"
                    maxWidth={1.0}
                >
                    {photo.caption}
                </Text>
            )}
        </group>
    );
};

export default Polaroid;

