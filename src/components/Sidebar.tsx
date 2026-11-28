'use client'

import { useState } from 'react'
import {
  ChatCircle,
  DotsThree,
  List,
  PencilSimple,
  Plus,
  Trash,
  GearSix,
} from '@phosphor-icons/react'

export type Session = { id: string; title: string }
export type SidebarUser = { id?: string; username?: string; yourname?: string; avatar?: string | null }

export type SidebarProps = {
  mobile?: boolean
  sessions: Session[]
  activeId: string
  user?: SidebarUser | null
  onSelect?: (id: string) => void
  onNewChat?: () => void
  onCollapse?: () => void
  onExpand?: () => void
  onOpenSettings?: () => void
  onCloseMobile?: () => void
  onOpenProfile?: () => void
}

function SidebarStyles() {
  return (
    <style>{`
      .sk-shell { display: flex; height: 100%; background: #000; color: #fff; }
      .sk-rail { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; width: 72px; height: 100%; padding: 12px 0; background: #000; border-right: 1px solid rgba(255,255,255,0.1); }
      .sk-rail-logo { width: 40px; height: 40px; border-radius: 12px; background: #fff; color: #000; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 20px; margin-bottom: 12px; }
      .sk-icon-btn { display: flex; align-items: center; justify-content: center; width: 48px; height: 48px; border: none; border-radius: 14px; background: transparent; color: #fff; cursor: pointer; }
      .sk-icon-btn:hover { background: #1a1a1a; }
      .sk-icon-btn-active { background: #1a1a1a; }
      .sk-rail-spacer { flex: 1; }
      .sk-rail-avatar { width: 40px; height: 40px; border-radius: 999px; background: #262626; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; overflow: hidden; border: none; cursor: pointer; margin-top: 8px; flex-shrink: 0; }
      .sk-rail-avatar img { width: 100%; height: 100%; object-fit: cover; }
      .sk-rail-avatar:hover { outline: 1px solid rgba(255,255,255,0.3); }
      .sk-item { position: relative; display: flex; align-items: center; box-sizing: border-box; height: 40px; padding: 6px 6px 6px 10px; border-radius: 12px; font-size: 14px; line-height: 22px; color: #fff; cursor: pointer; }
      .sk-item-active { background-color: #1a1a1a; }
      .sk-item:hover { background-color: #1a1a1a; }
      .sk-item-title { flex: 1; min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; line-height: 18px; }
      .sk-item-action { display: none; flex-shrink: 0; margin-left: 4px; }
      .sk-item:hover .sk-item-action, .sk-item-active .sk-item-action { display: flex; }
      .sk-small-btn { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border: none; border-radius: 8px; background: transparent; color: #fff; cursor: pointer; }
      .sk-small-btn:hover { background: #262626; }
      .sk-rename-input { box-sizing: border-box; width: 100%; height: 40px; padding: 0 10px; border-radius: 12px; border: 1px solid #fff; background: #1a1a1a; color: #fff; font: inherit; font-size: 14px; outline: none; }
      .sk-menu { position: relative; }
      .sk-menu-pop { position: absolute; right: 0; top: 32px; z-index: 50; min-width: 140px; background: #111; color: #fff; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.5); padding: 6px; display: flex; flex-direction: column; }
      .sk-menu-item { display: flex; align-items: center; gap: 8px; border: none; background: transparent; text-align: left; padding: 8px 10px; border-radius: 8px; cursor: pointer; font-size: 13px; color: #fff; }
      .sk-menu-item:hover { background: #1a1a1a; }
      .sk-menu-item-danger { color: #ff5555; }
      .sk-bottom { display: none; }
      @media (max-width: 768px) {
        .sk-shell { display: block; height: auto; }
        .sk-rail { display: none; }
        .sk-item { height: 44px; padding: 11px 6px 11px 12px; border-radius: 16px; font-size: 16px; }
        .sk-rename-input { height: 44px; padding: 0 12px; font-size: 16px; }
        /* Smartphone: navbar sengaja kosong.
           + -> FAB di Page
           Settings -> DotsThree pojok kanan atas di Page
           List chat -> di Page */
        .sk-bottom { position: fixed; left: 0; right: 0; bottom: 0; z-index: 50; display: flex; align-items: center; justify-content: space-around; height: 64px; padding-bottom: env(safe-area-inset-bottom); background: #000; border-top: 1px solid rgba(255,255,255,0.12); }
      }
      @media (hover: none) { .sk-item-action { display: flex; } }
    `}</style>
  )
}

