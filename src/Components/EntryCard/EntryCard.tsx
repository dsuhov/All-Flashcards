import { useMemo } from 'react';
import sanitizeHtml, { IOptions } from 'sanitize-html';
import {
  Card,
  Icon,
  Flex,
  Box,
  Text,
  Button,
  Disclosure,
} from '@gravity-ui/uikit';
import { TrashBin, Tray, Pencil } from '@gravity-ui/icons';
import cn from 'classnames';

import { DEFAULT_TEST_ID } from './constants';
import { EntryCardProps } from './interfaces';

import styles from './styles.module.css';

const sanitizeHtmlOpts: IOptions = {
  allowedTags: ['b', 'i', 'em', 'strong', 'a', 'br'],
};

const clean = (str: string) => {
  return sanitizeHtml(str, sanitizeHtmlOpts);
};

export const EntryCard = (props: EntryCardProps) => {
  const {
    entryId,
    entryText,
    definitions,
    transcription,
    currentBox,
    isLearned,
    onDelete,
    onEdit,
  } = props;

  const onDeleteHandler = () => onDelete(entryId);

  const onEditHandler = () => onEdit(entryId);

  const definitionsComps = useMemo(() => {
    if (definitions) {
      return definitions.map((definition, idx) => (
        <Card
          spacing={{ mb: 2, mt: 2, p: 3 }}
          key={idx}
          className={styles.definitions}
          view="raised"
        >
          <Text
            variant="body-2"
            dangerouslySetInnerHTML={{
              __html: clean(definition.text),
            }}
          />
          {definition.examples && (
            <Flex direction="column" gap={2} spacing={{ mt: 4 }}>
              {definition.examples.map((example, idx) => (
                <Text as="i" key={idx} className={styles.exText}>
                  {example}
                </Text>
              ))}
            </Flex>
          )}
        </Card>
      ));
    }
  }, [definitions]);

  return (
    <Card spacing={{ p: 3 }} tabIndex={0} data-testid={DEFAULT_TEST_ID.ROOT}>
      <Flex justifyContent="space-between" spacing={{ mb: 2 }}>
        <Flex gap={1} alignItems="center">
          {currentBox > 0 && (
            <>
              <Icon
                className={cn(styles.boxIcon, {
                  [styles.boxIcon_learned]: isLearned,
                })}
                size={16}
                data={Tray}
              />
              {currentBox <= 7 && !isLearned && (
                <Text color="secondary" qa={DEFAULT_TEST_ID.BOX_COUNT}>
                  {currentBox}
                </Text>
              )}
            </>
          )}
        </Flex>
        <Flex gap={2}>
          <Button
            view="flat"
            size="s"
            title="Удалить"
            className={styles.editButton}
            onClick={onDeleteHandler}
            qa={DEFAULT_TEST_ID.REMOVE_BTN}
          >
            <Icon data={Pencil} />
          </Button>
          <Button
            view="flat"
            size="s"
            title="Редактировать"
            className={styles.removeButton}
            onClick={onEditHandler}
            qa={DEFAULT_TEST_ID.REMOVE_BTN}
          >
            <Icon data={TrashBin} />
          </Button>
        </Flex>
      </Flex>
      <Box spacing={{ mb: 3 }}>
        <Text variant="body-3" wordBreak="break-all" className={styles.title}>
          {entryText}
        </Text>
        <Text color="hint">{`[${transcription}]`}</Text>
      </Box>

      <Disclosure>
        <Disclosure.Summary>
          {(props) => (
            <Button {...props} view="flat-info" qa={DEFAULT_TEST_ID.SHOW_BTN}>
              {props.expanded ? 'Скрыть' : 'Показать'}
            </Button>
          )}
        </Disclosure.Summary>
        {definitionsComps}
      </Disclosure>
    </Card>
  );
};
