import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { audioController } from '../../core/audio/AudioController';

// A simple Procedural Flower Geometry (reference = Blender Geo Nodes)
const FlowerGeometry = () => {
    // We compose a flower from a center sphere and a few petal spheres
    const geom = new THREE.BufferGeometry();

    // Instead of a full custom buffer which is heavy, we'll use a simpler
    // approach: we'll instantiate standard geometries inside the component.
    return null;
}

const FloatingFlowers = ({ count = 100 }) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    // Generate random initial positions, rotations, and scales for the flowers
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 60;
            const y = (Math.random() - 0.5) * 60;
            const z = -15 - Math.random() * 30; // Strictly far behind the dancer
            const rx = Math.random() * Math.PI;
            const ry = Math.random() * Math.PI;
            const rz = Math.random() * Math.PI;
            const scale = Math.random() * 0.8 + 0.2;
            const speed = Math.random() * 0.01 + 0.005;
            temp.push({ x, y, z, rx, ry, rz, scale, speed });
        }
        return temp;
    }, [count]);

    useFrame(() => {
        if (!meshRef.current) return;

        // Get live audio data to make them react
        const { average } = audioController.getAudioData();
        const audioBoost = (average / 255) * 0.05;

        // Update each instance
        particles.forEach((particle, i) => {
            // Drift upwards and rotate
            particle.y += particle.speed + (audioBoost * 0.5);
            particle.rx += 0.01;
            particle.ry += 0.01;

            // Loop back to bottom if they float too high
            if (particle.y > 20) {
                particle.y = -20;
            }

            // Apply transforms to the dummy object
            dummy.position.set(particle.x, particle.y, particle.z);
            dummy.rotation.set(particle.rx, particle.ry, particle.rz);

            // Pulse size with the beat
            const currentScale = particle.scale + (audioBoost * particle.scale * 2);
            dummy.scale.set(currentScale, currentScale, currentScale);

            dummy.updateMatrix();

            // Set the matrix for this specific instance
            meshRef.current?.setMatrixAt(i, dummy.matrix);
        });

        // Tell the instanced mesh it needs to update
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <torusKnotGeometry args={[0.3, 0.1, 64, 8, 2, 5]} />
            <meshStandardMaterial
                color="#ff69b4"
                roughness={0.2}
                metalness={0.1}
                emissive="#ff1493"
                emissiveIntensity={0.5}
            />
        </instancedMesh>
    );
};

export default FloatingFlowers;
