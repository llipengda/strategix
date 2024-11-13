import { addFullActivity } from '@/lib/actions/activity'
import { Activity } from '@/types/activity/activity'
import { AssignmentArray } from '@/types/activity/assignment'

await addFullActivity(
  Activity.parse({
    name: '活动测试',
    team: 'hr',
    sections: [
      {
        type: 'description',
        value: '这是一个活动测试'
      }
    ]
  }), AssignmentArray.parse([
    {
      id: '1bd017b2-98b4-455e-812a-336a4cea314d',
      managerName: 'manager',
      task: {
        name: 'task',
        description: 'task description',
        additionalInfo: 'task additional info',
        type: '推送'
      },
      dueDate: '2025-02-02T02:02:02Z',
      completed: false,
      isManager: false,
      type: 'assignment'
    }
  ])
)
