import type { ComponentChildren } from "preact";
import { createContext } from "preact";
import { useContext } from "preact/hooks";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { Statistics } from "../types";
import { getInitialStatistics, STORAGE_KEYS } from "../utils/storage";

interface StatisticsContextValue {
  statistics: Statistics;
  setStatistics: (stats: Statistics) => void;
}

const StatisticsContext = createContext<StatisticsContextValue | undefined>(undefined);

interface StatisticsProviderProps {
  children: ComponentChildren;
}

export function StatisticsProvider({ children }: StatisticsProviderProps) {
  const [statistics, setStatistics] = useLocalStorage<Statistics>(
    STORAGE_KEYS.STATISTICS,
    getInitialStatistics()
  );

  const value: StatisticsContextValue = {
    statistics,
    setStatistics,
  };

  return <StatisticsContext.Provider value={value}>{children}</StatisticsContext.Provider>;
}

export function useStatisticsContext() {
  const context = useContext(StatisticsContext);
  if (!context) {
    throw new Error("useStatisticsContext must be used within a StatisticsProvider");
  }
  return context;
}
