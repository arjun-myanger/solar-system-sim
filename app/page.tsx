"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import SolarSystem from "../components/SolarSystem";

export default function Home() {
  const [target, setTarget] = useState<[number, number, number]>([0, 0, 0]);
  const [selectedPlanetIndex, setSelectedPlanetIndex] = useState<number | null>(null);
  const [modalPlanet, setModalPlanet] = useState<any>(null);
  const controlsRef = useRef<any>(null);
  const [showMeteorShower, setShowMeteorShower] = useState(false);

  const triggerMeteorShower = useCallback(() => {
    setShowMeteorShower(true);
    setTimeout(() => setShowMeteorShower(false), 4000); // adjust duration if needed
  }, []);

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.target.set(...target);
      controlsRef.current.update();
    }
  }, [target]);

  return (
    <>
      <div className="w-screen h-screen">
        <button
          onClick={triggerMeteorShower}
          style={{
            position: "absolute",
            top: 32,
            left: 32,
            zIndex: 100,
            background: "linear-gradient(90deg,#14355c,#21b3e6 55%,#182c3f)",
            color: "#fff",
            border: "none",
            borderRadius: "24px",
            padding: "10px 26px",
            fontSize: "1.08rem",
            fontWeight: 700,
            boxShadow: "0 0 8px #4be7ff88",
            cursor: "pointer",
            outline: "none",
            letterSpacing: ".04em"
          }}
        >
          Trigger Meteor Shower
        </button>
        <Canvas camera={{ position: [0, 22, 0], fov: 45 }}>
          <SolarSystem
            setTarget={setTarget}
            selectedPlanetIndex={selectedPlanetIndex}
            onSelect={setSelectedPlanetIndex}
            onPlanetClick={planet => setModalPlanet(planet)}
            activePlanetName={modalPlanet?.name}
            showMeteorShower={showMeteorShower}
            onMeteorShowerEnd={() => setShowMeteorShower(false)}
          />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <OrbitControls ref={controlsRef} makeDefault />
        </Canvas>
      </div>
      {modalPlanet && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            minWidth: 340,
            background: "rgba(18,22,28,0.96)",
            color: "#e2eaff",
            borderRadius: "32px",
            padding: "40px 36px 32px 36px",
            zIndex: 50,
            boxShadow: "0 0 60px 14px #4be7ffcc, 0 0 24px 4px #fff5",
            border: "1.5px solid #1a2533cc",
            textAlign: "center",
            fontFamily: "inherit",
            backdropFilter: "blur(10px)",
            animation: "popIn 0.25s cubic-bezier(.45,1.4,.55,1.2)",
            overflow: "visible"
          }}
          onClick={e => e.stopPropagation()}
        >
          <h2 style={{
            margin: 0,
            fontWeight: 800,
            fontSize: "2.4rem",
            letterSpacing: ".14em",
            color: "#fff",
            textShadow: "0 0 24px #38e1ff, 0 0 4px #fff",
            filter: "brightness(1.28)",
            marginBottom: "16px"
          }}>
            {modalPlanet.name}
          </h2>
          <div style={{ fontSize: "1.1rem", marginBottom: 18 }}>
            {modalPlanet.facts.map((fact: string, idx: number) => (
              <div
                key={idx}
                style={{
                  background: "rgba(28, 44, 67, 0.44)",
                  borderRadius: "8px",
                  margin: "4px 0",
                  padding: "5px 14px",
                  boxShadow: "0 0 4px #51d1ff88, 0 0 2px #fff4",
                  fontFamily: "monospace",
                  color: "#e5f6ff",
                  textShadow: "0 0 7px #2e9cff, 0 0 1px #fff",
                  fontSize: "1rem",
                  letterSpacing: ".04em",
                  opacity: 0.94,
                }}
              >
                {fact}
              </div>
            ))}
          </div>
          <button
            onClick={() => setModalPlanet(null)}
            style={{
              marginTop: 18,
              padding: "10px 36px",
              background: "linear-gradient(90deg,#183a60,#28b0e6 55%,#1c3446)",
              color: "#fff",
              border: "none",
              borderRadius: "28px",
              fontSize: "1.15rem",
              fontWeight: 700,
              boxShadow: "0 0 14px #49f8ff88",
              cursor: "pointer",
              outline: "none",
              transition: "background 0.22s",
              letterSpacing: ".08em"
            }}
          >
            Close
          </button>
        </div>
      )}
      {modalPlanet && (
        <div
          onClick={() => setModalPlanet(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.25)",
            zIndex: 40,
            backdropFilter: "blur(2px)",
          }}
        />
      )}
    </>
  );
}
