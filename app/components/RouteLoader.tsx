"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function RouteLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    setVisible(true);
    setPhase(0);

    const timeline = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 600),
      setTimeout(() => setPhase(3), 1000),
      setTimeout(() => setVisible(false), 1600),
    ];

    return () => {
      timeline.forEach(clearTimeout);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <>
      <div className="route-loader-overlay">
        <div className="terminal">
          <Line show={true} text="> Initializing Tesser..." />
          <Line show={phase >= 1} text="> CODE" />
          <Line show={phase >= 2} text="> RUN" />
          <Line show={phase >= 3} text="> SHARE" blinking />
        </div>
      </div>

      <style jsx>{`
        .route-loader-overlay {
          position: fixed;
          inset: 0;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.2s ease forwards;
        }

        .terminal {
          font-family: monospace;
          font-size: 28px;
          color: #facc15;
          letter-spacing: 2px;
        }

        @media (min-width: 768px) {
          .terminal {
            font-size: 40px;
          }
        }

        .line {
          opacity: 0;
          transform: translateY(10px);
          animation: appear 0.4s ease forwards;
        }

        .cursor::after {
          content: "|";
          margin-left: 8px;
          animation: blink 1s infinite;
        }

        @keyframes blink {
          50% {
            opacity: 0;
          }
        }

        @keyframes appear {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}

function Line({
  text,
  show,
  blinking = false,
}: {
  text: string;
  show: boolean;
  blinking?: boolean;
}) {
  if (!show) return null;

  return (
    <div className={`line ${blinking ? "cursor" : ""}`}>
      {text}
    </div>
  );
}
