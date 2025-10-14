import type { PlayerTeammates } from "../types";

export function bfs(
  startPlayer: number,
  endPlayer: number,
  playerTeammates: PlayerTeammates
): number[] | null {
  const explored: number[] = [];
  const queue: number[][] = [[startPlayer]];

  if (startPlayer === endPlayer) {
    return [startPlayer];
  }

  while (queue.length > 0) {
    const path = queue.shift();
    if (!path) {
      return null;
    }
    const node = path[path.length - 1];
    if (node === undefined) {
      continue;
    }

    if (!explored.includes(node)) {
      const adjs = playerTeammates[node];
      if (!adjs) continue;
      for (const adj_id in adjs) {
        const adj = adjs[adj_id];
        if (adj === undefined) continue;
        const new_path = [...path];
        new_path.push(adj);
        queue.push(new_path);
        if (adj === endPlayer) {
          return new_path;
        }
      }
      explored.push(node);
    }
  }
  return null;
}

export function bfsPop(
  startPlayer: number,
  endPlayer: number,
  playerTeammates: PlayerTeammates,
  popList: number[]
): number[] | null {
  const explored: number[] = [];
  const queue: number[][] = [[startPlayer]];

  if (startPlayer === endPlayer) {
    return [startPlayer];
  }

  while (queue.length > 0) {
    const path = queue.shift();
    if (!path) {
      return null;
    }
    const node = path[path.length - 1];
    if (node === undefined) {
      continue;
    }

    if (!explored.includes(node)) {
      const adjs = playerTeammates[node];
      if (!adjs) continue;
      for (const adj_id in adjs) {
        const adj = adjs[adj_id];
        if (adj === undefined) continue;
        if (popList.includes(adj)) {
          const new_path = [...path];
          new_path.push(adj);
          queue.push(new_path);

          if (adj === endPlayer) {
            return new_path;
          }
        }
      }
      explored.push(node);
    }
  }
  return null;
}
