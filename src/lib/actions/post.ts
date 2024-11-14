'use server'

import { revalidatePath } from 'next/cache'

import { auth } from '@/auth'
import db from '@/lib/database'
import { local, localFormat } from '@/lib/time'
import { Post } from '@/types/post'

import { role } from '../role'

export const createPost = async (post: Post) => {
  await db.add(post)
}

export const createPostAction = async (_: unknown, formData: FormData) => {
  const {
    data: post,
    success,
    error
  } = await Post.safeParseAsync({
    title: formData.get('title') as string,
    team: formData.get('team') as string,
    publishDate: new Date(formData.get('publishDate') as string),
    isFrontPage: formData.get('isFrontPage') === 'on'
  })

  if (!success) {
    return error.errors.flatMap(e => e.message).join('; ')
  }

  if (post.isFrontPage) {
    const frontPages = await db.query<Post>({
      IndexName: 'type-index',
      KeyConditionExpression: '#type = :type AND begins_with(sk, :sk)',
      ExpressionAttributeNames: {
        '#type': 'type'
      },
      ExpressionAttributeValues: {
        ':type': 'post',
        ':sk': `${post.publishDate}#0#`
      }
    })

    if (frontPages.length > 0) {
      return '该日期已有头版推送'
    }
  }

  await createPost(post)
  revalidatePath('/schedule')
  revalidatePath(`/schedule/${localFormat(post.publishDate, 'd')}`)
  revalidatePath('/')
}

export const getPosts = async (year: number, month: number, day?: number) => {
  const yearMonth = `${year}-${month.toString().padStart(2, '0')}`

  const date = !!day
    ? `${yearMonth}-${day.toString().padStart(2, '0')}`
    : yearMonth

  const posts = await db.query<Post>({
    IndexName: 'type-index',
    KeyConditionExpression: '#type = :type AND begins_with(sk, :sk)',
    ExpressionAttributeNames: {
      '#type': 'type'
    },
    ExpressionAttributeValues: {
      ':type': 'post',
      ':sk': date
    }
  })

  return posts
}

export const getPostsStartingToday = async () => {
  const posts = await db.query<Post>({
    IndexName: 'type-index',
    KeyConditionExpression: '#type = :type AND sk > :sk',
    ExpressionAttributeNames: {
      '#type': 'type'
    },
    ExpressionAttributeValues: {
      ':type': 'post',
      ':sk': local(Date.now() - 1000 * 60 * 60 * 24).toISOString()
    }
  })

  return posts
}

export const deletePostAction = async (post: Post, path: string) => {
  const user = (await auth())?.user
  role.ensure.admin(user)

  await db.del({
    id: post.id,
    sk: post.sk
  })
  revalidatePath(path)
  revalidatePath('/schedule')
}
