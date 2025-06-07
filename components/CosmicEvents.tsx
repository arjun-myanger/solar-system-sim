// components/CosmicEvents.tsx
import { useEffect, useState } from "react";
import MeteorShower from "./MeteorShower";

export default function CosmicEvents() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active) {
      const timeout = setTimeout(
        () => setActive(true),
        16000 + Math.random() * 21000 // random interval (16–37s)
      );
      return () => clearTimeout(timeout);
    }
  }, [active]);

  return (
    <>
      {active && (
        <MeteorShower
          count={12 + Math.floor(Math.random() * 10)}
          duration={2.8 + Math.random() * 2}
          onEnd={() => setActive(false)}
        />
      )}
    </>
  );
}