'use client'

import { useState, useRef, useCallback } from 'react'
import { Sidebar, SessionItem } from '@/components/Sidebar'
import type { Session } from '@/components/Sidebar'
import { DotsThree, Brain } from '@phosphor-icons/react'

export default function Home() {
  const [sessions, setSessions] = useState<Session[]>([
    { id: '1', title: 'Chat baru' },
  ])
  const [activeId, setActiveId] = useState('1')
  const [collapsed, setCollapsed] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  // --- 2 PAGE: lebar Page 1 bisa digeser user ---
  const [sidebarWidth, setSidebarWidth] = useState(300)
  const dragging = useRef(false)

  const onDragStart = useCallback((e: React.MouseEvent) => {
    dragging.current = true
    const startX = e.clientX
    const startW = sidebarWidth

    const onMove = (ev: MouseEvent) => {
      if (!dragging.current) return
      const next = startW + (ev.clientX - startX)
      // batas biar gak kekecilan / kegedean
      setSidebarWidth(Math.min(480, Math.max(220, next)))
    }
    const onUp = () => {
      dragging.current = false
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [sidebarWidth])

  const handleNewChat = () => {
    const id = String(Date.now())
    setSessions((s) => [{ id, title: 'Chat baru' }, ...s])
    setActiveId(id)
  }

  return (
    <>
      <style>{`
        .pg-shell { display: flex; width: 100%; height: 100dvh; background: #000; color: #fff; overflow: hidden; }
        .pg-page1 { flex-shrink: 0; overflow: hidden; display: flex; }
        .pg-divider { width: 6px; cursor: col-resize; background: transparent; position: relative; flex-shrink: 0; touch-action: none; }
        .pg-divider:hover, .pg-divider:active { background: rgba(0,198,255,0.35); }
        .pg-divider::after { content:''; position:absolute; left:50%; top:0; bottom:0; width:1px; transform:translateX(-50%); background: rgba(255,255,255,0.12); }
        .pg-main { flex: 1; display: flex; flex-direction: column; min-width: 0; position: relative; }
        .pg-topbar { display: none; }
        .pg-list { padding: 16px 12px; }
        .pg-section { padding: 2px 10px 8px; font-size: 12px; color: #888; }
        .pg-center { flex: 1; display: flex; align-items: center; justify-content: center; }
        .pg-fab { display: none; }
        .pg-dotthree { display: none; }

        /* FAB BRAIN BIRU 3D - bulat */
        .pg-fab-brain {
          display: flex; align-items: center; justify-content: center;
          width: 56px; height: 56px; border-radius: 999px; border: none; cursor: pointer;
          color: #fff;
          /* biru 3D: terang -> utama -> gelap */
          background: radial-gradient(circle at 30% 25%, #BFE9FF 0%, #00C6FF 28%, #4248C7 62%, #15166F 100%);
          box-shadow: 0 8px 24px rgba(0,198,255,0.45), inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -6px 12px rgba(21,22,111,0.6);
        }
        .pg-fab-brain:active { transform: scale(0.96); }

        @media (max-width: 768px) {
          .pg-page1, .pg-divider { display: none; }
          .pg-topbar { display: flex; align-items: center; justify-content: space-between; padding: 12px 12px 0; }
          .pg-dotthree { display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; border: none; border-radius: 12px; background: transparent; color: #fff; cursor: pointer; }
          .pg-fab { display: flex; align-items: center; justify-content: center; position: fixed; right: 16px; bottom: 80px; z-index: 55; }
          .pg-main { padding-bottom: 64px; }
        }
      `}</style>

      <div className="pg-shell">
        {/* PAGE 1 - kiri */}
        {!collapsed && (
          <>
            <div className="pg-page1" style={{ width: sidebarWidth }}>
              <Sidebar
                sessions={sessions}
                activeId={activeId}
                onSelect={setActiveId}
                onNewChat={handleNewChat}
                onCollapse={() => setCollapsed(true)}
                onOpenSettings={() => setShowSettings(true)}
              />
            </div>

            {/* PEMISAH - bisa digeser user */}
            <div className="pg-divider" onMouseDown={onDragStart} title="Geser untuk atur lebar" />
          </>
        )}

        {/* PAGE 2 - kanan */}
        <div className="pg-main">
          <div className="pg-topbar">
            <div style={{ fontSize: 18, fontWeight: 700 }}>READTalk</div>
            <button className="pg-dotthree" aria-label="Settings" onClick={() => setShowSettings(true)}>
              <DotsThree size={28} weight="bold" />
            </button>
          </div>

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

          {/* SMARTPHONE ONLY: FAB BRAIN BIRU 3D, bukan + lagi */}
          <div className="pg-fab">
            <button className="pg-fab-brain" aria-label="Anna Laura AI" onClick={handleNewChat}>
              <Brain size={30} weight="fill" />
            </button>
          </div>

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
