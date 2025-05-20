'use client'

import { useState } from 'react'

import { type MergedTask } from '@/lib/task-process'
import { local, localDate } from '@/lib/time'

const dayMS = 24 * 60 * 60 * 1000

// Format date for display
const formatDate = (date: Date | string, format = 'short') => {
  if (format === 'short') {
    return local(date).toLocaleDateString('zh-CN', {
      month: 'numeric',
      day: 'numeric'
    })
  } else if (format === 'day') {
    return local(date).toLocaleDateString('zh-CN', {
      weekday: 'short'
    })
  } else if (format === 'full') {
    return local(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      weekday: 'short'
    })
  }
}

// Determine if a date is today
const isToday = (date: Date) => {
  const today = localDate()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

// Determine if a date is a weekend
const isWeekend = (date: Date) => {
  const day = local(date).getDay()
  return day === 0 || day === 6 // 0 is Sunday, 6 is Saturday
}

// Generate a random color for each task
const getTaskColor = (taskId: string) => {
  // Using a hash function to generate consistent colors
  let hash = 0
  for (let i = 0; i < taskId.length; i++) {
    hash = taskId.charCodeAt(i) + ((hash << 5) - hash)
  }

  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500'
  ]

  return colors[Math.abs(hash) % colors.length]
}

interface Props {
  tasks: MergedTask[]
}