// Dipindah ke Page, tapi tetap di-export biar Page bisa pakai komponen yang sama
export function SessionItem({ session, active, onSelect, onDelete }: { session: Session; active: boolean; onSelect?: () => void; onDelete?: () => void }) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(session.title)
  const [menuOpen, setMenuOpen] = useState(false)
  const displayTitle = title || 'Untitled chat'
  if (editing) {
    return (
      <input
        className="sk-rename-input"
        defaultValue={displayTitle}
        autoFocus
        onFocus={(e) => e.target.select()}
        onBlur={(e) => { if (e.target.value.trim()) setTitle(e.target.value.trim()); setEditing(false) }}
        onKeyDown={(e) => { if (e.key === 'Enter') { const v = (e.target as HTMLInputElement).value.trim(); if (v) setTitle(v); setEditing(false) } if (e.key === 'Escape') setEditing(false) }}
      />
    )
  }
  return (
    <div className={active ? 'sk-item sk-item-active' : 'sk-item'} onClick={onSelect}>
      <div className="sk-item-title">{displayTitle}</div>
      <div className="sk-item-action" onClick={(e) => e.stopPropagation()}>
        <div className="sk-menu">
          <button className="sk-small-btn" aria-label="More" onClick={() => setMenuOpen(!menuOpen)}><DotsThree size={20} weight="bold" /></button>
          {menuOpen && (
            <div className="sk-menu-pop">
              <button className="sk-menu-item" onClick={() => { setMenuOpen(false); setEditing(true) }}><PencilSimple size={16} /> Rename</button>
              <button className="sk-menu-item sk-menu-item-danger" onClick={() => { setMenuOpen(false); onDelete?.() }}><Trash size={16} /> Delete</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function CollapsedSidebar({ onExpand, onNewChat }: { onExpand?: () => void; onNewChat?: () => void }) {
  return (
    <>
      <SidebarStyles />
      <div style={{ display: 'flex', gap: 8, padding: 12 }}>
        <button className="sk-icon-btn" title="Expand" onClick={onExpand}><List size={22} /></button>
        <button className="sk-icon-btn" title="New chat" onClick={onNewChat}><Plus size={22} /></button>
      </div>
    </>
  )
}

export function Sidebar({ activeId, onSelect, onNewChat, onOpenSettings, onCloseMobile, user, onOpenProfile }: SidebarProps) {
  const [showList, setShowList] = useState(false)

  const avatarLabel = user?.yourname?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || '?'

  return (
    <>
      <SidebarStyles />
      <div className="sk-shell">
        {/* DESKTOP NAVRAIL - lengkap, standby */}
        <div className="sk-rail">
          <div className="sk-rail-logo">R</div>
          <button className="sk-icon-btn" title="New chat" aria-label="New chat" onClick={onNewChat}><Plus size={24} /></button>
          <button className={showList ? 'sk-icon-btn sk-icon-btn-active' : 'sk-icon-btn'} title="Chats" aria-label="Chats" onClick={() => setShowList(!showList)}><ChatCircle size={24} /></button>
          <div className="sk-rail-spacer" />
          {/* Settings standby di bawah */}
          <button className="sk-icon-btn" title="Settings" aria-label="Settings" onClick={() => onOpenSettings?.()}><GearSix size={24} /></button>
          {/* Avatar standby paling bawah - data dari Auth.tsx via props, bukan dari token */}
          <button className="sk-rail-avatar" title={user?.yourname || user?.username || 'Profile'} aria-label="Profile" onClick={() => onOpenProfile?.() ?? onOpenSettings?.()}>
            {user?.avatar ? <img src={user.avatar} alt="" /> : avatarLabel}
          </button>
        </div>

        {/* SMARTPHONE NAVBAR - sengaja kosong.
            Jangan diisi lagi. + = FAB di Page, Settings = DotsThree di Page */}
        <div className="sk-bottom" aria-hidden="true" />
      </div>
    </>
  )
}

export function MobileSidebar({ open, sessions, activeId, onSelect, onNewChat, onOpenSettings, onCloseMobile, user, onOpenProfile }: { open: boolean; sessions: Session[]; activeId: string; onSelect?: (id: string) => void; onNewChat?: () => void; onOpenSettings?: () => void; onCloseMobile?: () => void; user?: SidebarUser | null; onOpenProfile?: () => void }) {
  if (!open) return null
  return (<Sidebar sessions={sessions} activeId={activeId} onSelect={onSelect} onNewChat={onNewChat} onOpenSettings={onOpenSettings} onCloseMobile={onCloseMobile} user={user} onOpenProfile={onOpenProfile} />)
}
