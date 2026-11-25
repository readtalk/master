'use client'

import { useState } from 'react'
import ChatLayout from '@/components/ChatLayout'

export default function Home() {
  const [sessions, setSessions] = useState<{ id: string; title: string }[]>([])
  const [activeId, setActiveId] = useState('')

  const handleNewChat = () => {
    const newId = Date.now().toString()
    setSessions([{ id: newId, title: 'New chat' }])
    setActiveId(newId)
  }

  return (
    <ChatLayout
      sessions={sessions}
      activeId={activeId}
      onSelect={setActiveId}
      onNewChat={handleNewChat}
    />
  )
}
