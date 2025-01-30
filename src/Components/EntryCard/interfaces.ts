import { FilledEntry } from '@/types/entry';
import { EntryId } from '@/types/entry';

export interface EntryCardProps extends Omit<FilledEntry, 'boxId'> {
  onDelete: (entryId: EntryId) => void;
  onEdit: (entryId: EntryId) => void;
}
