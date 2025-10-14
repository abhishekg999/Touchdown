interface PlayerCellProps {
  playerName: string;
  variant?: "default" | "correct" | "wrong";
}

export function PlayerCell({ playerName, variant = "default" }: PlayerCellProps) {
  const className = variant === "default" ? "cell" : `cell ${variant}`;

  return <div class={className}>{playerName}</div>;
}
