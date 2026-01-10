'use client';

import React, { useRef } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  theme?: 'light' | 'dark';
  height?: string;
  readOnly?: boolean;
  defaultValue?: string;
}

const MONACO_OPTIONS: monaco.editor.IStandaloneEditorConstructionOptions = {
  minimap: { enabled: false },
  fontSize: 14,
  lineNumbers: 'on',
  scrollBeyondLastLine: false,
  automaticLayout: true,
  tabSize: 2,
  wordWrap: 'on',
  formatOnPaste: true,
  formatOnType: true,
  suggestOnTriggerCharacters: true,
  quickSuggestions: true,
  folding: true,
  foldingStrategy: 'indentation',
  showFoldingControls: 'always',
  matchBrackets: 'always',
  autoClosingBrackets: 'always',
  autoClosingQuotes: 'always',
};

export function MonacoEditor({
  value,
  onChange,
  language = 'javascript',
  theme = 'dark',
  height = '500px',
  readOnly = false,
  defaultValue = '',
}: MonacoEditorProps) {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    editorRef.current = editor;

    // Configure Monaco
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });

    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: 'React',
      allowJs: true,
      typeRoots: ['node_modules/@types'],
    });
  };

  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '');
  };

  return (
    <div className="rounded-lg overflow-hidden border border-neutral-200 dark:border-dark-border">
      <Editor
        height={height}
        language={language}
        value={value}
        defaultValue={defaultValue}
        theme={theme}
        options={{
          ...MONACO_OPTIONS,
          readOnly,
        }}
        onMount={handleEditorDidMount}
        onChange={handleEditorChange}
      />
    </div>
  );
}

export default MonacoEditor;
