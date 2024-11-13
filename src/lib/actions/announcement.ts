'use server'

import { revalidatePath } from 'next/cache'

import db from '@/lib/database'
import { Announcement } from '@/types/announcement'
import { auth } from '@/auth'
import { role } from '../role'

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
  revalidatePath('/announcement')
}

export const deleteAnnouncement = async (announcement: Announcement) => {
  await db.del({
    id: announcement.id,
    sk: announcement.sk
  })
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

export const deleteAnnouncementAction = async (announcement: Announcement) => {
  const user = (await auth())?.user

  role.ensure.admin(user)

  if (role.superAdmin(user) || announcement.publisherId === user?.id) {
    deleteAnnouncement(announcement);
    revalidatePath('/')
    revalidatePath('/announcement')
  }
}
