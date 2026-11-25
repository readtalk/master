//
'use client'

import { useEffect, useState } from 'react'
import { Sider, MobileSider } from './sider/Sider'
import ChatRoom from './ChatRoom'

type Props = {
  sessions: { id: string; title: string }[]
  activeId: string
  onSelect: (id: string) => void
  onNewChat: () => void
}

export default function ChatLayout({ sessions, activeId, onSelect, onNewChat }: Props) {
  const [isMobile, setIsMobile] = useState(false)
  const [siderCollapsed, setSiderCollapsed] = useState(false)
  const [mobileSiderOpen, setMobileSiderOpen] = useState(false)
  const [showChat, setShowChat] = useState(false) // HP: true = tampilkan chatroom

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <div className="flex h-screen w-full bg-white dark:bg-[#151517]">
      {/* Sidebar Desktop */}
      {!isMobile && !siderCollapsed && (
        <Sider
          sessions={sessions}
          activeId={activeId}
          onSelect={(id) => onSelect(id)}
          onNewChat={onNewChat}
          onCollapse={() => setSiderCollapsed(true)}
        />
      )}

      {/* Sidebar Mobile */}
      <MobileSider
        open={isMobile && mobileSiderOpen}
        sessions={sessions}
        activeId={activeId}
        onSelect={(id) => {
          onSelect(id)
          setShowChat(true) // HP: klik chat langsung buka room
          setMobileSiderOpen(false)
        }}
        onNewChat={() => {
          onNewChat()
          setShowChat(true)
          setMobileSiderOpen(false)
        }}
        onCloseMobile={() => setMobileSiderOpen(false)}
      />

      {/* Main Content */}
      <main className="flex flex-1 flex-col min-w-0">
        {/* Topbar */}
        <div className="flex items-center gap-2 p-3 border-b">
          <button 
            className="md:hidden p-2" 
            onClick={() => setMobileSiderOpen(true)}
          >
            ☰
          </button>
          {!isMobile && siderCollapsed && (
            <button onClick={() => setSiderCollapsed(false)}>☰</button>
          )}
          **{activeId ? 'New chat' : 'API usage demo'}**
        </div>

        {/* Chat Room */}
        <div className={`${isMobile && !showChat ? 'hidden' : 'flex'} flex-1 flex-col`}>
          <ChatRoom 
            isMobile={isMobile}
            onBack={() => setShowChat(false)}
            activeId={activeId}
          />
        </div>
      </main>
    </div>
  )
}
