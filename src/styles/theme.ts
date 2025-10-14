export const colors = {
  background: "#101110",
  cellBackground: "#0f222e",
  autocompleteBackground: "#061219",
  modalBackground: "#000000",

  text: "#ffffff",
  textGray: "#aaaaaa",
  textPlaceholder: "#647782",

  emphasis: "#ffff00",
  correct: "#008000",
  wrong: "#ff0000",
  warning: "#ff4500",
  strong: "#ff7a4a",

  border: "#888888",
  borderLight: "#585959",

  hover: "#a9a9a9",
  active: "#1e90ff",

  overlay: "rgba(0, 0, 0, 0.6)",
} as const;

export const fonts = {
  main: '"Open Sans", sans-serif',
  headline: '"Orbitron", sans-serif',
} as const;

export const fontSizes = {
  xs: "8px",
  sm: "12px",
  base: "13px",
  md: "14px",
  lg: "16px",
  xl: "24px",
  "2xl": "32px",
  "3xl": "54px",
} as const;

export const spacing = {
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "15px",
  xl: "20px",
} as const;

export const zIndex = {
  modal: 999,
  modalContent: 1000,
  autocomplete: 1,
} as const;
