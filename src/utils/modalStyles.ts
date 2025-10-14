import { colors, fonts } from "../styles/theme";

export const getModalStyles = (isMobile: boolean) => ({
  overlay: {
    position: "fixed" as const,
    inset: 0,
    zIndex: 999,
    backgroundColor: colors.overlay,
    backdropFilter: "blur(4px)",
  },

  content: {
    position: "fixed" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 1000,
    backgroundColor: colors.modalBackground,
    padding: isMobile ? "16px" : "24px",
    border: `1px solid ${colors.strong}`,
    width: isMobile ? "92%" : "85%",
    maxWidth: "512px",
    maxHeight: isMobile ? "85vh" : "90vh",
    overflowY: "auto" as const,
    boxSizing: "border-box" as const,
  },

  closeButton: {
    color: colors.textGray,
    fontSize: isMobile ? "28px" : "34px",
    fontWeight: "bold" as const,
    display: "block",
    position: "absolute" as const,
    top: isMobile ? "10px" : "15px",
    right: isMobile ? "10px" : "15px",
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
    lineHeight: 1,
    outline: "none",
  },

  header: {
    borderBottom: `1px solid ${colors.strong}`,
    textAlign: "center" as const,
    paddingBottom: isMobile ? "12px" : "16px",
    marginBottom: isMobile ? "16px" : "20px",
  },

  headerText: {
    fontFamily: fonts.headline,
    fontSize: isMobile ? "20px" : "28px",
    fontWeight: 700,
    color: colors.text,
    margin: 0,
    letterSpacing: isMobile ? "1px" : "2px",
    textTransform: "uppercase" as const,
  },

  modalText: {
    fontFamily: fonts.main,
    fontSize: isMobile ? "12px" : "13px",
    color: colors.text,
  },
});