export default function Gantt({ tasks }: Props) {
  const now = localDate()
  const todayDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0
  )

  const [timeRange, setTimeRange] = useState({
    start: todayDate,
    end: local(todayDate.getTime() + 13 * dayMS + dayMS - 1000)
  })
  const [hoveredTask, setHoveredTask] = useState<MergedTask | null>(null)

  console.log(timeRange)
  // Generate dates for the header
  const generateDates = () => {
    const dates = []
    let currentDate = local(timeRange.start)

    while (currentDate <= timeRange.end) {
      dates.push(local(currentDate))
      currentDate = local(currentDate.getTime() + dayMS)
    }

    return dates
  }

  const dates = generateDates()

  // Calculate task bar position and width
  const getTaskBarStyle = (task: MergedTask) => {
    // 使用task的startDate作为开始日期
    const startDate = local(task.startDate)

    console.log(task.name, task.dueDate, local(task.dueDate))
    // 如果没有startDate，则不显示
    if (!startDate || isNaN(startDate.getTime())) {
      return { display: 'none' }
    }


    // 默认持续时间为7天，如果有dueDate则使用dueDate作为结束日期
    let endDate
    if (task.dueDate && local(task.dueDate) > startDate) {
      endDate = local(task.dueDate)
    } else {
      endDate = local(startDate.getTime() + 7 * dayMS)
    }

    // If task is outside our timeRange, don't display
    if (endDate < timeRange.start || startDate > timeRange.end) {
      return { display: 'none' }
    }

    // Calculate position
    const startOffset = Math.max(
      0,
      (startDate.getTime() - timeRange.start.getTime()) /
        (timeRange.end.getTime() - timeRange.start.getTime())
    )
    const duration =
      Math.min(endDate.getTime(), timeRange.end.getTime()) -
      Math.max(startDate.getTime(), timeRange.start.getTime())
    const width =
      duration / (timeRange.end.getTime() - timeRange.start.getTime())

    return {
      left: `${startOffset * 100}%`,
      width: `${width * 100}%`
    }
  }

  // Handle task hover to show details
  const handleTaskHover = (task: MergedTask) => {
    setHoveredTask(task)
  }

  const moveLeft = () => {
    const range = timeRange.end.getTime() - timeRange.start.getTime()
    const newStart = local(timeRange.start.getTime() - range * 0.25)
    const newEnd = local(timeRange.end.getTime() - range * 0.25)
    setTimeRange({ start: newStart, end: newEnd })
  }

  const moveRight = () => {
    const range = timeRange.end.getTime() - timeRange.start.getTime()
    const newStart = local(timeRange.start.getTime() + range * 0.25)
    const newEnd = local(timeRange.end.getTime() + range * 0.25)
    setTimeRange({ start: newStart, end: newEnd })
  }

  return (
    <div className='flex flex-col w-full h-full bg-white rounded-lg shadow-lg'>
      {/* Gantt Chart Header */}
      <div className='p-4 border-b border-gray-200'>
        <div className='flex justify-between items-center'>
          <h2 className='text-xl font-bold text-gray-800'>活动甘特图</h2>
          <div className='flex space-x-2'>
            <button
              onClick={moveLeft}
              className='px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300'
            >
              ←
            </button>
            <button
              onClick={moveRight}
              className='px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300'
            >
              →
            </button>
          </div>
        </div>
        <div className='mt-2 text-sm text-gray-500'>
          显示时间范围: {formatDate(timeRange.start, 'full')} -{' '}
          {formatDate(timeRange.end, 'full')}
        </div>
      </div>

      {/* Gantt Chart Content */}
      <div className='flex flex-1 overflow-x-auto w-fit'>
        {/* Task Names Column */}
        <div className='min-w-64 border-r border-gray-200 bg-gray-50'>
          <div className='h-10 border-b border-gray-200 flex items-center px-4 font-semibold bg-gray-100'>
            任务名称
          </div>
          {tasks.map(task => (
            <div
              key={task.taskId}
              className='h-12 border-b border-gray-200 flex items-center px-4 hover:bg-gray-100'
            >
              <div className='truncate'>
                <div className='font-medium'>{task.name}</div>
                <div className='text-xs text-gray-500'>{task.managerName}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline Column */}
        <div className='flex-1 overflow-x-auto'>
          {/* Date Headers */}
          <div className='h-10 flex border-b border-gray-200 bg-gray-100'>
            {dates.map((date, index) => (
              <div
                key={index}
                className={`flex-shrink-0 w-16 text-center border-r border-gray-200 text-xs py-1
                  ${isWeekend(date) ? 'bg-gray-200' : ''}
                  ${isToday(date) ? 'bg-blue-100' : ''}`}
              >
                <div>{formatDate(date)}</div>
                <div className='text-gray-500'>{formatDate(date, 'day')}</div>
              </div>
            ))}
          </div>

          {/* Task Bars */}
          <div className='relative'>
            {tasks.map(task => (
              <div
                key={task.taskId}
                className='h-12 border-b border-gray-200 relative'
                onMouseEnter={() => handleTaskHover(task)}
                onMouseLeave={() => setHoveredTask(null)}
              >
                {/* Day columns */}
                <div className='absolute top-0 left-0 right-0 bottom-0 flex'>
                  {dates.map((date, index) => (
                    <div
                      key={index}
                      className={`flex-shrink-0 w-16 h-full border-r border-gray-200
                        ${isWeekend(date) ? 'bg-gray-100' : ''}
                        ${isToday(date) ? 'bg-blue-50' : ''}`}
                    ></div>
                  ))}
                </div>

                {/* Task bar */}
                <div
                  className={`absolute top-2 h-8 rounded ${getTaskColor(task.taskId)} text-white flex items-center px-2 cursor-pointer`}
                  style={getTaskBarStyle(task)}
                >
                  <div className='truncate text-xs font-medium'>
                    {task.stages && task.stages.length > 0
                      ? task.stages[0].name
                      : task.name}
                  </div>
                </div>

                {/* Due date marker */}
                {task.dueDate && (
                  <div
                    className='absolute h-full w-1 bg-red-500'
                    style={{
                      left: `${(((local(task.dueDate).getTime() - timeRange.start.getTime()) / (timeRange.end.getTime() - timeRange.start.getTime())) * 100).toFixed(3)}%`,
                      display:
                        local(task.dueDate) >= timeRange.start &&
                        local(task.dueDate) <= timeRange.end
                          ? 'block'
                          : 'none'
                    }}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Task details popup when hovering */}
      {hoveredTask && (
        <div
          className='fixed p-4 bg-white rounded-lg shadow-lg border border-gray-200 z-10 max-w-md'
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <h3 className='font-bold text-lg'>{hoveredTask.name}</h3>
          <p className='text-gray-600'>{hoveredTask.description}</p>
          <div className='mt-2 grid grid-cols-2 gap-2 text-sm'>
            <div>
              <span className='font-semibold'>负责人:</span>{' '}
              {hoveredTask.managerName}
            </div>
            <div>
              <span className='font-semibold'>所需人数:</span>{' '}
              {hoveredTask.requiredPeople}
            </div>
            <div>
              <span className='font-semibold'>开始日期:</span>{' '}
              {formatDate(hoveredTask.startDate, 'full')}
            </div>
            <div>
              <span className='font-semibold'>截止日期:</span>{' '}
              {formatDate(hoveredTask.dueDate, 'full')}
            </div>
          </div>

          {hoveredTask.users && hoveredTask.users.length > 0 && (
            <div className='mt-3'>
              <div className='font-semibold'>参与人员:</div>
              <div className='flex flex-wrap gap-1 mt-1'>
                {hoveredTask.users.slice(0, 5).map((user, idx) => (
                  <span
                    key={idx}
                    className='px-2 py-1 bg-gray-100 rounded-full text-xs'
                  >
                    {user.userName}
                  </span>
                ))}
                {hoveredTask.users.length > 5 && (
                  <span className='px-2 py-1 bg-gray-100 rounded-full text-xs'>
                    +{hoveredTask.users.length - 5}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
