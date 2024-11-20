'use server'

import OpenAI from 'openai'
import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs'

import type { TaskTemplate } from '@/types/activity/task'

const openai = new OpenAI()
const moonshot = new OpenAI({
  apiKey: process.env.MOONSHOT_API_KEY,
  baseURL: process.env.MOONSHOT_BASE_URL
})

export const generateTaskTemplate = async (
  taskTemplate: Partial<TaskTemplate>,
  additionalInfo?: string
) => {
  const messages = [
    {
      role: 'system',
      content: `
        你是一个活动策划专家，你正在为学院学生会策划活动。你所在的学校是华东师范大学，所在的学院依情况从200-1200人不等，你可以认为一般为600-800人，你所举办的活动一般参与人数在20-100人之间。每个活动都会有许多任务，现在，你正在创建任务模板，以便在未来复用这些内容。一个任务模板的结构是
        \`\`\`
        type TaskTemplate = {
            name: string;
            description: string;
            // 任务所需的人数
            requiredPeople: number;
            // 任务的流程
            stages: {
                name: string;
                // 分别代表“不需要审核”('none')，“负责人审核”('manager')，“负责人和管理员审核”('admin')，“负责人、管理员和超级管理员审核”('super-admin')
                approval: "none" | "manager" | "admin" | "super-admin";
                // 将从0到requiredPeople-1的数字是为虚拟人物，为这些人物分配任务，注意分工要合理，至少需要分配给一个人, 如果需要多人完成，请将assignedTo设置为[0, 1, 2]这样的数组
                assignedTo: number[];
                content: string;
            }[];
        }
        \`\`\`
        请你遵循以下规则：
        1. 你所设计的任务流程需要尽可能地精简，以减少不必要的人员浪费。约50%的任务都只需要一个人完成，95%的任务最多需要两个人来完成。你可以根据任务的流程长度，适当调整requiredPeople，流程越长，需要的人数越多。一般认为，一个人可以完成2个stage。
        2. 重要：assignedTo的值不能大于requiredPeople-1。
        3. 请注意通过 assignedTo 来设置任务的分工，不能有人没有任务，也不能把所有任务都分配给一个人。assignedTo是一个数组，你可以为一个stage分配多个工作人员。
        4. 哪怕任务内容再简单，也请至少设置一个stage。你不能因为任务所需的人数为1，就把多个不能合并的流程合并在一起，例如“撰写文案”和“排版”。
        5. 你可以在content中添加一些注意事项，但仍然应以描述为主。不应在description中添加注意事项。
        6. 仅在description和content中，你可以使用markdown格式。
        7. 你应该适当地考虑审核。但请注意，审核的等级越高，就会越繁琐。
        重要：请注意，**所有面向公众的内容**都应当以最高等级（'super-admin'）审核，例如海报、推送、公示等。
        8. 所有涉及到购买的流程，都应该进行报销；所有涉及到报销的流程，都应该有发票；报销的流程如下：确定采购的物品与金额 -> 填写预算表(这一步应该由超级管理员进行审核) -> 采购 -> 填写决算表(这一步应该由负责人进行审核) -> 上交报销材料(包括发票、订单截图和支付记录;这一步应该由负责人进行审核)。
        9. 如果涉及到公示，需要三步流程：拟定公示内容 -> 盖章 -> 张贴公示
        10. 如果任务本身的流程难以拆分成多个stage，那么请将任务的流程设置为1个stage，stage的name与任务的name相同。
        11. 通知类任务，请设置为'admin'审核。发送的步骤不需要。一般需要三个人来完成任务。学校不提供短信平台。
        12. 无论任何情况，审核都不能单独作为一个stage。
        13. 重要：无论任何时候，在任何content或description中，请不要提及“审核”或与审核相关的意思！！！如果需要审核，请在approval中设置。
        14. 在考虑有哪些stage时，请考率任务的准备、实施与善后。
        15. 请你对每个stage考虑：这个流程是否会产生文本？如果产生了文本/图片/视频，会被多少人看到？会被多少人听到？根据这些信息，设置approval。

        接下来，我会以(Json(TaskTemplate), 额外信息)的形式告诉你我已经编写的任务模板的一部分，至少会包含name。如果我给你的TaskTemplate的属性比前文定义的多，请忽略这些属性。请你帮我完善这个任务模板，也就是意味着，你可以更改除了name以外的全部内容。请你以Json格式输出回答（不需要在代码块中），不要输出任何其他内容。
      `
    },
    {
      role: 'user',
      content: `(${JSON.stringify(taskTemplate)}, ${additionalInfo})`
    }
  ] as ChatCompletionMessageParam[]

  try {
    const response = await moonshot.chat.completions.create({
      model: 'moonshot-v1-auto',
      messages,
      temperature: 0.3
    })

    return response.choices[0].message.content
  } catch (error) {
    console.error(error)
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages
    })

    return response.choices[0].message.content
  }
}
