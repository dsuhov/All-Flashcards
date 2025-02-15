import { useGate, useUnit } from 'effector-react';
import { Navigate } from 'react-router';

import { LearnEntries } from '../LearnEntries';
import { ConfirmLearnModal } from './components/ConfirmLearnModal';

import { LearnContainerProps } from './interfaces';

import {
  $filledEntriesToLearn,
  LearnGate,
  $isRedirectToMain,
  $entriesBlockToLearn,
  entriesLearned,
  $isUpdateLearnedBoxesPending,
  $isExitComfirmOpen,
  learnBlockCreated,
  pageRedirected,
} from '@/models/learn';
import { Box } from '@/types/entry';

export const LearnContainer = (props: LearnContainerProps) => {
  const { deckLinkName } = props;

  useGate(LearnGate, { deckLinkName });

  const [
    filledEntriesToLearn,
    isRedirectToMain,
    entriesBlockToLearn,
    entriesLearnedEvt,
    isUpdateLearnedBoxesPending,
    isExitComfirmOpen,
    learnBlockCreatedEvt,
    pageRedirectedEvt,
  ] = useUnit([
    $filledEntriesToLearn,
    $isRedirectToMain,
    $entriesBlockToLearn,
    entriesLearned,
    $isUpdateLearnedBoxesPending,
    $isExitComfirmOpen,
    learnBlockCreated,
    pageRedirected,
  ]);

  const onEntriesLearnedHandler = (learnedBoxes: Box[]) => {
    entriesLearnedEvt(learnedBoxes);
  };

  if (isRedirectToMain) {
    return <Navigate to="/" />;
  }

  return entriesBlockToLearn.length > 0 ? (
    <>
      {!isExitComfirmOpen && (
        <LearnEntries
          entries={entriesBlockToLearn}
          onLearnEnded={onEntriesLearnedHandler}
          pending={isUpdateLearnedBoxesPending}
        />
      )}
      <ConfirmLearnModal
        open={isExitComfirmOpen}
        toLearnQuantity={filledEntriesToLearn.length}
        onLearnMore={learnBlockCreatedEvt}
        onToDecks={pageRedirectedEvt}
      />
    </>
  ) : null;
};
