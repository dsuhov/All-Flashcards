import { FilledEntry, Entry } from '@/types/entry';
import { Static } from 'runtypes';

type MyPick<T, K extends keyof T> = {
  [P in K]-?: T[P];
};

export type NewEntryContentSheme = MyPick<
  FilledEntry,
  'entryText' | 'definitions' | 'transcription'
>;

export const NewEntryContent = Entry.pick(
  'entryText',
  'definitions',
  'transcription'
);

export type NewEntryContent = Static<typeof NewEntryContent>;
export type UpdatableEntryContent = Omit<FilledEntry, 'deckid'>;

export interface EntryEditableProps extends UpdatableEntryContent {
  onCancel: () => void;
  onSave: (updatedEntryContent: UpdatableEntryContent) => void;
  pending?: boolean;
}

export interface EntryNewProps {
  onSave: (newEntryContent: NewEntryContent[]) => void;
  onCancel: () => void;
  showAddEntryBtn?: boolean;
  defaultEntryContent?: NewEntryContent;
  pending?: boolean;
}

export type ValidateEntriesFieldsResult =
  | { type: 'FIELD_EMPTY'; entryIndex: number }
  | { type: 'DEFINITION_EMPTY'; entryIndex: number; definitionIndex: number };
