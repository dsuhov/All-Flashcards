import {
  Editor as EditorComponent,
  EditorProps,
  EditorProvider,
  Toolbar,
  BtnBold,
  BtnItalic,
  BtnUnderline,
  BtnClearFormatting,
  BtnUndo,
  BtnRedo,
} from 'react-simple-wysiwyg';

import './styles.css';

export const Editor = (props: EditorProps) => (
  <EditorProvider>
    <EditorComponent {...props}>
      <Toolbar>
        <BtnUndo />
        <BtnRedo />
        <BtnBold />
        <BtnItalic />
        <BtnUnderline />
        <BtnClearFormatting />
      </Toolbar>
    </EditorComponent>
  </EditorProvider>
);
