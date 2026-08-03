import {
  G_CODES,
  M_CODES,
  WORD_PARAMS,
} from '@/shared/constants/gcodeMetadata';

export const GCODE_LANGUAGE_ID = 'gcode';

export interface MonacoEditorModel {
  getValue(): string;
  getLineContent(lineNumber: number): string;
  getWordAtPosition(
    position: MonacoPosition,
  ): { word: string; startColumn: number; endColumn: number } | null;
  getWordUntilPosition(position: MonacoPosition): {
    word: string;
    startColumn: number;
    endColumn: number;
  };
  getFullModelRange(): MonacoRange;
  getLineMaxColumn(lineNumber: number): number;
}

export interface MonacoPosition {
  lineNumber: number;
  column: number;
}

export interface MonacoRange {
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
}

export interface MonacoMarkerData {
  severity: number;
  message: string;
  startLineNumber: number;
  endLineNumber: number;
  startColumn: number;
  endColumn: number;
}

export interface MonacoInstance {
  MarkerSeverity: {
    Warning: number;
    Error: number;
  };
  Range: new (
    startLineNumber: number,
    startColumn: number,
    endLineNumber: number,
    endColumn: number,
  ) => MonacoRange;
  languages: {
    register(language: { id: string }): void;
    setLanguageConfiguration(
      languageId: string,
      options: Record<string, unknown>,
    ): void;
    setMonarchTokensProvider(
      languageId: string,
      provider: Record<string, unknown>,
    ): void;
    registerCompletionItemProvider(
      languageId: string,
      provider: {
        triggerCharacters: string[];
        provideCompletionItems(
          model: MonacoEditorModel,
          position: MonacoPosition,
        ): { suggestions: unknown[] };
      },
    ): void;
    registerHoverProvider(
      languageId: string,
      provider: {
        provideHover(
          model: MonacoEditorModel,
          position: MonacoPosition,
        ): { range?: MonacoRange; contents: Array<{ value: string }> } | null;
      },
    ): void;
    registerDocumentFormattingEditProvider(
      languageId: string,
      provider: {
        provideDocumentFormattingEdits(
          model: MonacoEditorModel,
        ): Array<{ range: MonacoRange; text: string }>;
      },
    ): void;
    CompletionItemKind: {
      Keyword: number;
      Function: number;
      Variable: number;
      Snippet: number;
    };
    CompletionItemInsertTextRule: {
      InsertAsSnippet: number;
    };
  };
  editor: {
    setModelMarkers(
      model: MonacoEditorModel,
      owner: string,
      markers: MonacoMarkerData[],
    ): void;
  };
}

export function formatGcode(text: string): string {
  return text
    .split('\n')
    .map((line) => {
      const trimmed = line.trim();
      if (trimmed === '' || trimmed.startsWith('//')) return trimmed;

      const commentMatch = trimmed.match(/\(.*\)\s*$/);
      const code = commentMatch
        ? trimmed.slice(0, commentMatch.index).trim()
        : trimmed;
      const comment = commentMatch ? ' ' + commentMatch[0] : '';

      const normalized = code
        .replace(/\s+/g, ' ')
        .replace(
          /\b([gm])(\d)/gi,
          (_, letter, digit) => `${letter.toUpperCase()}${digit}`,
        );

      return normalized + comment;
    })
    .join('\n');
}

export function validateGcode(
  monaco: MonacoInstance,
  model: MonacoEditorModel,
): void {
  const markers: MonacoMarkerData[] = [];
  const lines = model.getValue().split('\n');

  lines.forEach((line, idx) => {
    const codeMatches = line.matchAll(/\b([GM])(\d+)\b/gi);
    for (const m of codeMatches) {
      if (m.index === undefined) continue;
      const code = `${m[1].toUpperCase()}${parseInt(m[2], 10)}`;
      const known = m[1].toUpperCase() === 'G' ? G_CODES : M_CODES;
      if (!known[code]) {
        markers.push({
          severity: monaco.MarkerSeverity.Warning,
          message: `Unrecognized ${m[1].toUpperCase()}-code: ${code}`,
          startLineNumber: idx + 1,
          endLineNumber: idx + 1,
          startColumn: m.index + 1,
          endColumn: m.index + m[0].length + 1,
        });
      }
    }
  });

  monaco.editor.setModelMarkers(model, GCODE_LANGUAGE_ID, markers);
}

