"use client";

import { createContext, useContext } from "react";
import type { GlobalSettings } from "./global-settings";

const GlobalSettingsContext = createContext<GlobalSettings | null>(null);

export function GlobalSettingsProvider({
  value,
  children,
}: {
  value: GlobalSettings | null;
  children: React.ReactNode;
}) {
  return (
    <GlobalSettingsContext.Provider value={value}>
      {children}
    </GlobalSettingsContext.Provider>
  );
}

export function useGlobalSettings(): GlobalSettings | null {
  return useContext(GlobalSettingsContext);
}
