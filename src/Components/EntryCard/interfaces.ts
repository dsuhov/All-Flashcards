import { Entry } from '@/types/entry';
import { BoxNumber, EntryId } from '@/types/entry';

export interface EntryCardProps extends Entry {
  currentBox: BoxNumber;
  isLearned: boolean;
  onDelete: (entryId: EntryId) => void;
  onEdit: (entryId: EntryId) => void;
}
