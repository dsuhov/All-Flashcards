import { useState } from 'react';
import { Card, Box, Select } from '@gravity-ui/uikit';
import { useTranslation } from 'react-i18next';

import { BOX_LEARNED } from '@/constants';
import { BoxNumber } from '@/types/entry';
import { EntryForm } from '../../EntryForm';
import { EntryEditableProps, NewEntryContent } from '../../interfaces';

export const EntryEdit = (props: EntryEditableProps) => {
  const {
    onSave,
    currentBox,
    entryId,
    entryText,
    transcription,
    definitions,
    boxId,
    ...rest
  } = props;

  const [box, setBox] = useState<string[]>([currentBox.toString()]);

  const { t } = useTranslation();

  const onSaveHandler = (newEntryContent: NewEntryContent[]) => {
    const updatedEntryContent = newEntryContent[0];

    const updatedEntry = {
      ...updatedEntryContent,
      entryId,
      boxId,
      currentBox: BoxNumber.check(Number(box[0])),
    };

    onSave(updatedEntry);
  };

  const onValueChange = (value: string[]) => {
    setBox([value[0]]);
  };

  return (
    <Card spacing={{ p: 3 }}>
      <Box spacing={{ mb: 2 }}>
        <Select label={t('entryEdit.box')} value={box} onUpdate={onValueChange}>
          {Array.from({ length: BOX_LEARNED + 1 }, (_, idx) => (
            <Select.Option value={idx.toString()} key={idx}>
              {idx.toString()}
            </Select.Option>
          ))}
        </Select>
      </Box>
      <EntryForm
        {...rest}
        defaultEntryContent={{
          entryText: entryText,
          transcription: transcription,
          definitions: definitions,
        }}
        onSave={onSaveHandler}
        showAddEntryBtn={false}
      />
    </Card>
  );
};
