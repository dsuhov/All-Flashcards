import { Button } from '@gravity-ui/uikit';
import { Icon } from '@gravity-ui/uikit';
import { CirclePlus } from '@gravity-ui/icons';

export const AddEntryBtn = ({ onAddEntry }: { onAddEntry: () => void }) => (
  <Button
    width="max"
    view="outlined-success"
    qa="AddEntryBtn"
    onClick={onAddEntry}
  >
    <Icon size={20} data={CirclePlus} />
  </Button>
);
