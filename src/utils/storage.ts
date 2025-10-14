import type { GameState, Statistics } from "../types";
import { getDate } from "./date";

export const STORAGE_KEYS = {
  CURRENT_GAME: "CurrentGame",
  STATISTICS: "Statistics",
} as const;

export function getInitialGameState(): GameState {
  return {
    id: btoa(getDate()),
    guesses: [],
    finished: false,
    won: false,
  };
}

export function getInitialStatistics(): Statistics {
  return {
    gamesPlayed: 0,
    gamesWon: 0,
    gameStats: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, fail: 0 },
    currentStreak: 0,
    maxStreak: 0,
  };
}

export function validateGameState(data: unknown): data is GameState {
  if (!data || typeof data !== "object") return false;
  const game = data as Partial<GameState>;

  return (
    typeof game.id === "string" &&
    Array.isArray(game.guesses) &&
    typeof game.finished === "boolean" &&
    typeof game.won === "boolean"
  );
}

export function validateStatistics(data: unknown): data is Statistics {
  if (!data || typeof data !== "object") return false;
  const stats = data as Partial<Statistics>;

  return (
    typeof stats.gamesPlayed === "number" &&
    typeof stats.gamesWon === "number" &&
    typeof stats.currentStreak === "number" &&
    typeof stats.maxStreak === "number" &&
    stats.gameStats !== undefined &&
    typeof stats.gameStats === "object"
  );
}

export function hasStorageData(): boolean {
  return (
    localStorage.getItem(STORAGE_KEYS.CURRENT_GAME) !== null ||
    localStorage.getItem(STORAGE_KEYS.STATISTICS) !== null
  );
}
