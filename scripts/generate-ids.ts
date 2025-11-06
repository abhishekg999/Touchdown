#!/usr/bin/env bun

import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const RAW_DATA_DIR = join(import.meta.dir, "..", "raw-data");
const OUTPUT_FILE = join(import.meta.dir, "..", "src", "data", "playerIds.ts");

interface Player {
  name: string;
}

function main() {
  console.log("Starting player IDs generation...\n");

  const uniqueNames = new Set<string>();

  console.log("Scanning raw data files...");
  const files = readdirSync(RAW_DATA_DIR).filter((f) => f.endsWith(".json"));
  console.log(`Found ${files.length} files\n`);

  for (const file of files) {
    try {
      const content = readFileSync(join(RAW_DATA_DIR, file), "utf-8");
      const players: Player[] = JSON.parse(content);

      for (const player of players) {
        const name = player.name?.trim();
        if (name) {
          uniqueNames.add(name);
        }
      }
    } catch (err) {
      console.error(`Error reading ${file}:`, err);
    }
  }

  console.log(`Found ${uniqueNames.size} unique player names\n`);

  const sortedNames = Array.from(uniqueNames).sort();

  console.log("Generating TypeScript file...");

  const lines = [
    'export type PlayerIds = { [id: string]: string };',
    '',
    'export const playerIds: PlayerIds = {',
  ];

  for (let i = 0; i < sortedNames.length; i++) {
    const name = sortedNames[i]!;
    const escapedName = name.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    const comma = i < sortedNames.length - 1 ? "," : "";
    lines.push(`"${i}":"${escapedName}"${comma}`);
  }

  lines.push("} as const;");
  lines.push("");

  writeFileSync(OUTPUT_FILE, lines.join("\n"), "utf-8");

  console.log(`Generated ${OUTPUT_FILE}`);
  console.log(`Total players: ${sortedNames.length}`);
}

main();

