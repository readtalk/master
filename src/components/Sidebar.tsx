'use client'

import { useState } from 'react'
import {
  DotsThree,
  GearSix,
  List,
  PencilSimple,
  Plus,
  Trash,
} from '@phosphor-icons/react'

export type Session = {
  id: string
  title: string
}

export type SidebarProps = {
  mobile?: boolean
  sessions: Session[]
  activeId: string
  onSelect?: (id: string) => void
  onNewChat?: () => void
  onCollapse?: () => void
  onExpand?: () => void
  onOpenSettings?: () => void
  onCloseMobile?: () => void
}

function SidebarStyles() {
  return (
    <style>{`
      .sk-sider { display: flex; flex-direction: column; flex-shrink: 0; box-sizing: border-box; width: 261px; height: 100%; padding: 6px 12px 0; border-right: 1px solid var(--dsw-alias-border-l1, rgba(0,0,0,0.04)); background-color: var(--dsw-specific-sidebar-fill, #f9fafb); }
      .sk-sider-mobile { width: 300px; max-width: calc(100vw - 48px); }
      .sk-sider-mobile .sk-list-wrap { margin-top: 16px; }
      .sk-sider-mobile .sk-section-header { padding: 4px 10px 3px; font-size: 14px; line-height: 22px; }
      .sk-sider-mobile .sk-bottom { height: auto; padding: 12px 0; }
      .sk-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; box-sizing: border-box; height: 48px; margin-bottom: 16px; padding: 15px 0 10px 4px; flex-shrink: 0; }
      .sk-app-name { min-width: 0; padding-left: 4px; overflow: hidden; font-size: 20px; line-height: 22px; font-weight: 600; white-space: nowrap; text-overflow: ellipsis; color: var(--dsw-alias-brand-primary, #3964fe); }
      .sk-icon-btn { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border: none; border-radius: 8px; background: transparent; color: inherit; cursor: pointer; font-size: 16px; }
      .sk-icon-btn:hover { background: var(--dsw-specific-sidebar-nav-item-hover, rgba(0,0,0,0.04)); }
      .sk-new-chat { position: relative; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-sizing: border-box; width: 100%; height: 40px; padding: 0 16px; border-radius: 100px; border: 1px solid rgba(103,158,254,0); background: var(--dsw-alias-button-elevated-fill, #fff); color: var(--dsw-alias-label-primary, #111); font: inherit; font-size: 14px; font-weight: 500; cursor: pointer; user-select: none; box-shadow: 0 -2px 2px rgba(72,104,178,0.04), 0 2px 2px rgba(106,111,117,0.09), 0 1px 2px rgba(72,104,178,0.08); transition: box-shadow 0.3s ease; }
      .sk-new-chat:hover { box-shadow: 0 4px 4px 0 rgba(72,104,178,0.04), 0 -3px 4px 0 rgba(72,104,178,0.04), 0 6px 6px 0 rgba(106,111,117,0.1); }
      .sk-new-chat-icon { display: flex; margin-right: 6px; font-size: 18px; }
      .sk-list-wrap { position: relative; flex: 1; min-height: 0; margin-top: 24px; }
      .sk-list { height: 100%; margin: 0 -2px; padding: 0 2px; overflow-y: auto; }
      .sk-section { position: relative; margin-top: 16px; padding-top: 4px; }
      .sk-section:first-child { margin-top: 0; }
      .sk-section-header { position: sticky; top: 0; z-index: 20; padding: 2px 10px; font-size: 12px; line-height: 18px; font-weight: 500; color: var(--dsw-alias-label-tertiary, #6b7280); background-color: var(--dsw-specific-sidebar-fill, #f9fafb); user-select: none; }
      .sk-bottom { display: flex; flex-shrink: 0; height: 64px; }
      .sk-settings { display: flex; align-items: center; box-sizing: border-box; width: 100%; margin-block: auto; padding: 6px 2px 6px 6px; border: none; border-radius: 12px; background: none; font: inherit; text-align: left; cursor: pointer; user-select: none; outline: none; color: inherit; }
      .sk-settings:hover { background-color: var(--dsw-specific-sidebar-nav-item-hover, rgba(0,0,0,0.04)); }
      .sk-settings-icon { display: flex; align-items: center; justify-content: center; flex-shrink: 0; width: 32px; height: 32px; color: var(--dsw-alias-label-primary, #111); font-size: 16px; }
      .sk-settings-label { min-width: 0; margin-left: 4px; overflow: hidden; font-size: 14px; white-space: nowrap; text-overflow: ellipsis; color: var(--dsw-alias-label-primary, #111); }
      .sk-collapsed { position: absolute; top: 0; left: 0; z-index: 20; display: flex; align-items: center; gap: 16px; margin: 12px 0 0 16px; }
      .sk-collapsed-group { display: flex; align-items: center; gap: 2px; height: 40px; padding: 0 2px; box-sizing: border-box; border-radius: 100px; border: 1px solid var(--dsw-alias-border-l2, rgba(0,0,0,0.1)); background: var(--dsw-alias-bg-layer-3, #fff); box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
      .sk-drawer-mask { position: absolute; inset: 0; z-index: 799; background: rgba(0,0,0,0.35); }
      .sk-drawer { position: absolute; top: 0; bottom: 0; left: 0; z-index: 800; }
      .sk-item { position: relative; display: flex; align-items: center; box-sizing: border-box; height: 40px; padding: 6px 6px 6px 10px; border-radius: 12px; font-size: 14px; line-height: 22px; color: var(--dsw-alias-label-primary, #111); cursor: pointer; }
      .sk-item-active { background-color: var(--dsw-specific-sidebar-nav-item-active-accent, #e4edfd); color: var(--dsw-alias-brand-primary-invert, #3964fe); }
      .sk-item:hover { background-color: var(--dsw-specific-sidebar-nav-item-hover, rgba(0,0,0,0.04)); }
      .sk-item-title { flex: 1; min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; line-height: 18px; }
      .sk-item-action { display: none; flex-shrink: 0; margin-left: 4px; }
      .sk-item:hover .sk-item-action, .sk-item-active .sk-item-action { display: flex; }
      .sk-rename-input { box-sizing: border-box; width: 100%; height: 40px; padding: 0 10px; border-radius: 12px; border: 1px solid var(--dsw-alias-brand-primary, #3964fe); background: var(--dsw-specific-input-major, #fff); color: var(--dsw-alias-label-primary, #111); font: inherit; font-size: 14px; outline: none; }
      .sk-modal-mask { position: fixed; inset: 0; background: rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; z-index: 900; }
      .sk-modal { background: #fff; color: #111; width: min(420px, 90vw); border-radius: 16px; padding: 18px; }
      .sk-btn { border: 1px solid rgba(0,0,0,0.1); background: #fff; color: inherit; border-radius: 999px; padding: 7px 12px; font-size: 13px; cursor: pointer; }
      .sk-btn-danger { background: #ec1313; color: #fff; border-color: #ec1313; }
      .sk-menu { position: relative; }
      .sk-menu-pop { position: absolute; right: 0; top: 32px; z-index: 50; min-width: 140px; background: #fff; color: #111; border: 1px solid rgba(0,0,0,0.08); border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.12); padding: 6px; display: flex; flex-direction: column; }
      .sk-menu-item { display: flex; align-items: center; gap: 8px; border: none; background: transparent; text-align: left; padding: 8px 10px; border-radius: 8px; cursor: pointer; font-size: 13px; color: inherit; }
      .sk-menu-item:hover { background: rgba(0,0,0,0.05); }
      .sk-menu-item-danger { color: #ec1313; }
      @media (hover: none) { .sk-item-action { display: flex; } }
      @media (max-width: 768px) { .sk-item { height: 44px; padding: 11px 6px 11px 12px; border-radius: 16px; font-size: 16px; } .sk-rename-input { height: 44px; padding: 0 12px; font-size: 16px; } }
    `}</style>
  )
}

