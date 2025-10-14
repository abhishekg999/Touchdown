import { useEffect, useRef } from "preact/hooks";
import { useResponsive } from "../hooks/useResponsive";
import { colors, fonts } from "../styles/theme";
import { highlight, type SearchResult } from "../utils/search";

interface AutocompleteProps {
  suggestions: SearchResult[];
  onSelect: (value: string) => void;
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  listboxId: string;
}

export function Autocomplete({
  suggestions,
  onSelect,
  activeIndex,
  onActiveIndexChange,
  listboxId,
}: AutocompleteProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useResponsive();

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
          const selected = suggestions[activeIndex];
          if (selected !== undefined) {
            onSelect(selected.value);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, suggestions, onSelect, onActiveIndexChange]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current && activeIndex >= 0) {
      const activeElement = listRef.current.children[activeIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [activeIndex]);

  if (suggestions.length === 0) return null;

  const containerStyle = {
    width: "100%",
    maxWidth: "640px",
    maxHeight: isMobile ? "240px" : "280px",
    border: `1px solid ${colors.text}`,
    backgroundColor: colors.autocompleteBackground,
    position: "absolute" as const,
    top: "0%",
    zIndex: 1,
    boxSizing: "border-box" as const,
    marginLeft: isMobile ? "0" : "5px",
    marginRight: isMobile ? "0" : "5px",
    transform: isMobile ? "translate(0, -12px)" : "translate(-4px, -15px)",
    fontFamily: fonts.main,
    fontSize: isMobile ? "13px" : "14px",
    fontWeight: 600,
    color: colors.text,
    display: "flex",
    flexDirection: "column" as const,
  };

  const listStyle = {
    flex: 1,
    overflowX: "hidden" as const,
    overflowY: "auto" as const,
    msOverflowStyle: "none" as const,
    scrollbarWidth: "none" as const,
  };

  const itemStyle = (isActive: boolean) => ({
    width: "100%",
    minHeight: isMobile ? "32px" : "35px",
    lineHeight: isMobile ? "32px" : "35px",
    backgroundColor: isActive ? colors.strong : colors.autocompleteBackground,
    alignItems: "center",
    borderBottom: `1px solid ${colors.border}`,
    paddingLeft: "8px",
    cursor: "pointer",
    color: colors.text,
    transition: "background-color 0.15s ease",
  });

  const footerStyle = {
    height: isMobile ? "22px" : "24px",
    lineHeight: isMobile ? "22px" : "24px",
    backgroundColor: colors.autocompleteBackground,
    borderTop: `1px solid ${colors.border}`,
    paddingLeft: "8px",
    paddingRight: "8px",
    fontSize: isMobile ? "10px" : "11px",
    color: colors.textGray,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexShrink: 0,
  };

  return (
    <div style={containerStyle}>
      <div
        ref={listRef}
        role="listbox"
        id={listboxId}
        aria-label="Player suggestions"
        style={listStyle}
      >
        {suggestions.map((result, index) => (
          <div
            key={index}
            onClick={() => onSelect(result.value)}
            onMouseEnter={() => onActiveIndexChange(index)}
            role="option"
            id={`${listboxId}-option-${index}`}
            aria-selected={index === activeIndex}
            style={itemStyle(index === activeIndex)}
            dangerouslySetInnerHTML={{ __html: highlight(result.value, result.ranges) }}
          />
        ))}
      </div>
      <div style={footerStyle}>
        <span>
          {suggestions.length} player{suggestions.length !== 1 ? "s" : ""} found
        </span>
        {!isMobile && <span style={{ fontSize: "10px" }}>↑↓ to navigate • ↵ to select</span>}
      </div>
    </div>
  );
}
