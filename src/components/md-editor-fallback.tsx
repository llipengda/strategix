import AdaptiveContentLoader from '@/components/adaptive-content-loader'

const MdEditorFallback = ({ className }: { className?: string }) => {
  return (
    <AdaptiveContentLoader
      className={`w-full h-[120px] rounded-md ${className}`}
    />
  )
}

export default MdEditorFallback
