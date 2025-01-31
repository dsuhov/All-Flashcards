import { KeyboardEvent, useMemo } from 'react';
import { useParams } from 'react-router';
import { Icon, Box, TextInput, Button, Loader } from '@gravity-ui/uikit';
import { Flex } from '@gravity-ui/uikit';
import { Magnifier } from '@gravity-ui/icons';
import { useTranslation } from 'react-i18next';
import { useUnit, useGate } from 'effector-react';
import styles from './styles.module.css';

import { EntryCard } from '@/Components/EntryCard';
import { EntryEdit, EntryNew } from '@/Components/EntryNew';
import { AddEntryBtn } from '@/Components/AddEntryBtn';
import {
  EntriesGate,
  $entriesData,
  $isEntriesPending,
  $editableEntryId,
  $isUpdateEntryPending,
  entryEditClicked,
  entryUpdated,
  entryDeleted,
  entryAdded,
  entryAddStarted,
  $isAddingNewEntry,
  $addEntryPending,
} from '@/models/entries';

export const EntriesPage = () => {
  const { t } = useTranslation();
  const { deckLink } = useParams<{ deckLink: string }>();

  const [
    entriesData,
    isEntriesPending,
    editableEntryId,
    entryEditClickedEvt,
    entryUpdatedEvt,
    isUpdateEntryPending,
    entryDeletedEvt,
    entryAddedEvt,
    isAddingNewEntry,
    entryAddStartedEvt,
    addEntryPending,
  ] = useUnit([
    $entriesData,
    $isEntriesPending,
    $editableEntryId,
    entryEditClicked,
    entryUpdated,
    $isUpdateEntryPending,
    entryDeleted,
    entryAdded,
    $isAddingNewEntry,
    entryAddStarted,
    $addEntryPending,
  ]);

  useGate(EntriesGate, deckLink || '');

  const entries = useMemo(() => {
    if (!entriesData) {
      return [];
    }

    const entriesToRender = entriesData.entries.map((entry) => {
      console.log('sdfsdfsdf');

      if (entry.entryId === editableEntryId) {
        return (
          <EntryEdit
            {...entry}
            key={entry.entryId}
            onSave={entryUpdatedEvt}
            onCancel={() => entryEditClickedEvt(null)}
            pending={isUpdateEntryPending}
          />
        );
      }

      return (
        <EntryCard
          {...entry}
          key={entry.entryId}
          onDelete={entryDeletedEvt}
          onEdit={() => entryEditClickedEvt(entry.entryId)}
        />
      );
    });

    if (isAddingNewEntry) {
      entriesToRender.unshift(
        <EntryNew
          key={0}
          onSave={entryAddedEvt}
          onCancel={() => entryAddStartedEvt(false)}
          pending={addEntryPending}
        />
      );
    }

    return entriesToRender;
  }, [
    entriesData,
    editableEntryId,
    entryEditClickedEvt,
    entryUpdatedEvt,
    entryDeletedEvt,
    isAddingNewEntry,
    entryAddedEvt,
    isUpdateEntryPending,
    entryAddStartedEvt,
    addEntryPending,
  ]);

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
      <Box spacing={{ mb: 2, px: 2 }}>
        <AddEntryBtn onAddEntry={() => entryAddStartedEvt(true)} />
      </Box>
      {isEntriesPending && (
        <Flex justifyContent="center">
          <Loader size="m" />
        </Flex>
      )}
      {entries.length > 0 && !isEntriesPending && (
        <Flex direction="column" gap={2} spacing={{ px: 2 }}>
          {entries}
        </Flex>
      )}
    </>
  );
};
