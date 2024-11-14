'use client'

import { useState } from 'react'

import { v4 } from 'uuid'

import Add from '@/app/(main)/activity/new/add'
import Edit from '@/app/(main)/activity/new/edit'
import type { Section } from '@/types/activity/activity'

interface EditsProps {
  sections: Section[]
}

const Edits: React.FC<EditsProps> = ({ sections }) => {
  const [edits, setEdits] = useState(sections)

  const handleAdd = () => {
    setEdits([
      ...edits,
      {
        id: v4(),
        type: 'custom',
        name: '',
        value: ''
      }
    ])
  }

  const handleDelete = (id: string) => {
    setEdits(edits.filter(e => e.id !== id))
  }

  return (
    <div className='space-y-8'>
      {edits.map(e => (
        <Edit
          key={e.id}
          id={e.id}
          type={e.type}
          preValue={String(e.value)}
          name={e.name}
          onDelete={handleDelete}
        />
      ))}
      <Add onClick={handleAdd} />
    </div>
  )
}

export default Edits
