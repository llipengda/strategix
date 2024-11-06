import PostItem from "@/app/(main)/schedule/post-item";
import Calendar from "@/app/(main)/schedule/calendar";
import {createPostAction, getPosts} from "@/lib/actions/post";
import { Post } from "@/types/post";
import AddPosts from "./add-post";

const Page = async () => {

  const year = new Date().getFullYear()
  const month = new Date().getMonth() + 1
  const postInfo: Post[] = await getPosts(year, month)
  return (

      <div className='w-full h-full flex flex-col *:w-full gap-2'>

          <div className='bg-pink-500 flex flex-col aspect-video w-3/4 mx-auto'>
            <div className=' h-6 text-xl bg-blue-300'>
              日历
            </div>
            <Calendar onItemClick={()=>{}} />

          </div>

        <div className='flex flex-col gap-0.5 *:rounded-md'>

              <AddPosts />


            {postInfo.map(
              v => (
                <PostItem title={v.title} teamName={v.team} key={v.id} />
              )
            )}

        </div>
      </div>

  )
}

export default Page
