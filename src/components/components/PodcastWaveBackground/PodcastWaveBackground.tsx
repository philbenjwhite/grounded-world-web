"use client";

import styles from "./PodcastWaveBackground.module.css";

/**
 * Animated flowing wave background matching the "It Shouldn't Be This Hard"
 * podcast cover art — thin cyan and magenta light trails on black with subtle glow.
 */
export default function PodcastWaveBackground() {
  return (
    <div className={styles.wrapper}>
      <svg
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
        className={styles.svg}
        aria-hidden="true"
      >
        <defs>
          {/* Subtle glow — just enough to give light trail feel */}
          <filter id="pw-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="b2" />
            <feMerge>
              <feMergeNode in="b1" />
              <feMergeNode in="b2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="pw-glow-wide" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" />
          </filter>
        </defs>

        {/* ── CYAN WAVE 1 — main trail, enters bottom-left, organic S-curve
            with a loop/undulation in the middle, exits upper-right ── */}

        {/* Soft wide glow behind */}
        <path
          className={`${styles.path} ${styles.d2s}`}
          d="M-80,1020 C60,940 200,820 380,720 C500,650 580,520 660,440
             C740,360 840,320 920,350 C1000,380 1060,440 1140,400
             C1220,360 1340,240 1480,170 C1620,100 1780,50 2020,0"
          stroke="#00AEEF"
          strokeWidth="6"
          fill="none"
          opacity="0.15"
          filter="url(#pw-glow-wide)"
        />
        {/* Main visible line */}
        <path
          className={`${styles.path} ${styles.d2s}`}
          d="M-80,1020 C60,940 200,820 380,720 C500,650 580,520 660,440
             C740,360 840,320 920,350 C1000,380 1060,440 1140,400
             C1220,360 1340,240 1480,170 C1620,100 1780,50 2020,0"
          stroke="#00AEEF"
          strokeWidth="2"
          fill="none"
          opacity="0.7"
          filter="url(#pw-glow)"
        />
        {/* Bright core */}
        <path
          className={`${styles.path} ${styles.d2s}`}
          d="M-80,1020 C60,940 200,820 380,720 C500,650 580,520 660,440
             C740,360 840,320 920,350 C1000,380 1060,440 1140,400
             C1220,360 1340,240 1480,170 C1620,100 1780,50 2020,0"
          stroke="#80DFFF"
          strokeWidth="0.8"
          fill="none"
          opacity="0.9"
        />

        {/* ── CYAN WAVE 2 — thinner companion, offset path ── */}
        <path
          className={`${styles.path} ${styles.d2_5s}`}
          d="M-40,1060 C100,980 260,860 420,760 C540,690 620,560 700,480
             C780,400 880,360 960,380 C1040,400 1100,460 1180,420
             C1260,380 1380,260 1520,190 C1660,120 1820,70 2040,20"
          stroke="#00AEEF"
          strokeWidth="1"
          fill="none"
          opacity="0.35"
          filter="url(#pw-glow)"
        />

        {/* ── CYAN WAVE 3 — thin wispy accent ── */}
        <path
          className={`${styles.path} ${styles.d3s}`}
          d="M-120,960 C20,900 160,780 340,680 C460,610 540,480 620,400
             C700,320 800,290 880,310 C960,330 1020,400 1100,360
             C1180,320 1300,200 1440,130 C1580,60 1740,20 1980,-30"
          stroke="#00AEEF"
          strokeWidth="0.5"
          fill="none"
          opacity="0.25"
        />

        {/* ── MAGENTA WAVE 1 — main trail, enters upper-left area,
            sweeps diagonally with gentle curves, exits lower-right ── */}

        {/* Soft wide glow */}
        <path
          className={`${styles.path} ${styles.d2_2s}`}
          d="M-60,80 C80,130 240,240 400,320 C560,400 680,360 800,420
             C920,480 1020,580 1140,660 C1260,740 1400,800 1560,870
             C1720,940 1860,980 2040,1040"
          stroke="#FF08CC"
          strokeWidth="5"
          fill="none"
          opacity="0.12"
          filter="url(#pw-glow-wide)"
        />
        {/* Main visible line */}
        <path
          className={`${styles.path} ${styles.d2_2s}`}
          d="M-60,80 C80,130 240,240 400,320 C560,400 680,360 800,420
             C920,480 1020,580 1140,660 C1260,740 1400,800 1560,870
             C1720,940 1860,980 2040,1040"
          stroke="#FF08CC"
          strokeWidth="1.5"
          fill="none"
          opacity="0.6"
          filter="url(#pw-glow)"
        />
        {/* Bright core */}
        <path
          className={`${styles.path} ${styles.d2_2s}`}
          d="M-60,80 C80,130 240,240 400,320 C560,400 680,360 800,420
             C920,480 1020,580 1140,660 C1260,740 1400,800 1560,870
             C1720,940 1860,980 2040,1040"
          stroke="#FF80E5"
          strokeWidth="0.6"
          fill="none"
          opacity="0.8"
        />

        {/* ── MAGENTA WAVE 2 — thinner companion ── */}
        <path
          className={`${styles.path} ${styles.d2_8s}`}
          d="M-20,40 C120,90 280,200 440,280 C600,360 720,320 840,380
             C960,440 1060,540 1180,620 C1300,700 1440,760 1600,830
             C1760,900 1900,940 2060,1000"
          stroke="#FF08CC"
          strokeWidth="0.8"
          fill="none"
          opacity="0.3"
          filter="url(#pw-glow)"
        />

        {/* ── MAGENTA WAVE 3 — thin wispy accent ── */}
        <path
          className={`${styles.path} ${styles.d3_2s}`}
          d="M-100,120 C40,170 200,280 360,360 C520,440 640,400 760,460
             C880,520 980,620 1100,700 C1220,780 1360,840 1520,910
             C1680,980 1820,1020 2000,1080"
          stroke="#FF08CC"
          strokeWidth="0.4"
          fill="none"
          opacity="0.2"
        />
      </svg>
    </div>
  );
}
