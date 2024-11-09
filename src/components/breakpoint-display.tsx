import React from 'react'

/**
 * Shows the current breakpoint in the top right corner of the screen.
 * Should not be rendered in production.
 */
const BreakpointDisplay = () => {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('BreakpointDisplay should not be rendered in production')
  }

  return (
    <>
      <div
        className="z-50 fixed top-4 right-4 p-2 bg-gray-800 text-white rounded font-bold
                      after:content-['xs']
                      sm:after:content-['sm']
                      md:after:content-['md']
                      lg:after:content-['lg']
                      xl:after:content-['xl']
                      2xl:after:content-['2xl']"
      >
        Current Breakpoint: <span className='after:ml-1'></span>
      </div>
      <div
        className="z-50 fixed top-16 right-4 p-2 bg-gray-800 text-white rounded font-bold
                    max-sm:after:content-['max-sm']
                    max-md:after:content-['max-md']
                    max-lg:after:content-['max-lg']
                    max-xl:after:content-['max-xl']
                    max-2xl:after:content-['max-2xl']"
      >
        Current Max Breakpoint: <span className='after:ml-1'></span>
      </div>
    </>
  )
}

export default BreakpointDisplay
