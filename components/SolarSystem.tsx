// @ts-nocheck
"use client";
import { Html } from "@react-three/drei";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { TextureLoader } from "three";
import { useRef } from "react";
import TwinklingStars from "./TwinklingStars";
import MeteorShower from "./MeteorShower";

// Data for all main planets with textures and Saturn's rings
const planets = [
  {
    name: "Mercury",
    radius: 0.20,
    orbit: 4,
    speed: 0.04,
    texture: "mercury.jpg",
    facts: [
      "Diameter: 4,880 km",
      "Year: 88 Earth days",
      "Fun: No atmosphere – extreme temp swings!"
    ]
  },
  {
    name: "Venus",
    radius: 0.35,
    orbit: 5,
    speed: 0.03,
    texture: "venus.jpg",
    facts: [
      "Diameter: 12,104 km",
      "Year: 225 Earth days",
      "Fun: Hottest planet with thick CO2 atmosphere"
    ]
  },
  {
    name: "Earth",
    radius: 0.40,
    orbit: 6.5,
    speed: 0.02,
    texture: "earth.jpg",
    facts: [
      "Diameter: 12,742 km",
      "Year: 365 Earth days",
      "Fun: Only planet known to support life"
    ]
  },
  {
    name: "Mars",
    radius: 0.30,
    orbit: 8,
    speed: 0.017,
    texture: "mars.jpg",
    facts: [
      "Diameter: 6,779 km",
      "Year: 687 Earth days",
      "Fun: Home to the tallest volcano in solar system"
    ]
  },
  {
    name: "Jupiter",
    radius: 0.70,
    orbit: 10,
    speed: 0.009,
    texture: "jupiter.jpg",
    facts: [
      "Diameter: 139,822 km",
      "Year: 12 Earth years",
      "Fun: Largest planet with Great Red Spot storm"
    ]
  },
  {
    name: "Saturn",
    radius: 0.60,
    orbit: 12,
    speed: 0.007,
    texture: "saturn.jpg",
    rings: "saturn_rings.png",
    facts: [
      "Diameter: 116,464 km",
      "Year: 29 Earth years",
      "Fun: Famous for its spectacular ring system"
    ]
  },
  {
    name: "Uranus",
    radius: 0.45,
    orbit: 14,
    speed: 0.005,
    texture: "uranus.jpg",
    facts: [
      "Diameter: 50,724 km",
      "Year: 84 Earth years",
      "Fun: Rotates on its side with extreme seasons"
    ]
  },
  {
    name: "Neptune",
    radius: 0.44,
    orbit: 16,
    speed: 0.004,
    texture: "neptune.jpg",
    facts: [
      "Diameter: 49,244 km",
      "Year: 165 Earth years",
      "Fun: Strongest winds in the solar system"
    ]
  },
];

export default function SolarSystem({
  setTarget,
  selectedPlanetIndex,
  onSelect,
  onPlanetClick,
  hideLabelForPlanetIndex,
  activePlanetName,
  showMeteorShower,
  onMeteorShowerEnd,
}: {
  setTarget: (pos: [number, number, number]) => void;
  selectedPlanetIndex: number | null;
  onSelect: (idx: number | null) => void;
  onPlanetClick: (planet: typeof planets[0] | null) => void;
  hideLabelForPlanetIndex?: number | null;
  activePlanetName?: string | null;
  showMeteorShower: boolean;
  onMeteorShowerEnd: () => void;
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
      <TwinklingStars count={900} radius={40} />
      {showMeteorShower && (
        <MeteorShower
          count={32}
          duration={5}
          onEnd={onMeteorShowerEnd}
          color="#ffd06a"
        />
      )}
      <mesh raycast={() => null} onClick={() => onSelect(null)}>
        <sphereGeometry args={[40, 64, 64]} />
        <meshBasicMaterial
          map={starsTexture}
          side={THREE.BackSide}
          transparent={true}
          opacity={0.99}
        />
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
            onClick={e => {
              e.stopPropagation();
              onSelect(i);
              onPlanetClick(planet);
            }}
          >
            <sphereGeometry args={[planet.radius, 32, 32]} />
            <meshStandardMaterial map={texture} />
            <Html
              center
              distanceFactor={10}
              style={{
                pointerEvents: "none",
                display: hideLabelForPlanetIndex === i ? "none" : undefined,
                color: "#fff",
                fontWeight: "bold",
                fontSize: "1.1rem",
                padding: "2px 10px",
                borderRadius: "12px",
                background: "rgba(20, 20, 30, 0.32)",
                boxShadow: "0 0 8px 2px #50c8ff88, 0 0 4px 1px #fff3",
                textShadow: "0 0 8px #50c8ff, 0 0 2px #fff",
                userSelect: "none",
                letterSpacing: "0.07em",
                filter: "brightness(1.35) blur(0.01px)",
                transition: "opacity 0.2s",
                opacity: 0.96,
                minWidth: "60px",
                textAlign: "center",
              }}
            >
              <div>
                {planet.name}
              </div>
            </Html>
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