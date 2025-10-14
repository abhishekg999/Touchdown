import type { ComponentChildren } from "preact";
import { createContext } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { GameState, PlayerDefaultDates, PlayerTeammates } from "../types";
import { POPULAR_PLAYERS } from "../utils/constants";
import { getDate } from "../utils/date";
import { bfs } from "../utils/pathfinding";
import { getPsrand, randomChoice } from "../utils/random";
import { getInitialGameState, STORAGE_KEYS } from "../utils/storage";

interface GameContextValue {
  currentGame: GameState;
  setCurrentGame: (game: GameState) => void;
  startPlayer: number;
  endPlayer: number;
  prevPlayer: number;
  setPrevPlayer: (player: number) => void;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

interface GameProviderProps {
  children: ComponentChildren;
  playerDefaultDates: PlayerDefaultDates;
  playerTeammates: PlayerTeammates;
}

export function GameProvider({ children, playerDefaultDates, playerTeammates }: GameProviderProps) {
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

  const value: GameContextValue = {
    currentGame,
    setCurrentGame,
    startPlayer,
    endPlayer,
    prevPlayer,
    setPrevPlayer,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
