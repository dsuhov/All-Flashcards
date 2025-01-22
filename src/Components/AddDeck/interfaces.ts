import { ChangeEvent } from 'react';

export interface AddDeckProps {
  onAddDeckClick: () => void;
  inputFieldOpen: boolean;
  closePopup: () => void;
  onDeckNameInputChange: (evt: ChangeEvent<HTMLInputElement>) => void;
  deckNameNameValue: string;
  onSave: () => void;
  pending?: boolean;
  className?: string;
  error?: string;
}
