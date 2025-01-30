import { useState, useMemo, Fragment } from 'react';
import { ContentEditableEvent } from 'react-simple-wysiwyg';
import {
  Card,
  Box,
  Flex,
  Text,
  TextInput,
  TextArea,
  Icon,
  Button,
  Divider,
} from '@gravity-ui/uikit';
import { CirclePlus } from '@gravity-ui/icons';
import { useTranslation } from 'react-i18next';

import { Editor } from '@/Components/Editor';
import { cleanEntriesFields, validateEntriesFields } from './utils';
import {
  EntryNewProps,
  NewEntryContentSheme,
  ValidateEntriesFieldsResult,
} from './interfaces';
import { DEFAULT_TEST_ID } from './constants';

export const EntryNew = (props: EntryNewProps) => {
  const { onSave, onCancel, showAddEntryBtn = true } = props;

  const { t } = useTranslation();

  const [errors, setErrors] = useState<ValidateEntriesFieldsResult[] | null>(
    null
  );
  const [entryContents, setEntryContents] = useState<NewEntryContentSheme[]>([
    {
      entryText: '',
      transcription: '',
      definitions: [{ text: '', examples: [''] }],
    },
  ]);

  const onSaveHandler = () => {
    const result = validateEntriesFields(entryContents);

    if (result.length > 0) {
      setErrors(result);
    } else {
      setErrors(null);
      const cleanedEntryContents = cleanEntriesFields(entryContents);

      onSave(cleanedEntryContents);
    }
  };

  const onAddEntryHandler = () => {
    setEntryContents((prev) => [
      ...prev,
      {
        entryText: '',
        transcription: '',
        definitions: [{ text: '', examples: [''] }],
      },
    ]);
  };

  const onAddDefinitionEntryHandler = () => {
    setEntryContents((prev) => {
      const newEntryContents = [...prev];
      newEntryContents[newEntryContents.length - 1].definitions.push({
        text: '',
        examples: [''],
      });
      return newEntryContents;
    });
  };

  const onAddExample = (entryIndex: number, definitionIndex: number) => {
    setEntryContents((prev) => {
      const newEntryContents = [...prev];

      newEntryContents[entryIndex].definitions[definitionIndex].examples = [
        ...newEntryContents[entryIndex].definitions[definitionIndex].examples!,
        '',
      ];

      return newEntryContents;
    });
  };

  const onEntryTextChangeHandler = (value: string, entryIndex: number) => {
    setEntryContents((prev) => {
      const newEntryContents = [...prev];
      newEntryContents[entryIndex] = {
        ...newEntryContents[entryIndex],
        entryText: value,
      };
      return newEntryContents;
    });
  };

  const onTranscriptionChangeHandler = (value: string, entryIndex: number) => {
    setEntryContents((prev) => {
      const newEntryContents = [...prev];
      newEntryContents[entryIndex] = {
        ...newEntryContents[entryIndex],
        transcription: value,
      };
      return newEntryContents;
    });
  };

  const onEntryDefinitionChangeHandler = (
    value: string,
    entryIndex: number,
    definitionIndex: number
  ) => {
    setEntryContents((prev) => {
      const newEntryContents = [...prev];

      newEntryContents[entryIndex].definitions = newEntryContents[
        entryIndex
      ].definitions.map((definition, idx) =>
        idx === definitionIndex
          ? {
              ...definition,
              text: value.replace(/<br>/g, ''),
            }
          : definition
      );

      return newEntryContents;
    });
  };

  const onExampleChangeHandler = (
    value: string,
    entryIndex: number,
    definitionIndex: number,
    exampleIndex: number
  ) => {
    setEntryContents((prev) => {
      const newEntryContents = [...prev];

      if (newEntryContents[entryIndex].definitions[definitionIndex].examples) {
        newEntryContents[entryIndex].definitions[definitionIndex].examples =
          newEntryContents[entryIndex].definitions[
            definitionIndex
          ].examples.map((example, idx) =>
            idx === exampleIndex ? value : example
          );
      }

      return newEntryContents;
    });
  };

  const entriesArray = useMemo(() => {
    const ERROR_TEXT = {
      FIELD_EMPTY: t('entryNew.fieldEmpty'),
      DEFINITION_EMPTY: t('entryNew.definitionEmpty'),
    };

    const expamplesBlock = (
      definition: NewEntryContentSheme['definitions'][number],
      entryIndex: number,
      definitionIndex: number
    ) => {
      return definition.examples?.map((example, exampleIndex) => (
        <Flex gap={2} key={exampleIndex}>
          <TextArea
            placeholder={t('entryNew.example')}
            value={example}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              onExampleChangeHandler(
                e.target.value,
                entryIndex,
                definitionIndex,
                exampleIndex
              )
            }
          />
          {definition.examples!.length - 1 === exampleIndex && (
            <Button
              title={t('entryNew.addExample')}
              view="outlined-success"
              onClick={() => onAddExample(entryIndex, definitionIndex)}
            >
              <Icon size={18} data={CirclePlus} />
            </Button>
          )}
        </Flex>
      ));
    };

    const definitionsBlock = (
      entryContent: NewEntryContentSheme,
      entryIndex: number
    ) => {
      return entryContent.definitions.map((definition, definitionIndex) => {
        const error = errors?.find(
          (err) =>
            err.type === 'DEFINITION_EMPTY' &&
            err.entryIndex === entryIndex &&
            err.definitionIndex === definitionIndex
        );

        return (
          <Flex direction="column" gap={2} key={definitionIndex}>
            <Flex gap={2}>
              <Editor
                placeholder={t('entryNew.definition')}
                value={definition.text}
                onChange={(e: ContentEditableEvent) =>
                  onEntryDefinitionChangeHandler(
                    e.target.value,
                    entryIndex,
                    definitionIndex
                  )
                }
              />
            </Flex>
            {error && <Text color="danger">{ERROR_TEXT.DEFINITION_EMPTY}</Text>}
            {expamplesBlock(definition, entryIndex, definitionIndex)}
            {definitionIndex === entryContent.definitions.length - 1 && (
              <Flex>
                <Button
                  title={t('entryNew.addDefinition')}
                  view="normal"
                  onClick={onAddDefinitionEntryHandler}
                >
                  {t('entryNew.addDefinition')}
                </Button>
              </Flex>
            )}
          </Flex>
        );
      });
    };

    return entryContents.map((entryContent, entryIndex) => {
      const error = errors?.find(
        (err) => err.type === 'FIELD_EMPTY' && err.entryIndex === entryIndex
      );

      return (
        <Fragment key={entryIndex}>
          <Flex gap={2} direction="column">
            <TextArea
              minRows={2}
              placeholder={t('entryNew.entryText')}
              value={entryContent.entryText}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                onEntryTextChangeHandler(e.target.value, entryIndex)
              }
              validationState={
                error?.type === 'FIELD_EMPTY' ? 'invalid' : undefined
              }
              errorMessage={
                error?.type === 'FIELD_EMPTY'
                  ? ERROR_TEXT.FIELD_EMPTY
                  : undefined
              }
            />
            <TextInput
              placeholder={t('entryNew.transcription')}
              size="s"
              value={entryContent.transcription}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onTranscriptionChangeHandler(e.target.value, entryIndex)
              }
            />
            <Flex direction="column" gap={2}>
              {definitionsBlock(entryContent, entryIndex)}
            </Flex>
          </Flex>
          <Box spacing={{ py: 1 }}>
            <Divider />
          </Box>
        </Fragment>
      );
    });
  }, [entryContents, errors, t]);

  return (
    <Card spacing={{ p: 3 }} data-testid={DEFAULT_TEST_ID.ROOT}>
      <Flex spacing={{ mb: 2 }} direction="column" gap={2}>
        {entriesArray}
      </Flex>

      <Flex
        gap={2}
        justifyContent={showAddEntryBtn ? 'space-between' : 'flex-end'}
      >
        {showAddEntryBtn && (
          <Button
            title={t('entryNew.addEntry')}
            view="outlined-success"
            onClick={onAddEntryHandler}
          >
            {t('entryNew.addEntry')}
          </Button>
        )}
        <Flex gap={2}>
          <Button title={t('common.cancel')} view="normal" onClick={onCancel}>
            {t('common.cancel')}
          </Button>
          <Button
            title={t('common.save')}
            view="action"
            onClick={onSaveHandler}
          >
            {t('common.save')}
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
};
