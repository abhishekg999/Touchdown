export interface PlayerIds {
  [key: string]: string;
}

export interface PlayerTeammates {
  [key: string]: number[];
}

export interface PlayerDefaultDates {
  [key: string]: [number, number];
}

export interface GameState {
  id: string;
  guesses: [number, boolean][];
  finished: boolean;
  won: boolean;
}

export interface Statistics {
  gamesPlayed: number;
  gamesWon: number;
  gameStats: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
    fail: number;
  };
  currentStreak: number;
  maxStreak: number;
}

export interface GameData {
  playerIds: PlayerIds;
  playerTeammates: PlayerTeammates;
  playerDefaultDates: PlayerDefaultDates;
}
