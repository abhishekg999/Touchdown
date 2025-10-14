import { PlayerCell } from "./PlayerCell";
import { PlayerInput } from "./PlayerInput";
import type { GameState, PlayerIds, PlayerTeammates } from "../types";
import { MAXGUESSES } from "../utils/constants";

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

    const isCorrect = playerTeammates[prevPlayer]?.includes(playerId);
    onGuess(playerId, isCorrect);
  };

  return (
    <div class="main">
      <div class="game-prompt">
        <span>
          Connect{" "}
          <span id="start-player" class="emphasize">
            {playerIds[startPlayer]}
          </span>{" "}
          to{" "}
          <span id="end-player" class="emphasize">
            {playerIds[endPlayer]}
          </span>{" "}
          through mutual teammates.
        </span>
      </div>
      <div class="game-table">
        <div id="start-pt">
          <PlayerCell playerName={playerIds[startPlayer]} />
        </div>
        <div id="guess-pt">
          {currentGame.guesses.map(([playerId, isCorrect], index) => (
            <PlayerCell
              key={index}
              playerName={playerIds[playerId]}
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
        <div id="end-pt">
          <PlayerCell playerName={playerIds[endPlayer]} />
        </div>
      </div>
      <div class="remaining-guesses" id="rem-guesses">
        <span>
          <span id="remaining-guess-cnt">{remainingGuesses}</span> guesses remaining
        </span>
      </div>
    </div>
  );
}
