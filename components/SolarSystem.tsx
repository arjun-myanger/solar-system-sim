"use client";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

// Data for all main planets
const planets = [
  { name: "Mercury", color: "#bbb", radius: 0.15, orbit: 4, speed: 0.04 },
  { name: "Venus", color: "#e2c16b", radius: 0.3, orbit: 5, speed: 0.03 },
  { name: "Earth", color: "#3f83f8", radius: 0.32, orbit: 6.5, speed: 0.02 },
  { name: "Mars", color: "#c1440e", radius: 0.2, orbit: 8, speed: 0.017 },
  { name: "Jupiter", color: "#daa520", radius: 0.7, orbit: 10, speed: 0.009 },
  { name: "Saturn", color: "#e6c28b", radius: 0.6, orbit: 12, speed: 0.007 },
  { name: "Uranus", color: "#90e0ef", radius: 0.4, orbit: 14, speed: 0.005 },
  { name: "Neptune", color: "#577590", radius: 0.39, orbit: 16, speed: 0.004 },
];

export default function SolarSystem() {
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
      {/* Sun */}
      <mesh>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial color="#e2c16b" emissive="orange" emissiveIntensity={0.7} />
      </mesh>
      {/* Orbits */}
      {planets.map((planet, i) => (
        <OrbitRing key={planet.name + "_orbit"} radius={planet.orbit} />
      ))}
      {/* Planets */}
      {planets.map((planet, i) => (
        <mesh
          key={planet.name}
          ref={el => (planetRefs.current[i] = el)}
        >
          <sphereGeometry args={[planet.radius, 32, 32]} />
          <meshStandardMaterial color={planet.color} />
        </mesh>
      ))}
    </>
  );
}