export function SessionItem({
  session,
  active,
  onSelect,
  onDelete,
}: {
  session: Session
  active: boolean
  onSelect?: () => void
  onDelete?: () => void
}) {
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
        onBlur={(e) => {
          if (e.target.value.trim()) setTitle(e.target.value.trim())
          setEditing(false)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            const v = (e.target as HTMLInputElement).value.trim()
            if (v) setTitle(v)
            setEditing(false)
          }
          if (e.key === 'Escape') setEditing(false)
        }}
      />
    )
  }

  return (
    <div className={active ? 'sk-item sk-item-active' : 'sk-item'} onClick={onSelect}>
      <div className="sk-item-title">{displayTitle}</div>
      <div className="sk-item-action" onClick={(e) => e.stopPropagation()}>
        <div className="sk-menu">
          <button className="sk-icon-btn" aria-label="More" onClick={() => setMenuOpen(!menuOpen)}>
            <DotsThree size={20} weight="bold" />
          </button>
          {menuOpen && (
            <div className="sk-menu-pop">
              <button className="sk-menu-item" onClick={() => { setMenuOpen(false); setEditing(true) }}>
                <PencilSimple size={16} /> Rename
              </button>
              <button className="sk-menu-item sk-menu-item-danger" onClick={() => { setMenuOpen(false); onDelete?.() }}>
                <Trash size={16} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function CollapsedSidebar({
  onExpand,
  onNewChat,
}: {
  onExpand?: () => void
  onNewChat?: () => void
}) {
  return (
    <>
      <SidebarStyles />
      <div className="sk-collapsed">
        <div className="sk-collapsed-group">
          <button className="sk-icon-btn" title="Expand sidebar" onClick={onExpand}>
            <List size={20} />
          </button>
          <button className="sk-icon-btn" title="New chat" onClick={onNewChat}>
            <Plus size={20} />
          </button>
        </div>
      </div>
    </>
  )
}

export function Sidebar({
  mobile = false,
  sessions,
  activeId,
  onSelect,
  onNewChat,
  onCollapse,
  onOpenSettings,
  onCloseMobile,
}: SidebarProps) {
  const [deleting, setDeleting] = useState<Session | null>(null)
  const [deletePending, setDeletePending] = useState(false)

  return (
    <>
      <SidebarStyles />
      <div className={mobile ? 'sk-sider sk-sider-mobile' : 'sk-sider'}>
        <div className="sk-top">
          <div className="sk-app-name">ReadTalk</div>
          <button className="sk-icon-btn" title="Collapse sidebar" onClick={() => (mobile ? onCloseMobile?.() : onCollapse?.())}>
            <List size={20} />
          </button>
        </div>

        <button type="button" className="sk-new-chat" onClick={() => { onNewChat?.(); onCloseMobile?.() }}>
          <span className="sk-new-chat-icon"><Plus size={18} /></span> New chat
        </button>

        <div className="sk-list-wrap">
          <div className="sk-list">
            <div className="sk-section">
              <div className="sk-section-header">Today</div>
              {sessions.map((session) => (
                <SessionItem
                  key={session.id}
                  session={session}
                  active={session.id === activeId}
                  onSelect={() => { onSelect?.(session.id); onCloseMobile?.() }}
                  onDelete={() => setDeleting(session)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="sk-bottom">
          <button type="button" className="sk-settings" onClick={onOpenSettings}>
            <span className="sk-settings-icon"><GearSix size={20} /></span>
            <span className="sk-settings-label">Settings</span>
          </button>
        </div>

        {deleting ? (
          <div className="sk-modal-mask" onClick={() => { if (!deletePending) setDeleting(null) }}>
            <div className="sk-modal" onClick={(e) => e.stopPropagation()}>
              <h3 style={{ margin: '0 0 8px' }}>Delete session?</h3>
              <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 16px' }}>
                This will delete “{deleting.title}” and its files. Skeleton only — nothing is really deleted.
              </p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button className="sk-btn" disabled={deletePending} onClick={() => setDeleting(null)}>Cancel</button>
                <button className="sk-btn sk-btn-danger" disabled={deletePending} onClick={() => { setDeletePending(true); window.setTimeout(() => { setDeletePending(false); setDeleting(null) }, 400) }}>Delete</button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  )
}

export function MobileSidebar({
  open,
  sessions,
  activeId,
  onSelect,
  onNewChat,
  onOpenSettings,
  onCloseMobile,
}: {
  open: boolean
  sessions: Session[]
  activeId: string
  onSelect?: (id: string) => void
  onNewChat?: () => void
  onOpenSettings?: () => void
  onCloseMobile?: () => void
}) {
  if (!open) return null
  return (
    <>
      <div className="sk-drawer-mask" onClick={onCloseMobile} />
      <div className="sk-drawer">
        <Sidebar
          mobile
          sessions={sessions}
          activeId={activeId}
          onSelect={onSelect}
          onNewChat={onNewChat}
          onOpenSettings={onOpenSettings}
          onCloseMobile={onCloseMobile}
        />
      </div>
    </>
  )
}
