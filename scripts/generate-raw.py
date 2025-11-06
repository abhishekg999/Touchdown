#!/usr/bin/env python3

import json
from pathlib import Path
import nflreadpy as nfl  # type: ignore

RAW_DATA_DIR = Path(__file__).parent.parent / "raw-data"
START_YEAR = 1999
END_YEAR = 2025


def main():
    print("Starting raw data generation with nflverse...\n")

    print("Cleaning raw-data directory...")
    if RAW_DATA_DIR.exists():
        import shutil

        shutil.rmtree(RAW_DATA_DIR)
    RAW_DATA_DIR.mkdir(parents=True, exist_ok=True)
    print("Raw-data directory ready\n")

    print("Fetching rosters...")
    years = list(range(START_YEAR, END_YEAR + 1))

    try:
        rosters_df = nfl.load_rosters(years)
        rosters = rosters_df.to_pandas()

        print(f"Loaded rosters for {len(years)} years\n")

        saved = 0
        for year in years:
            year_rosters = rosters[rosters["season"] == year]

            if year_rosters.empty:
                print(f"No data for {year}")
                continue

            teams = year_rosters["team"].unique()

            for team_abbr in teams:
                team_roster = year_rosters[year_rosters["team"] == team_abbr]

                players = []
                for _, player in team_roster.iterrows():
                    player_id = player.get("gsis_id")
                    if not player_id or str(player_id) == "nan":
                        continue

                    players.append(
                        {
                            "id": str(player_id),
                            "name": str(player.get("full_name", "")),
                            "number": (
                                str(int(player.get("jersey_number")))
                                if player.get("jersey_number")
                                and str(player.get("jersey_number")) != "nan"
                                else None
                            ),
                            "position": str(player.get("position", "")),
                            "height": str(player.get("height", "")),
                            "weight": (
                                int(player.get("weight"))
                                if player.get("weight")
                                and str(player.get("weight")) != "nan"
                                else None
                            ),
                            "college": str(player.get("college", "")),
                            "experience": (
                                str(int(player.get("years_exp")))
                                if player.get("years_exp")
                                and str(player.get("years_exp")) != "nan"
                                else None
                            ),
                        }
                    )

                if players:
                    filename = f"{team_abbr}_{year}.json"
                    filepath = RAW_DATA_DIR / filename

                    with open(filepath, "w") as f:
                        json.dump(players, f, separators=(",", ":"))

                    saved += 1

            print(f"Year {year}: {len(teams)} teams processed")

        print(f"\nComplete!")
        print(f"Saved {saved} files to raw-data/")

    except Exception as e:
        print(f"Error: {e}")
        import traceback

        traceback.print_exc()


if __name__ == "__main__":
    main()
