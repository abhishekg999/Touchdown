import { Dialog } from "radix-ui";
import { colors, fonts } from "../styles/theme";
import { PlayerCell } from "./PlayerCell";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InfoModal({ isOpen, onClose }: InfoModalProps) {
  const overlayStyle = {
    position: "fixed" as const,
    inset: 0,
    zIndex: 999,
    backgroundColor: colors.overlay,
    backdropFilter: "blur(4px)",
  };

  const contentStyle = {
    position: "fixed" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 1000,
    backgroundColor: colors.modalBackground,
    padding: "24px",
    border: `1px solid ${colors.strong}`,
    width: "85%",
    maxWidth: "512px",
    maxHeight: "90vh",
    overflowY: "auto" as const,
    boxSizing: "border-box" as const,
  };

  const closeButtonStyle = {
    color: colors.textGray,
    fontSize: "34px",
    fontWeight: "bold" as const,
    display: "block",
    position: "absolute" as const,
    top: "15px",
    right: "15px",
    background: "none",
    border: "none",
    padding: 0,
    cursor: "pointer",
    lineHeight: 1,
  };

  const headerStyle = {
    borderBottom: `1px solid ${colors.strong}`,
    textAlign: "center" as const,
    paddingBottom: "16px",
    marginBottom: "20px",
  };

  const headerTextStyle = {
    fontFamily: fonts.headline,
    fontSize: "28px",
    fontWeight: 700,
    color: colors.text,
    margin: 0,
    letterSpacing: "2px",
    textTransform: "uppercase" as const,
  };

  const modalTextStyle = {
    fontFamily: fonts.main,
    fontSize: "14px",
    color: colors.text,
    lineHeight: 1.6,
  };

  const descriptionStyle = {
    textAlign: "center" as const,
    marginBottom: "20px",
    fontSize: "15px",
  };

  const exampleTitleStyle = {
    textAlign: "center" as const,
    marginBottom: "16px",
    fontSize: "14px",
  };

  const sampleContainerStyle = {
    marginBottom: "20px",
  };

  const dividerStyle = {
    height: "1px",
    background: `linear-gradient(to right, transparent, ${colors.strong}, transparent)`,
    marginTop: "24px",
    marginBottom: "20px",
  };

  const explanationItemStyle = {
    marginBottom: "16px",
    paddingLeft: "12px",
    borderLeft: `2px solid ${colors.strong}`,
  };

  const explanationTextStyle = {
    fontSize: "13px",
    lineHeight: 1.6,
    color: colors.textGray,
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay style={overlayStyle} />
        <Dialog.Content style={contentStyle}>
          <Dialog.Close
            style={closeButtonStyle}
            aria-label="Close"
            onMouseEnter={(e) => (e.currentTarget.style.color = colors.text)}
            onMouseLeave={(e) => (e.currentTarget.style.color = colors.textGray)}
          >
            &times;
          </Dialog.Close>

          <div style={modalTextStyle}>
            <div style={headerStyle}>
              <Dialog.Title style={headerTextStyle}>HOW TO PLAY</Dialog.Title>
            </div>

            <Dialog.Description style={descriptionStyle}>
              Connect two NFL players through 6 or fewer mutual teammates
            </Dialog.Description>

            <div style={exampleTitleStyle}>
              Example: Connect <strong style={{ color: colors.strong }}>Drew Brees</strong> to{" "}
              <strong style={{ color: colors.strong }}>Aaron Rodgers</strong>
            </div>

            <div style={sampleContainerStyle}>
              <div style={{ marginBottom: "10px" }}>
                <PlayerCell playerName="Drew Brees" />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <PlayerCell playerName="Brandin Cooks" variant="correct" />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <PlayerCell playerName="Patrick Mahomes" variant="wrong" />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <PlayerCell playerName="Randall Cobb" variant="correct" />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <PlayerCell playerName="Aaron Rodgers" />
              </div>
            </div>

            <div style={dividerStyle} />

            <div>
              <div style={explanationItemStyle}>
                <strong style={{ color: colors.correct }}>Brandin Cooks</strong> played with Drew
                Brees, but never played with Rodgers.
              </div>

              <div style={explanationItemStyle}>
                <strong style={{ color: colors.wrong }}>Patrick Mahomes</strong> never played with
                Brandin Cooks.
              </div>

              <div style={{ ...explanationItemStyle, marginBottom: 0 }}>
                <strong style={{ color: colors.correct }}>Randall Cobb</strong> played with Brandin
                Cooks, and also played with Rodgers. ✓
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
