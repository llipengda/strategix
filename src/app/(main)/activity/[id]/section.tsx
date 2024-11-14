'use client'

import dynamic from 'next/dynamic'

import type { Section as TSection } from '@/types/activity/activity'

const MarkdownEditor = dynamic(() => import('@/components/markdown-editor'), {
  ssr: false
})

const Section = ({ section }: { section: TSection }) => {
  return (
    <div>
      <h2 className='text-xl font-bold'>{section.name}</h2>
      <MarkdownEditor markdown={section.value as string} readOnly />
    </div>
  )
}

export default Section
