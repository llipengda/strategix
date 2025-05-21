import { type NextRequest } from 'next/server'

import OpenAI from 'openai'
import type { ChatCompletionMessageParam } from 'openai/resources/index.mjs'

import { auth } from '@/auth'
import { localISOFormat } from '@/lib/time'
import { type Activity, predefinedSections } from '@/types/activity/activity'
import type { Assignment } from '@/types/activity/assignment'
import type { Task, TaskTemplate } from '@/types/activity/task'
import type { Team } from '@/types/team'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE_URL
})

// 请求体类型定义
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

// 创建会话存储
const conversationStore = new Map<string, ChatCompletionMessageParam[]>()

// 清理过期会话的定时器（30分钟后清理）
const SESSION_TIMEOUT = 30 * 60 * 1000
setInterval(() => {
  const now = Date.now()
  const sessions = new Map<string, number>()

  // 此处应从某处获取会话访问时间，这里仅为示例
  // 实际实现中应当使用更完善的会话管理机制
  conversationStore.forEach((_, key) => {
    if (sessions.has(key) && now - (sessions.get(key) || 0) > SESSION_TIMEOUT) {
      conversationStore.delete(key)
    }
  })
}, SESSION_TIMEOUT)

// 任务模板生成系统提示词
function getTaskTemplatePrompt(
  taskTemplate: TaskTemplate,
  additionalInfo: string
) {
  return `
作为活动策划专家，你需要为华东师范大学学生会创建任务模板。请根据以下信息补充模板:

【模板结构】
- name: 任务名称
- description: 任务描述
- requiredPeople: 所需人数
- stages: 任务流程
  - name: 阶段名称
  - approval: 审核级别("none"|"manager"|"admin"|"super-admin")
  - assignedTo: 分配对象[数字数组]
  - content: 内容描述

【关键规则】
- 精简人员: 50%任务单人完成，95%任务最多双人
- 合理分工: assignedTo不超过requiredPeople-1
- 流程细分: 无论简单与否至少设置一个stage
- 审核机制: 面向公众内容(海报，推送，通知)需"super-admin"审核；审核不作为单独的流程
- 报销流程: 预算(super-admin审核)→采购→决算(manager审核)→上交材料(manager审核)
- 公示流程: 拟定内容→盖章→张贴

【技术要求】
- 输出纯JSON格式，不使用代码块
- 仅保留定义中的属性，多余属性请忽略

输入: ${JSON.stringify(taskTemplate)}, ${additionalInfo}
`
}

// 活动生成系统提示词
function getActivityPrompt(activity: Activity, additionalInfo: string) {
  return `
作为华东师范大学软件工程学院(800名本科生)的活动策划专家，请创建/完善活动方案:

【活动结构】
- name: 活动名称
- sections: 活动内容板块
  - type: 板块类型[${Object.keys(predefinedSections).join('|')}|custom]
  - name: 板块名称
  - value: 板块内容(支持markdown)
- time/timeRange: 活动时间(ISO格式，二选一)

【关键规则】
- 时间安排: 必须晚于${localISOFormat()}，优先考虑周三下午>周末>周五晚上
- 场地选择: <30人(教书院小教室), 30-60人(教书院中教室/理科大楼A228), 60-100人(教书院大教室), >100人(户外)
- 输出分组: 基本信息为一组，每个section为一组

【输出格式】
{
  index: 组号,
  content: {基本信息或单个section},
  end: 是否最后一组
}

输入: ${JSON.stringify(activity)}, ${additionalInfo}
`
}

// 任务生成系统提示词
function getTaskPrompt(
  activity: Activity,
  tasks: Task[],
  additionalInfo: string
) {
  return `
作为华东师范大学软件工程学院活动策划专家，请为活动"${activity.name}"生成必要任务:

【任务结构】
- name: 任务名称
- description: 任务描述
- requiredPeople: 所需人数
- references: 参考资料
- stages: 任务阶段
  - name: 阶段名称
  - approval: 审核级别
  - assignedTo: 分配对象[数字]
  - content: 阶段内容
  - completed: 完成状态
- dueDate: 截止日期(ISO格式)
- fakeAssignedTo: 虚拟分配成员['A','B'...]

【关键规则】
- 任务必要性: 每个任务必须对活动成功有直接贡献
- 唯一性: 任务名称不可重复
- 虚拟分配: 必须完成所有任务的虚拟分配

【输出格式】
{
  index: 序号,
  type: 'modify-task'|'generate-task',
  content: {任务内容},
  end: 是否最后一个
}

输入: 活动${JSON.stringify(activity)}, 现有任务${JSON.stringify(tasks)}, ${additionalInfo}
`
}

