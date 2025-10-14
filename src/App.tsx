import { useEffect, useState } from "preact/hooks";
import { GameBoard } from "./components/GameBoard";
import { Header } from "./components/Header";
import { InfoModal } from "./components/InfoModal";
import { LoadingScreen } from "./components/LoadingScreen";
import { StatsModal } from "./components/StatsModal";
import { GameProvider, StatisticsProvider, useGame, useStatisticsContext } from "./contexts";
import { colors } from "./styles/theme";
import type { GameData } from "./types";
import { MAXGUESSES } from "./utils/constants";
import { hasStorageData } from "./utils/storage";

function GameContent({
  gameData,
  setIsStatsModalOpen,
}: {
  gameData: GameData;
  setIsStatsModalOpen: (open: boolean) => void;
}) {
  const { currentGame, setCurrentGame, startPlayer, endPlayer, prevPlayer, setPrevPlayer } =
    useGame();
  const { statistics, setStatistics } = useStatisticsContext();

  const handleGuess = (playerId: number, isCorrect: boolean) => {
    const newGuesses = [...currentGame.guesses, [playerId, isCorrect] as [number, boolean]];
    const newGame = { ...currentGame, guesses: newGuesses };

    if (isCorrect) {
      setPrevPlayer(playerId);

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
    </>
  );
}

export function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [gameData, setGameData] = useState<GameData>({
    playerIds: {},
    playerTeammates: {},
    playerDefaultDates: {},
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const { playerIds, playerTeammates, playerDefaultDates } = await import("./data");

        setGameData({
          playerIds,
          playerTeammates,
          playerDefaultDates,
        });
        setIsDataLoaded(true);
      } catch (error) {
        console.error("Error loading game data:", error);
        setIsDataLoaded(true);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!hasStorageData() && !isLoading) {
      setIsInfoModalOpen(true);
    }
  }, [isLoading]);

  return (
    <StatisticsProvider>
      <GameProvider
        playerDefaultDates={gameData.playerDefaultDates}
        playerTeammates={gameData.playerTeammates}
      >
        <div
          style={{
            backgroundColor: colors.background,
            minHeight: "100vh",
            width: "100%",
            margin: 0,
            padding: 0,
          }}
        >
          {isLoading && (
            <LoadingScreen onComplete={() => setIsLoading(false)} isDataLoaded={isDataLoaded} />
          )}

          <Header
            onInfoClick={() => setIsInfoModalOpen(true)}
            onStatsClick={() => setIsStatsModalOpen(true)}
          />

          <GameContent gameData={gameData} setIsStatsModalOpen={setIsStatsModalOpen} />

          <InfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
          <StatsModalWrapper
            isOpen={isStatsModalOpen}
            onClose={() => setIsStatsModalOpen(false)}
            gameData={gameData}
          />
        </div>
      </GameProvider>
    </StatisticsProvider>
  );
}

function StatsModalWrapper({
  isOpen,
  onClose,
  gameData,
}: {
  isOpen: boolean;
  onClose: () => void;
  gameData: GameData;
}) {
  const { currentGame, startPlayer, endPlayer } = useGame();
  const { statistics } = useStatisticsContext();

  return (
    <StatsModal
      isOpen={isOpen}
      onClose={onClose}
      statistics={statistics}
      currentGame={currentGame}
      startPlayer={startPlayer}
      endPlayer={endPlayer}
      playerIds={gameData.playerIds}
      playerTeammates={gameData.playerTeammates}
    />
  );
}
