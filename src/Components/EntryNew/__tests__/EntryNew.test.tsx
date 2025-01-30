import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@gravity-ui/uikit';
import { t } from 'i18next';
import { userEvent } from '@testing-library/user-event';

import '@/i18n/i18n.config';
import { EntryNew } from '../EntryNew';
import { EntryNewProps } from '../interfaces';

describe('EntryNew component', () => {
  const Component = ({ onSave, onCancel }: EntryNewProps) => (
    <ThemeProvider>
      <EntryNew onSave={onSave} onCancel={onCancel} />
    </ThemeProvider>
  );

  it('Renders card with base fields', () => {
    render(<Component onSave={jest.fn()} onCancel={jest.fn()} />);

    const entryField = screen.getByPlaceholderText(t('entryNew.entryText'));
    const transcriptionField = screen.getByPlaceholderText(
      t('entryNew.transcription')
    );
    const definitionField = screen.getByPlaceholderText(
      t('entryNew.definition')
    );
    const exampleField = screen.getByPlaceholderText(t('entryNew.example'));

    expect(entryField).toBeInTheDocument();
    expect(transcriptionField).toBeInTheDocument();
    expect(definitionField).toBeInTheDocument();
    expect(exampleField).toBeInTheDocument();
  });

  it('add example', async () => {
    render(<Component onSave={jest.fn()} onCancel={jest.fn()} />);

    expect(
      (await screen.findAllByPlaceholderText(t('entryNew.example'))).length
    ).toBe(1);

    const addExampleBtn = screen.getByTitle(t('entryNew.addExample'));

    await userEvent.click(addExampleBtn);
    const exampleField = await screen.findAllByPlaceholderText(
      t('entryNew.example')
    );

    expect(exampleField.length).toBe(2);
  });

  it('add entry', async () => {
    render(<Component onSave={jest.fn()} onCancel={jest.fn()} />);

    const eddEntryBtn = screen.getByText(t('entryNew.addEntry'));

    await userEvent.click(eddEntryBtn);

    const entryField = screen.getAllByPlaceholderText(t('entryNew.entryText'));
    const transcriptionField = screen.getAllByPlaceholderText(
      t('entryNew.transcription')
    );
    const definitionField = screen.getAllByPlaceholderText(
      t('entryNew.definition')
    );
    const exampleField = screen.getAllByPlaceholderText(t('entryNew.example'));

    expect(entryField.length).toBe(2);
    expect(transcriptionField.length).toBe(2);
    expect(definitionField.length).toBe(2);
    expect(exampleField.length).toBe(2);
  });

  it('add definition', async () => {
    render(<Component onSave={jest.fn()} onCancel={jest.fn()} />);

    const eddEntryBtn = screen.getByText(t('entryNew.addDefinition'));

    await userEvent.click(eddEntryBtn);

    const entryField = screen.getAllByPlaceholderText(t('entryNew.entryText'));
    const transcriptionField = screen.getAllByPlaceholderText(
      t('entryNew.transcription')
    );
    const definitionField = screen.getAllByPlaceholderText(
      t('entryNew.definition')
    );
    const exampleField = screen.getAllByPlaceholderText(t('entryNew.example'));

    expect(entryField.length).toBe(1);
    expect(transcriptionField.length).toBe(1);
    expect(definitionField.length).toBe(2);
    expect(exampleField.length).toBe(2);
  });

  it('fill fields and submit', async () => {
    const ENTRY_TEXT = 'entry test text';
    const TRANSCRIPTION_TEXT = 'transcription test text';
    const DEFINITION_TEXT = 'definition test text';
    const EXAMPLE_TEXT = 'example test text';

    const onSave = jest.fn();

    render(<Component onSave={onSave} onCancel={jest.fn()} />);

    const entryField = screen.getByPlaceholderText(t('entryNew.entryText'));
    const transcriptionField = screen.getByPlaceholderText(
      t('entryNew.transcription')
    );
    const definitionField = screen.getByPlaceholderText(
      t('entryNew.definition')
    );
    const exampleField = screen.getByPlaceholderText(t('entryNew.example'));

    await userEvent.type(entryField, ENTRY_TEXT);
    await userEvent.type(transcriptionField, TRANSCRIPTION_TEXT);
    await userEvent.type(definitionField, DEFINITION_TEXT);
    await userEvent.type(exampleField, EXAMPLE_TEXT);

    const saveBtn = screen.getByTitle(t('common.save'));

    await userEvent.click(saveBtn);

    expect(onSave).toHaveBeenCalledWith([
      {
        entryText: ENTRY_TEXT,
        transcription: TRANSCRIPTION_TEXT,
        definitions: [
          {
            text: DEFINITION_TEXT,
            examples: [EXAMPLE_TEXT],
          },
        ],
      },
    ]);
  });

  it('add definition and example, fill fields and submit', async () => {
    const ENTRY_TEXT = 'entry test text';
    const TRANSCRIPTION_TEXT = 'transcription test text';
    const DEFINITION_1_TEXT = 'definition 1 test text';
    const EXAMPLE_1_1_TEXT = 'example 1_1 test text';
    const DEFINITION_2_TEXT = 'definition 2 test text';
    const EXAMPLE_2_1_TEXT = 'example 2_1 test text';
    const EXAMPLE_2_2_TEXT = 'example 2_2 test text';

    const onSave = jest.fn();

    render(<Component onSave={onSave} onCancel={jest.fn()} />);

    const addDefinitionBtn = screen.getByText(t('entryNew.addDefinition'));
    await userEvent.click(addDefinitionBtn);

    const addExampleBtns = screen.getAllByTitle(t('entryNew.addExample'));
    await userEvent.click(addExampleBtns[1]);

    const entryField = screen.getByPlaceholderText(t('entryNew.entryText'));
    const transcriptionField = screen.getByPlaceholderText(
      t('entryNew.transcription')
    );

    const definitionField = screen.getAllByPlaceholderText(
      t('entryNew.definition')
    );
    const exampleField = screen.getAllByPlaceholderText(t('entryNew.example'));

    await userEvent.type(entryField, ENTRY_TEXT);
    await userEvent.type(transcriptionField, TRANSCRIPTION_TEXT);
    await userEvent.type(definitionField[0], DEFINITION_1_TEXT);
    await userEvent.type(exampleField[0], EXAMPLE_1_1_TEXT);
    await userEvent.type(definitionField[1], DEFINITION_2_TEXT);
    await userEvent.type(exampleField[1], EXAMPLE_2_1_TEXT);
    await userEvent.type(exampleField[2], EXAMPLE_2_2_TEXT);

    const saveBtn = screen.getByTitle(t('common.save'));

    await userEvent.click(saveBtn);

    expect(onSave).toHaveBeenCalledWith([
      {
        entryText: ENTRY_TEXT,
        transcription: TRANSCRIPTION_TEXT,
        definitions: [
          {
            text: DEFINITION_1_TEXT,
            examples: [EXAMPLE_1_1_TEXT],
          },
          {
            text: DEFINITION_2_TEXT,
            examples: [EXAMPLE_2_1_TEXT, EXAMPLE_2_2_TEXT],
          },
        ],
      },
    ]);
  });

  it('cancel', async () => {
    const onCancel = jest.fn();

    render(<Component onSave={jest.fn()} onCancel={onCancel} />);

    const cancelBtn = screen.getByTitle(t('common.cancel'));
    await userEvent.click(cancelBtn);

    expect(onCancel).toHaveBeenCalled();
  });

  it('error entry field', async () => {
    const onSave = jest.fn();

    render(<Component onSave={onSave} onCancel={jest.fn()} />);

    const saveBtn = screen.getByTitle(t('common.save'));
    await userEvent.click(saveBtn);

    const error = screen.getByText(t('entryNew.fieldEmpty'));

    expect(error).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('error definition field', async () => {
    const EXAMPLE_TEXT = 'example test text';
    const onSave = jest.fn();

    render(<Component onSave={onSave} onCancel={jest.fn()} />);

    const saveBtn = screen.getByTitle(t('common.save'));

    const exampleField = screen.getByPlaceholderText(t('entryNew.example'));
    await userEvent.type(exampleField, EXAMPLE_TEXT);

    await userEvent.click(saveBtn);

    const error = screen.getByText(t('entryNew.definitionEmpty'));
    screen.debug();
    expect(error).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });
});
