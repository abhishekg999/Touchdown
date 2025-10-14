import { Dialog } from "radix-ui";
import { colors } from "../styles/theme";
import { useResponsive } from "../hooks/useResponsive";
import { getModalStyles } from "../utils/modalStyles";
import { PlayerCell } from "./PlayerCell";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InfoModal({ isOpen, onClose }: InfoModalProps) {
  const { isMobile } = useResponsive();
  const styles = getModalStyles(isMobile);

  const descriptionStyle = {
    textAlign: "center" as const,
    marginBottom: isMobile ? "16px" : "20px",
    fontSize: isMobile ? "14px" : "15px",
  };

  const exampleTitleStyle = {
    textAlign: "center" as const,
    marginBottom: isMobile ? "12px" : "16px",
    fontSize: isMobile ? "13px" : "14px",
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
    marginBottom: isMobile ? "12px" : "16px",
    paddingLeft: isMobile ? "8px" : "12px",
    borderLeft: `2px solid ${colors.strong}`,
  };

  const explanationTextStyle = {
    fontSize: isMobile ? "12px" : "13px",
    lineHeight: 1.6,
    color: colors.textGray,
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay style={styles.overlay} />
        <Dialog.Content style={styles.content}>
          <Dialog.Close
            style={styles.closeButton}
            aria-label="Close"
            onMouseEnter={(e) => (e.currentTarget.style.color = colors.text)}
            onMouseLeave={(e) => (e.currentTarget.style.color = colors.textGray)}
          >
            &times;
          </Dialog.Close>

          <div style={{ ...styles.modalText, lineHeight: 1.6 }}>
            <div style={styles.header}>
              <Dialog.Title style={styles.headerText}>HOW TO PLAY</Dialog.Title>
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
