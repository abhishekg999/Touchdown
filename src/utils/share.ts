import type { GameState, PlayerIds } from "../types";
import { daysPassed } from "./date";

export function generateShareText(
  currentGame: GameState,
  startPlayer: number,
  endPlayer: number,
  playerIds: PlayerIds
): string {
  let shareStr = "Touchdown #" + daysPassed() + "\n";
  shareStr += playerIds[startPlayer] + " → " + playerIds[endPlayer] + "\n🏈";

  for (const guess of currentGame.guesses) {
    if (guess[1] === false) {
      shareStr += "🟥";
    } else {
      shareStr += "🟩";
    }
  }

  for (let i = 0; i < 6 - currentGame.guesses.length; i++) {
    shareStr += "⬜";
  }

  shareStr += "\nhttps://touchdown.life";
  return shareStr;
}

export function shareToClipboard(text: string): void {
  navigator.clipboard.writeText(text);
}
