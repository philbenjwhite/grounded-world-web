"use client";

import React, { useEffect, useRef, useState } from "react";

interface PieChartProps {
  percent: number;
  label: string;
  size?: number;
  animate: boolean;
}

const PieChart: React.FC<PieChartProps> = ({ percent, label, size = 140, animate }) => {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (percent / 100) * circumference;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* SVG rotated so arc starts at 12 o'clock; text is overlaid in HTML (upright) */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
        >
          {/* Track */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="14"
          />
          {/* Filled arc */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="#e53e3e"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={`${animate ? filled : 0} ${circumference}`}
            strokeDashoffset={0}
            style={{
              transition: animate
                ? "stroke-dasharray 1.6s cubic-bezier(0.4, 0, 0.2, 1)"
                : "none",
            }}
          />
        </svg>
        {/* Percent label — separate from SVG so it stays upright */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-bold" style={{ fontSize: size * 0.2 }}>
            {percent}%
          </span>
        </div>
      </div>
      <p className="text-sm text-white/60 text-center leading-snug" style={{ maxWidth: size + 20 }}>
        {label}
      </p>
    </div>
  );
};

const IntentionActionStats: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimate(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 flex items-start justify-center gap-6"
    >
      <PieChart
        percent={97}
        label="of people say they are prepared to take action to live a more sustainable lifestyle³"
        size={150}
        animate={animate}
      />
      <div className="text-white/40 text-lg font-light pt-14">vs</div>
      <PieChart
        percent={13}
        label="of people are actively changing their behaviour³"
        size={150}
        animate={animate}
      />
    </div>
  );
};

export default IntentionActionStats;
