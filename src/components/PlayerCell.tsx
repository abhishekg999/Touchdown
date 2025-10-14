import { colors, fonts } from "../styles/theme";

interface PlayerCellProps {
  playerName: string;
  variant?: "default" | "correct" | "wrong";
}

export function PlayerCell({ playerName, variant = "default" }: PlayerCellProps) {
  const textColor =
    variant === "correct" ? colors.correct : variant === "wrong" ? colors.wrong : colors.text;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "678px",
        minHeight: "40px",
        lineHeight: "40px",
        overflowX: "hidden",
        overflowY: "hidden",
        whiteSpace: "nowrap",
        backgroundColor: colors.cellBackground,
        display: "flex",
        alignItems: "center",
        border: `1px solid ${colors.border}`,
        marginLeft: "5px",
        marginRight: "5px",
        marginBottom: "15px",
        boxSizing: "border-box",
        paddingLeft: "8px",
        transform: "translate(-4px, 0px)",
        fontFamily: fonts.main,
        fontSize: "14px",
        fontWeight: 600,
        color: textColor,
        userSelect: "text",
      }}
    >
      {playerName}
    </div>
  );
}
