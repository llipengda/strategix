'use client'

import { useId } from 'react'
import ContentLoader, { type IContentLoaderProps } from 'react-content-loader'

import useTheme from '@/lib/hooks/use-theme'

const AdaptiveContentLoader: React.FC<IContentLoaderProps> = props => {
  const theme = useTheme()
  const id = useId()

  const isDark = theme === 'dark'

  return (
    <ContentLoader
      backgroundColor={isDark ? '#111' : '#eee'}
      foregroundColor={isDark ? '#333' : '#f5f5f5'}
      uniqueKey={id}
      {...props}
    >
      {props.children ?? (
        <rect x='0' y='0' rx='4' ry='4' width='100%' height='100%' />
      )}
    </ContentLoader>
  )
}

export default AdaptiveContentLoader
