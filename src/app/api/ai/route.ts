import { type NextRequest, NextResponse } from 'next/server'

import OpenAI from 'openai'
import type {
  ChatCompletionChunk,
  ChatCompletionMessageParam
} from 'openai/resources/index.mjs'

import { auth } from '@/auth'
import { localFormat, localISOFormat } from '@/lib/time'
import { type Activity, predefinedSections } from '@/types/activity/activity'
import type { Assignment } from '@/types/activity/assignment'
import type { Task, TaskTemplate } from '@/types/activity/task'
import type { Team } from '@/types/team'

const openai = new OpenAI()
const moonshot = new OpenAI({
  apiKey: process.env.MOONSHOT_API_KEY,
  baseURL: process.env.MOONSHOT_BASE_URL
})

function streamResponse(generator: AsyncIterable<ChatCompletionChunk>) {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of generator) {
          const content = chunk.choices[0].delta.content
          if (content) {
            controller.enqueue(encoder.encode(content))
          }
        }
      } catch (err) {
        console.error('Stream error:', err)
        controller.error(err)
      } finally {
        controller.close()
      }
    }
  })

  const [stream1, stream2] = stream.tee()

  return [
    new NextResponse(stream1, {
      headers: {
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Transfer-Encoding': 'chunked'
      }
    }),
    stream2.pipeThrough(new TextDecoderStream())
  ] as const
}

function readStream(stream: ReadableStream<string>): Promise<string> {
  return new Promise(async resolve => {
    const reader = stream.getReader()
    let content = ''

    while (true) {
      const { done, value } = await reader.read()
      console.log(done, value)
      if (done) break
      content += value
    }

    resolve(content)
  })
}

type RequestBody =
  | {
      action: 'generateTaskTemplate'
      params: {
        taskTemplate: TaskTemplate
        additionalInfo: string
      }
    }
  | {
      action: 'generateActivity'
      params: {
        activity: Activity
        additionalInfo: string
      }
    }
  | {
      action: 'continueGenerateActivity'
      params: undefined
    }
  | {
      action: 'generateTask'
      params: {
        activity: Activity
        tasks: Task[]
        additionalInfo: string
      }
    }
  | {
      action: 'continueGenerateTask'
      params: undefined
    }
  | {
      action: 'generateAssignment'
      params: {
        team: Team
        tasks: Task[]
        assignments: Assignment[]
        additionalInfo: string
      }
    }
  | {
      action: 'continueGenerateAssignment'
      params: undefined
    }

// Store conversation history
const conversationStore = new Map<string, ChatCompletionMessageParam[]>()

