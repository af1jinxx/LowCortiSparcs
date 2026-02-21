import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { audioController } from '../../core/audio/AudioController';

const SimpleVisualizer = () => {
    const meshRef = useRef<Mesh>(null);

    useFrame(() => {
        if (meshRef.current) {
            const { average } = audioController.getAudioData();

            // Simple reactivity: scale based on volume
            // Map average (0-255) to scale (1-3)
            const scale = 1 + (average / 255) * 2;

            meshRef.current.scale.set(scale, scale, scale);

            // Rotate for some life
            meshRef.current.rotation.x += 0.01;
            meshRef.current.rotation.y += 0.01;
        }
    });

    return (
        <mesh ref={meshRef}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="hotpink" wireframe />
        </mesh>
    );
};

export default SimpleVisualizer;
