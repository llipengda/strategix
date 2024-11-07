'use server'

import { revalidatePath } from 'next/cache'

import db from '@/lib/database'
import { Announcement } from '@/types/announcement'

export const getAllAnnouncements = async () => {
  const data = await db.query<Announcement>({
    IndexName: 'type-index',
    KeyConditionExpression: '#type = :type',
    ExpressionAttributeNames: {
      '#type': 'type'
    },
    ExpressionAttributeValues: {
      ':type': 'announcement'
    },
    ScanIndexForward: false
  })

  return data
}

export const addAnnouncement = async (announcement: Announcement) => {
  await db.add(announcement)

  revalidatePath('/')
  revalidatePath('/announcements')
}

export const addAnnouncementAction = async (formData: FormData) => {
  const announcement = await Announcement.parseAsync({
    content: formData.get('content') as string,
    publisherName: formData.get('publisherName') as string,
    publisherId: (formData.get('publisherId') ?? undefined) as
      | string
      | undefined,
    pin: formData.get('pin') === 'on'
  })

  await addAnnouncement(announcement)
}
