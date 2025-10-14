import { useEffect, useRef } from "preact/hooks";

interface AutocompleteProps {
  suggestions: string[];
  onSelect: (value: string) => void;
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
}

export function Autocomplete({
  suggestions,
  onSelect,
  activeIndex,
  onActiveIndexChange,
}: AutocompleteProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.keyCode === 40) {
        // Down arrow
        e.preventDefault();
        onActiveIndexChange(Math.min(activeIndex + 1, suggestions.length - 1));
      } else if (e.keyCode === 38) {
        // Up arrow
        e.preventDefault();
        onActiveIndexChange(Math.max(activeIndex - 1, 0));
      } else if (e.keyCode === 13) {
        // Enter
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < suggestions.length) {
          onSelect(suggestions[activeIndex]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, suggestions, onSelect, onActiveIndexChange]);

  if (suggestions.length === 0) return null;

  return (
    <div class="autocomplete-items" ref={listRef}>
      {suggestions.map((suggestion, index) => (
        <div
          key={index}
          class={index === activeIndex ? "autocomplete-active" : ""}
          onClick={() => onSelect(suggestion)}
        >
          {suggestion}
        </div>
      ))}
    </div>
  );
}
