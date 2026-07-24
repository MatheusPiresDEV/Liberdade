import { createContext, useContext } from "react";
import type { AppData } from "./data";

export interface AppContextType {
  data: AppData;
  mode: "admin" | "visitor";
  isAdmin: boolean;
  saveData: (d: AppData) => void;
  onLogout: () => void;
}

export const AppContext = createContext<AppContextType | null>(null);

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppContext.Provider");
  return ctx;
}
