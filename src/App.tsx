import { useEffect, useState } from "preact/hooks";
import { GameBoard } from "./components/GameBoard";
import { Header } from "./components/Header";
import { InfoModal } from "./components/InfoModal";
import { LoadingScreen } from "./components/LoadingScreen";
import { StatsModal } from "./components/StatsModal";
import { useGameState } from "./hooks/useGameState";
import { useStatistics } from "./hooks/useStatistics";
import type { GameData } from "./types";
import { MAXGUESSES } from "./utils/constants";

export function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [gameData, setGameData] = useState<GameData>({
    playerIds: {},
    playerTeammates: {},
    playerDefaultDates: {},
  });
  const [statistics, setStatistics] = useStatistics();

  const { currentGame, setCurrentGame, startPlayer, endPlayer, prevPlayer, setPrevPlayer } =
    useGameState(gameData.playerDefaultDates, gameData.playerTeammates);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { playerIds, playerTeammates, playerDefaultDates } = await import("./data");

        setGameData({
          playerIds,
          playerTeammates,
          playerDefaultDates,
        });
      } catch (error) {
        console.error("Error loading game data:", error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    // Show info modal on first visit
    const hasVisited = localStorage.getItem("Statistics") !== null;
    if (!hasVisited && !isLoading) {
      setIsInfoModalOpen(true);
    }
  }, [isLoading]);

  const handleGuess = (playerId: number, isCorrect: boolean) => {
    const newGuesses = [...currentGame.guesses, [playerId, isCorrect] as [number, boolean]];
    const newGame = { ...currentGame, guesses: newGuesses };

    if (isCorrect) {
      setPrevPlayer(playerId);

      // Check if player won
      if (gameData.playerTeammates[playerId]?.includes(endPlayer)) {
        newGame.finished = true;
        newGame.won = true;

        const newStats = { ...statistics };
        newStats.gamesPlayed++;
        newStats.gamesWon++;
        newStats.currentStreak++;
        if (newStats.currentStreak > newStats.maxStreak) {
          newStats.maxStreak = newStats.currentStreak;
        }
        newStats.gameStats[newGuesses.length as keyof typeof newStats.gameStats]++;
        setStatistics(newStats);

        setTimeout(() => setIsStatsModalOpen(true), 1300);
      }
    }

    // Check if player lost
    if (newGuesses.length >= MAXGUESSES && !newGame.won) {
      newGame.finished = true;
      newGame.won = false;

      const newStats = { ...statistics };
      newStats.gamesPlayed++;
      newStats.currentStreak = 0;
      newStats.gameStats.fail++;
      setStatistics(newStats);

      setTimeout(() => setIsStatsModalOpen(true), 1300);
    }

    setCurrentGame(newGame);
  };

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      <Header
        onInfoClick={() => setIsInfoModalOpen(true)}
        onStatsClick={() => setIsStatsModalOpen(true)}
      />

      {startPlayer && endPlayer && (
        <GameBoard
          startPlayer={startPlayer}
          endPlayer={endPlayer}
          playerIds={gameData.playerIds}
          playerTeammates={gameData.playerTeammates}
          currentGame={currentGame}
          prevPlayer={prevPlayer}
          onGuess={handleGuess}
        />
      )}

      <InfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />

      <StatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        statistics={statistics}
        currentGame={currentGame}
        startPlayer={startPlayer}
        endPlayer={endPlayer}
        playerIds={gameData.playerIds}
        playerTeammates={gameData.playerTeammates}
      />

      <div class="footer"></div>
    </>
  );
}