export function handleEditorWillMount(monaco: MonacoInstance): void {
  monaco.languages.register({ id: GCODE_LANGUAGE_ID });

  monaco.languages.setLanguageConfiguration(GCODE_LANGUAGE_ID, {
    comments: {
      lineComment: '//',
      blockComment: ['(', ')'],
    },
    brackets: [['(', ')']],
    autoClosingPairs: [{ open: '(', close: ')' }],
  });

  monaco.languages.setMonarchTokensProvider(GCODE_LANGUAGE_ID, {
    ignoreCase: true,
    tokenizer: {
      root: [
        [/\/\/.*$/, 'comment'],
        [/\(/, 'comment', '@comment'],
        [/\bN\d+\b/i, 'number.linenum'],
        [/\bO\d+\b/i, 'namespace'],
        [/\bG\d+(\.\d+)?\b/i, 'keyword.gcode'],
        [/\bM\d+(\.\d+)?\b/i, 'keyword.mcode'],
        [/\b[XYZABCIJKRFSTPQLHDE](?=[-+]?\d)/i, 'type.identifier'],
        [/[-+]?\d+\.\d+/, 'number'],
        [/[-+]?\d+/, 'number'],
        [/"[^"]*"/, 'string'],
        [/[A-Za-z]+/, 'identifier'],
      ],
      comment: [
        [/[^)]+/, 'comment'],
        [/\)/, 'comment', '@pop'],
      ],
    },
  });

  monaco.languages.registerCompletionItemProvider(GCODE_LANGUAGE_ID, {
    triggerCharacters: ['G', 'M', ' '],
    provideCompletionItems(model: MonacoEditorModel, position: MonacoPosition) {
      const word = model.getWordUntilPosition(position);
      const range: MonacoRange = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const gSuggestions = Object.entries(G_CODES).map(([code, doc]) => ({
        label: code,
        kind: monaco.languages.CompletionItemKind.Keyword,
        detail: doc,
        documentation: { value: `**${code}**\n\n${doc}` },
        insertText: code,
        range,
      }));

      const mSuggestions = Object.entries(M_CODES).map(([code, doc]) => ({
        label: code,
        kind: monaco.languages.CompletionItemKind.Function,
        detail: doc,
        documentation: { value: `**${code}**\n\n${doc}` },
        insertText: code,
        range,
      }));

      const wordSuggestions = WORD_PARAMS.map((letter) => ({
        label: letter,
        kind: monaco.languages.CompletionItemKind.Variable,
        detail: `${letter} parameter`,
        insertText: `${letter}\${1:0}`,
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range,
      }));

      const snippetSuggestions = [
        {
          label: 'rapid move',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'G0 X${1:0} Y${2:0} Z${3:0}',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Rapid positioning move (G0) with X/Y/Z.',
          range,
        },
        {
          label: 'linear cut',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'G1 X${1:0} Y${2:0} F${3:100}',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Linear cutting move (G1) with feed rate.',
          range,
        },
        {
          label: 'drill cycle',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'G81 X${1:0} Y${2:0} Z${3:-5} R${4:2} F${5:100}',
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Simple drilling canned cycle (G81).',
          range,
        },
        {
          label: 'program end',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'M30',
          documentation: 'End of program and rewind (M30).',
          range,
        },
      ];

      return {
        suggestions: [
          ...gSuggestions,
          ...mSuggestions,
          ...wordSuggestions,
          ...snippetSuggestions,
        ],
      };
    },
  });

  monaco.languages.registerHoverProvider(GCODE_LANGUAGE_ID, {
    provideHover(model: MonacoEditorModel, position: MonacoPosition) {
      const word = model.getWordAtPosition(position);
      if (!word) return null;

      const token = word.word.toUpperCase();
      const lineText = model.getLineContent(position.lineNumber);
      const match = lineText
        .slice(0, word.endColumn - 1)
        .match(/([GM])(\d+)$/i);

      let code = null;
      if (match) {
        code = `${match[1].toUpperCase()}${parseInt(match[2], 10)}`;
      } else if (/^[GM]\d+$/.test(token)) {
        code = `${token[0]}${parseInt(token.slice(1), 10)}`;
      }

      if (code && G_CODES[code]) {
        return {
          range: {
            startLineNumber: position.lineNumber,
            startColumn: 1,
            endLineNumber: position.lineNumber,
            endColumn: model.getLineMaxColumn(position.lineNumber),
          },
          contents: [{ value: `**${code}**` }, { value: G_CODES[code] }],
        };
      }
      if (code && M_CODES[code]) {
        return {
          contents: [{ value: `**${code}**` }, { value: M_CODES[code] }],
        };
      }

      if (WORD_PARAMS.includes(token)) {
        return {
          contents: [
            { value: `**${token}**` },
            { value: `Parameter word (${token} axis/value).` },
          ],
        };
      }

      return null;
    },
  });

  monaco.languages.registerDocumentFormattingEditProvider(GCODE_LANGUAGE_ID, {
    provideDocumentFormattingEdits(model: MonacoEditorModel) {
      return [
        {
          range: model.getFullModelRange(),
          text: formatGcode(model.getValue()),
        },
      ];
    },
  });
}
