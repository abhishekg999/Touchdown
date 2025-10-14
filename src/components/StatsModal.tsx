import { useState } from "preact/hooks";
import { Modal } from "./Modal";
import type { Statistics, GameState, PlayerIds, PlayerTeammates } from "../types";
import { generateShareText, shareToClipboard } from "../utils/share";
import { bfs, bfsPop } from "../utils/pathfinding";
import { POPULAR_PLAYERS } from "../utils/constants";

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  statistics: Statistics;
  currentGame: GameState;
  startPlayer: number;
  endPlayer: number;
  playerIds: PlayerIds;
  playerTeammates: PlayerTeammates;
}

export function StatsModal({
  isOpen,
  onClose,
  statistics,
  currentGame,
  startPlayer,
  endPlayer,
  playerIds,
  playerTeammates,
}: StatsModalProps) {
  const [tooltipText, setTooltipText] = useState("Copy to clipboard");

  const handleShare = () => {
    const shareText = generateShareText(currentGame, startPlayer, endPlayer, playerIds);
    shareToClipboard(shareText);
    setTooltipText("Copied to clipboard");
    setTimeout(() => setTooltipText("Copy to clipboard"), 2000);
  };

  const winPercentage =
    statistics.gamesPlayed === 0
      ? "0%"
      : `${Math.round((statistics.gamesWon / statistics.gamesPlayed) * 100)}%`;

  const maxVal = Math.max(...Object.values(statistics.gameStats));

  const getBarWidth = (value: number) => {
    if (maxVal === 0) return 8;
    return (92 * value) / maxVal + 8;
  };

  const addValuesToListIfNotExist = (list: number[], valuesToAdd: number[]): number[] => {
    const uniqueSet = new Set(list);
    for (const value of valuesToAdd) {
      uniqueSet.add(value);
    }
    return Array.from(uniqueSet);
  };

  let posPath: number[] | null = null;
  let shoPath: number[] | null = null;

  if (currentGame.finished && startPlayer && endPlayer) {
    try {
      posPath = bfsPop(
        startPlayer,
        endPlayer,
        playerTeammates,
        addValuesToListIfNotExist(POPULAR_PLAYERS, [startPlayer, endPlayer])
      );
    } catch (err) {
      posPath = null;
    }
    shoPath = bfs(startPlayer, endPlayer, playerTeammates);
  }

  const renderPath = (path: number[] | null) => {
    if (!path) return null;
    return (
      <span>
        {playerIds[startPlayer]} &rarr;{" "}
        {path.slice(1, -1).map((playerId, idx) => (
          <span key={idx}>
            <span class="correct">{playerIds[playerId]}</span> &rarr;{" "}
          </span>
        ))}
        {playerIds[endPlayer]}
      </span>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      {currentGame.finished && (
        <div class="stats-modal-shortest-path" style={{ display: "block" }}>
          {shoPath && (
            <>
              <span>Shortest Path: </span>
              <div class="stats-modal-sp-route">{renderPath(shoPath)}</div>
            </>
          )}
          {posPath && (
            <>
              <span>Popular Player Path: </span>
              <div class="stats-modal-sp-route">{renderPath(posPath)}</div>
            </>
          )}
        </div>
      )}
      <div class="modal-header">
        <header>Statistics</header>
        View your game statistics! If this looks off, make sure you are using the same browser when
        playing.
      </div>
      <div class="stats-modal-var-container">
        <div class="stats-modal-stat-obj">
          <div>{statistics.gamesPlayed}</div>
          <div class="stats-modal-stat-obj-text">Played</div>
        </div>
        <div class="stats-modal-stat-obj">
          <div>{winPercentage}</div>
          <div class="stats-modal-stat-obj-text">Win %</div>
        </div>
        <div class="stats-modal-stat-obj">
          <div>{statistics.currentStreak}</div>
          <div class="stats-modal-stat-obj-text">Current Streak</div>
        </div>
        <div class="stats-modal-stat-obj">
          <div>{statistics.maxStreak}</div>
          <div class="stats-modal-stat-obj-text">Max Streak</div>
        </div>
      </div>
      <div class="stats-modal-guess-distribution">
        <div class="stats-modal-guess-row-ids">
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <div key={num} class="stats-modal-guess-row-val">
              {num}
            </div>
          ))}
        </div>
        <div class="stats-modal-guess-row-bars">
          {[1, 2, 3, 4, 5, 6].map((num) => {
            const value = statistics.gameStats[num as keyof typeof statistics.gameStats];
            const isCurrent =
              currentGame.finished && currentGame.won && currentGame.guesses.length === num;
            return (
              <div
                key={num}
                class={`stats-modal-guess-row-bar${isCurrent ? " current" : ""}`}
                style={{ width: `${getBarWidth(value as number)}%` }}
              >
                {value}
              </div>
            );
          })}
        </div>
      </div>
      {currentGame.finished && (
        <div class="stats-modal-share" style={{ display: "block" }}>
          <button class="share-button" onClick={handleShare}>
            Share!
          </button>
          <span class="tooltiptext">{tooltipText}</span>
        </div>
      )}
      <div class="stats-modal-footer">
        Created by A&A (<a href="https://www.linkedin.com/in/abhishekgovindarasu/">Abhishek</a> and{" "}
        <a href="https://www.linkedin.com/in/aaran-guha/">Aaran</a>)
        <br />
      </div>
    </Modal>
  );
}
