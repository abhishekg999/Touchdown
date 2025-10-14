import type { ComponentChildren } from "preact";
import { Dialog } from "radix-ui";
import { colors } from "../styles/theme";
import { useResponsive } from "../hooks/useResponsive";
import { getModalStyles } from "../utils/modalStyles";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ComponentChildren;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const { isMobile } = useResponsive();
  const styles = getModalStyles(isMobile);

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
          <div style={styles.modalText}>
            <div style={styles.header}>
              <Dialog.Title style={styles.headerText}>{title}</Dialog.Title>
            </div>
            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
