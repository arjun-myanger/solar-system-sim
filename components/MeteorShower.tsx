// components/MeteorShower.tsx
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function MeteorShower({
  count = 32,
  duration = 6,
  radius = 120,
  color = "#ff00ff",
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
        delay: 0,
        len: 30 + Math.random() * 30, // <-- wider range for better visibility
        width: 2 + Math.random() * 2, // <-- much wider for debug
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
      // Opacity debugging: just show full opacity for now
      // const material = mesh.current.material;
      // if (Array.isArray(material)) {
      //   material.forEach(mat => { if ("opacity" in mat) mat.opacity = 1; });
      // } else if ("opacity" in material) {
      //   material.opacity = 1;
      // }
    }
  });

  // Set orientation to point from start to end
  const direction = end.clone().sub(start).normalize();
  const axis = new THREE.Vector3(0, 1, 0);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, direction);

  return (
    <mesh ref={mesh} quaternion={quaternion}>
      <cylinderGeometry args={[width, 0.01, len, 5]} />
      <meshBasicMaterial color={color} transparent opacity={1} />
    </mesh>
  );
}