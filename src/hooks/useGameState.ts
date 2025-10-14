import { useEffect, useState } from "preact/hooks";
import type { GameState, PlayerDefaultDates, PlayerTeammates } from "../types";
import { POPULAR_PLAYERS } from "../utils/constants";
import { getDate } from "../utils/date";
import { bfs } from "../utils/pathfinding";
import { getPsrand, randomChoice } from "../utils/random";
import { getInitialGameState, STORAGE_KEYS } from "../utils/storage";
import { useLocalStorage } from "./useLocalStorage";

export function useGameState(
  playerDefaultDates: PlayerDefaultDates,
  playerTeammates: PlayerTeammates
) {
  const [currentGame, setCurrentGame] = useLocalStorage<GameState>(
    STORAGE_KEYS.CURRENT_GAME,
    getInitialGameState()
  );
  const [startPlayer, setStartPlayer] = useState<number>(0);
  const [endPlayer, setEndPlayer] = useState<number>(0);
  const [prevPlayer, setPrevPlayer] = useState<number>(0);

  useEffect(() => {
    if (Object.keys(playerDefaultDates).length === 0 || Object.keys(playerTeammates).length === 0) {
      return;
    }

    const today = getDate();
    let start: number;
    let end: number;

    if (playerDefaultDates.hasOwnProperty(today)) {
      const players = playerDefaultDates[today];
      if (!players) {
        return;
      }
      [start, end] = players;
    } else {
      const rand = getPsrand();
      start = randomChoice(POPULAR_PLAYERS, rand);
      end = randomChoice(POPULAR_PLAYERS, rand);

      const startTeammates = playerTeammates[start];
      while (
        end === start ||
        (startTeammates && startTeammates.includes(end)) ||
        !bfs(start, end, playerTeammates)
      ) {
        start = randomChoice(POPULAR_PLAYERS, rand);
        end = randomChoice(POPULAR_PLAYERS, rand);
      }
    }

    setStartPlayer(start);
    setEndPlayer(end);
    setPrevPlayer(start);

    if (currentGame.id !== btoa(today)) {
      setCurrentGame(getInitialGameState());
    }
  }, [playerDefaultDates, playerTeammates]);

  return {
    currentGame,
    setCurrentGame,
    startPlayer,
    endPlayer,
    prevPlayer,
    setPrevPlayer,
  };
}
