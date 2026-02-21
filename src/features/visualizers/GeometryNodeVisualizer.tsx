import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { audioController } from '../../core/audio/AudioController';

const GeometryNodeVisualizer = () => {
    // Load the GLTF file from the public directory
    const { scene } = useGLTF('/Audio Visual - Rings and Cubes.glb');
    const groupRef = useRef<THREE.Group>(null);

    // Apply materials and hide the backdrop once on load
    useEffect(() => {
        if (!scene) return;

        scene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                // Hide the massive black backdrop bounding box
                if (child.name.includes('BACKDROP') || child.name.includes('Backdrop')) {
                    child.visible = false;
                }

                // Ensure materials are side-rendered properly if needed
                if (child.material) {
                    child.material.side = THREE.DoubleSide;
                    // Optional: increase metalness for a cooler look
                    if (child.material.metalness !== undefined) {
                        child.material.metalness = 0.8;
                        child.material.roughness = 0.2;
                    }
                }
            }
        });
    }, [scene]);

    // Audio reactive animation loop
    useFrame(() => {
        if (!groupRef.current) return;

        // Get live audio data
        const { average } = audioController.getAudioData();

        // The simplest universal reactivity:
        // Scale the entire group based on the average volume
        const scale = 1 + (average / 255) * 0.5;

        // Apply smooth interpolation for scale
        groupRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);

        // Add a slow, constant rotation for ambiance
        groupRef.current.rotation.y += 0.002;
        groupRef.current.rotation.x += 0.001;
    });

    return (
        <group ref={groupRef}>
            {/* Render the loaded scene */}
            <primitive object={scene} />
        </group>
    );
};

// Preload the model for faster initial display
useGLTF.preload('/Audio Visual - Rings and Cubes.glb');

export default GeometryNodeVisualizer;