export async function POST(req: NextRequest) {
  const session = await auth()

  const user = session?.user

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const userId = user.id

  const { action, params } = (await req.json()) as RequestBody

  switch (action) {
    case 'generateTaskTemplate': {
      const { taskTemplate, additionalInfo } = params
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
                    // 分别代表"不需要审核"('none')，"负责人审核"('manager')，"负责人和管理员审核"('admin')，"负责人、管理员和超级管理员审核"('super-admin')
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
            4. 哪怕任务内容再简单，也请至少设置一个stage。你不能因为任务所需的人数为1，就把多个不能合并的流程合并在一起，例如"撰写文案"和"排版"。
            5. 你可以在content中添加一些注意事项，但仍然应以描述为主。不应在description中添加注意事项。
            6. 仅在description和content中，你可以使用markdown格式。
            7. 你应该适当地考虑审核。但请注意，审核的等级越高，就会越繁琐。
            重要：请注意，**所有面向公众的内容**都应当以最高等级（'super-admin'）审核，例如海报、推送、公示等。
            8. 所有涉及到购买的流程，都应该进行报销；所有涉及到报销的流程，都应该有发票；报销的流程如下：确定采购的物品与金额 -> 填写预算表(这一步应该由超级管理员进行审核) -> 采购 -> 填写决算表(这一步应该由负责人进行审核) -> 上交报销材料(包括发票、订单截图和支付记录;这一步应该由负责人进行审核)。
            9. 如果涉及到公示，需要三步流程：拟定公示内容 -> 盖章 -> 张贴公示
            10. 如果任务本身的流程难以拆分成多个stage，那么请将任务的流程设置为1个stage，stage的name与任务的name相同。
            11. 通知类任务，请设置为'admin'审核。发送的步骤不需要。一般需要三个人来完成任务。学校不提供短信平台。
            12. 无论任何情况，审核都不能单独作为一个stage。
            13. 重要：无论任何时候，在任何content或description中，请不要提及"审核"或与审核相关的意思！！！如果需要审核，请在approval中设置。
            14. 在考虑有哪些stage时，请考率任务的准备、实施与善后。
            15. 请你对每个stage考虑：这个流程是否会产生文本？如果产生了文本/图片/视频，会被多少人看到？会被多少人听到？根据这些信息，设置approval。

            接下来，我会以(Json(TaskTemplate), 额外信息)的形式告诉你我已经编写的任务模板的一部分，至少会包含name。如果我给你的TaskTemplate的属性比前文定义的多，请忽略这些属性。请你帮我完善这个任务模板，也就是意味着，你可以更改除了name以外的全部内容。请你以Json格式输出回答（不需要在代码块中），不要输出任何其他内容。
            无论何时，都不要使用代码块。
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
          temperature: 0.3,
          stream: true
        })

        return streamResponse(response)[0]
      } catch (error) {
        console.error(error)
        const response = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages,
          stream: true
        })

        return streamResponse(response)[0]
      }
    }

    case 'generateActivity': {
      const { activity, additionalInfo } = params
      const messages = [
        {
          role: 'system',
          content: `
            你是一个活动策划专家，你正在为软件工程学院学生会策划活动。你所在的学校是华东师范大学，所在校区为普陀校区。所在的学院约有本科生800人，你所举办的活动一般参与人数在20-100人之间。现在，你正在创建活动(Activity)。
            一个活动的结构是
            \`\`\`
            type Activity = {
              name: string; // 活动名称
              sections: {
                type: string
                name: string
                value: string // 可以为markdown格式
              }
              time?: string; // 可选的单一时间，ISO 格式字符串
              timeRange?: [string, string]; // 可选的时间范围，ISO 格式的字符串元组
            };
            \`\`\`
            sections 表示除了活动名称、时间、任务与分工之外的内容。
            有一些预定义好的sections，请参考以下内容：
            ${JSON.stringify(predefinedSections)}
            你可以参考这些预定义的sections，但请注意，如果你选择 type 为 'custom'，请为这个section设置一个name。
            time 表示活动的开始时间，请以ISO格式字符串给出。
            timeRange 表示活动的开始时间和结束时间，请以ISO格式字符串给出。

            请你严格遵守以下规则：
            1. time 和 timeRange 不能同时存在，但 time 和 timeRange 至少存在一个。
            3. 活动的时间必须比${localISOFormat}晚，但最好在${localFormat(new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 * 4))}之前。
            4. 当你在确定活动时间时，请按以下优先级考虑： 1.周三下午 2.周六/周日 3.周五晚上 3.其他时间
            5. 请不要设置时间范围，除非你能确定活动会持续超过一天。
            6. 当你在考虑活动地点时，请考虑以下因素：
               (1) 人数小于 30 人时，可以考虑 教书院小教室。
               (2) 人数在 30-60 人时，可以考虑 教书院中教室 或 理科大楼 A228
               (3) 人数在 60-100 人时，可以考虑 教书院大教室。
               (4) 人数超过 100 人时，请考虑 户外场地。
               (5) 当活动的其他内容暗示了活动地点时，忽略上述规则。
            7. 生成 sections 时，请优先参考预定义的 sections，有必要时，添加 custom 类型的 section。

            输出要求：
            1. 请将生成结果分组，(name, time, timeRange) 为一组，每个 section 为一组。
            2. 每次回答问题时，仅输出一个组。格式如下：
               {
                  index: number; // 组号
                  content: object; // 组内容
                  end: boolean; // 当且仅当内容为最后一个 section 时为 true
               }
               示例：
               {
                  index: 0;
                  content: {
                    name: '活动名称';
                    time: '2024-12-01T10:00:00.000Z';
                  };
                  end: false;
               }
               或
               {
                  index: 1;
                  content: {
                    section: {
                      type: 'description';
                      name: '活动简介';
                      value: '活动的简介...';
                    }
                  };
                  end: true;
               }
            3. 请以Json格式输出回答（不需要在代码块中），不要输出任何其他内容。
            4. 输出的Json中，不能有任何值为undefined的属性。

            输入格式：
            (activity, additionalInfo) 或 '请继续生成'
            1. 其中 activity 是已经策划了一部分的活动，additionalInfo 是额外信息。
            2. 当输入为 '请继续生成' 时，请根据你的记忆，继续生成活动，不要输出任何其他内容。
          `
        },
        {
          role: 'user',
          content: `(${JSON.stringify(activity)}, ${additionalInfo})`
        }
      ] as ChatCompletionMessageParam[]

      const response = await moonshot.chat.completions.create({
        model: 'moonshot-v1-auto',
        messages,
        temperature: 0.3
      })

      // Store conversation and add assistant's response
      messages.push({
        role: 'assistant',
        content: response.choices[0].message.content || ''
      })
      conversationStore.set(`${userId}-activity`, messages)

      return new Response(response.choices[0].message.content)
    }

    case 'continueGenerateActivity': {
      const messages = conversationStore.get(`${userId}-activity`) || []
      messages.push({
        role: 'user',
        content: '请继续生成'
      })

      const response = await moonshot.chat.completions.create({
        model: 'moonshot-v1-auto',
        messages,
        temperature: 0.3
      })

      // Add assistant's response to conversation
      messages.push({
        role: 'assistant',
        content: response.choices[0].message.content || ''
      })
      conversationStore.set(`${userId}-activity`, messages)

      return new Response(response.choices[0].message.content)
    }

    case 'generateTask': {
      const { activity, tasks, additionalInfo } = params
      const messages = [
        {
          role: 'system',
          content: `
             你是一个活动策划专家，你正在为软件工程学院学生会策划活动。你所在的学校是华东师范大学，所在校区为普陀校区。所在的学院约有本科生800人，你所举办的活动一般参与人数在20-100人之间。你正在为活动${activity.name}生成任务。

            一个任务(Task)的结构如下所示：
            \`\`\`
            type Task = {
              id: string;
              sk: string;
              name: string;
              description: string;
              requiredPeople: number;
              references: string[];
              stages: {
                id: string;
                name: string;
                approval: "none" | "manager" | "admin" | "super-admin";
                assignedTo: number[];
                content: string;
                completed: boolean;
              }[];
              dueDate: string;
              fakeAssignedTo?: string[] | undefined;
            }
            \`\`\`

            Task 的 fakeAssignedTo 属性代表虚拟分配。
            fakeAssignedTo 的值是一个字符串数组，数组中的元素是 'A', 'B', 'C', 'D' 这样的字母。
            为一个任务分配的虚拟成员数，必须等于该任务的 requiredPeople。
            不同任务的虚拟成员之间可以重复，代表这些虚拟成员被分配给了多个任务。
            所有任务的虚拟成员去重后的数量，应当等于活动 totalUsers。

            你要进行的任务：
            1. 仔细分析活动内容和目标，生成真正必要的任务。每个任务都应该对活动的成功举办有直接贡献。
            2. 对于已存在的任务，评估其必要性和合理性，如有必要可以修改或删除。
            3. 如果有任务没有虚拟分配，必须通过 'modify-task' 来修改
            4. 任务名称不能重复。
            5. 新任务必须有虚拟分配和截止日期。
            6. 每个任务都应该有明确的目标和可衡量的完成标准。

            输入格式：
            (\${JSON.stringify(activity)}, \${JSON.stringify(tasks)}(现有任务), \${additionalInfo})
            或
            '请继续生成'

            输出格式：
            {
              index: number;
              type: 'modify-task' | 'generate-task';
              content: Task | Omit<Task, 'id' | 'sk' | 'taskId'>;
              end: boolean;
            }
            1. modify-task: content为修改后的Task，未修改的属性保持原样
            2. generate-task: content不能包含id/sk/taskId
            content中不能有undefined属性。
            不要使用代码块。
            一次只输出一个组。end为true时代表最后一个组。
          `
        },
        {
          role: 'user',
          content: `(${JSON.stringify(activity)}, ${JSON.stringify(tasks)}, ${additionalInfo})`
        }
      ] as ChatCompletionMessageParam[]

      const response = await moonshot.chat.completions.create({
        model: 'moonshot-v1-auto',
        messages,
        temperature: 0.3,
        stream: true
      })

      // Store conversation and add assistant's response
      const [res, stream] = streamResponse(response)

      void readStream(stream).then(content => {
        conversationStore.set(`${userId}-task`, [
          ...messages,
          {
            role: 'assistant',
            content
          }
        ])
      })

      return res
    }

    case 'continueGenerateTask': {
      const messages = conversationStore.get(`${userId}-task`) || []
      messages.push({
        role: 'user',
        content: '请继续生成'
      })

      console.log(messages)

      const response = await moonshot.chat.completions.create({
        model: 'moonshot-v1-auto',
        messages,
        temperature: 0.3,
        stream: true
      })

      const [res, stream] = streamResponse(response)

      void readStream(stream).then(content => {
        console.log(content)
        console.log('--------------------------------')
        conversationStore.set(`${userId}-task`, [
          ...messages,
          {
            role: 'assistant',
            content
          }
        ])
      })

      return res
    }

    case 'generateAssignment': {
      const { team, tasks, assignments, additionalInfo } = params as {
        team: Team
        tasks: Task[]
        assignments: Assignment[]
        additionalInfo: string
      }
      const messages = [
        {
          role: 'system',
          content: `
            你是一个活动策划专家，正在为活动生成分工。

            团队(Team)的结构如下所示：
            \`\`\`
            type Team = {
              teamName: string;
              members: {
                id: string;
                name: string;
                role: 'user' | 'manager' | 'admin' | 'super-admin';
              }[];
            }
            \`\`\`

            一个分工(Assignment)的结构如下所示：
            \`\`\`
            type Assignment = {
                taskId: string;
                isManager: false;
                userName: string;
                userId: string;
            } | {
                taskId: string;
                isManager: true;
                managerName: string;
                managerId: string;
            }
            \`\`\`

            你要进行的任务：
            1. 为每个任务分配负责人(isManager为true)
            2. 负责人必须是团队中role为manager/admin/super-admin的成员
            3. 不能修改已存在的分工
            4. 新生成的任务也需要分配负责人

            输出格式：
            {
              index: number;
              type: 'generate-assignment';
              content: Assignment;
              end: boolean;
            }
            content中不能有undefined属性。
            不要使用代码块。
            一次只输出一个组。end为true时代表最后一个组。
          `
        },
        {
          role: 'user',
          content: `(团队：${JSON.stringify(team)}, ${JSON.stringify(tasks)}(现有任务), ${JSON.stringify(assignments)}(现有分工), ${additionalInfo})`
        }
      ] as ChatCompletionMessageParam[]

      const response = await moonshot.chat.completions.create({
        model: 'moonshot-v1-auto',
        messages,
        temperature: 0.3,
        stream: true
      })

      const [res, stream] = streamResponse(response)

      void readStream(stream).then(content => {
        conversationStore.set(`${userId}-assignment`, [
          ...messages,
          {
            role: 'assistant',
            content
          }
        ])
      })

      return res
    }

    case 'continueGenerateAssignment': {
      const messages = conversationStore.get(`${userId}-assignment`) || []
      messages.push({
        role: 'user',
        content: '请继续生成'
      })

      const response = await moonshot.chat.completions.create({
        model: 'moonshot-v1-auto',
        messages,
        temperature: 0.3,
        stream: true
      })

      const [res, stream] = streamResponse(response)

      void readStream(stream).then(content => {
        conversationStore.set(`${userId}-assignment`, [
          ...messages,
          {
            role: 'assistant',
            content
          }
        ])
      })

      return res
    }

    default:
      return new Response('Invalid action', { status: 400 })
  }
}
