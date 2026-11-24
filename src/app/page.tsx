// src/app/page.tsx
// Skeleton only - Chat AI frame v5.
// Matches anna-laura-demo 2x2 matrix:
//   Sider: open vs collapsed (pill)  x  Content: Welcome vs Chat
// - No MobileSider drawer: sider is always docked left, even on phone.
//   Collapsed = pill [PanelLeft + Plus] top-left in main.
// - Welcome: "How can I help you?" + composer = ONE centered block.
//   No footer in Welcome.
// - Chat: header "New chat" at top of main, content scrolls,
//   composer fixed at bottom, footer "AI-generated, for reference only".
// - First AI reply in demo = error state: red insufficient-balance,
//   with Copy + Retry icons, avatar "A".
// - Phosphor everywhere, no emoji.
// No engine: no fetch, no SSE network, no API key, no store, no persistence.
'use client'

import { useEffect, useState } from 'react'
import {
  ArrowCounterClockwise,
  ArrowUp,
  Atom,
  Copy,
  Globe,
  Microphone,
  PanelLeft,
  Paperclip,
  PencilSimple,
  Plus,
  Warning,
} from '@phosphor-icons/react'
import { Sider } from '../components/sider/Sider'

export default function Home() {
  const [siderCollapsed, setSiderCollapsed] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [toast, setToast] = useState('')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [deepThink, setDeepThink] = useState(false)
  const [searchEnabled, setSearchEnabled] = useState(false)
  const [inputValue, setInputValue] = useState('')

  // Sider state and content state are INDEPENDENT - the 2x2 matrix.
  const [sessions, setSessions] = useState<{ id: string; title: string }[]>([
    { id: '1', title: 'New chat' },
  ])
  const [activeId, setActiveId] = useState('1')
  const [hasMessages, setHasMessages] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark')
    if (theme === 'dark') document.body.setAttribute('data-ds-dark-theme', 'dark')
    else document.body.removeAttribute('data-ds-dark-theme')
  }, [theme])

  const showToastMessage = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }

  const handleNewChat = () => {
    setSessions((prev) => [{ id: String(Date.now()), title: 'New chat' }, ...prev])
    setHasMessages(false)
    setInputValue('')
  }

  const handleSend = () => {
    if (!inputValue.trim()) return
    if (!hasMessages) setHasMessages(true)
    else showToastMessage('Kerangka saja - pesan tidak dikirim ke API')
    setInputValue('')
  }

  const composer = (
    <div className="sk-input-box">
      <textarea
        className="sk-input"
        rows={2}
        placeholder="Enter a message"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
      />
      <div className="sk-composer-row">
        <button className={deepThink ? 'sk-pill sk-pill-active' : 'sk-pill'} onClick={() => setDeepThink(!deepThink)}>
          <Atom size={16} /> DeepThink
        </button>
        <button className={searchEnabled ? 'sk-pill sk-pill-active' : 'sk-pill'} onClick={() => setSearchEnabled(!searchEnabled)}>
          <Globe size={16} /> Search
        </button>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4, alignItems: 'center' }}>
          <button className="sk-round" title="Voice" onClick={() => showToastMessage('Kerangka saja - voice belum nyambung')}><Microphone size={20} /></button>
          <button className="sk-round" title="Attach" onClick={() => showToastMessage('Kerangka saja - attach belum nyambung')}><Paperclip size={20} /></button>
          <button className="sk-send" disabled={!inputValue.trim()} onClick={handleSend}><ArrowUp size={20} weight="bold" /></button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        .sk-frame { display: flex; width: 100%; height: 100dvh; overflow: hidden; background: #fff; color: #171717; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .sk-frame.sk-dark { background: #151517; color: #f9fafb; }
        .sk-main { position: relative; display: flex; flex-direction: column; flex: 1; min-width: 0; height: 100%; }
        .sk-header { display: flex; align-items: center; gap: 10px; padding: 12px 16px; flex-shrink: 0; }
        .sk-pill-btn { display: inline-flex; align-items: center; gap: 6px; border: 1px solid rgba(0,0,0,0.08); background: #fff; color: inherit; border-radius: 999px; padding: 6px 8px; cursor: pointer; }
        .sk-dark .sk-pill-btn { background: #2a2a2e; border-color: rgba(255,255,255,0.1); }
        .sk-header-title { font-size: 14px; }
        .sk-content { position: relative; flex: 1; min-height: 0; overflow-y: auto; }
        .sk-column { width: 100%; max-width: 840px; margin: 0 auto; padding-left: 44px; padding-right: 44px; }
        /* Welcome: title + composer = ONE centered block */
        .sk-welcome { min-height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 18px; padding: 24px 0; }
        .sk-welcome h1 { font-size: 26px; margin: 0; font-weight: 600; }
        .sk-welcome .sk-input-box { width: 100%; }
        .sk-chat { padding-top: 8px; padding-bottom: 24px; }
        .sk-ai-row { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; }
        .sk-avatar { width: 36px; height: 36px; border-radius: 50%; background: #eef2ff; color: #3964fe; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; }
        .sk-ai-actions { display: flex; gap: 6px; color: #9ca3af; }
        .sk-icon-btn { width: 30px; height: 30px; border-radius: 999px; border: none; background: transparent; color: inherit; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }
        .sk-error { display: flex; gap: 8px; align-items: flex-start; color: #dc2626; font-size: 14px; line-height: 22px; width: 100%; }
        .sk-error a { color: #3964fe; text-decoration: none; }
        .sk-bubble-user { margin-left: auto; width: fit-content; max-width: 78%; background: #eff3fe; padding: 12px 16px; border-radius: 18px 18px 4px 18px; font-size: 15px; line-height: 1.6; }
        .sk-dark .sk-bubble-user { background: #2a2a2e; }
        /* Chat: composer fixed at bottom */
        .sk-composer { flex-shrink: 0; padding: 8px 0 10px; }
        .sk-input-box { border: 1px solid rgba(0,0,0,0.1); border-radius: 22px; padding: 12px 14px; background: #fff; box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
        .sk-dark .sk-input-box { background: #222224; border-color: rgba(255,255,255,0.1); }
        .sk-input { width: 100%; border: 0; outline: 0; background: transparent; color: inherit; font-size: 16px; resize: none; font-family: inherit; }
        .sk-input::placeholder { color: #9ca3af; }
        .sk-composer-row { display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap; align-items: center; }
        .sk-pill { display: inline-flex; align-items: center; gap: 6px; border: 1px solid rgba(0,0,0,0.1); background: #fff; color: inherit; border-radius: 999px; padding: 7px 12px; font-size: 14px; cursor: pointer; }
        .sk-dark .sk-pill { background: #2a2a2e; border-color: rgba(255,255,255,0.12); }
        .sk-pill-active { background: #e4edfd !important; border-color: #b7c8fe !important; color: #3964fe !important; }
        .sk-round { width: 36px; height: 36px; border-radius: 50%; border: none; background: transparent; color: inherit; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }
        .sk-send { width: 40px; height: 40px; border-radius: 50%; border: none; background: #a9c1ff; color: #fff; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }
        .sk-send:disabled { opacity: 0.6; cursor: default; }
        .sk-btn { border: 1px solid rgba(0,0,0,0.1); background: #fff; color: inherit; border-radius: 999px; padding: 7px 12px; font-size: 13px; cursor: pointer; }
        .sk-dark .sk-btn { background: #2a2a2e; border-color: rgba(255,255,255,0.12); }
        .sk-panel { position: fixed; inset: 0; background: rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .sk-dialog { background: #fff; color: #171717; width: min(420px, 90vw); border-radius: 16px; padding: 18px; }
        .sk-dark .sk-dialog { background: #222224; color: #f9fafb; }
        .sk-toast { position: fixed; left: 50%; bottom: 92px; transform: translateX(-50%); background: #353538; color: #fff; padding: 9px 14px; border-radius: 999px; font-size: 13px; z-index: 1100; }
        @media (max-width: 768px) { .sk-column { padding-left: 16px; padding-right: 16px; } .sk-frame { position: fixed; top: 0; } }
      `}</style>

      <div className={theme === 'dark' ? 'sk-frame sk-dark' : 'sk-frame'}>
        {!siderCollapsed && (
          <Sider
            sessions={sessions}
            activeId={activeId}
            onSelect={setActiveId}
            onCollapse={() => setSiderCollapsed(true)}
            onNewChat={handleNewChat}
            onOpenSettings={() => setShowSettings(true)}
          />
        )}

        <main className="sk-main">
          <div className="sk-header">
            {siderCollapsed && (
              <span className="sk-pill-btn">
                <button className="sk-icon-btn" aria-label="Open sidebar" onClick={() => setSiderCollapsed(false)}><PanelLeft size={20} /></button>
                <button className="sk-icon-btn" aria-label="New chat" onClick={handleNewChat}><Plus size={20} /></button>
              </span>
            )}
            {hasMessages && <span className="sk-header-title">New chat</span>}
          </div>

          <div className="sk-content">
            {!hasMessages ? (
              <div className="sk-column sk-welcome">
                <h1>How can I help you?</h1>
                {composer}
              </div>
            ) : (
              <div className="sk-column sk-chat">
                <div className="sk-bubble-user">Halo, test pesan pertama</div>
                <div style={{ height: 16 }} />
                <div className="sk-ai-row">
                  <div className="sk-avatar">A</div>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button className="sk-icon-btn" onClick={() => showToastMessage('Kerangka saja - copy belum nyambung')}><Copy size={16} /></button>
                    <button className="sk-icon-btn" onClick={() => showToastMessage('Kerangka saja - edit belum nyambung')}><PencilSimple size={16} /></button>
                  </div>
                  <div className="sk-error">
                    <Warning size={18} weight="fill" />
                    <span>
                      Insufficient account balance. Please top up and try again.{' '}
                      <a href="#" onClick={(e) => { e.preventDefault(); showToastMessage('Kerangka saja - top up belum nyambung') }}>Top up</a>
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 4, alignSelf: 'flex-start' }}>
                    <button className="sk-icon-btn" onClick={() => showToastMessage('Kerangka saja - copy belum nyambung')}><Copy size={16} /></button>
                    <button className="sk-icon-btn" onClick={() => showToastMessage('Kerangka saja - retry belum nyambung')}><ArrowCounterClockwise size={16} /></button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {hasMessages && (
            <div className="sk-column sk-composer">
              {composer}
              <p style={{ fontSize: 12, color: '#6b7280', textAlign: 'center', margin: '8px 0 0' }}>
                AI-generated, for reference only
              </p>
            </div>
          )}
        </main>
      </div>

      {showSettings && (
        <div className="sk-panel" onClick={() => setShowSettings(false)}>
          <div className="sk-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 8px' }}>Settings</h3>
            <p style={{ fontSize: 14, color: '#6b7280' }}>Kerangka settings. Tidak menyimpan API key.</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="sk-btn" onClick={() => setTheme('light')}>Light</button>
              <button className="sk-btn" onClick={() => setTheme('dark')}>Dark</button>
              <button className="sk-btn" onClick={() => setShowSettings(false)}>Tutup</button>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="sk-toast">{toast}</div>}
    </>
  )
}
