import { Card } from '@gravity-ui/uikit';
import { EntryForm } from './EntryForm';
import { DEFAULT_TEST_ID } from './constants';
import { EntryNewProps } from './interfaces';

export const EntryNew = (props: EntryNewProps) => {
  return (
    <Card spacing={{ p: 3 }} data-testid={DEFAULT_TEST_ID.ROOT}>
      <EntryForm {...props} />
    </Card>
  );
};
