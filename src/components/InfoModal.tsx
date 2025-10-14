import { Modal } from "./Modal";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InfoModal({ isOpen, onClose }: InfoModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div class="modal-header">
        <header>HOW TO PLAY</header>
        Connect two NFL players through 6 or fewer mutual teammates.
      </div>
      <p>
        Example: Connect <strong>Drew Brees</strong> to <strong>Aaron Rodgers</strong>
      </p>
      <div class="info-modal-sample">
        <div class="cell">Drew Brees</div>
        <div class="cell correct">Brandin Cooks</div>
        <div class="cell wrong">Patrick Mahomes</div>
        <div class="cell correct">Randall Cobb</div>
        <div class="cell">Aaron Rodgers</div>
      </div>
      <div class="info-modal-guess-explanation">
        <div class="info-modal-explanation-cell">
          <span>
            Guess 1: <span class="correct">Brandin Cooks</span>
          </span>
          <div class="info-modal-explanation-reason">
            Brandon Cooks played with Drew Brees, however, he's never played with Rodgers.
          </div>
        </div>
        <div class="info-modal-explanation-cell">
          <span>
            Guess 2: <span class="wrong">Patrick Mahomes</span>
          </span>
          <div class="info-modal-explanation-reason">
            Patrick Mahomes never played with Brandon Cooks.
          </div>
        </div>
        <div class="info-modal-explanation-cell">
          <span>
            Guess 3: <span class="correct">Randall Cobb</span>
          </span>
          <div class="info-modal-explanation-reason">
            Randall Cobb played with Brandin Cooks, and also played with Rodgers.
          </div>
        </div>
      </div>
    </Modal>
  );
}
