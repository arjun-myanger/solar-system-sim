"use client";
import { useFrame, useLoader } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { TextureLoader } from "three";

// Data for all main planets with textures and Saturn's rings
const planets = [
  { name: "Mercury", radius: 0.15, orbit: 4, speed: 0.04, texture: "mercury.jpg" },
  { name: "Venus", radius: 0.3, orbit: 5, speed: 0.03, texture: "venus.jpg" },
  { name: "Earth", radius: 0.32, orbit: 6.5, speed: 0.02, texture: "earth.jpg" },
  { name: "Mars", radius: 0.2, orbit: 8, speed: 0.017, texture: "mars.jpg" },
  { name: "Jupiter", radius: 0.7, orbit: 10, speed: 0.009, texture: "jupiter.jpg" },
  { name: "Saturn", radius: 0.6, orbit: 12, speed: 0.007, texture: "saturn.jpg", rings: "saturn_rings.png" },
  { name: "Uranus", radius: 0.4, orbit: 14, speed: 0.005, texture: "uranus.jpg" },
  { name: "Neptune", radius: 0.39, orbit: 16, speed: 0.004, texture: "neptune.jpg" },
];

// Planet component for loading texture and rendering mesh
function Planet({ planet, meshRef, onPlanetClick }: { planet: any, meshRef: any, onPlanetClick?: (pos: [number, number, number]) => void }) {
  const texture = useLoader(TextureLoader, "/" + planet.texture);

  return (
    <mesh
      ref={meshRef}
      onClick={e => {
        e.stopPropagation();
        if (onPlanetClick && meshRef && meshRef.current) {
          const { x, y, z } = meshRef.current.position;
          console.log(`Planet ${planet.name} clicked! Position:`, x, y, z);
          onPlanetClick([x, y, z]);
        }
      }}
    >
      <sphereGeometry args={[planet.radius, 32, 32]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

export default function SolarSystem({ setTarget }: { setTarget: (pos: [number, number, number]) => void }) {
  const sunTexture = useLoader(TextureLoader, "/sun.jpg");
  const starsTexture = useLoader(TextureLoader, "/stars.jpg");
  const planetRefs = useRef<any[]>([]);

  useFrame(({ clock }) => {
    planets.forEach((planet, i) => {
      const mesh = planetRefs.current[i];
      if (mesh) {
        const angle = clock.getElapsedTime() * planet.speed;
        mesh.position.x = planet.orbit * Math.cos(angle);
        mesh.position.z = planet.orbit * Math.sin(angle);
      }
    });
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
      <mesh raycast={() => null}>
        <sphereGeometry args={[40, 64, 64]} />
        <meshBasicMaterial map={starsTexture} side={THREE.BackSide} transparent={true} opacity={0.99} />
      </mesh>
      {/* Sun */}
      <mesh onClick={() => console.log("Sun clicked!")}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial map={sunTexture} emissive="orange" emissiveIntensity={0.7} />
      </mesh>
      {/* Orbits */}
      {planets.map((planet, i) => (
        <OrbitRing key={planet.name + "_orbit"} radius={planet.orbit} />
      ))}
      {/* Planets */}
      {planets.map((planet, i) => (
        <Planet
          key={planet.name}
          planet={planet}
          meshRef={(el: THREE.Mesh | null) => (planetRefs.current[i] = el)}
          onPlanetClick={setTarget}
        />
      ))}
      {/* Saturn's Rings as a sibling mesh */}
      {planets.map((planet, i) =>
        planet.rings ? (
          <mesh
            key={planet.name + "_rings"}
            position={planetRefs.current[i]?.position}
            rotation={[-Math.PI / 2, 0, 0]}
            renderOrder={1}
          >
            <ringGeometry args={[planet.radius * 1.1, planet.radius * 1.8, 64]} />
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