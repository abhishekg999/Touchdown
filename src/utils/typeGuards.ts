import type { PlayerIds, PlayerTeammates } from "../types";

export function getPlayerName(playerIds: PlayerIds, playerId: number): string {
  const name = playerIds[playerId];
  if (!name) {
    throw new Error(`Player ID ${playerId} not found`);
  }
  return name;
}

export function getPlayerIdByName(playerIds: PlayerIds, playerName: string): number | undefined {
  for (const [id, name] of Object.entries(playerIds)) {
    if (name === playerName) {
      return Number(id);
    }
  }
  return undefined;
}

export function getPlayerTeammates(playerTeammates: PlayerTeammates, playerId: number): number[] {
  return playerTeammates[playerId] ?? [];
}

export function hasPlayedTogether(
  playerTeammates: PlayerTeammates,
  player1: number,
  player2: number
): boolean {
  const teammates = playerTeammates[player1];
  return teammates ? teammates.includes(player2) : false;
}
