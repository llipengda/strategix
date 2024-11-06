import Input from "@/components/input"
import Select from "@/components/select"
import SubmitButton from "@/components/submit-button"
import { createPostAction } from "@/lib/actions/post"

interface PostData {
    title: string,
    team: string,
    publishDate: string
    isFrontPage: 'on'|'off'
  }
const AddPosts = () => {
    
    return (
        <form action={createPostAction}>
            <Input id="title" name="title" placeholder="请输入推送内容" required/>
            <Input id="team" name="team" placeholder="请输入团队"/>
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