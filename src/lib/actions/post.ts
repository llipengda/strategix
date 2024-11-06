'use server'

import db from '@/lib/database'
import { Post } from '@/types/post'

export const createPost = async (post: Post) => {
  await db.add(post)
}

export const createPostAction = async (formData: FormData) => {
  const post = await Post.parseAsync({
    title: formData.get('title') as string,
    team: formData.get('team') as string,
    publishDate: new Date(formData.get('publishDate') as string),
    isFrontPage: formData.get('isFrontPage') === 'on'
  })

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
      throw new Error('该日期已有头版')
    }
  }

  await createPost(post)
}

export const getPosts = async (year: number, month: number) => {
  const yearMonth = `${year}-${month.toString().padStart(2, '0')}`

  const posts = await db.query<Post>({
    IndexName: 'type-index',
    KeyConditionExpression:
      '#type = :type AND begins_with(sk, :sk)',
    ExpressionAttributeNames: {
      '#type': 'type'
    },
    ExpressionAttributeValues: {
      ':type': 'post',
      ':sk': `${yearMonth}`,
    }
  })

  return posts
}
