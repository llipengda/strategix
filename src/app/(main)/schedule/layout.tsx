const Layout = async ({
  children,
  detail
}: {
  children: React.ReactNode
  detail: React.ReactNode
}) => {
  return (
    <div className='w-full flex flex-col *:w-full gap-8'>
      <div className='flex flex-col aspect-video mx-auto dark:border-white/10 border-2 rounded-md p-2'>
        {children}
      </div>
      <div className='flex flex-col aspect-video mx-auto'>
        {detail}
      </div>
    </div>
  )
}
export default Layout
