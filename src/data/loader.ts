
export async function loadGameData() {
  const [playerIds, playerTeammates, playerDefaultDates] = await Promise.all([
    import("./playerIds").then((m) => m.playerIds),
    import("./playerTeammates").then((m) => m.playerTeammates),
    import("./playerDefaultDates").then((m) => m.playerDefaultDates),
  ]);

  return { playerIds, playerTeammates, playerDefaultDates };
}

