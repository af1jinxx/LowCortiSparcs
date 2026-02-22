import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useFBX } from '@react-three/drei';
import * as THREE from 'three';
import { audioController } from '../../core/audio/AudioController';
import { useAudioStore } from '../../store/useAudioStore';

const FBXVisualizer = () => {
    // loding the FBX file gikan sa public directory
    const fbx = useFBX('/Hip Hop Dancing (1).fbx');
    const groupRef = useRef<THREE.Group>(null);
    const mixerRef = useRef<THREE.AnimationMixer | null>(null);

    // audio play to sync anination
    const isPlaying = useAudioStore((state) => state.isPlaying);

    // Set up material and animation mixer once on load
    useEffect(() => {
        if (!fbx) return;

        fbx.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(mat => mat.side = THREE.DoubleSide);
                    } else {
                        child.material.side = THREE.DoubleSide;
                    }
                }
            }
        });

        // animation mixer setup
        if (fbx.animations && fbx.animations.length > 0) {
            const mixer = new THREE.AnimationMixer(fbx);
            // Play the first animation found in the FBX (the skeleton mesh)
            const action = mixer.clipAction(fbx.animations[0]);
            action.play();
            mixerRef.current = mixer;
        }

        return () => {
            if (mixerRef.current) {
                mixerRef.current.stopAllAction();
            }
        }
    }, [fbx]);

    // reactive na animation loop
    useFrame((_, delta) => {
        if (!groupRef.current) return;

        // kuha ug live audio data
        const { average } = audioController.getAudioData();

        // Audio Reactivity (so need mag vary ang size depende sa beat)
        // Adjust the base scale depending on how big the FBX is naturally

        const baseScale = 0.02;
        const reactScale = baseScale + (average / 255) * 0.01;

        groupRef.current.scale.lerp(new THREE.Vector3(reactScale, reactScale, reactScale), 0.1);

        // play animation ONLY if audio is playing, or drive animation speed by audio.
        if (mixerRef.current) {
            let timeScale = 0;
            if (isPlaying) {
                //mas kusog na music, the slightly faster the modeled character dance.
                // base speed 1.0, scales up to 1.5 based on volume
                timeScale = 1.0 + (average / 255) * 0.5;
            }

            mixerRef.current.timeScale = THREE.MathUtils.lerp(mixerRef.current.timeScale, timeScale, 0.1);
            mixerRef.current.update(delta);
        }

        // slow pan rotation - Removed per user request (user input)
        // groupRef.current.rotation.y += 0.002;
    });

    return (
        <group ref={groupRef} position={[0, -2, 0]}>
            <primitive object={fbx} />
        </group>
    );
};

// Preload the model (to avoid delays)
useFBX.preload('/Hip Hop Dancing (1).fbx');

export default FBXVisualizer;
