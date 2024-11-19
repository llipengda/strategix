'use client'

import Ably from 'ably'
import { AblyProvider, ChannelProvider } from 'ably/react'

interface ChoiceWrapperProps {
  activityId: string
  children: React.ReactNode
}

export default function ChoiceWrapper({
  activityId,
  children
}: ChoiceWrapperProps) {
  const client = new Ably.Realtime({ authUrl: '/api/ably' })

  return (
    <AblyProvider client={client}>
      <ChannelProvider channelName={`activity-${activityId}`}>
        {children}
      </ChannelProvider>
    </AblyProvider>
  )
}
