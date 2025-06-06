// components/TwinklingStars.tsx

// Note: The twinkling stars radius should match the starfield sphere to avoid points appearing outside the starfield.

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// GLSL for star twinkle
const vertexShader = `
  precision mediump float;
  uniform float uTime;
  attribute float twinkleSeed;
  varying float vTwinkleSeed;
  void main() {
    vTwinkleSeed = twinkleSeed;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = 2.0 + 4.5 * abs(sin(uTime * 1.7 + twinkleSeed * 31.0));
  }
`;

const fragmentShader = `
  precision mediump float;
  varying float vTwinkleSeed;
  uniform float uTime;
  void main() {
    float twinkle = 0.4 + 1.2 * abs(sin(uTime * 2.3 + vTwinkleSeed * 52.0));
    float sparkle = fract(sin(uTime * 17.0 + vTwinkleSeed * 120.0) * 43758.5453);
    twinkle *= 0.8 + 0.4 * sparkle;
    float dist = length(gl_PointCoord - vec2(0.5));
    float alpha = smoothstep(0.17, 0.0, dist);
    gl_FragColor = vec4(vec3(1.0) * twinkle, alpha * twinkle);
  }
`;

export default function TwinklingStars({
  count = 800,
  radius = 100
}: {
  count?: number;
  radius?: number;
}) {
  const mesh = useRef<THREE.Points>(null);

  // Star positions and "twinkle seed" for each point
  const { positions, twinkleSeeds } = useMemo(() => {
    const pos = [];
    const seeds = [];
    for (let i = 0; i < count; i++) {
      // Random point on a sphere
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      const r = radius * (0.97 + 0.02 * Math.random());
      pos.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );
      seeds.push(Math.random());
    }
    return {
      positions: new Float32Array(pos),
      twinkleSeeds: new Float32Array(seeds)
    };
  }, [count, radius]);

  // Shader material uniforms
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 }
    }),
    []
  );

  // Animate time for shader
  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-twinkleSeed"
          args={[twinkleSeeds, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
      />
    </points>
  );
}