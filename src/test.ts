import { addAnnouncementAction } from '@/lib/actions/announcement'

const formData = new FormData()

formData.append(
  'content',
  'pin test'
)
formData.append('publisherName', 'system')
formData.append('pin', 'on')

addAnnouncementAction(formData)
