import { ModalProps } from '@gravity-ui/uikit';

export interface ConfirmLearnModalProps extends ModalProps {
  toLearnQuantity: number;
  onLearnMore: () => void;
  onToDecks: () => void;
}
