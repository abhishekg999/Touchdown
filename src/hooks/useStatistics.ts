import type { Statistics } from "../types";
import { useLocalStorage } from "./useLocalStorage";

function getInitialStatistics(): Statistics {
  return {
    gamesPlayed: 0,
    gamesWon: 0,
    gameStats: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, fail: 0 },
    currentStreak: 0,
    maxStreak: 0,
  };
}

export function useStatistics() {
  return useLocalStorage<Statistics>("Statistics", getInitialStatistics());
}
