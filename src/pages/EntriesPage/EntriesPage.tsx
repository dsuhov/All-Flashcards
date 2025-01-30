import { KeyboardEvent, useMemo } from 'react';
import { useParams } from 'react-router';
import { Icon, Box, TextInput, Button, Loader } from '@gravity-ui/uikit';
import { Flex } from '@gravity-ui/uikit';
import { Magnifier } from '@gravity-ui/icons';
import { useTranslation } from 'react-i18next';
import { useUnit, useGate } from 'effector-react';
import styles from './styles.module.css';

import { EntryCard } from '@/Components/EntryCard';
import { AddEntryBtn } from '@/Components/AddEntryBtn';
import { EntriesGate, $entriesData, $isEntriesPending } from '@/models/entries';

// import { EntryId } from '@/types/entry';

export const EntriesPage = () => {
  const { t } = useTranslation();
  const { deckLink } = useParams<{ deckLink: string }>();

  // const [editableEntryId, setEditableEntryId] = useState<EntryId | null>(null);
  // const [isAddingNewEntry, setIsAddingNewEntry] = useState(false);

  const [entriesData, isEntriesPending] = useUnit([
    $entriesData,
    $isEntriesPending,
  ]);

  useGate(EntriesGate, deckLink || '');

  const entries = useMemo(() => {
    if (!entriesData) {
      return [];
    }

    const entriesToRender = entriesData.entries.map((entry) => {
      // if (entry.entryId === editableEntryId) {
      //   return <h1>Editable</h1>;
      // }

      return (
        <EntryCard
          {...entry}
          key={entry.entryId}
          onDelete={() => console.log('delete')}
          onEdit={() => console.log('edit')}
        />
      );
    });

    // if (isAddingNewEntry) {
    //   entriesToRender.unshift(<h1>Adding new entry</h1>);
    // }

    return entriesToRender;
    // }, [entriesData, isAddingNewEntry, editableEntryId]);
  }, [entriesData]);

  return (
    <>
      <Box spacing={{ p: 2, mb: 2 }} className={styles.searchBar}>
        <TextInput
          placeholder={t('add_deck.find')}
          onKeyPress={(evt: KeyboardEvent<HTMLInputElement>) => {
            if (evt.code === 'Enter') {
              console.log('enter pressed');
            }
          }}
          hasClear
          size="m"
          endContent={
            <Button view="flat" size="s" title={t('add_deck.input_title')}>
              <Icon data={Magnifier} />
            </Button>
          }
        />
      </Box>
      {isEntriesPending && (
        <Flex justifyContent="center">
          <Loader size="m" />
        </Flex>
      )}
      {entries.length > 0 && !isEntriesPending && (
        <Flex direction="column" gap={2} spacing={{ px: 2 }}>
          <AddEntryBtn onAddEntry={() => console.log('AddEntryBtn clicked')} />
          {entries}
        </Flex>
      )}
    </>
  );
};
