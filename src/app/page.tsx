// src/app/page.tsx
// Skeleton only - Chat AI frame v4.2.
// Based on v4 (same file, same Sider imports) + 3 patches:
// 1. Matrix header: mobile welcome = List only, mobile chat = List + "New chat" + PlusCircle,
//    desktop chat = "New chat" title. No rewrite, no removed Sider imports.
// 2. Code render: tiny highlighter (no new dep), pre = overflow-x auto like original,
//    code head = ts + Copy + Download.
// 3. AI ornaments: avatar "A" + action bar Copy / Retry / Like / Dislike / Speaker / Share on done.
// No engine: no fetch, no SSE network, no API key, no store, no persistence.
'use client'

import { useEffect, useRef, useState } from 'react'
import {
  ArrowCounterClockwise,
  ArrowUp,
  Atom,
  Copy,
  GearSix,
  Globe,
  List,
  MagnifyingGlass,
  Microphone,
  Paperclip,
  PlusCircle,
  ShareNetwork,
  SpeakerHigh,
  ThumbsDown,
  ThumbsUp,
} from '@phosphor-icons/react'
import { CollapsedSider, MobileSider, Sider } from '@components/sider/Sider'
import { DUMMY_AI_CODE, DUMMY_AI_INTRO, DUMMY_AI_OUTRO, DUMMY_USER_MESSAGE, type Phase } from '@components/chat-types'
import { highlightCode } from '@components/CodeHighlight'
import './page.css'

