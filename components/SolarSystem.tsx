"use client";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { TextureLoader } from "three";
import { useRef } from "react";

// Data for all main planets with textures and Saturn's rings
const planets = [
  { name: "Mercury", radius: 0.20, orbit: 4, speed: 0.04, texture: "mercury.jpg" },
  { name: "Venus", radius: 0.35, orbit: 5, speed: 0.03, texture: "venus.jpg" },
  { name: "Earth", radius: 0.40, orbit: 6.5, speed: 0.02, texture: "earth.jpg" },
  { name: "Mars", radius: 0.30, orbit: 8, speed: 0.017, texture: "mars.jpg" },
  { name: "Jupiter", radius: 0.70, orbit: 10, speed: 0.009, texture: "jupiter.jpg" },
  { name: "Saturn", radius: 0.60, orbit: 12, speed: 0.007, texture: "saturn.jpg", rings: "saturn_rings.png" },
  { name: "Uranus", radius: 0.45, orbit: 14, speed: 0.005, texture: "uranus.jpg" },
  { name: "Neptune", radius: 0.44, orbit: 16, speed: 0.004, texture: "neptune.jpg" },
];

export default function SolarSystem({
  setTarget,
  selectedPlanetIndex,
  onSelect,
}: {
  setTarget: (pos: [number, number, number]) => void;
  selectedPlanetIndex: number | null;
  onSelect: (idx: number | null) => void;
}) {
  const sunTexture = useLoader(TextureLoader, "/sun.jpg");
  const starsTexture = useLoader(TextureLoader, "/stars.jpg");

  const planetRefs = useRef<(THREE.Mesh | null)[]>([]);
  const saturnRingsRef = useRef<THREE.Mesh | null>(null);

  useFrame(({ clock }) => {
    planets.forEach((planet, i) => {
      const mesh = planetRefs.current[i];
      if (mesh) {
        const angle = clock.getElapsedTime() * (planet.speed * 2 * Math.PI);
        mesh.position.x = planet.orbit * Math.cos(angle);
        mesh.position.z = planet.orbit * Math.sin(angle);
        mesh.position.y = 0;
      }
    });
    const saturnIndex = planets.findIndex(p => p.name === "Saturn");
    if (saturnIndex !== -1 && planetRefs.current[saturnIndex] && saturnRingsRef.current) {
      saturnRingsRef.current.position.copy(planetRefs.current[saturnIndex].position);
    }
    if (
      selectedPlanetIndex !== null &&
      planetRefs.current[selectedPlanetIndex]
    ) {
      const pos = planetRefs.current[selectedPlanetIndex].position;
      setTarget([pos.x, pos.y, pos.z]);
    }
  });

  // Helper: Draw a ring to show orbits
  const OrbitRing = ({ radius }: { radius: number }) => (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.01, radius + 0.01, 64]} />
      <meshBasicMaterial color="#aaa" side={THREE.DoubleSide} transparent opacity={0.25} />
    </mesh>
  );

  return (
    <>
      <mesh raycast={() => null} onClick={() => onSelect(null)}>
        <sphereGeometry args={[40, 64, 64]} />
        <meshBasicMaterial map={starsTexture} side={THREE.BackSide} transparent={true} opacity={0.99} />
      </mesh>
      {/* Sun */}
      <mesh onClick={() => onSelect(null)}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshStandardMaterial map={sunTexture} emissive="orange" emissiveIntensity={0.7} />
      </mesh>
      {/* Orbits */}
      {planets.map((planet, i) => (
        <OrbitRing key={planet.name + "_orbit"} radius={planet.orbit} />
      ))}
      {/* Planets */}
      {planets.map((planet, i) => {
        const texture = useLoader(TextureLoader, "/" + planet.texture);
        return (
          <mesh
            key={planet.name}
            ref={el => (planetRefs.current[i] = el)}
            position={[0, 0, 0]}
            onClick={() => {
              console.log(`Direct: Planet ${planet.name} clicked!`);
              onSelect(i);
            }}
          >
            <sphereGeometry args={[planet.radius, 32, 32]} />
            <meshStandardMaterial map={texture} />
          </mesh>
        );
      })}
      {/* Saturn's Rings as a sibling mesh */}
      {planets.map((planet, i) =>
        planet.rings ? (
          <mesh
            key={planet.name + "_rings"}
            position={[0, 0, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            renderOrder={1}
            ref={saturnRingsRef}
          >
            <ringGeometry args={[planet.radius * 1.2, planet.radius * 1.7, 64]} />
            <meshBasicMaterial
              map={useLoader(TextureLoader, "/" + planet.rings)}
              transparent
              opacity={0.7}
              side={2}
            />
          </mesh>
        ) : null
      )}
    </>
  );
} 