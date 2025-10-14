import { useState } from "preact/hooks";
import { Dialog } from "radix-ui";
import { useResponsive } from "../hooks/useResponsive";
import { colors, fonts } from "../styles/theme";
import type { GameState, PlayerIds, PlayerTeammates, Statistics } from "../types";
import { POPULAR_PLAYERS } from "../utils/constants";
import { getModalStyles } from "../utils/modalStyles";
import { bfs, bfsPop } from "../utils/pathfinding";
import { generateShareText, shareToClipboard } from "../utils/share";

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
  const [showTooltip, setShowTooltip] = useState(false);
  const { isMobile } = useResponsive();
  const modalStyles = getModalStyles(isMobile);

  const handleShare = () => {
    const shareText = generateShareText(currentGame, startPlayer, endPlayer, playerIds);
    shareToClipboard(shareText);
    setTooltipText("Copied!");
    setShowTooltip(true);
    setTimeout(() => {
      setShowTooltip(false);
      setTimeout(() => setTooltipText("Copy to clipboard"), 300);
    }, 2000);
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
            <span style={{ color: colors.correct }}>{playerIds[playerId]}</span> &rarr;{" "}
          </span>
        ))}
        {playerIds[endPlayer]}
      </span>
    );
  };

  const descriptionStyle = {
    textAlign: "center" as const,
    marginBottom: isMobile ? "12px" : "16px",
    color: colors.textGray,
  };

  const pathContainerStyle = {
    textAlign: "center" as const,
    fontSize: isMobile ? "13px" : "15px",
    fontWeight: 700,
    marginBottom: isMobile ? "16px" : "20px",
    padding: isMobile ? "12px" : "16px",
    backgroundColor: "rgba(255, 122, 74, 0.05)",
    border: `1px solid ${colors.strong}`,
  };

  const pathLabelStyle = {
    fontFamily: fonts.headline,
    color: colors.strong,
    fontWeight: 700,
    marginBottom: isMobile ? "4px" : "6px",
    letterSpacing: isMobile ? "0.5px" : "1px",
    fontSize: isMobile ? "12px" : "13px",
  };

  const pathRouteStyle = {
    fontSize: isMobile ? "11px" : "13px",
    fontWeight: 400,
    fontStyle: "italic" as const,
    marginTop: isMobile ? "4px" : "6px",
    color: colors.text,
    wordBreak: "break-word" as const,
  };

  const statsGridStyle = {
    display: "grid",
    gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
    gap: isMobile ? "8px" : "12px",
    marginBottom: isMobile ? "16px" : "24px",
  };

  const statCardStyle = {
    textAlign: "center" as const,
    padding: isMobile ? "12px 6px" : "16px 8px",
    backgroundColor: "rgba(255, 122, 74, 0.05)",
    border: `1px solid ${colors.strong}`,
  };

  const statValueStyle = {
    fontSize: isMobile ? "24px" : "32px",
    fontWeight: "bold" as const,
    color: colors.text,
    lineHeight: 1,
    marginBottom: isMobile ? "6px" : "8px",
  };

  const statLabelStyle = {
    fontSize: isMobile ? "9px" : "11px",
    color: colors.textGray,
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  };

  const distributionContainerStyle = {
    marginBottom: isMobile ? "16px" : "20px",
  };

  const distributionTitleStyle = {
    fontFamily: fonts.headline,
    fontSize: isMobile ? "12px" : "14px",
    fontWeight: 700,
    marginBottom: isMobile ? "10px" : "12px",
    textAlign: "center" as const,
    color: colors.strong,
    textTransform: "uppercase" as const,
    letterSpacing: isMobile ? "0.5px" : "1px",
  };

  const distributionStyle = {
    display: "flex",
    gap: isMobile ? "6px" : "8px",
    alignItems: "stretch",
  };

  const rowLabelsStyle = {
    display: "flex",
    flexDirection: "column" as const,
    gap: isMobile ? "4px" : "6px",
    fontSize: isMobile ? "12px" : "14px",
    fontWeight: 600,
  };

  const rowLabelStyle = {
    height: isMobile ? "20px" : "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: colors.textGray,
  };

  const barsContainerStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    gap: isMobile ? "4px" : "6px",
  };

  const barStyle = (value: number, isCurrent: boolean) => ({
    height: isMobile ? "20px" : "24px",
    backgroundColor: isCurrent ? colors.correct : colors.textGray,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingRight: isMobile ? "6px" : "8px",
    fontSize: isMobile ? "11px" : "13px",
    fontWeight: 600,
    width: `${getBarWidth(value)}%`,
    minWidth: value > 0 ? (isMobile ? "28px" : "32px") : isMobile ? "20px" : "24px",
    transition: "width 0.3s ease",
  });

  const shareContainerStyle = {
    textAlign: "center" as const,
    marginBottom: isMobile ? "16px" : "20px",
    position: "relative" as const,
  };

  const shareButtonStyle = {
    backgroundColor: colors.strong,
    color: colors.background,
    fontSize: isMobile ? "12px" : "14px",
    fontWeight: 700,
    fontFamily: fonts.headline,
    padding: isMobile ? "12px 24px" : "14px 36px",
    border: `1px solid ${colors.strong}`,
    cursor: "pointer",
    transition: "all 0.2s ease",
    textTransform: "uppercase" as const,
    letterSpacing: isMobile ? "1px" : "1.5px",
  };

  const tooltipStyle = {
    position: "absolute" as const,
    bottom: "calc(100% + 8px)",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#333",
    color: "#fff",
    padding: "6px 12px",
    fontSize: "12px",
    whiteSpace: "nowrap" as const,
    pointerEvents: "none" as const,
    opacity: showTooltip ? 1 : 0,
    transition: "opacity 0.2s ease",
  };

  const tooltipArrowStyle = {
    position: "absolute" as const,
    top: "100%",
    left: "50%",
    transform: "translateX(-50%)",
    width: 0,
    height: 0,
    borderLeft: "6px solid transparent",
    borderRight: "6px solid transparent",
    borderTop: "6px solid #333",
  };

  const footerStyle = {
    marginTop: isMobile ? "16px" : "20px",
    paddingTop: isMobile ? "12px" : "16px",
    textAlign: "center" as const,
    borderTop: `1px solid ${colors.strong}`,
    fontSize: isMobile ? "11px" : "12px",
    color: colors.textGray,
  };

  const linkStyle = {
    color: colors.correct,
    textDecoration: "none",
    transition: "color 0.2s ease",
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay style={modalStyles.overlay} />
        <Dialog.Content style={modalStyles.content}>
          <Dialog.Close
            style={modalStyles.closeButton}
            aria-label="Close"
            onMouseEnter={(e) => (e.currentTarget.style.color = colors.text)}
            onMouseLeave={(e) => (e.currentTarget.style.color = colors.textGray)}
          >
            &times;
          </Dialog.Close>

          <div style={modalStyles.modalText}>
            <div style={modalStyles.header}>
              <Dialog.Title style={modalStyles.headerText}>Statistics</Dialog.Title>
            </div>

            <Dialog.Description style={descriptionStyle}>
              View your game statistics! If this looks off, make sure you are using the same browser
              when playing.
            </Dialog.Description>

            {currentGame.finished && (shoPath || posPath) && (
              <div style={pathContainerStyle}>
                {shoPath && (
                  <div style={{ marginBottom: posPath ? "12px" : 0 }}>
                    <div style={pathLabelStyle}>Shortest Path ({shoPath.length - 1} steps)</div>
                    <div style={pathRouteStyle}>{renderPath(shoPath)}</div>
                  </div>
                )}
                {posPath && (
                  <div>
                    <div style={pathLabelStyle}>
                      Popular Player Path ({posPath.length - 1} steps)
                    </div>
                    <div style={pathRouteStyle}>{renderPath(posPath)}</div>
                  </div>
                )}
              </div>
            )}

            <div style={statsGridStyle}>
              <div style={statCardStyle}>
                <div style={statValueStyle}>{statistics.gamesPlayed}</div>
                <div style={statLabelStyle}>Played</div>
              </div>
              <div style={statCardStyle}>
                <div style={statValueStyle}>{winPercentage}</div>
                <div style={statLabelStyle}>Win Rate</div>
              </div>
              <div style={statCardStyle}>
                <div style={statValueStyle}>{statistics.currentStreak}</div>
                <div style={statLabelStyle}>Current</div>
              </div>
              <div style={statCardStyle}>
                <div style={statValueStyle}>{statistics.maxStreak}</div>
                <div style={statLabelStyle}>Best</div>
              </div>
            </div>

            <div style={distributionContainerStyle}>
              <div style={distributionTitleStyle}>Guess Distribution</div>
              <div style={distributionStyle}>
                <div style={rowLabelsStyle}>
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <div key={num} style={rowLabelStyle}>
                      {num}
                    </div>
                  ))}
                </div>
                <div style={barsContainerStyle}>
                  {[1, 2, 3, 4, 5, 6].map((num) => {
                    const value = statistics.gameStats[num as keyof typeof statistics.gameStats];
                    const isCurrent =
                      currentGame.finished && currentGame.won && currentGame.guesses.length === num;
                    return (
                      <div key={num} style={barStyle(value as number, isCurrent)}>
                        {value}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {currentGame.finished && (
              <div style={shareContainerStyle}>
                <button
                  style={shareButtonStyle}
                  onClick={handleShare}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.background;
                    e.currentTarget.style.color = colors.strong;
                    setShowTooltip(true);
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.strong;
                    e.currentTarget.style.color = colors.background;
                    if (tooltipText === "Copy to clipboard") {
                      setShowTooltip(false);
                    }
                  }}
                >
                  Share Results
                </button>
                <div style={tooltipStyle}>
                  {tooltipText}
                  <div style={tooltipArrowStyle} />
                </div>
              </div>
            )}

            <div style={footerStyle}>
              Created by{" "}
              <a
                href="https://www.linkedin.com/in/abhishekgovindarasu/"
                style={linkStyle}
                onMouseEnter={(e) => (e.currentTarget.style.color = colors.active)}
                onMouseLeave={(e) => (e.currentTarget.style.color = colors.correct)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Abhishek
              </a>{" "}
              &{" "}
              <a
                href="https://www.linkedin.com/in/aaran-guha/"
                style={linkStyle}
                onMouseEnter={(e) => (e.currentTarget.style.color = colors.active)}
                onMouseLeave={(e) => (e.currentTarget.style.color = colors.correct)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Aaran
              </a>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
