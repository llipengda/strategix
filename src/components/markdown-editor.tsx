'use client'

import type { ForwardedRef } from 'react'

import {
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  headingsPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  thematicBreakPlugin
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'

import useTheme from '@/lib/hooks/use-theme'

export default function MarkdownEditor({
  editorRef,
  ...props
}: { editorRef?: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
  const theme = useTheme()

  return (
    <MDXEditor
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin()
      ]}
      className={`${theme === 'dark' ? 'dark-theme' : ''}`}
      {...props}
      ref={editorRef}
    />
  )
}
