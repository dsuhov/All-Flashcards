import { useState, useEffect, useMemo, Fragment, useRef } from 'react';
import { Box, Text, Flex, Divider } from '@gravity-ui/uikit';
import cn from 'classnames';

import { FilledEntryProps } from './interfaces';
import styles from './styles.module.css';
import { SCROLL_TIMEOUT } from './constants';
import { cleanStylesAttr } from '@/utils/cleanStylesAttr';

export const FlipCard = (props: FilledEntryProps) => {
  const { entry, cardWidth } = props;

  const backContentRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef<boolean>(false);

  const [isTapped, setIsTapped] = useState(false);
  const [isBackShowed, setIsBackShowed] = useState(false);

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (isScrolling.current) {
      return;
    }

    setIsTapped(true);
    setIsBackShowed((prev) => !prev);
  };

  const handleClick = () => {
    if (!isTapped) {
      setIsBackShowed((prev) => !prev);
    }
    setIsTapped(false);
  };

  useEffect(() => {
    let timeout: number;

    const handleScroll = () => {
      if (timeout) {
        clearTimeout(timeout);
      }

      isScrolling.current = true;

      timeout = setTimeout(() => {
        isScrolling.current = false;
      }, SCROLL_TIMEOUT);
    };

    const backContent = backContentRef.current;

    if (backContent) {
      backContent.addEventListener('touchmove', handleScroll);
    }

    return () => {
      if (backContent) {
        backContent.removeEventListener('touchmove', handleScroll);
      }
    };
  }, []);

  const definitionsComps = useMemo(() => {
    if (entry.definitions) {
      return entry.definitions.map((definition, idx) => (
        <Fragment key={idx}>
          <Box>
            <Text
              variant="body-2"
              dangerouslySetInnerHTML={{
                __html: cleanStylesAttr(definition.text),
              }}
            />
            {definition.examples && (
              <Flex direction="column" gap={2} spacing={{ mt: 2 }}>
                {definition.examples.map((example, idx) => (
                  <Text as="i" key={idx}>
                    {example}
                  </Text>
                ))}
              </Flex>
            )}
          </Box>
          {idx !== entry.definitions!.length - 1 && (
            <Divider align="center">{idx + 2}</Divider>
          )}
        </Fragment>
      ));
    }
  }, [entry]);

  return (
    <Box className={styles.cardContainer} style={{ width: cardWidth }}>
      <div
        className={cn(styles.card, {
          [styles.active]: isBackShowed,
        })}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
      >
        <Box className={styles.cardFront} spacing={{ p: 4 }}>
          <Flex direction="column" gap={2}>
            <Text variant="body-3">{entry.entryText}</Text>
            {entry.transcription && (
              <Text color="hint">{`[${entry.transcription}]`}</Text>
            )}
          </Flex>
        </Box>
        <Box className={styles.cardBack} spacing={{ p: 4 }}>
          {definitionsComps && definitionsComps.length > 0 && (
            <Flex
              direction="column"
              gap={2}
              className={styles.cardBackContent}
              ref={backContentRef}
            >
              {definitionsComps}
            </Flex>
          )}
        </Box>
      </div>
    </Box>
  );
};
