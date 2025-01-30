import { EntryNew } from '../../EntryNew';
import { EntryEditableProps, NewEntryContent } from '../../interfaces';

export const EntryEdit = (props: EntryEditableProps) => {
  // const { onSave, currentBox, ...rest } = props;
  const { ...rest } = props;

  const onSaveHandler = (newEntryContent: NewEntryContent[]) => {
    // onSave(newEntryContent, id);
    console.log('newEntryContent', newEntryContent);
  };

  return (
    <div>
      sdfsdf
      <EntryNew {...rest} onSave={onSaveHandler} showAddEntryBtn={false} />
    </div>
  );
};
