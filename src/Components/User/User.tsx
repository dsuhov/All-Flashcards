import { DropdownMenu } from '@gravity-ui/uikit';

export const User = () => {
  return (
    <DropdownMenu
      items={[
        {
          action: () => console.log('Rename'),
          text: 'Rename',
        },
        {
          action: () => console.log('Delete'),
          text: 'Delete',
          theme: 'danger',
        },
      ]}
    />
  );
};
