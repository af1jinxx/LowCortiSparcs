import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Suspense } from 'react';
import FBXVisualizer from '../../features/visualizers/FBXVisualizer';
import FloatingFlowers from '../../features/visualizers/FloatingFlowers';

const VisualizerCanvas = () => {
    return (
        <div className="w-full h-screen bg-black">
            <Canvas camera={{ position: [0, 5, 20], fov: 45 }}>
                <color attach="background" args={['#050505']} />
                <ambientLight intensity={1.5} />
                <directionalLight position={[10, 20, 10]} intensity={2} />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#ff0080" />
                <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />

                <Suspense fallback={null}>
                    <FloatingFlowers count={150} />
                    <FBXVisualizer />
                    <Environment preset="city" />
                    <ContactShadows position={[0, -5, 0]} opacity={0.5} scale={50} blur={2} far={10} />
                </Suspense>

                {/* Make OrbitControls static per user request (mouse click) */}
                <OrbitControls makeDefault />
            </Canvas>
        </div>
    );
};

export default VisualizerCanvas;
