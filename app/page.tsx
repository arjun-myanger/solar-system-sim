"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import SolarSystem from "../components/SolarSystem";

export default function Home() {
  return (
    <div className="w-screen h-screen">
      <Canvas>
        <SolarSystem />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
