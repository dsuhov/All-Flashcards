import type {
  NewEntryContentSheme,
  NewEntryContent,
  ValidateEntriesFieldsResult,
} from './interfaces';
import { NewEntryContent as NewEntryContentRT } from './interfaces';

const cleanDefinition = (
  definition: NewEntryContentSheme['definitions'][0]
) => {
  const updatedDefinition: Record<string, unknown> = {};

  if (definition.text.length > 0) {
    updatedDefinition.text = definition.text;
  }

  if (definition.examples && definition.examples.length > 0) {
    const updatedExamples = definition.examples.filter(
      (example) => example.length > 0
    );

    if (updatedExamples.length > 0) {
      updatedDefinition.examples = updatedExamples;
    }
  }

  if (Object.keys(updatedDefinition).length > 0) {
    return updatedDefinition as NewEntryContentSheme['definitions'][0];
  }

  return null;
};

const cleanFields = (entryContent: NewEntryContentSheme) => {
  const updatedEntry: Record<string, unknown> = {};

  if (entryContent.entryText.length > 0) {
    updatedEntry.entryText = entryContent.entryText;
  }

  if (entryContent.transcription.length > 0) {
    updatedEntry.transcription = entryContent.transcription;
  }

  if (entryContent.definitions.length > 0) {
    const definitions: unknown[] = [];

    if (entryContent.definitions.length > 0) {
      entryContent.definitions.forEach((definition) => {
        const cleanedDefinition = cleanDefinition(definition);

        if (cleanedDefinition) {
          definitions.push(cleanedDefinition);
        }
      });
    }

    if (definitions.length > 0) {
      updatedEntry.definitions = definitions;
    }
  }

  if (Object.keys(updatedEntry).length > 0) {
    return updatedEntry;
  }

  return null;
};

export const cleanEntriesFields = (entryContents: NewEntryContentSheme[]) => {
  const cleanedEntryContent: NewEntryContent[] = [];

  entryContents.forEach((entry) => {
    const cleanedEntry = cleanFields(entry);

    if (cleanedEntry) {
      cleanedEntryContent.push(NewEntryContentRT.check(cleanedEntry));
    }
  });

  return cleanedEntryContent;
};

export const validateEntriesFields = (entryContents: NewEntryContent[]) => {
  const errors: ValidateEntriesFieldsResult[] = [];

  entryContents.forEach((entry, index) => {
    if (entry.entryText.length === 0) {
      errors.push({ type: 'FIELD_EMPTY', entryIndex: index });
    }

    if (entry.definitions && entry.definitions.length > 0) {
      entry.definitions.forEach((definition, definitionIndex) => {
        const isExamples =
          definition.examples &&
          definition.examples.length > 0 &&
          definition.examples.some((example) => example.length > 0);

        if (definition.text.length === 0 && isExamples) {
          errors.push({
            type: 'DEFINITION_EMPTY',
            entryIndex: index,
            definitionIndex: definitionIndex,
          });
        }
      });
    }
  });

  return errors;
};
