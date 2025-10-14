import { colors, fonts } from "../styles/theme";
import type { GameState, PlayerIds, PlayerTeammates } from "../types";
import { MAXGUESSES } from "../utils/constants";
import { getPlayerName, hasPlayedTogether } from "../utils/typeGuards";
import { PlayerCell } from "./PlayerCell";
import { PlayerInput } from "./PlayerInput";

interface GameBoardProps {
  startPlayer: number;
  endPlayer: number;
  playerIds: PlayerIds;
  playerTeammates: PlayerTeammates;
  currentGame: GameState;
  prevPlayer: number;
  onGuess: (playerId: number, isCorrect: boolean) => void;
}

export function GameBoard({
  startPlayer,
  endPlayer,
  playerIds,
  playerTeammates,
  currentGame,
  prevPlayer,
  onGuess,
}: GameBoardProps) {
  const playerNames = Object.values(playerIds);
  const remainingGuesses = MAXGUESSES - currentGame.guesses.length;

  const handlePlayerSelect = (playerId: number) => {
    if (currentGame.finished) return;

    const isCorrect = hasPlayedTogether(playerTeammates, prevPlayer, playerId);
    onGuess(playerId, isCorrect);
  };

  return (
    <div
      style={{
        position: "relative",
        width: "85%",
        margin: "auto",
        backgroundColor: "rgba(0, 0, 0, 0)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          color: colors.text,
          fontFamily: fonts.main,
          fontSize: "16px",
          paddingTop: "20px",
          paddingBottom: "10px",
          overflowX: "hidden",
          textAlign: "center",
        }}
      >
        <span>
          Connect{" "}
          <span style={{ color: colors.emphasis }}>{getPlayerName(playerIds, startPlayer)}</span> to{" "}
          <span style={{ color: colors.emphasis }}>{getPlayerName(playerIds, endPlayer)}</span>{" "}
          through mutual teammates.
        </span>
      </div>
      <div
        style={{
          margin: "0 auto",
          paddingTop: "15px",
          maxWidth: "640px",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div>
          <PlayerCell playerName={getPlayerName(playerIds, startPlayer)} />
        </div>
        <div>
          {currentGame.guesses.map(([playerId, isCorrect], index) => (
            <PlayerCell
              key={index}
              playerName={getPlayerName(playerIds, playerId)}
              variant={isCorrect ? "correct" : "wrong"}
            />
          ))}
        </div>
        {!currentGame.finished && (
          <PlayerInput
            playerNames={playerNames}
            playerIds={playerIds}
            onPlayerSelect={handlePlayerSelect}
            disabled={currentGame.finished}
          />
        )}
        <div>
          <PlayerCell playerName={getPlayerName(playerIds, endPlayer)} />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          color: colors.warning,
          fontFamily: fonts.main,
          fontSize: "14px",
          paddingTop: "10px",
          paddingBottom: "10px",
          overflowX: "hidden",
          textAlign: "center",
        }}
      >
        <span>
          <span>{remainingGuesses}</span> guesses remaining
        </span>
      </div>
    </div>
  );
}
