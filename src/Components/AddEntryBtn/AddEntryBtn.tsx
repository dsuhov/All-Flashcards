import { Button } from '@gravity-ui/uikit';
import { Icon } from '@gravity-ui/uikit';
import { CirclePlus } from '@gravity-ui/icons';

import { useTranslation } from 'react-i18next';

export const AddEntryBtn = ({ onAddEntry }: { onAddEntry: () => void }) => {
  const { t } = useTranslation();

  return (
    <Button
      width="max"
      view="outlined-success"
      title={t('entryNew.add')}
      onClick={onAddEntry}
    >
      <Icon size={20} data={CirclePlus} />
    </Button>
  );
};
