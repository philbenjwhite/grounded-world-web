"use client";

import React, { useState } from "react";
import cn from "classnames";
import styles from "./GaiaChat.module.css";

const GaiaChat: React.FC = () => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn(styles.chatShell, "w-full md:h-[min(80vh,750px)] flex flex-col overflow-hidden")}>
      {/* Loading indicator — visible until iframe fires onLoad */}
      {!loaded && (
        <div className={styles.loading}>
          <div className={styles.loadingDots}>
            <span className={styles.loadingDot} />
            <span className={styles.loadingDot} />
            <span className={styles.loadingDot} />
          </div>
        </div>
      )}

      <iframe
        title="Gaia AI Chat"
        src="https://gaia.zeeuwe.com/"
        className={cn(styles.iframe, loaded && styles.iframeVisible)}
        allow="microphone"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
};

export default GaiaChat;
