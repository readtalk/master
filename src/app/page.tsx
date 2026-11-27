'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import type { Session } from '@/components/Sidebar'

export default function Home() {
  const [sessions, setSessions] = useState<Session[]>([
    { id: '1', title: 'Chat baru' },
  ])
  const [activeId, setActiveId] = useState('1')
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div style={{ display: 'flex', width: '100%', height: '100dvh', background: '#000', color: '#fff' }}>
      {!collapsed && (
        <Sidebar
          sessions={sessions}
          activeId={activeId}
          onSelect={setActiveId}
          onNewChat={() => {
            const id = String(Date.now())
            setSessions((s) => [{ id, title: 'Chat baru' }, ...s])
            setActiveId(id)
          }}
          onCollapse={() => setCollapsed(true)}
          onOpenSettings={() => {}}
        />
      )}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            style={{ position: 'absolute', top: 16, left: 16, background: '#1a1a1a', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 999, padding: '8px 14px', cursor: 'pointer' }}
          >
            Buka
          </button>
        )}
        <div style={{ fontSize: 20, fontWeight: 600 }}>READTalk</div>
      </div>
    </div>
  )
}
