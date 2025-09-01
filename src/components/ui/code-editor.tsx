import React, { useRef, useEffect } from 'react'
import Editor from '@monaco-editor/react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language?: 'html' | 'css' | 'javascript' | 'typescript' | 'json'
  height?: string | number
  className?: string
  placeholder?: string
  readOnly?: boolean
  minimap?: boolean
  lineNumbers?: boolean
  wordWrap?: boolean
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'html',
  height = '300px',
  className,
  placeholder,
  readOnly = false,
  minimap = false,
  lineNumbers = true,
  wordWrap = true
}) => {
  const { theme } = useTheme()
  const editorRef = useRef<any>(null)

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor
    
    // Configurar tema personalizado para modo escuro
    monaco.editor.defineTheme('storyspark-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A737D' },
        { token: 'keyword', foreground: 'F97583' },
        { token: 'string', foreground: '9ECBFF' },
        { token: 'number', foreground: '79B8FF' },
        { token: 'tag', foreground: '85E89D' },
        { token: 'attribute.name', foreground: 'FFAB70' },
        { token: 'attribute.value', foreground: '9ECBFF' },
      ],
      colors: {
        'editor.background': '#030712',
        'editor.foreground': '#f8fafc',
        'editorLineNumber.foreground': '#64748b',
        'editorLineNumber.activeForeground': '#cbd5e1',
        'editor.selectionBackground': '#334155',
        'editor.inactiveSelectionBackground': '#1e293b',
        'editorIndentGuide.background': '#1e293b',
        'editorIndentGuide.activeBackground': '#334155',
        'editorGutter.background': '#030712',
        'editorWidget.background': '#0f172a',
        'editorWidget.border': '#334155',
        'input.background': '#0f172a',
        'input.border': '#334155',
        'dropdown.background': '#0f172a',
        'dropdown.border': '#334155',
      }
    })

    // Configurar tema personalizado para modo claro
    monaco.editor.defineTheme('storyspark-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A737D' },
        { token: 'keyword', foreground: 'D73A49' },
        { token: 'string', foreground: '032F62' },
        { token: 'number', foreground: '005CC5' },
        { token: 'tag', foreground: '22863A' },
        { token: 'attribute.name', foreground: 'E36209' },
        { token: 'attribute.value', foreground: '032F62' },
      ],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#0f172a',
        'editorLineNumber.foreground': '#64748b',
        'editorLineNumber.activeForeground': '#334155',
        'editor.selectionBackground': '#e2e8f0',
        'editor.inactiveSelectionBackground': '#f1f5f9',
        'editorIndentGuide.background': '#e2e8f0',
        'editorIndentGuide.activeBackground': '#cbd5e1',
        'editorGutter.background': '#ffffff',
        'editorWidget.background': '#f8fafc',
        'editorWidget.border': '#e2e8f0',
        'input.background': '#ffffff',
        'input.border': '#e2e8f0',
        'dropdown.background': '#ffffff',
        'dropdown.border': '#e2e8f0',
      }
    })

    // Aplicar tema baseado no tema atual
    const currentTheme = theme === 'dark' ? 'storyspark-dark' : 'storyspark-light'
    monaco.editor.setTheme(currentTheme)
  }

  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '')
  }

  // Atualizar tema quando mudar
  useEffect(() => {
    if (editorRef.current) {
      const monaco = (window as any).monaco
      if (monaco) {
        const currentTheme = theme === 'dark' ? 'storyspark-dark' : 'storyspark-light'
        monaco.editor.setTheme(currentTheme)
      }
    }
  }, [theme])

  return (
    <div className={cn('monaco-editor-container', className)}>
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          minimap: { enabled: minimap },
          lineNumbers: lineNumbers ? 'on' : 'off',
          wordWrap: wordWrap ? 'on' : 'off',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          fontSize: 14,
          fontFamily: 'Fira Code, Monaco, Consolas, monospace',
          tabSize: 2,
          insertSpaces: true,
          formatOnPaste: true,
          formatOnType: true,
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: 'on',
          quickSuggestions: {
            other: true,
            comments: false,
            strings: true
          },
          parameterHints: {
            enabled: true
          },
          bracketPairColorization: {
            enabled: true
          },
          guides: {
            bracketPairs: true,
            indentation: true
          },
          renderWhitespace: 'selection',
          renderControlCharacters: false,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          cursorSmoothCaretAnimation: 'on',
          mouseWheelZoom: true,
          contextmenu: true,
          selectOnLineNumbers: true,
          glyphMargin: false,
          folding: true,
          foldingHighlight: true,
          showFoldingControls: 'mouseover',
          matchBrackets: 'always',
          renderLineHighlight: 'line',
          fixedOverflowWidgets: true,
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
            verticalScrollbarSize: 12,
            horizontalScrollbarSize: 12,
            useShadows: false,
            verticalHasArrows: false,
            horizontalHasArrows: false
          }
        }}
        loading={
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        }
      />
      {placeholder && !value && (
        <div className="absolute top-4 left-4 text-muted-foreground pointer-events-none">
          {placeholder}
        </div>
      )}
    </div>
  )
}

export default CodeEditor