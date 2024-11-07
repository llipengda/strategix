import Input from "@/components/input"
import Select from "@/components/select"
import SubmitButton from "@/components/submit-button"
import { createPostAction } from "@/lib/actions/post"
import { getCurrentUser } from "@/lib/actions/user"
import './add-post.css'

const AddPosts = async () => {
   const user = await getCurrentUser()
    return (
        <form action={createPostAction} className="flex flex-col gap-1 add-post">
            <label htmlFor="title">标题</label>
            <Input id="title" name="title" placeholder="标题" required/>
            <label htmlFor="team">团队</label>
            <Input id="team" name="team" placeholder="请输入团队" value={user?.team} required/>
            <label htmlFor="publishDate">推送日期</label>
            <Input id="publishDate" placeholder="请输入推送日期" name="publishDate" type="date" required/>
            <label htmlFor="isFrontPage">设为版头</label>
            <Select id="isFrontPage" name="isFrontPage" defaultValue={'off'}>
                <option value="off">否</option>
                <option value="on">是</option>
            </Select>
            <SubmitButton text='添加推送'  />
        </form>
    )
}
export default AddPosts