import Calendar from "@/app/(main)/schedule/calendar";
import AddPosts from "./add-post";
const Page = async () => {
  return (
      <div className='w-full h-full flex flex-col *:w-full gap-2'>
          <div className='flex flex-col aspect-video w-3/4 mx-auto border-white/10 border-2 rounded-md p-2'>
            <Calendar />
          </div>
        <div className='flex flex-col gap-0.5 *:rounded-md'>
              <AddPosts />
        </div>
      </div>
  )
}
export default Page
