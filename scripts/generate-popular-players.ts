#!/usr/bin/env bun

import { writeFileSync } from "fs";
import { join } from "path";
import { playerIds } from "../src/data/playerIds";

const OUTPUT_FILE = join(import.meta.dir, "..", "src", "data", "playerPopular.ts");

const POPULAR_PLAYER_NAMES = [
  "Todd Gurley",
  "DeAndre Hopkins",
  "Stefon Diggs",
  "Jonathan Taylor",
  "Tyreek Hill",
  "Dalvin Cook",
  "Fred Warner",
  "Nick Chubb",
  "Aaron Rodgers",
  "T.J. Watt",
  "Patrick Mahomes",
  "Justin Jefferson",
  "Mark Andrews",
  "Von Miller",
  "Mike Evans",
  "Darren Waller",
  "Joe Mixon",
  "Terry McLaurin",
  "Justin Tucker",
  "Joe Burrow",
  "Shaquille Leonard",
  "Michael Thomas",
  "Josh Allen",
  "Dak Prescott",
  "Dak Prescott",
  "Chris Godwin",
  "Deebo Samuel",
  "Keenan Allen",
  "Tyler Lockett",
  "Amari Cooper",
  "Justin Herbert",
  "Alvin Kamara",
  "Micah Parsons",
  "Austin Ekeler",
  "Josh Jacobs",
  "Aaron Jones",
  "Russell Wilson",
  "Leonard Fournette",
  "T.J. Hockenson",
  "D.K. Metcalf",
  "Kyle Pitts",
  "Kareem Hunt",
  "D.J. Moore",
  "Saquon Barkley",
  "Ezekiel Elliott",
  "Adam Thielen",
  "Robert Woods",
  "Dallas Goedert",
  "A.J. Brown",
  "Kyle Juszczyk",
  "CeeDee Lamb",
  "Matthew Stafford",
  "Ja'Marr Chase",
  "Brandin Cooks",
  "Najee Harris",
  "Hunter Renfrow",
  "Lamar Jackson",
  "Matt Judon",
  "Shaq Thompson",
  "Mike Gesicki",
  "James Robinson",
  "Mike Williams",
  "Hunter Henry",
  "Deshaun Watson",
  "Jaylen Waddle",
  "Harrison Butker",
  "David Montgomery",
  "Marquise Brown",
  "Calvin Ridley",
  "Tyler Boyd",
  "Zach Ertz",
  "Cordarrelle Patterson",
  "Melvin Gordon",
  "Diontae Johnson",
  "Jarvis Landry",
  "Tee Higgins",
  "Cam Akers",
  "DeVonta Smith",
  "Tyler Higbee",
  "Jerry Jeudy",
  "Chris Boswell",
  "Kyler Murray",
  "Courtland Sutton",
  "Sterling Shepard",
  "Courtland Sutton",
  "Kyler Murray",
  "Allen Robinson",
  "James Conner",
  "Kenny Golladay",
  "Evan McPherson",
  "Michael Pittman",
  "Devin Singletary",
  "Derek Carr",
  "Ryan Tannehill",
  "Julio Jones",
  "Brandon Aiyuk",
  "Graham Gano",
  "Evan Engram",
  "Michael Gallup",
  "Tony Pollard",
  "Elijah Mitchell",
  "Noah Fant",
  "Younghoe Koo",
  "Marvin Jones",
  "Kirk Cousins",
  "Damien Harris",
  "A.J. Green",
  "Gabriel Davis",
  "Miles Sanders",
  "Robert Tonyan",
  "AJ Dillon",
  "Elijah Moore",
  "Austin Hooper",
  "Rondale Moore",
  "Kenyan Drake",
  "Kendrick Bourne",
  "Matt Ryan",
  "Sammy Watkins",
  "Corey Davis",
  "Darnell Mooney",
  "Christian Kirk",
  "Nelson Agholor",
  "J.K. Dobbins",
  "Leighton Vander Esch",
  "D'Andre Swift",
  "David Njoku",
  "Wil Lutz",
  "JuJu Smith-Schuster",
  "Raheem Mostert",
  "Marcedes Lewis",
  "Robbie Gould",
  "Chase Edmonds",
  "Randall Cobb",
  "Bryan Edwards",
  "Rashod Bateman",
  "Baker Mayfield",
  "Sony Michel",
  "Kadarius Toney",
  "Allen Lazard",
  "Jamaal Williams",
  "Darrell Henderson",
  "Clyde Edwards-Helaire",
  "Mecole Hardman",
  "Antonio Gibson",
  "Trevor Lawrence",
  "Van Jefferson",
  "Curtis Samuel",
  "Garrett Wilson",
  "Chris Olave",
  "Trent Williams",
  "Jerry Rice",
  "Peyton Manning",
  "Ray Lewis",
  "Brett Favre",
  "Tom Brady",
  "Deion Sanders",
  "LaDainian Tomlinson",
  "Randy Moss",
  "Troy Aikman",
  "Steve Young",
  "Ed Reed",
  "Kurt Warner",
  "Larry Fitzgerald",
  "Rob Gronkowski",
  "Andrew Luck",
  "Colin Kaepernick",
  "Cam Newton",
  "David Johnson",
  "Tony Romo",
  "Justin Herbert",
];

function main() {
  console.log("Starting popular players generation...\n");

  const nameToId = new Map<string, string>();
  for (const [id, name] of Object.entries(playerIds)) {
    nameToId.set(name, id);
  }

  console.log(`Loaded ${nameToId.size} player IDs\n`);

  const popularPlayerIds: string[] = [];
  const missingPlayers: string[] = [];

  for (const name of POPULAR_PLAYER_NAMES) {
    const id = nameToId.get(name);
    if (!id) {
      missingPlayers.push(name);
    } else {
      popularPlayerIds.push(id);
    }
  }

  if (missingPlayers.length > 0) {
    console.error(`\nError: ${missingPlayers.length} players not found in playerIds:`);
    for (const name of missingPlayers) {
      console.error(`  - ${name}`);
    }
    process.exit(1);
  }

  console.log(`All ${popularPlayerIds.length} popular players found\n`);

  const content = `export const POPULAR_PLAYERS = [${popularPlayerIds.join(",")}];\n`;

  writeFileSync(OUTPUT_FILE, content, "utf-8");
  console.log(`Generated ${OUTPUT_FILE}`);
  console.log(`Total popular players: ${popularPlayerIds.length}\n`);
}

main();

