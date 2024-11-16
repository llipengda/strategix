'use client'

import React, { useRef, useState } from 'react'
import { MdClose, MdUpload } from 'react-icons/md'

interface FileUploadProps {
  onUpload: (files: File[]) => void
  onRemove: (file: File) => void
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload, onRemove }) => {
  const [dragging, setDragging] = useState(false)
  const [fileList, setFileList] = useState<File[]>([])

  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)

    const files = Array.from(e.dataTransfer.files)
    setFileList(prev => [...prev, ...files])
    onUpload(files)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      console.log(files)
      setFileList(prev => [...prev, ...files])
      onUpload(files)
    }
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleRemove = (file: File) => {
    setFileList(prev => prev.filter(f => f !== file))
    if (inputRef.current) {
      inputRef.current.value = ''
    }
    onRemove(file)
  }

  return (
    <div className='w-full'>
      <div
        className={`border-2 ${
          dragging ? 'border-blue-500' : 'border-gray-300'
        } border-dashed rounded-lg p-6 text-center transition-colors duration-300 cursor-pointer hover:bg-gray-50 hover:border-blue-500`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <p className='text-gray-500 italic'>
          拖拽文件到这里上传 或 点击选择文件
        </p>
        <MdUpload className='text-5xl text-gray-500 text-center mx-auto mt-4' />
        <input
          ref={inputRef}
          type='file'
          onChange={handleFileSelect}
          multiple
          className='hidden'
          id='file-input'
        />
      </div>
      {fileList.length > 0 && (
        <ul className='mt-2 space-y-2'>
          {fileList.map((file, index) => (
            <li key={index} className='text-gray-500 flex items-center gap-2'>
              {file.name}
              <MdClose
                className='text-gray-500 text-md hover:text-red-500 cursor-pointer'
                onClick={() => handleRemove(file)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default FileUpload
