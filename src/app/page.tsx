'use client'

import { useState } from 'react'
import { Sidebar, SessionItem } from '@/components/Sidebar'
import type { Session } from '@/components/Sidebar'
import { DotsThree, Plus } from '@phosphor-icons/react'

export default function Home() {
  const [sessions, setSessions] = useState<Session[]>([
    { id: '1', title: 'Chat baru' },
  ])
  const [activeId, setActiveId] = useState('1')
  const [collapsed, setCollapsed] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const handleNewChat = () => {
    const id = String(Date.now())
    setSessions((s) => [{ id, title: 'Chat baru' }, ...s])
    setActiveId(id)
  }

  return (
    <>
      <style>{`
        .pg-shell { display: flex; width: 100%; height: 100dvh; background: #000; color: #fff; }
        .pg-main { flex: 1; display: flex; flex-direction: column; min-width: 0; position: relative; }
        .pg-topbar { display: none; }
        .pg-list { padding: 16px 12px; }
        .pg-section { padding: 2px 10px 8px; font-size: 12px; color: #888; }
        .pg-center { flex: 1; display: flex; align-items: center; justify-content: center; }
        .pg-fab { display: none; }
        .pg-dotthree { display: none; }
        @media (max-width: 768px) {
          /* Smartphone: navrail hilang, yang jalan FAB + DotsThree di Page */
          .pg-topbar { display: flex; align-items: center; justify-content: space-between; padding: 12px 12px 0; }
          .pg-dotthree { display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border: none; border-radius: 12px; background: transparent; color: #fff; cursor: pointer; }
          .pg-fab { display: flex; align-items: center; justify-content: center; position: fixed; right: 16px; bottom: 80px; z-index: 55; width: 56px; height: 56px; border-radius: 999px; background: #fff; color: #000; border: none; box-shadow: 0 4px 16px rgba(0,0,0,0.5); cursor: pointer; }
          .pg-main { padding-bottom: 64px; } /* ruang buat navbar kosong */
        }
      `}</style>

      <div className="pg-shell">
        {!collapsed && (
          <Sidebar
            sessions={sessions}
            activeId={activeId}
            // Nanti isi dari Auth.tsx, bukan dari token di Sidebar
            // user={auth.user}
            onSelect={setActiveId}
            onNewChat={handleNewChat}
            onCollapse={() => setCollapsed(true)}
            onOpenSettings={() => setShowSettings(true)}
          />
        )}

        <div className="pg-main">
          {/* SMARTPHONE ONLY: DotsThree Settings pojok kanan atas */}
          <div className="pg-topbar">
            <div style={{ fontSize: 18, fontWeight: 700 }}>READTalk</div>
            <button className="pg-dotthree" aria-label="Settings" onClick={() => setShowSettings(true)}>
              <DotsThree size={28} weight="bold" />
            </button>
          </div>

          {/* LIST OBROLAN DUMMY - pindah dari Sidebar ke Page */}
          {/* Nanti isinya obrolan Anna Laura AI */}
          <div className="pg-list">
            <div className="pg-section">Today</div>
            {sessions.map((s) => (
              <SessionItem
                key={s.id}
                session={s}
                active={s.id === activeId}
                onSelect={() => setActiveId(s.id)}
                onDelete={() => setSessions((prev) => prev.filter((x) => x.id !== s.id))}
              />
            ))}
          </div>

          <div className="pg-center">
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

          {/* SMARTPHONE ONLY: FAB + , copy dari navrail */}
          <button className="pg-fab" aria-label="New chat" onClick={handleNewChat}>
            <Plus size={28} weight="bold" />
          </button>

          {showSettings && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={() => setShowSettings(false)}>
              <div style={{ background: '#111', borderRadius: 16, padding: 18, width: 'min(420px, 90vw)' }} onClick={(e) => e.stopPropagation()}>
                <h3 style={{ margin: '0 0 8px' }}>Settings</h3>
                <p style={{ fontSize: 14, color: '#888', margin: 0 }}>Placeholder - nanti nyambung ke Auth.tsx + Anna Laura AI.</p>
                <button onClick={() => setShowSettings(false)} style={{ marginTop: 16, background: '#1a1a1a', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 999, padding: '7px 12px', cursor: 'pointer' }}>Tutup</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
