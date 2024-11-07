import Input from "@/components/input"
import Select from "@/components/select"
import SubmitButton from "@/components/submit-button"
import { createPostAction } from "@/lib/actions/post"
import { getCurrentUser } from "@/lib/actions/user"

const AddPosts = async () => {
   const user = await getCurrentUser()
    return (
        <form action={createPostAction}>
            <Input id="title" name="title" placeholder="标题" required/>
            <Input id="team" name="team" placeholder="请输入团队" value={user?.team} required/>
            <Input id="publishDate" placeholder="请输入推送日期" name="publishDate" type="date" required/>
            <Select id="isFrontPage" name="isFrontPage" defaultValue={'off'}>
                <option value="off">否</option>
                <option value="on">是</option>
            </Select>
            <SubmitButton text='添加推送'  />
        </form>
    )
}
export default AddPosts