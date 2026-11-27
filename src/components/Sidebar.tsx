'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  ChatCircle,
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

type AuthTestUser = {
  id: string
  username?: string
  yourname?: string
  avatar?: string | null
}

type AuthTestState = {
  loading: boolean
  loggedIn: boolean
  hasSession: boolean
  code: string | null
  user: AuthTestUser | null
  lastChecked: string
}

const TOKEN_KEY = 'sidebar_token'
const TOKEN_KEY_2 = 'token'
const COOKIE_KEY = 'readtalk_token'

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  try {
    const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
    return m ? decodeURIComponent(m[1]) : null
  } catch { return null }
}

function setCookie(name: string, value: string) {
  if (typeof document === 'undefined') return
  try {
    // 30 hari, kebawa ke semua path, tahan reload + close PWA
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=2592000; SameSite=Lax`
  } catch {}
}

function deleteCookie(name: string) {
  if (typeof document === 'undefined') return
  try { document.cookie = `${name}=; path=/; max-age=0` } catch {}
}

function readTokenSync(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('token')
    if (fromUrl) return fromUrl
  } catch {}
  // cookie dulu, baru localStorage. kalo localStorage dihapus orang, cookie masih ada.
  const fromCookie = getCookie(COOKIE_KEY) || getCookie(TOKEN_KEY) || getCookie(TOKEN_KEY_2)
  if (fromCookie) return fromCookie
  try { return localStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY_2) || sessionStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY_2) } catch { return null }
}

function saveTokenEverywhere(token: string) {
  try {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(TOKEN_KEY_2, token)
    sessionStorage.setItem(TOKEN_KEY, token)
    sessionStorage.setItem(TOKEN_KEY_2, token)
  } catch {}
  setCookie(COOKIE_KEY, token)
  setCookie(TOKEN_KEY, token)
  setCookie(TOKEN_KEY_2, token)
}

function parseUser(token: string | null): AuthTestUser | null {
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const id = payload.properties?.id || payload.sub || payload.id || ''
    const username = payload.properties?.username || payload.username || ''
    const yourname = payload.properties?.yourname || payload.yourname || username || ''
    if (id || username) return { id: String(id), username, yourname }
  } catch {}
  return null
}

function getInitialAuth(): AuthTestState {
  const token = readTokenSync()
  if (token && typeof window !== 'undefined') {
    try {
      if (new URLSearchParams(window.location.search).get('token')) {
        saveTokenEverywhere(token)
        window.history.replaceState({}, '', window.location.pathname)
      }
    } catch {}
  }
  const loggedIn = Boolean(token)
  return { loading: false, loggedIn, hasSession: loggedIn, code: token, user: parseUser(token), lastChecked: new Date().toLocaleTimeString() }
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
      .sk-panel { width: 260px; height: 100%; background: #000; border-right: 1px solid rgba(255,255,255,0.1); padding: 16px 12px; box-sizing: border-box; overflow-y: auto; }
      .sk-section-header { padding: 2px 10px 8px; font-size: 12px; line-height: 18px; font-weight: 500; color: #888; }
      .sk-item { position: relative; display: flex; align-items: center; box-sizing: border-box; height: 40px; padding: 6px 6px 6px 10px; border-radius: 12px; font-size: 14px; line-height: 22px; color: #fff; cursor: pointer; }
      .sk-item-active { background-color: #1a1a1a; }
      .sk-item:hover { background-color: #1a1a1a; }
      .sk-item-title { flex: 1; min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; line-height: 18px; }
      .sk-item-action { display: none; flex-shrink: 0; margin-left: 4px; }
      .sk-item:hover .sk-item-action, .sk-item-active .sk-item-action { display: flex; }
      .sk-small-btn { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border: none; border-radius: 8px; background: transparent; color: #fff; cursor: pointer; }
      .sk-small-btn:hover { background: #262626; }
      .sk-rename-input { box-sizing: border-box; width: 100%; height: 40px; padding: 0 10px; border-radius: 12px; border: 1px solid #fff; background: #1a1a1a; color: #fff; font: inherit; font-size: 14px; outline: none; }
      .sk-modal-mask { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 900; }
      .sk-modal { background: #111; color: #fff; width: min(420px, 90vw); border-radius: 16px; padding: 18px; }
      .sk-btn { border: 1px solid rgba(255,255,255,0.2); background: #1a1a1a; color: #fff; border-radius: 999px; padding: 7px 12px; font-size: 13px; cursor: pointer; }
      .sk-btn-danger { background: #ec1313; color: #fff; border-color: #ec1313; }
      .sk-menu { position: relative; }
      .sk-menu-pop { position: absolute; right: 0; top: 32px; z-index: 50; min-width: 140px; background: #111; color: #fff; border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.5); padding: 6px; display: flex; flex-direction: column; }
      .sk-menu-item { display: flex; align-items: center; gap: 8px; border: none; background: transparent; text-align: left; padding: 8px 10px; border-radius: 8px; cursor: pointer; font-size: 13px; color: #fff; }
      .sk-menu-item:hover { background: #1a1a1a; }
      .sk-menu-item-danger { color: #ff5555; }
      .sk-bottom { display: none; }
      .sk-sheet-mask { display: none; }
      .sk-sheet { display: none; }
      .sk-auth-test { border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; padding: 12px; margin: 0 0 12px; background: #111; }
      .sk-auth-test-title { font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #888; margin-bottom: 10px; }
      .sk-auth-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
      .sk-auth-avatar { width: 36px; height: 36px; border-radius: 999px; background: #262626; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; overflow: hidden; flex-shrink: 0; }
      .sk-auth-avatar img { width: 100%; height: 100%; object-fit: cover; }
      .sk-auth-name { font-size: 14px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .sk-auth-username { font-size: 12px; color: #888; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .sk-auth-kv { display: flex; justify-content: space-between; gap: 8px; font-size: 12px; padding: 6px 0; border-top: 1px solid rgba(255,255,255,0.08); }
      .sk-auth-kv span:first-child { color: #888; }
      .sk-auth-kv span:last-child { text-align: right; word-break: break-all; }
      .sk-auth-ok { color: #4ade80; font-weight: 700; }
      .sk-auth-fail { color: #ff5555; font-weight: 700; }
      @media (max-width: 768px) {
        .sk-shell { display: block; height: auto; }
        .sk-rail { display: none; }
        .sk-panel { display: none; }
        .sk-item { height: 44px; padding: 11px 6px 11px 12px; border-radius: 16px; font-size: 16px; }
        .sk-rename-input { height: 44px; padding: 0 12px; font-size: 16px; }
        .sk-bottom { position: fixed; left: 0; right: 0; bottom: 0; z-index: 50; display: flex; align-items: center; justify-content: space-around; height: 64px; padding-bottom: env(safe-area-inset-bottom); background: #000; border-top: 1px solid rgba(255,255,255,0.12); }
        .sk-bottom-btn { border: none; background: transparent; color: #888; display: flex; align-items: center; justify-content: center; width: 56px; height: 56px; border-radius: 14px; cursor: pointer; }
        .sk-bottom-btn-active { color: #fff; background: #1a1a1a; }
        .sk-bottom-plus { width: 52px; height: 52px; border-radius: 999px; background: #fff; color: #000; display: flex; align-items: center; justify-content: center; border: none; margin-top: -28px; box-shadow: 0 4px 16px rgba(0,0,0,0.5); cursor: pointer; }
        .sk-sheet-mask { display: block; position: fixed; inset: 0; z-index: 60; background: rgba(0,0,0,0.6); }
        .sk-sheet { display: block; position: fixed; left: 0; right: 0; bottom: 64px; z-index: 61; max-height: 60dvh; overflow-y: auto; background: #111; color: #fff; border-radius: 20px 20px 0 0; padding: 16px 12px calc(16px + env(safe-area-inset-bottom)); }
      }
      @media (hover: none) { .sk-item-action { display: flex; } }
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
          <button className="sk-small-btn" aria-label="More" onClick={() => setMenuOpen(!menuOpen)}>
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
      <div style={{ display: 'flex', gap: 8, padding: 12 }}>
        <button className="sk-icon-btn" title="Expand" onClick={onExpand}>
          <List size={22} />
        </button>
        <button className="sk-icon-btn" title="New chat" onClick={onNewChat}>
          <Plus size={22} />
        </button>
      </div>
    </>
  )
}

export function Sidebar({
  sessions,
  activeId,
  onSelect,
  onNewChat,
  onOpenSettings,
  onCloseMobile,
}: SidebarProps) {
  const [deleting, setDeleting] = useState<Session | null>(null)
  const [deletePending, setDeletePending] = useState(false)
  const [showList, setShowList] = useState(false)
  const [mobileTab, setMobileTab] = useState('chats')
  const [showAuthTest, setShowAuthTest] = useState(false)
  const [auth, setAuth] = useState<AuthTestState>(() => getInitialAuth())

  const refreshAuth = useCallback(() => {
    const token = readTokenSync()
    if (token && typeof window !== 'undefined') {
      try {
        if (new URLSearchParams(window.location.search).get('token')) {
          saveTokenEverywhere(token)
          window.history.replaceState({}, '', window.location.pathname)
        }
      } catch {}
    }
    const loggedIn = Boolean(token)
    setAuth({ loading: false, loggedIn, hasSession: loggedIn, code: token, user: parseUser(token), lastChecked: new Date().toLocaleTimeString() })
  }, [])

  useEffect(() => {
    refreshAuth()
    const onChanged = () => refreshAuth()
    const onStorage = () => refreshAuth()
    window.addEventListener('session-changed', onChanged)
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener('session-changed', onChanged)
      window.removeEventListener('storage', onStorage)
    }
  }, [refreshAuth])

  const handleLogout = () => {
    try {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(TOKEN_KEY_2)
      sessionStorage.removeItem(TOKEN_KEY)
      sessionStorage.removeItem(TOKEN_KEY_2)
    } catch {}
    deleteCookie(COOKIE_KEY)
    deleteCookie(TOKEN_KEY)
    deleteCookie(TOKEN_KEY_2)
    refreshAuth()
  }

  const handleOpenSettings = () => {
    setShowAuthTest((v) => !v)
    setShowList(true)
    onOpenSettings?.()
  }

  const authTestContent = (
    <div className="sk-auth-test">
      <div className="sk-auth-test-title">Auth Test — Sidebar</div>
      {auth.loading ? (
        <div style={{ fontSize: 13, color: '#888' }}>Checking session...</div>
      ) : (
        <>
          <div className="sk-auth-row">
            <div className="sk-auth-avatar">
              {auth.user?.avatar ? <img src={auth.user.avatar} alt="" /> : (auth.user?.yourname?.[0]?.toUpperCase() || auth.user?.username?.[0]?.toUpperCase() || '?')}
            </div>
            <div style={{ minWidth: 0 }}>
              <div className="sk-auth-name">{auth.user?.yourname || auth.user?.username || (auth.loggedIn ? 'Login (token ke-tangkep)' : 'Belum login')}</div>
              <div className="sk-auth-username">{auth.user ? `@${auth.user.username || '-'}` : '—'}</div>
            </div>
          </div>
          <div className="sk-auth-kv"><span>Status</span><span className={auth.loggedIn ? 'sk-auth-ok' : 'sk-auth-fail'}>{auth.loggedIn ? 'LOGIN' : 'BELUM LOGIN'}</span></div>
          <div className="sk-auth-kv"><span>Session</span><span className={auth.hasSession ? 'sk-auth-ok' : 'sk-auth-fail'}>{auth.hasSession ? 'ADA' : 'KOSONG'}</span></div>
          <div className="sk-auth-kv"><span>Token</span><span>{auth.code ? `${auth.code.slice(0, 8)}...${auth.code.slice(-4)}` : '-'}</span></div>
          <div className="sk-auth-kv"><span>Full Token</span><span style={{ fontSize: 10 }}>{auth.code || '-'}</span></div>
          <div className="sk-auth-kv"><span>ID</span><span>{auth.user?.id || '-'}</span></div>
          <div className="sk-auth-kv"><span>Last check</span><span>{auth.lastChecked}</span></div>
          <button className="sk-btn" style={{ width: '100%', marginTop: 8 }} onClick={refreshAuth}>Cek ulang</button>
          {auth.loggedIn && (
            <button className="sk-btn sk-btn-danger" style={{ width: '100%', marginTop: 8 }} onClick={handleLogout}>Logout / Hapus Token</button>
          )}
        </>
      )}
    </div>
  )

  const listContent = (
    <>
      {showAuthTest && authTestContent}
      <div className="sk-section-header">Today</div>
      {sessions.map((session) => (
        <SessionItem
          key={session.id}
          session={session}
          active={session.id === activeId}
          onSelect={() => { onSelect?.(session.id); setShowList(false); onCloseMobile?.() }}
          onDelete={() => setDeleting(session)}
        />
      ))}
    </>
  )

  return (
    <>
      <SidebarStyles />
      <div className="sk-shell">
        <div className="sk-rail">
          <div className="sk-rail-logo">R</div>
          <button className="sk-icon-btn" title="New chat" aria-label="New chat" onClick={onNewChat}>
            <Plus size={24} />
          </button>
          <button className={showList ? 'sk-icon-btn sk-icon-btn-active' : 'sk-icon-btn'} title="Chats" aria-label="Chats" onClick={() => setShowList(!showList)}>
            <ChatCircle size={24} />
          </button>
          <div className="sk-rail-spacer" />
          <button className={showAuthTest ? 'sk-icon-btn sk-icon-btn-active' : 'sk-icon-btn'} title="Settings" aria-label="Settings" onClick={handleOpenSettings}>
            <GearSix size={24} />
          </button>
        </div>

        {showList && <div className="sk-panel">{listContent}</div>}

        <div className="sk-bottom">
          <button className={mobileTab === 'chats' ? 'sk-bottom-btn sk-bottom-btn-active' : 'sk-bottom-btn'} aria-label="Chats" onClick={() => { setMobileTab('chats'); setShowList(true) }}>
            <ChatCircle size={26} />
          </button>
          <button className="sk-bottom-plus" aria-label="New chat" onClick={() => { onNewChat?.(); setShowList(false) }}>
            <Plus size={28} weight="bold" />
          </button>
          <button className={mobileTab === 'settings' ? 'sk-bottom-btn sk-bottom-btn-active' : 'sk-bottom-btn'} aria-label="Settings" onClick={() => { setMobileTab('settings'); setShowList(false); handleOpenSettings() }}>
            <GearSix size={26} />
          </button>
        </div>

        {showList && (
          <>
            <div className="sk-sheet-mask" onClick={() => setShowList(false)} />
            <div className="sk-sheet">{listContent}</div>
          </>
        )}
      </div>

      {deleting ? (
        <div className="sk-modal-mask" onClick={() => { if (!deletePending) setDeleting(null) }}>
          <div className="sk-modal" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 8px' }}>Delete session?</h3>
            <p style={{ fontSize: 14, color: '#888', margin: '0 0 16px' }}>
              This will delete “{deleting.title}” and its files. Skeleton only — nothing is really deleted.
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button className="sk-btn" disabled={deletePending} onClick={() => setDeleting(null)}>Cancel</button>
              <button className="sk-btn sk-btn-danger" disabled={deletePending} onClick={() => { setDeletePending(true); window.setTimeout(() => { setDeletePending(false); setDeleting(null) }, 400) }}>Delete</button>
            </div>
          </div>
        </div>
      ) : null}
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
    <Sidebar
      sessions={sessions}
      activeId={activeId}
      onSelect={onSelect}
      onNewChat={onNewChat}
      onOpenSettings={onOpenSettings}
      onCloseMobile={onCloseMobile}
    />
  )
}