// 分工生成系统提示词
function getAssignmentPrompt(
  team: Team,
  tasks: Task[],
  assignments: Assignment[],
  additionalInfo: string
) {
  return `
作为活动策划专家，请为团队分配任务负责人:

【团队结构】
${JSON.stringify(team, null, 2)}

【分工规则】
- 每个任务必须分配一名负责人(isManager: true)
- 负责人必须是role为manager/admin/super-admin的成员
- 不可修改已存在的分工
- 新任务必须分配负责人

【输出格式】
{
  index: 序号,
  type: 'generate-assignment',
  content: {
    taskId: 任务ID,
    isManager: true,
    managerName: 负责人姓名,
    managerId: 负责人ID
  },
  end: 是否最后一个
}

输入: 团队${JSON.stringify(team)}, 现有任务${JSON.stringify(tasks)}, 现有分工${JSON.stringify(assignments)}, ${additionalInfo}
`
}

// 处理定时清理过期会话的函数
function updateSessionTime(userId: string, actionType: string) {
  // 此处应更新会话最后访问时间
  // 实现会话管理机制
  console.log(
    `用户${userId}的${actionType}会话已更新，当前时间: ${localISOFormat()}`
  )
}

// 主要API处理函数
export async function POST(req: NextRequest) {
  try {
    // 身份验证
    const session = await auth()
    const user = session?.user

    if (!user) {
      return new Response('身份验证失败', { status: 401 })
    }

    const userId = user.id

    // 解析请求体
    const body = (await req.json()) as RequestBody
    const { action, params } = body

    // 根据操作类型处理请求
    switch (action) {
      case 'generateTaskTemplate': {
        return await handleGenerateTaskTemplate(
          params.taskTemplate,
          params.additionalInfo
        )
      }
      case 'generateActivity': {
        return await handleGenerateActivity(
          userId,
          params.activity,
          params.additionalInfo
        )
      }
      case 'continueGenerateActivity': {
        return await handleContinueGenerateActivity(userId)
      }
      case 'generateTask': {
        return await handleGenerateTask(
          userId,
          params.activity,
          params.tasks,
          params.additionalInfo
        )
      }
      case 'continueGenerateTask': {
        return await handleContinueGenerateTask(userId)
      }
      case 'generateAssignment': {
        return await handleGenerateAssignment(
          userId,
          params.team,
          params.tasks,
          params.assignments,
          params.additionalInfo
        )
      }
      case 'continueGenerateAssignment': {
        return await handleContinueGenerateAssignment(userId)
      }
      default:
        return new Response('无效的操作', { status: 400 })
    }
  } catch (error) {
    console.error('API错误:', error)
    return new Response('服务器错误', { status: 500 })
  }
}

// 处理生成任务模板的请求
async function handleGenerateTaskTemplate(
  taskTemplate: TaskTemplate,
  additionalInfo: string
) {
  try {
    const systemPrompt = getTaskTemplatePrompt(taskTemplate, additionalInfo)

    const messages = [
      {
        role: 'system',
        content: systemPrompt
      }
    ] as ChatCompletionMessageParam[]

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.3
    })

    return new Response(response.choices[0].message.content)
  } catch (error) {
    console.error('生成任务模板错误:', error)
    throw error
  }
}

