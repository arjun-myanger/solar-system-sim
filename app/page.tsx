"use client";
import { useState, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import SolarSystem from "../components/SolarSystem";

export default function Home() {
  const [target, setTarget] = useState<[number, number, number]>([0, 0, 0]);
  const [selectedPlanetIndex, setSelectedPlanetIndex] = useState<number | null>(null);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.set(...target);
      controlsRef.current.update();
    }
  }, [target]);

  return (
    <div className="w-screen h-screen">
      <Canvas camera={{ position: [0, 22, 0], fov: 45 }}>
        <SolarSystem
          setTarget={setTarget}
          selectedPlanetIndex={selectedPlanetIndex}
          onSelect={setSelectedPlanetIndex}
        />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <OrbitControls ref={controlsRef} makeDefault />
      </Canvas>
    </div>
  );
}
