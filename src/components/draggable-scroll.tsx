'use client'

import { useEffect, useRef, useState } from 'react'
import { useDraggable } from 'react-use-draggable-scroll'

import { MacScrollbar } from 'mac-scrollbar'
import 'mac-scrollbar/dist/mac-scrollbar.css'

type DraggableScrollProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'ref'>

const DraggableScroll: React.FC<DraggableScrollProps> = props => {
  const ref = useRef<HTMLDivElement>(null!)

  const { events } = useDraggable(ref)

  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    setTheme(mediaQuery.matches ? 'dark' : 'light')

    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return (
    <MacScrollbar ref={ref} {...props} {...events} skin={theme}>
      {props.children}
    </MacScrollbar>
  )
}

export default DraggableScroll
