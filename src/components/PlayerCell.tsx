import { colors, fonts } from "../styles/theme";
import { useResponsive } from "../hooks/useResponsive";

interface PlayerCellProps {
  playerName: string;
  variant?: "default" | "correct" | "wrong";
}

export function PlayerCell({ playerName, variant = "default" }: PlayerCellProps) {
  const { isMobile } = useResponsive();
  const textColor =
    variant === "correct" ? colors.correct : variant === "wrong" ? colors.wrong : colors.text;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "678px",
        minHeight: isMobile ? "38px" : "40px",
        lineHeight: isMobile ? "38px" : "40px",
        overflowX: "hidden",
        overflowY: "hidden",
        whiteSpace: "nowrap",
        backgroundColor: colors.cellBackground,
        display: "flex",
        alignItems: "center",
        border: `1px solid ${colors.border}`,
        marginLeft: isMobile ? "0" : "5px",
        marginRight: isMobile ? "0" : "5px",
        marginBottom: isMobile ? "12px" : "15px",
        boxSizing: "border-box",
        paddingLeft: "8px",
        transform: isMobile ? "none" : "translate(-4px, 0px)",
        fontFamily: fonts.main,
        fontSize: isMobile ? "13px" : "14px",
        fontWeight: 600,
        color: textColor,
        userSelect: "text",
      }}
    >
      {playerName}
    </div>
  );
}
