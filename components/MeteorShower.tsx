// components/MeteorShower.tsx
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function MeteorShower({
  count = 16,
  duration = 3,
  radius = 100,
  color = "#bbf8ff",
  onEnd
}: {
  count?: number;
  duration?: number;
  radius?: number;
  color?: string;
  onEnd?: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  const startTime = useRef<number>(0);

  const meteors = useMemo(() => {
    return Array.from({ length: count }).map(() => {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      const dir = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.sin(phi) * Math.sin(theta),
        Math.cos(phi)
      );
      return {
        start: dir.clone().multiplyScalar(radius + 20),
        end: dir.clone().multiplyScalar(radius - 10),
        delay: Math.random() * (duration * 0.6),
        len: 7 + Math.random() * 10,
        width: 0.11 + Math.random() * 0.15,
      };
    });
  }, [count, duration, radius]);

  useFrame(({ clock }) => {
    if (!startTime.current) startTime.current = clock.getElapsedTime();
    const t = clock.getElapsedTime() - startTime.current;
    if (t > duration && onEnd) onEnd();
  });

  return (
    <group ref={group}>
      {meteors.map((m, i) => (
        <MeteorStreak
          key={i}
          start={m.start}
          end={m.end}
          delay={m.delay}
          duration={duration}
          len={m.len}
          width={m.width}
          color={color}
        />
      ))}
    </group>
  );
}

function MeteorStreak({
  start,
  end,
  delay,
  duration,
  len,
  width,
  color,
}: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  delay: number;
  duration: number;
  len: number;
  width: number;
  color: string;
}) {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    let progress = (t - delay) / duration;
    if (progress < 0) progress = 0;
    if (progress > 1) progress = 1;
    const pos = start.clone().lerp(end, progress);
    if (mesh.current) {
      mesh.current.position.copy(pos);
      mesh.current.visible = progress > 0 && progress < 1;
      const material = mesh.current.material;
      const newOpacity = 0.7 * Math.sin(Math.PI * progress);

      if (Array.isArray(material)) {
        material.forEach(mat => {
          if ("opacity" in mat) (mat as THREE.Material & { opacity?: number }).opacity = newOpacity;
        });
      } else if ("opacity" in material) {
        (material as THREE.Material & { opacity?: number }).opacity = newOpacity;
      }
    }
  });

  // The cylinder will shoot along its Y axis; we don't need the group rotation line from before.
  return (
    <mesh ref={mesh}>
      <cylinderGeometry args={[width, 0.01, len, 5]} />
      <meshBasicMaterial color={color} transparent opacity={0.7} />
    </mesh>
  );
}