import { useState } from 'react';

import { Box, Flex, Button, Icon, Text } from '@gravity-ui/uikit';
import { Check, Tray, Xmark, Volume } from '@gravity-ui/icons';
import ReactSimplyCarousel from 'react-simply-carousel';
import { useTranslation } from 'react-i18next';

import { Box as BoxType, BoxNumber, FilledEntry } from '@/types/entry';

import { FlipCard } from './components/FlipCard';
import { LearnEntriesProps } from './interfaces';
import { useElementWidth } from './hooks/useElementWidth';
import { speak } from '@/services/speak';

import styles from './styles.module.css';
import { CAROUSEL_SETTINGS } from './constants';

const getNewBox = (entry: FilledEntry, isOk: boolean): BoxType => {
  const { boxId, deckId, entryId, currentBox } = entry;

  const newBox: BoxType = {
    boxId,
    deckId,
    entryId,
    lastStudied: Date.now(),
    box: isOk ? ((currentBox + 1) as BoxNumber) : currentBox,
  };

  return newBox;
};

export const LearnEntries = (props: LearnEntriesProps) => {
  const { entries, onLearnEnded, pending } = props;

  const { t } = useTranslation();
  const [width, setWidth] = useElementWidth();

  const [learnedBoxes, setLearnedBoxes] = useState<BoxType[]>([]);

  const activeIndex =
    learnedBoxes.length < entries.length
      ? learnedBoxes.length
      : learnedBoxes.length - 1;

  const onLearnActionHandler = (isOk: boolean) => {
    if (learnedBoxes.length + 1 === entries.length) {
      const currentEntryBeingLearned = entries[entries.length - 1];
      const newBox = getNewBox(currentEntryBeingLearned, isOk);
      const updatedLearnedBoxes = [...learnedBoxes, newBox];

      onLearnEnded(updatedLearnedBoxes);
    }

    setLearnedBoxes((prevBoxes) => {
      if (prevBoxes.length === entries.length) {
        return prevBoxes;
      }

      const currentEntryBeingLearned = entries[prevBoxes.length];
      const newBox = getNewBox(currentEntryBeingLearned, isOk);
      const updatedLearnedBoxes = [...prevBoxes, newBox];

      return updatedLearnedBoxes;
    });
  };

  const onSpeakHandler = () => {
    speak(entries[activeIndex].entryText);
  };

  return (
    <Flex className={styles.container} direction="column" gap={1}>
      <Flex justifyContent="space-between" spacing={{ px: 2 }}>
        <Box>
          <Text color="secondary" variant="code-2">
            {activeIndex + 1}/{entries.length}
          </Text>
        </Box>
        <Flex alignItems="center">
          <Icon className={styles.boxIcon} size={16} data={Tray} />
          {entries[activeIndex].currentBox}
        </Flex>
      </Flex>
      <Box style={{ flexGrow: 1 }} ref={setWidth}>
        {width && (
          <ReactSimplyCarousel
            activeSlideIndex={activeIndex}
            onRequestChange={() => {}}
            {...CAROUSEL_SETTINGS}
          >
            {entries.map((entry) => (
              <FlipCard key={entry.entryId} entry={entry} cardWidth={width} />
            ))}
          </ReactSimplyCarousel>
        )}
      </Box>

      <Flex justifyContent="center" alignItems="center" gap="8">
        <Button
          size="xl"
          view="outlined-warning"
          className={styles.btn}
          onClick={() => onLearnActionHandler(false)}
          title={t('learnEntries.dontRemember')}
          loading={pending}
        >
          <Icon data={Xmark} />
        </Button>
        <Button size="l" className={styles.btn} onClick={onSpeakHandler}>
          <Icon data={Volume} />
        </Button>
        <Button
          view="outlined-success"
          size="xl"
          className={styles.btn}
          onClick={() => onLearnActionHandler(true)}
          title={t('learnEntries.ok')}
          loading={pending}
        >
          <Icon data={Check} />
        </Button>
      </Flex>
    </Flex>
  );
};
