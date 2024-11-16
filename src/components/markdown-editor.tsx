'use client'

import type { ForwardedRef } from 'react'

import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  InsertTable,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  UndoRedo,
  headingsPlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'

import useTheme from '@/lib/hooks/use-theme'

export default function MarkdownEditor({
  editorRef,
  additionalContentEditableClassName,
  ...props
}: {
  editorRef?: ForwardedRef<MDXEditorMethods> | null
  additionalContentEditableClassName?: string
} & MDXEditorProps) {
  const theme = useTheme()

  return (
    <MDXEditor
      plugins={[
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <UndoRedo />
              <BlockTypeSelect />
              <BoldItalicUnderlineToggles />
              <InsertTable />
            </>
          )
        }),
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        tablePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        linkPlugin(),
        linkDialogPlugin()
      ]}
      className={`${theme === 'dark' ? 'dark-theme' : ''}`}
      contentEditableClassName={`prose max-w-none dark:prose-invert ${props.readOnly ? '' : 'bg-gray-50 dark:bg-gray-900'} rounded-lg ${additionalContentEditableClassName}`}
      {...props}
      ref={editorRef}
    />
  )
}
