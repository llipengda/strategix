'use client'

import { useEffect, useState } from 'react'

interface AiDialogProps {
  generating?: boolean
  onAiGenerate: (additionalInfo: string) => Promise<void>
  onConfirm: () => void
  onRevert: () => void
  aiError: string | undefined
}

export default function AiDialog({
  generating,
  onAiGenerate,
  onConfirm,
  onRevert,
  aiError
}: AiDialogProps) {
  const [showAiDialog, setShowAiDialog] = useState(false)
  const [additionalInfo, setAdditionalInfo] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleAiConfirm = async () => {
    setIsGenerating(true)
    await onAiGenerate(additionalInfo)
    setIsGenerating(false)
    setShowAiDialog(false)
    setShowConfirmation(true)
  }

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      await handleAiConfirm()
    }
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'i') {
        e.preventDefault()
        setShowAiDialog(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  const [isGenerating, setIsGenerating] = useState(false)

  return (
    <div className='fixed z-50 bottom-4 right-4'>
      <button
        type='button'
        className='group w-10 h-10 rounded-full bg-indigo-600 text-white shadow hover:bg-indigo-700 flex items-center justify-center relative transition-all duration-200 ease-in-out hover:scale-110'
        onClick={() => setShowAiDialog(!showAiDialog)}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className={`h-6 w-6 transition-transform duration-300 ${showAiDialog ? 'rotate-180' : ''}`}
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M13 10V3L4 14h7v7l9-11h-7z'
          />
        </svg>
        <span className='absolute -top-10 right-0 bg-gray-800/90 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out transform group-hover:-translate-y-2 hover:scale-105 shadow-lg whitespace-nowrap'>
          按{' '}
          <kbd className='px-1.5 py-0.5 bg-gray-700 rounded font-mono text-xs animate-pulse'>
            Ctrl
          </kbd>
          +
          <kbd className='px-1.5 py-0.5 bg-gray-700 rounded font-mono text-xs animate-pulse'>
            I
          </kbd>{' '}
          打开
        </span>
      </button>

      {showAiDialog && (
        <div className='absolute bottom-12 right-0 bg-white rounded-lg p-6 w-96 shadow-lg'>
          <textarea
            autoFocus
            value={additionalInfo}
            onChange={e => setAdditionalInfo(e.target.value)}
            onKeyDown={handleKeyDown}
            className='w-full h-32 p-4 border border-gray-300 rounded-lg mb-4 outline-none transition-colors duration-200 resize-none bg-gray-50 hover:bg-white text-gray-700 placeholder-gray-400'
            placeholder='输入额外信息，以帮助AI更好地完善...'
          />
          {aiError && <p className='text-red-500 mt-2'>{aiError}</p>}
          <div className='flex justify-end space-x-2'>
            {isGenerating ? (
              <>
                <div className='flex items-center gap-3'>
                  <div className='w-6 h-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent'></div>
                  <span className='text-indigo-600 font-medium'>生成中...</span>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => setShowAiDialog(false)}
                  className='px-4 py-2 text-gray-600 hover:text-gray-800'
                >
                  取消
                </button>
                <button
                  onClick={handleAiConfirm}
                  className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700'
                >
                  确定
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {showConfirmation && (
        <div className='absolute bottom-12 right-0 bg-white rounded-lg p-6 w-96 shadow-lg'>
          <div className='flex justify-between items-start mb-4'>
            <p className='text-gray-700'>AI已生成新的模板内容</p>
            <button
              onClick={() => {
                setShowConfirmation(false)
              }}
              className='text-gray-400 hover:text-gray-600'
            >
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>
          <div className='flex justify-end space-x-2'>
            <button
              onClick={() => {
                onRevert()
                setShowConfirmation(false)
                setShowAiDialog(true)
              }}
              className='px-4 py-2 text-gray-600 hover:text-gray-800'
            >
              撤回
            </button>
            <button
              onClick={() => {
                onConfirm()
                setShowConfirmation(false)
                setAdditionalInfo('')
                setShowAiDialog(true)
              }}
              className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700'
            >
              继续
            </button>
          </div>
        </div>
      )}
      {(generating !== undefined ? generating : isGenerating) && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50'>
          <div className='bg-white/90 dark:bg-gray-800/90 min-w-[20rem] p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-6 border border-gray-200 dark:border-gray-700'>
            <div className='relative'>
              <div className='absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-blue-500/30'></div>
              <div className='animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent'></div>
            </div>
            <p className='text-xl font-medium bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent animate-pulse'>
              思考中...
            </p>
            <div className='flex gap-3'>
              <span className='w-3 h-3 rounded-full bg-blue-500 animate-bounce delay-0'></span>
              <span className='w-3 h-3 rounded-full bg-indigo-500 animate-bounce delay-150'></span>
              <span className='w-3 h-3 rounded-full bg-purple-500 animate-bounce delay-300'></span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
