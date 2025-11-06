import { expect, test } from "bun:test";
import { playerIds } from "../data/playerIds";
import { playerTeammates } from "../data/playerTeammates";
import { bfs } from "./pathfinding";

function getPlayerId(name: string): number | null {
  for (const [id, playerName] of Object.entries(playerIds)) {
    if (playerName === name) {
      return parseInt(id);
    }
  }
  return null;
}

function testPath(playerNames: string[]): boolean {
  for (let i = 0; i < playerNames.length - 1; i++) {
    const startId = getPlayerId(playerNames[i]!);
    const endId = getPlayerId(playerNames[i + 1]!);

    if (startId === null || endId === null) {
      return false;
    }

    const path = bfs(startId, endId, playerTeammates);
    if (!path || path.length !== 2) {
      return false;
    }
  }

  return true;
}

test("Aaron Rodgers → D.J. Reed → George Kittle", () => {
  expect(testPath(["Aaron Rodgers", "D.J. Reed", "George Kittle"])).toBe(true);
});

test("Kirk Cousins → Stefon Diggs → Josh Allen", () => {
  expect(testPath(["Kirk Cousins", "Stefon Diggs", "Josh Allen"])).toBe(true);
});

test("Calvin Ridley → Matt Ryan → Michael Pittman → Anthony Richardson", () => {
  expect(testPath(["Calvin Ridley", "Matt Ryan", "Michael Pittman", "Anthony Richardson"])).toBe(
    true
  );
});

test("Dak Prescott → Brandin Cooks → Tom Brady", () => {
  expect(testPath(["Dak Prescott", "Brandin Cooks", "Tom Brady"])).toBe(true);
});

test("Aaron Rodgers → Deebo Samuel → George Kittle (invalid)", () => {
  expect(testPath(["Aaron Rodgers", "Deebo Samuel", "George Kittle"])).toBe(false);
});

test("Kirk Cousins → Fred Warner → Josh Allen (invalid)", () => {
  expect(testPath(["Kirk Cousins", "Fred Warner", "Josh Allen"])).toBe(false);
});

test("Calvin Ridley → DeSean Jackson → Matthew Stafford → Anthony Richardson (invalid)", () => {
  expect(
    testPath(["Calvin Ridley", "DeSean Jackson", "Matthew Stafford", "Anthony Richardson"])
  ).toBe(false);
});

test("Dak Prescott → Cooper Kupp → Tom Brady (invalid)", () => {
  expect(testPath(["Dak Prescott", "Cooper Kupp", "Tom Brady"])).toBe(false);
});
