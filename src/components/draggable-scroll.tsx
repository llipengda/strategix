'use client'

import { useRef } from 'react'
import { useDraggable } from 'react-use-draggable-scroll'

import { MacScrollbar } from 'mac-scrollbar'
import 'mac-scrollbar/dist/mac-scrollbar.css'

import useTheme from '@/lib/hooks/use-theme'

type DraggableScrollProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'ref'>

const DraggableScroll: React.FC<DraggableScrollProps> = props => {
  const ref = useRef<HTMLDivElement>(null!)

  const { events } = useDraggable(ref)

  const theme = useTheme()

  return (
    <MacScrollbar ref={ref} {...props} {...events} skin={theme}>
      {props.children}
    </MacScrollbar>
  )
}

export default DraggableScroll
