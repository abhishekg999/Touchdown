#!/usr/bin/env bun

import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { playerIds } from "../src/data/playerIds";

const RAW_DATA_DIR = join(import.meta.dir, "..", "raw-data");
const OUTPUT_FILE = join(import.meta.dir, "..", "src", "data", "playerTeammates.ts");

interface Player {
  name: string;
}

function main() {
  console.log("Starting player teammates generation...\n");

  console.log("Loading player IDs mapping...");

  const nameToId = new Map<string, string>();
  for (const [id, name] of Object.entries(playerIds)) {
    nameToId.set(name, id);
  }

  console.log(`Loaded ${nameToId.size} player IDs\n`);

  const teammatesGraph = new Map<string, Set<string>>();

  console.log("Scanning raw data files...");
  const files = readdirSync(RAW_DATA_DIR).filter((f) => f.endsWith(".json"));
  console.log(`Found ${files.length} files\n`);

  let processed = 0;
  for (const file of files) {
    try {
      const content = readFileSync(join(RAW_DATA_DIR, file), "utf-8");
      const players: Player[] = JSON.parse(content);

      const playerIdsInFile: string[] = [];
      for (const player of players) {
        const name = player.name?.trim();
        if (name && nameToId.has(name)) {
          playerIdsInFile.push(nameToId.get(name)!);
        }
      }

      for (const pid of playerIdsInFile) {
        if (!teammatesGraph.has(pid)) {
          teammatesGraph.set(pid, new Set());
        }

        for (const teammatePid of playerIdsInFile) {
          if (pid !== teammatePid) {
            teammatesGraph.get(pid)!.add(teammatePid);
          }
        }
      }

      processed++;
      if (processed % 100 === 0) {
        console.log(`Processed ${processed}/${files.length} files...`);
      }
    } catch (err) {
      console.error(`Error reading ${file}:`, err);
    }
  }

  console.log(`\nProcessed all ${files.length} files`);
  console.log(`Generated graph for ${teammatesGraph.size} players\n`);

  console.log("Generating TypeScript file...");

  const lines = [
    'export type PlayerTeammates = { [playerId: string]: number[] };',
    '',
    'export const playerTeammates: PlayerTeammates = {',
  ];

  const sortedPids = Array.from(teammatesGraph.keys()).sort((a, b) => parseInt(a) - parseInt(b));

  for (let i = 0; i < sortedPids.length; i++) {
    const pid = sortedPids[i]!;
    const _teammates = teammatesGraph.get(pid);
    if (!_teammates) {
        throw new Error(`Player ID ${pid} not found in teammates graph`);
    }
    const teammates = Array.from(_teammates).sort((a, b) => parseInt(a) - parseInt(b));
    const teammatesStr = teammates.join(",");
    const comma = i < sortedPids.length - 1 ? "," : "";
    lines.push(`"${pid}":[${teammatesStr}]${comma}`);
  }

  lines.push("} as const;");
  lines.push("");

  writeFileSync(OUTPUT_FILE, lines.join("\n"), "utf-8");

  console.log(`Generated ${OUTPUT_FILE}`);
  console.log(`Total players with teammates: ${teammatesGraph.size}`);
}

main();

