import { ChangeEvent, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useParams } from 'react-router';
import { Box, Flex, Loader, Dialog, Text, TextInput } from '@gravity-ui/uikit';

import { useUnit, useGate } from 'effector-react';

import { EntryCard } from '@/Components/widgets/EntryCard';
import { EntryEdit, EntryNew } from '@/Components/widgets/EntryNew';
import { AddEntryBtn } from '@/Components/UI/AddEntryBtn';
import { EntryId } from '@/types/entry';

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
  entriesSorted,
  $filteredEntriesData,
} from '@/models/entries';

import styles from './styles.module.css';

export const EntriesContainer = () => {
  const { t } = useTranslation();
  const { deckLink } = useParams<{ deckLink: string }>();

  const entryToDeleteRef = useRef<EntryId | null>(null);
  const [isDelEntryOpen, setIsDelEntryOpen] = useState(false);

  const timeoutId = useRef<number | undefined>();

  const [
    entriesData,
    filteredEntriesData,
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
    entriesSortedEvt,
  ] = useUnit([
    $entriesData,
    $filteredEntriesData,
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
    entriesSorted,
  ]);

  useGate(EntriesGate, deckLink || '');

  const onEntryDeleteHandler = (entryId: EntryId) => {
    entryToDeleteRef.current = entryId;
    setIsDelEntryOpen(true);
  };

  const onEntryDeleteConfirm = () => {
    if (entryToDeleteRef.current) {
      entryDeletedEvt(entryToDeleteRef.current);
      setIsDelEntryOpen(false);
    }
  };

  const onEntryDeleteCancel = () => {
    setIsDelEntryOpen(false);
  };

  const cleanDeckToDeleteId = () => {
    entryToDeleteRef.current = null;
  };

  const entries = useMemo(() => {
    if (!entriesData) {
      return [];
    }

    const entriesToRender = (filteredEntriesData || entriesData).entries
      .reverse()
      .map((entry) => {
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
            onDelete={onEntryDeleteHandler}
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
    filteredEntriesData,
    editableEntryId,
    entryEditClickedEvt,
    entryUpdatedEvt,
    isAddingNewEntry,
    entryAddedEvt,
    isUpdateEntryPending,
    entryAddStartedEvt,
    addEntryPending,
  ]);

  const onSearchChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (timeoutId) {
      clearTimeout(timeoutId.current);
    }

    timeoutId.current = window.setTimeout(() => {
      entriesSortedEvt(value);
      clearTimeout(timeoutId.current);
    }, 200);
  };

  return (
    <>
      <Box spacing={{ mb: 2, px: 2 }} className={styles.searchBar}>
        <TextInput
          label="Найти слово"
          placeholder="..."
          hasClear
          onChange={onSearchChangeHandler}
        />
      </Box>
      <Box spacing={{ mb: 2, px: 2 }}>
        <AddEntryBtn
          onAddEntry={() => entryAddStartedEvt(true)}
          disabled={filteredEntriesData !== null}
        />
      </Box>
      {isEntriesPending && (
        <Flex justifyContent="center">
          <Loader size="m" />
        </Flex>
      )}
      {entries.length > 0 && !isEntriesPending && (
        <Flex direction="column" gap={2} spacing={{ px: 2, pb: 2 }}>
          {entries}
        </Flex>
      )}
      <Dialog
        onTransitionExited={cleanDeckToDeleteId}
        onClose={onEntryDeleteCancel}
        open={isDelEntryOpen}
        onEnterKeyDown={onEntryDeleteConfirm}
      >
        <Dialog.Header caption={t('deck.remove')} />
        <Dialog.Body>
          <Flex direction="column">
            <Text variant="body-2">
              {t('entry.toDelete')}{' '}
              <Text color="danger" variant="body-3">
                {entriesData &&
                  entriesData.entries.find(
                    (entry) => entry.entryId === entryToDeleteRef.current
                  )?.entryText}
              </Text>
              ?
            </Text>
          </Flex>
        </Dialog.Body>
        <Dialog.Footer
          loading={isUpdateEntryPending}
          onClickButtonCancel={onEntryDeleteCancel}
          onClickButtonApply={onEntryDeleteConfirm}
          textButtonApply={t('entryCard.confirmRemove')}
          textButtonCancel={t('common.cancel')}
        />
      </Dialog>
    </>
  );
};
