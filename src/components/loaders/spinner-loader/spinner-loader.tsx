import React, { useEffect, useRef } from 'react';


function SpinnerLoader() {
  const groupRef = useRef<SVGGElement>(null);
  const sectorRef = useRef<SVGCircleElement>(null);
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>(0);
  const angleRef = useRef<number>(0);

  const baseSpeed = 90 * 5;
  const amplitude = 250;
  const frequency = 0.5;
  const radius = 28;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const animate = (time: number) => {
      if (previousTimeRef.current === 0) {
        previousTimeRef.current = time;
      }
      const deltaTime = (time - previousTimeRef.current) / 1000;
      previousTimeRef.current = time;

      const currentSpeed = baseSpeed + amplitude * Math.sin(2 * Math.PI * frequency * time / 1000);
      angleRef.current += currentSpeed * deltaTime;

      if (angleRef.current >= 360) {
        angleRef.current -= 360;
      }

      const minSectorAngle = 15;
      const maxSectorAngle = 90;

      const normalizedSpeed = (currentSpeed - (baseSpeed - amplitude)) / (2 * amplitude);
      const clampedNormalizedSpeed = Math.max(0, Math.min(1, normalizedSpeed));
      const currentSectorAngle = minSectorAngle + clampedNormalizedSpeed * (maxSectorAngle - minSectorAngle);

      if (groupRef.current && sectorRef.current) {
        groupRef.current.style.transform = `rotate(${angleRef.current}deg)`;
        const dashLength = (currentSectorAngle / 360) * circumference;
        sectorRef.current.style.strokeDasharray = `${dashLength} ${circumference}`;
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [amplitude, baseSpeed, circumference, frequency]);

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#ffffff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  };

  return (
    <div style={containerStyle} data-testid="spinner-loader">
      <svg
        width="60"
        height="60"
        viewBox="0 0 60 60"
      >
        <circle
          cx="30"
          cy="30"
          r={radius}
          stroke="#f3f3f3"
          strokeWidth="4"
          fill="none"
        />
        <g
          ref={groupRef}
          style={{
            transformOrigin: '30px 30px',
          }}
        >
          <circle
            ref={sectorRef}
            className="blue-circle"
            cx="30"
            cy="30"
            r={28}
            stroke="#3498db"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            style={{
              strokeDasharray: `${15 / 360 * circumference} ${circumference}`,
            }}
          />
        </g>
      </svg>
    </div>
  );
}

export default SpinnerLoader;
