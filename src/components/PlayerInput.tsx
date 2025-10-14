import { useState, useRef, useEffect } from "preact/hooks";
import { Autocomplete } from "./Autocomplete";
import type { PlayerIds } from "../types";

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
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const getKeyByValue = (value: string): string | undefined => {
    return Object.keys(playerIds).find((key) => playerIds[key] === value);
  };

  const handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    setInputValue(value);

    if (!value) {
      setSuggestions([]);
      setActiveIndex(-1);
      return;
    }

    const filtered = playerNames
      .filter((name) => name.toUpperCase().startsWith(value.toUpperCase()))
      .slice(0, 10);

    setSuggestions(filtered);
    setActiveIndex(filtered.length > 0 ? 0 : -1);
  };

  const handleSelect = (name: string) => {
    const playerId = getKeyByValue(name);
    if (playerId) {
      onPlayerSelect(parseInt(playerId));
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

  return (
    <div id="next-pt">
      <input
        ref={inputRef}
        class="cell"
        id="ui"
        placeholder="Enter player name here"
        value={inputValue}
        onInput={handleInput}
        disabled={disabled}
        autoComplete="off"
        data-gramm="false"
        data-gramm_editor="false"
        data-enable-grammarly="false"
      />
      <div class="autocomplete-wrapper" id="autocomplete-wrapper">
        <Autocomplete
          suggestions={suggestions}
          onSelect={handleSelect}
          activeIndex={activeIndex}
          onActiveIndexChange={setActiveIndex}
        />
      </div>
    </div>
  );
}
