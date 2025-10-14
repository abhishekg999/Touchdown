import { useEffect, useRef, useState } from "preact/hooks";
import { colors, fonts } from "../styles/theme";
import type { PlayerIds } from "../types";
import { search, type SearchResult } from "../utils/search";
import { getPlayerIdByName } from "../utils/typeGuards";
import { Autocomplete } from "./Autocomplete";

interface PlayerInputProps {
  playerNames: string[];
  playerIds: PlayerIds;
  onPlayerSelect: (playerId: number) => void;
  disabled: boolean;
}

export function PlayerInput({
  playerNames,
  playerIds,
  onPlayerSelect,
  disabled,
}: PlayerInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    setInputValue(value);

    if (!value) {
      setSuggestions([]);
      setActiveIndex(-1);
      return;
    }

    const results = search(value, playerNames).slice(0, 10);

    setSuggestions(results);
    setActiveIndex(results.length > 0 ? 0 : -1);
  };

  const handleSelect = (name: string) => {
    const playerId = getPlayerIdByName(playerIds, name);
    if (playerId !== undefined) {
      onPlayerSelect(playerId);
      setInputValue("");
      setSuggestions([]);
      setActiveIndex(-1);
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
      setSuggestions([]);
      setActiveIndex(-1);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const listboxId = "player-listbox";
  const activeOptionId = activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined;

  const inputStyle = {
    width: "100%",
    maxWidth: "678px",
    minHeight: "40px",
    lineHeight: "40px",
    overflowX: "hidden" as const,
    overflowY: "hidden" as const,
    whiteSpace: "nowrap" as const,
    backgroundColor: colors.cellBackground,
    display: "flex",
    alignItems: "center",
    border: `1px solid ${colors.border}`,
    marginLeft: "5px",
    marginRight: "5px",
    marginBottom: "15px",
    boxSizing: "border-box" as const,
    paddingLeft: "8px",
    transform: "translate(-4px, 0px)",
    fontFamily: fonts.main,
    fontSize: "14px",
    fontWeight: 600,
    color: colors.text,
  };

  return (
    <div>
      <input
        ref={inputRef}
        style={inputStyle}
        placeholder="Enter player name here"
        value={inputValue}
        onInput={handleInput}
        disabled={disabled}
        autoComplete="off"
        data-gramm="false"
        data-gramm_editor="false"
        data-enable-grammarly="false"
        role="combobox"
        aria-autocomplete="list"
        aria-controls={suggestions.length > 0 ? listboxId : undefined}
        aria-expanded={suggestions.length > 0}
        aria-activedescendant={activeOptionId}
        aria-label="Enter NFL player name"
      />
      <div style={{ position: "relative" }}>
        <Autocomplete
          suggestions={suggestions}
          onSelect={handleSelect}
          activeIndex={activeIndex}
          onActiveIndexChange={setActiveIndex}
          listboxId={listboxId}
        />
      </div>
    </div>
  );
}
