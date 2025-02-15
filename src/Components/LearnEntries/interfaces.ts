import { FilledEntry, Box } from '@/types/entry';

export interface LearnEntriesProps {
  entries: FilledEntry[];
  onLearnEnded: (learnedBoxes: Box[]) => void;
  pending?: boolean;
}
