'use client'

import type { ForwardedRef } from 'react'

import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  Separator,
  UndoRedo,
  headingsPlugin,
  imagePlugin,
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

import { upload } from '@/lib/b2'
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

  const plugins = [
    headingsPlugin(),
    listsPlugin(),
    quotePlugin(),
    tablePlugin(),
    thematicBreakPlugin(),
    markdownShortcutPlugin(),
    imagePlugin({
      async imageUploadHandler(file) {
        const timestamp = Date.now()
        const newFile = new File([file], `${timestamp}.${file.name}`, {
          type: file.type
        })
        const key = await upload(newFile, 'image')
        return `${process.env.NEXT_PUBLIC_DEPLOY_URL}/api/download/${encodeURIComponent(key)}`
      }
    }),
    linkPlugin(),
    linkDialogPlugin()
  ]

  if (!props.readOnly) {
    plugins.push(
      toolbarPlugin({
        toolbarContents: () => (
          <>
            <UndoRedo />
            <Separator />
            <BlockTypeSelect />
            <Separator />
            <BoldItalicUnderlineToggles />
            <Separator />
            <InsertThematicBreak />
            <Separator />
            <CreateLink />
            <InsertTable />
            <InsertImage />
          </>
        )
      })
    )
  }

  return (
    <MDXEditor
      plugins={plugins}
      className={`${theme === 'dark' ? 'dark-theme' : ''}`}
      contentEditableClassName={`prose max-w-none dark:prose-invert ${props.readOnly ? '' : 'bg-gray-50 dark:bg-gray-900'} rounded-lg ${additionalContentEditableClassName}`}
      {...props}
      ref={editorRef}
    />
  )
}