// 处理生成活动的请求
async function handleGenerateActivity(
  userId: string,
  activity: Activity,
  additionalInfo: string
) {
  try {
    const systemPrompt = getActivityPrompt(activity, additionalInfo)

    const messages = [
      {
        role: 'system',
        content: systemPrompt
      }
    ] as ChatCompletionMessageParam[]

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.3
    })

    // 存储会话
    messages.push({
      role: 'assistant',
      content: response.choices[0].message.content || ''
    })
    conversationStore.set(`${userId}-activity`, messages)
    updateSessionTime(userId, 'activity')

    return new Response(response.choices[0].message.content)
  } catch (error) {
    console.error('生成活动错误:', error)
    throw error
  }
}

// 处理继续生成活动的请求
async function handleContinueGenerateActivity(userId: string) {
  try {
    const messages = conversationStore.get(`${userId}-activity`) || []
    if (messages.length === 0) {
      return new Response('没有找到相关会话', { status: 404 })
    }

    messages.push({
      role: 'user',
      content: '请继续生成'
    })

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.3
    })

    // 更新会话
    messages.push({
      role: 'assistant',
      content: response.choices[0].message.content || ''
    })
    conversationStore.set(`${userId}-activity`, messages)
    updateSessionTime(userId, 'activity')

    return new Response(response.choices[0].message.content)
  } catch (error) {
    console.error('继续生成活动错误:', error)
    throw error
  }
}

// 处理生成任务的请求
async function handleGenerateTask(
  userId: string,
  activity: Activity,
  tasks: Task[],
  additionalInfo: string
) {
  try {
    const systemPrompt = getTaskPrompt(activity, tasks, additionalInfo)

    const messages = [
      {
        role: 'system',
        content: systemPrompt
      }
    ] as ChatCompletionMessageParam[]

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.3
    })

    // 存储会话
    const content = response.choices[0].message.content || ''
    conversationStore.set(`${userId}-task`, [
      ...messages,
      {
        role: 'assistant',
        content
      }
    ])
    updateSessionTime(userId, 'task')

    return new Response(content)
  } catch (error) {
    console.error('生成任务错误:', error)
    throw error
  }
}

// 处理继续生成任务的请求
async function handleContinueGenerateTask(userId: string) {
  try {
    const messages = conversationStore.get(`${userId}-task`) || []
    if (messages.length === 0) {
      return new Response('没有找到相关会话', { status: 404 })
    }

    messages.push({
      role: 'user',
      content: '请继续生成'
    })

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.3
    })

    // 更新会话
    const content = response.choices[0].message.content || ''
    messages.push({
      role: 'assistant',
      content
    })
    conversationStore.set(`${userId}-task`, messages)
    updateSessionTime(userId, 'task')

    return new Response(content)
  } catch (error) {
    console.error('继续生成任务错误:', error)
    throw error
  }
}

// 处理生成分工的请求
async function handleGenerateAssignment(
  userId: string,
  team: Team,
  tasks: Task[],
  assignments: Assignment[],
  additionalInfo: string
) {
  try {
    const systemPrompt = getAssignmentPrompt(
      team,
      tasks,
      assignments,
      additionalInfo
    )

    const messages = [
      {
        role: 'system',
        content: systemPrompt
      }
    ] as ChatCompletionMessageParam[]

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.3
    })

    // 存储会话
    const content = response.choices[0].message.content || ''
    conversationStore.set(`${userId}-assignment`, [
      ...messages,
      {
        role: 'assistant',
        content
      }
    ])
    updateSessionTime(userId, 'assignment')

    return new Response(content)
  } catch (error) {
    console.error('生成分工错误:', error)
    throw error
  }
}

// 处理继续生成分工的请求
async function handleContinueGenerateAssignment(userId: string) {
  try {
    const messages = conversationStore.get(`${userId}-assignment`) || []
    if (messages.length === 0) {
      return new Response('没有找到相关会话', { status: 404 })
    }

    messages.push({
      role: 'user',
      content: '请继续生成'
    })

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.3
    })

    // 更新会话
    const content = response.choices[0].message.content || ''
    messages.push({
      role: 'assistant',
      content
    })
    conversationStore.set(`${userId}-assignment`, messages)
    updateSessionTime(userId, 'assignment')

    return new Response(content)
  } catch (error) {
    console.error('继续生成分工错误:', error)
    throw error
  }
}
