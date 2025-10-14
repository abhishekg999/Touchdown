import type { ComponentChildren } from "preact";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ComponentChildren;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div class="modal" style={{ display: "flex" }} onClick={handleBackdropClick}>
      <div class="modal-content">
        <header>
          <div class="close" onClick={onClose}>
            &times;
          </div>
        </header>
        <div class="modal-text">{children}</div>
      </div>
    </div>
  );
}
