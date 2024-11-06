
const generateDateInfo = () => {
  for(let i=0;i<35;i++){

  }
}
const Calendar = ({
  onItemClick
}:{
  onItemClick: (year: number, month: number)=> void
}) => {
  return (
    <div className=' w-full grid grid-cols-7 grid-rows-5 flex-grow gap-1'>
      {'1'.repeat(31).split('').map((v, index) => {

        return(
          <div className='bg-amber-300 rounded-sm' key={index}>
            {index}
          </div>
        )
      })}
    </div>
  )
}

export default Calendar
