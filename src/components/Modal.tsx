import type { ComponentChildren } from "preact";
import { Dialog } from "radix-ui";
import { colors, fonts } from "../styles/theme";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ComponentChildren;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
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
    fontSize: "13px",
    color: colors.text,
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
              <Dialog.Title style={headerTextStyle}>{title}</Dialog.Title>
            </div>

            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