export default function Home() {
  const [isMobile, setIsMobile] = useState(false)
  const [siderCollapsed, setSiderCollapsed] = useState(false)
  const [mobileSiderOpen, setMobileSiderOpen] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [toast, setToast] = useState('')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [deepThink, setDeepThink] = useState(false)
  const [searchEnabled, setSearchEnabled] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const [sessions, setSessions] = useState<{ id: string; title: string }[]>([])
  const [activeId, setActiveId] = useState('')
  const [hasMessages, setHasMessages] = useState(false)
  const [phase, setPhase] = useState<Phase>('thinking')
  const [streamedIntro, setStreamedIntro] = useState('')
  const [streamedCode, setStreamedCode] = useState('')
  const [streamedOutro, setStreamedOutro] = useState('')
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<number | null>(null)

  const fullAiText = `${DUMMY_AI_INTRO}\n\n${DUMMY_AI_CODE}\n\n${DUMMY_AI_OUTRO}`

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark')
    if (theme === 'dark') document.body.setAttribute('data-ds-dark-theme', 'dark')
    else document.body.removeAttribute('data-ds-dark-theme')
  }, [theme])

  // Fake SSE - only runs after first message exists.
  useEffect(() => {
    if (!hasMessages) return
    setPhase('thinking')
    setStreamedIntro('')
    setStreamedCode('')
    setStreamedOutro('')
    let index = 0
    const t = window.setTimeout(() => {
      setPhase('streaming')
      timerRef.current = window.setInterval(() => {
        index += 3
        const sliced = fullAiText.slice(0, index)
        const introEnd = DUMMY_AI_INTRO.length
        const codeEnd = introEnd + 2 + DUMMY_AI_CODE.length
        setStreamedIntro(sliced.slice(0, Math.min(introEnd, sliced.length)))
        setStreamedCode(sliced.length > introEnd + 2 ? sliced.slice(introEnd + 2, Math.min(codeEnd, sliced.length)) : '')
        setStreamedOutro(sliced.length > codeEnd + 2 ? sliced.slice(codeEnd + 2) : '')
        if (index >= fullAiText.length) {
          if (timerRef.current) window.clearInterval(timerRef.current)
          setPhase('done')
        }
      }, 18)
    }, 900)
    return () => {
      window.clearTimeout(t)
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMessages])

  const showToastMessage = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }

  const handleNewChat = () => {
    setSessions([{ id: '1', title: 'New chat' }])
    setActiveId('1')
    setHasMessages(false)
    setMobileSiderOpen(false)
  }

  const handleSend = () => {
    if (!inputValue.trim()) return
    if (!hasMessages) {
      if (sessions.length === 0) {
        setSessions([{ id: '1', title: inputValue.trim().slice(0, 30) }])
        setActiveId('1')
      }
      setHasMessages(true)
    } else {
      showToastMessage('Kerangka saja - pesan tidak dikirim ke API')
    }
    setInputValue('')
  }

  const handleCopyCode = async () => {
    try { await navigator.clipboard.writeText(DUMMY_AI_CODE) } catch {}
    setCopied(true)
    showToastMessage('Code disalin')
    window.setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadCode = () => {
    const blob = new Blob([DUMMY_AI_CODE], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'PrimaryButton.tsx'
    a.click()
    URL.revokeObjectURL(url)
    showToastMessage('Code diunduh')
  }

  const phaseLabel = phase === 'thinking' ? 'Thinking...' : phase === 'streaming' ? 'Menulis...' : 'Selesai'
  const canSend = inputValue.trim().length > 0

  return (
    <>
      <div className={theme === 'dark' ? 'sk-frame sk-dark' : 'sk-frame'}>
        {!isMobile && !siderCollapsed && (
          <Sider sessions={sessions} activeId={activeId} onSelect={setActiveId} onCollapse={() => setSiderCollapsed(true)} onNewChat={handleNewChat} onOpenSettings={() => setShowSettings(true)} />
        )}

        <main className="sk-main">
          <div className="sk-topbar">
            <button className="sk-icon-btn" aria-label="Toggle sidebar" onClick={() => (isMobile ? setMobileSiderOpen(true) : setSiderCollapsed(!siderCollapsed))}>
              <List size={22} />
            </button>
            {isMobile && !hasMessages && <strong>API usage demo</strong>}
            {isMobile && hasMessages && <strong>New chat</strong>}
            {!isMobile && hasMessages && <strong style={{ fontSize: 15, fontWeight: 500 }}>New chat</strong>}
            {isMobile && !hasMessages && (
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
                <button className="sk-icon-btn" aria-label="Search" onClick={() => setShowSearch(true)}><MagnifyingGlass size={20} /></button>
                <button className="sk-icon-btn" aria-label="Settings" onClick={() => setShowSettings(true)}><GearSix size={20} /></button>
              </div>
            )}
            {isMobile && hasMessages && (
              <div style={{ marginLeft: 'auto' }}>
                <button className="sk-icon-btn" aria-label="New chat" onClick={handleNewChat}><PlusCircle size={26} /></button>
              </div>
            )}
          </div>

          <div className="sk-content">
            {siderCollapsed && !isMobile && (
              <CollapsedSider onExpand={() => setSiderCollapsed(false)} onNewChat={handleNewChat} />
            )}
            {!hasMessages ? (
              <div className="sk-column sk-wrap">
                <div className="sk-welcome">
                  <h1 style={{ fontSize: 28, margin: 0, fontWeight: 600 }}>How can I help you?</h1>
                </div>
              </div>
            ) : (
              <div className="sk-column sk-wrap">
                <div className="sk-bubble-user">{DUMMY_USER_MESSAGE}</div>
                <div className="sk-ai">
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div className="sk-avatar">A</div>
                  </div>
                  <div className="sk-status">
                    {phase !== 'done' && <span className="sk-dot" />}
                    <span>{phaseLabel}</span>
                    {deepThink && <span>• DeepThink on</span>}
                    {searchEnabled && <span>• Search on</span>}
                  </div>
                  {streamedIntro && <p style={{ margin: '0 0 8px' }}>{streamedIntro}</p>}
                  {streamedCode && (
                    <div className="sk-code">
                      <div className="sk-code-head">
                        <span>tsx</span>
                        <span style={{ display: 'flex', gap: 8 }}>
                          <button className="sk-btn" onClick={handleCopyCode}>{copied ? 'Copied' : 'Copy'}</button>
                          <button className="sk-btn" onClick={handleDownloadCode}>Download</button>
                        </span>
                      </div>
                      <pre>{highlightCode(streamedCode)}</pre>
                    </div>
                  )}
                  {streamedOutro && <p style={{ margin: '8px 0 0' }}>{streamedOutro}</p>}
                  {phase === 'streaming' && <span className="sk-cursor" />}
                  {phase === 'done' && (
                    <div style={{ display: 'flex', gap: 4, marginTop: 12, color: '#9ca3af' }}>
                      <button className="sk-icon-btn" title="Copy" onClick={handleCopyCode}><Copy size={16} /></button>
                      <button className="sk-icon-btn" title="Retry" onClick={() => showToastMessage('Kerangka saja - retry belum nyambung')}><ArrowCounterClockwise size={16} /></button>
                      <button className="sk-icon-btn" title="Like" onClick={() => showToastMessage('Kerangka saja - like belum nyambung')}><ThumbsUp size={16} /></button>
                      <button className="sk-icon-btn" title="Dislike" onClick={() => showToastMessage('Kerangka saja - dislike belum nyambung')}><ThumbsDown size={16} /></button>
                      <button className="sk-icon-btn" title="Speaker" onClick={() => showToastMessage('Kerangka saja - speaker belum nyambung')}><SpeakerHigh size={16} /></button>
                      <button className="sk-icon-btn" title="Share" onClick={() => showToastMessage('Kerangka saja - share belum nyambung')}><ShareNetwork size={16} /></button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="sk-column sk-composer">
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
                  <button className="sk-send" disabled={!canSend} onClick={handleSend}><ArrowUp size={20} weight="bold" /></button>
                </div>
              </div>
            </div>
            <p style={{ fontSize: 12, color: '#6b7280', textAlign: 'center', margin: '8px 0 0' }}>
              AI-generated, for reference only
            </p>
          </div>
        </main>

        <MobileSider open={isMobile && mobileSiderOpen} sessions={sessions} activeId={activeId} onSelect={(id) => { setActiveId(id); setMobileSiderOpen(false) }} onNewChat={handleNewChat} onOpenSettings={() => setShowSettings(true)} onCloseMobile={() => setMobileSiderOpen(false)} />
      </div>

      {showSearch && (
        <div className="sk-panel" onClick={() => setShowSearch(false)}>
          <div className="sk-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 8px' }}>Search</h3>
            <p style={{ fontSize: 14, color: '#6b7280' }}>Kerangka panel pencarian. Belum nyambung mesin.</p>
            <button className="sk-btn" onClick={() => setShowSearch(false)}>Tutup</button>
          </div>
        </div>
      )}

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
