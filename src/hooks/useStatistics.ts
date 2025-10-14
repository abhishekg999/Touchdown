import type { Statistics } from "../types";
import { getInitialStatistics, STORAGE_KEYS } from "../utils/storage";
import { useLocalStorage } from "./useLocalStorage";

export function useStatistics() {
  return useLocalStorage<Statistics>(STORAGE_KEYS.STATISTICS, getInitialStatistics());
}
