"use client";

import { useEffect, useRef } from "react";

interface WellnessRingProps {
  score: number;      // 0-100
  size?: number;      // px, default 120
  strokeWidth?: number;
  label?: string;
}

function scoreToColor(score: number) {
  if (score >= 78) return "#6fa174";
  if (score >= 64) return "#f4c95d";
  if (score >= 50) return "#d98870";
  return "#b86c88";
}

export function WellnessRing({ score, size = 120, strokeWidth = 9, label }: WellnessRingProps) {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = scoreToColor(score);
  const fillRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const el = fillRef.current;
    if (!el) return;
    // Animate from full-offset to target
    el.style.strokeDashoffset = String(circumference);
    const raf = requestAnimationFrame(() => {
      el.style.transition = "stroke-dashoffset 1.3s cubic-bezier(0.4,0,0.2,1)";
      el.style.strokeDashoffset = String(offset);
    });
    return () => cancelAnimationFrame(raf);
  }, [score, offset, circumference]);

  return (
    <div className="wellness-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="wellness-ring-track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          ref={fillRef}
          className="wellness-ring-fill"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
        />
      </svg>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ position: "absolute" }}
      >
        <span className="text-2xl font-black text-ink leading-none">{score}</span>
        {label && (
          <span className="text-[9px] font-black uppercase tracking-wider text-ink/50 mt-0.5">{label}</span>
        )}
      </div>
    </div>
  );
}
