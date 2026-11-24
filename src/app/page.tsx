// src/app/page.tsx
// Skeleton only - Chat AI presentation frame.
// Follows the portion/structure of App.tsx from anna-laura-demo:
// frame > Sider / MobileSider + main + content + CollapsedSider
// + Welcome / SessionView + SearchPanel + SettingsDialog + Toast.
// No engine: no fetch, no SSE network, no API key, no store,
// no persistence, no zustand, no idb. Dummy data only.
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

// ---------------------------------------------------------------------------
// Dummy data - 1 user message + 1 AI response to test the UI presentation.
// ---------------------------------------------------------------------------

const DUMMY_USER_MESSAGE = 'Buatin tombol yang rapi buat Next.js'

const DUMMY_AI_INTRO =
  'Siap, ini tombol yang konsisten dan gampang dipakai. Copy aja lalu tempel di project kamu.'

const DUMMY_AI_CODE = `export default function PrimaryButton() {
  return (
    <button className="primary-button">
      Simpan
    </button>
  )
}`

const DUMMY_AI_OUTRO =
  'Tombol ini pakai satu gaya yang sama di semua halaman, jadi tampilan coding kamu tetap konsisten.'

const DUMMY_SESSION_TITLE = 'Tombol Next.js'

// SSE-like presentation phases for lay users: Thinking -> Streaming -> Done.
// This is a local timer simulation, NOT a real EventSource / fetch stream.
type SsePhase = 'thinking' | 'streaming' | 'done'

export default function Home() {
  // -------------------------------------------------------------------------
  // Frame state - mirrors App.tsx layout state, local only.
  // -------------------------------------------------------------------------
  const [isMobile, setIsMobile] = useState(false)
  const [siderCollapsed, setSiderCollapsed] = useState(false)
  const [mobileSiderOpen, setMobileSiderOpen] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [toast, setToast] = useState('')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  // -------------------------------------------------------------------------
  // Capability toggles - visual only, same affordance as DeepThink / Search.
  // They do not call any API.
  // -------------------------------------------------------------------------
  const [deepThink, setDeepThink] = useState(true)
  const [searchEnabled, setSearchEnabled] = useState(false)
  const [inputValue, setInputValue] = useState('')

  // -------------------------------------------------------------------------
  // Session state - 1 dummy session, always active to show SessionView.
  // Set hasSession to false to preview the Welcome state.
  // -------------------------------------------------------------------------
  const [hasSession] = useState(true)

  // -------------------------------------------------------------------------
  // Fake SSE presentation state.
  // -------------------------------------------------------------------------
  const [phase, setPhase] = useState<SsePhase>('thinking')
  const [streamedIntro, setStreamedIntro] = useState('')
  const [streamedCode, setStreamedCode] = useState('')
  const [streamedOutro, setStreamedOutro] = useState('')
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<number | null>(null)

  const fullAiText = useMemo(() => {
    return `${DUMMY_AI_INTRO}\n\n${DUMMY_AI_CODE}\n\n${DUMMY_AI_OUTRO}`
  }, [])

  // Detect mobile the same way App.tsx branches MobileSider vs Sider.
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Apply theme the same way theme.ts does: body class + data attribute.
  // Local state only, no settings store.
  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark')
    if (theme === 'dark') {
      document.body.setAttribute('data-ds-dark-theme', 'dark')
    } else {
      document.body.removeAttribute('data-ds-dark-theme')
    }
  }, [theme])

  // Fake SSE: Thinking pause, then reveal text char by char.
  useEffect(() => {
    if (!hasSession) return
    let index = 0
    let thinkingTimer: number | undefined
    thinkingTimer = window.setTimeout(() => {
      setPhase('streaming')
      timerRef.current = window.setInterval(() => {
        index += 3
        const sliced = fullAiText.slice(0, index)
        // Split streamed text back into intro / code / outro for rendering.
        const introEnd = DUMMY_AI_INTRO.length
        const codeEnd = introEnd + 2 + DUMMY_AI_CODE.length
        setStreamedIntro(sliced.slice(0, Math.min(introEnd, sliced.length)))
        setStreamedCode(
          sliced.length > introEnd + 2
            ? sliced.slice(introEnd + 2, Math.min(codeEnd, sliced.length))
            : ''
        )
        setStreamedOutro(
          sliced.length > codeEnd + 2 ? sliced.slice(codeEnd + 2) : ''
        )
        if (index >= fullAiText.length) {
          if (timerRef.current) window.clearInterval(timerRef.current)
          setPhase('done')
        }
      }, 18)
    }, 900)
    return () => {
      if (thinkingTimer) window.clearTimeout(thinkingTimer)
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [hasSession, fullAiText])

  const showToastMessage = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2200)
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(DUMMY_AI_CODE)
    } catch {
      // Clipboard may be unavailable - still show feedback for skeleton.
    }
    setCopied(true)
    showToastMessage('Code disalin')
    window.setTimeout(() => setCopied(false), 2000)
  }

  const handleSend = () => {
    // Skeleton only: do not send to any API. Just show feedback.
    if (!inputValue.trim()) return
    showToastMessage('Kerangka saja - pesan tidak dikirim ke API')
    setInputValue('')
  }

  const phaseLabel =
    phase === 'thinking'
      ? 'Thinking...'
      : phase === 'streaming'
        ? 'Menulis...'
        : 'Selesai'

  return (
    <>
      {/* Design tokens from theme.css + global.css + App.module.css, scoped to this skeleton file. */}
      <style>{`
        .sk-frame { position: absolute; inset: 0; display: flex; overflow: hidden; background: #fff; color: #171717; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .sk-frame.sk-dark { background: #151517; color: #f9fafb; }
        .sk-sider { width: 260px; flex-shrink: 0; background: #f9fafb; border-right: 1px solid rgba(0,0,0,0.08); display: flex; flex-direction: column; padding: 12px; gap: 12px; }
        .sk-dark .sk-sider { background: #1b1b1d; border-right-color: rgba(255,255,255,0.08); }
        .sk-main { position: relative; display: flex; flex-direction: column; flex: 1; min-width: 0; }
        .sk-content { position: relative; flex: 1; min-height: 0; overflow-y: auto; }
        .sk-topbar { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-bottom: 1px solid rgba(0,0,0,0.06); }
        .sk-dark .sk-topbar { border-bottom-color: rgba(255,255,255,0.08); }
        .sk-btn { border: 1px solid rgba(0,0,0,0.1); background: #fff; color: inherit; border-radius: 999px; padding: 7px 12px; font-size: 13px; cursor: pointer; }
        .sk-dark .sk-btn { background: #2a2a2e; border-color: rgba(255,255,255,0.12); }
        .sk-btn-active { background: #e4edfd; border-color: #b7c8fe; color: #3964fe; }
        .sk-dark .sk-btn-active { background: #28304a; border-color: #4868b2; color: #a9bfff; }
        .sk-icon-btn { width: 36px; height: 36px; border-radius: 999px; border: 1px solid rgba(0,0,0,0.08); background: transparent; color: inherit; cursor: pointer; }
        .sk-session { padding: 10px 12px; border-radius: 10px; background: #e4edfd; font-size: 14px; cursor: pointer; }
        .sk-dark .sk-session { background: #2a2a2e; }
        .sk-wrap { max-width: 840px; margin: 0 auto; padding: 28px 44px 24px; }
        .sk-welcome { min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 18px; text-align: center; }
        .sk-bubble-user { margin-left: auto; max-width: 78%; background: #eff3fe; padding: 12px 16px; border-radius: 18px 18px 4px 18px; font-size: 15px; line-height: 1.6; }
        .sk-dark .sk-bubble-user { background: #2a2a2e; }
        .sk-ai { margin-top: 22px; font-size: 16px; line-height: 28px; }
        .sk-status { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; color: #6b7280; margin-bottom: 10px; }
        .sk-dot { width: 8px; height: 8px; border-radius: 50%; background: #3964fe; display: inline-block; animation: sk-blink 1s infinite; }
        @keyframes sk-blink { 0%,100% { opacity: 1; } 50% { opacity: 0.25; } }
        .sk-code { margin: 14px 0; border: 1px solid rgba(0,0,0,0.08); border-radius: 12px; overflow: hidden; background: #f9fafb; }
        .sk-dark .sk-code { background: #1b1b1d; border-color: rgba(255,255,255,0.1); }
        .sk-code-head { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; font-size: 12px; color: #6b7280; }
        .sk-code pre { margin: 0; padding: 14px; overflow-x: auto; font-family: Menlo, Monaco, Consolas, 'Courier New', monospace; font-size: 13px; line-height: 22px; white-space: pre-wrap; }
        .sk-cursor { display: inline-block; width: 8px; height: 16px; background: #3964fe; margin-left: 2px; vertical-align: -2px; animation: sk-blink 1s infinite; }
        .sk-composer { max-width: 840px; margin: 0 auto; padding: 12px 44px 18px; }
        .sk-input-box { border: 1px solid rgba(0,0,0,0.1); border-radius: 18px; padding: 10px 12px; background: #fff; box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
        .sk-dark .sk-input-box { background: #222224; border-color: rgba(255,255,255,0.1); }
        .sk-input { width: 100%; border: 0; outline: 0; background: transparent; color: inherit; font-size: 15px; resize: none; }
        .sk-panel { position: absolute; inset: 0; background: rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; z-index: 30; }
        .sk-dialog { background: #fff; color: #171717; width: min(420px, 90vw); border-radius: 16px; padding: 18px; }
        .sk-dark .sk-dialog { background: #222224; color: #f9fafb; }
        .sk-toast { position: absolute; left: 50%; bottom: 92px; transform: translateX(-50%); background: #353538; color: #fff; padding: 9px 14px; border-radius: 999px; font-size: 13px; z-index: 40; }
        .sk-mobile-sider { width: 280px; background: #f9fafb; height: 100%; padding: 14px; }
        .sk-dark .sk-mobile-sider { background: #1b1b1d; }
        @media (max-width: 1022px) { .sk-wrap, .sk-composer { padding-left: 36px; padding-right: 36px; } }
        @media (max-width: 768px) { .sk-frame { position: fixed; top: 0; height: 100dvh; } .sk-sider { display: none; } .sk-wrap, .sk-composer { padding-left: 18px; padding-right: 18px; } }
      `}</style>

      {/* App.tsx portion: <div frame> */}
      <div className={theme === 'dark' ? 'sk-frame sk-dark' : 'sk-frame'}>
        {/* App.tsx portion: {isMobile ? <MobileSider /> : siderCollapsed ? null : <Sider />} */}
        {!isMobile && !siderCollapsed && (
          <aside className="sk-sider">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>Chat AI</strong>
              <button className="sk-icon-btn" onClick={() => setSiderCollapsed(true)} aria-label="Collapse sider">‹</button>
            </div>
            <button className="sk-btn" onClick={() => showToastMessage('Kerangka saja - new chat belum nyambung mesin')}>
              + New chat
            </button>
            <button className="sk-btn" onClick={() => setShowSearch(true)}>Search</button>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Sesi</div>
            <div className="sk-session">{DUMMY_SESSION_TITLE}</div>
            <div style={{ marginTop: 'auto', display: 'flex', gap: 8 }}>
              <button className="sk-btn" onClick={() => setShowSettings(true)}>Settings</button>
              <button className="sk-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
                {theme === 'dark' ? 'Light' : 'Dark'}
              </button>
            </div>
          </aside>
        )}

        {/* App.tsx portion: <main main> */}
        <main className="sk-main">
          {/* App.tsx portion: mobile top bar (MobileHeader equivalent) */}
          {isMobile && (
            <div className="sk-topbar">
              <button className="sk-icon-btn" onClick={() => setMobileSiderOpen(true)}>≡</button>
              <strong>Chat AI</strong>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                <button className="sk-icon-btn" onClick={() => setShowSearch(true)}>⌕</button>
                <button className="sk-icon-btn" onClick={() => setShowSettings(true)}>⚙</button>
              </div>
            </div>
          )}

          {/* App.tsx portion: <div content> */}
          <div className="sk-content">
            {/* App.tsx portion: {siderCollapsed ? <CollapsedSider /> : null} */}
            {siderCollapsed && !isMobile && (
              <button
                className="sk-icon-btn"
                style={{ position: 'absolute', top: 12, left: 12, zIndex: 5 }}
                onClick={() => setSiderCollapsed(false)}
                aria-label="Expand sider"
              >
                ›
              </button>
            )}

            {/* App.tsx portion: session ? <SessionView /> : <Welcome /> */}
            {!hasSession ? (
              <div className="sk-wrap">
                <div className="sk-welcome">
                  <h1 style={{ fontSize: 28, margin: 0 }}>How can I help you?</h1>
                  <p style={{ color: '#6b7280', margin: 0 }}>Tanya coding apa pun, jawabannya ditampilkan selangkah demi selangkah.</p>
                </div>
              </div>
            ) : (
              <div className="sk-wrap">
                {/* User dummy */}
                <div className="sk-bubble-user">{DUMMY_USER_MESSAGE}</div>

                {/* AI dummy with SSE-like presentation */}
                <div className="sk-ai">
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
                        <button className="sk-btn" onClick={handleCopyCode}>{copied ? 'Copied' : 'Copy'}</button>
                      </div>
                      <pre>{streamedCode}</pre>
                    </div>
                  )}

                  {streamedOutro && <p style={{ margin: '8px 0 0' }}>{streamedOutro}</p>}
                  {phase === 'streaming' && <span className="sk-cursor" />}
                </div>
              </div>
            )}
          </div>

          {/* Composer - input + DeepThink / Search capability toggles */}
          <div className="sk-composer">
            <div className="sk-input-box">
              <textarea
                className="sk-input"
                rows={2}
                placeholder="Enter a message"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                <button
                  className={deepThink ? 'sk-btn sk-btn-active' : 'sk-btn'}
                  onClick={() => setDeepThink(!deepThink)}
                >
                  DeepThink {deepThink ? '• On' : '• Off'}
                </button>
                <button
                  className={searchEnabled ? 'sk-btn sk-btn-active' : 'sk-btn'}
                  onClick={() => setSearchEnabled(!searchEnabled)}
                >
                  Search {searchEnabled ? '• On' : '• Off'}
                </button>
                <button
                  className="sk-btn"
                  style={{ marginLeft: 'auto', background: '#3964fe', color: '#fff', borderColor: '#3964fe' }}
                  onClick={handleSend}
                >
                  Kirim
                </button>
              </div>
            </div>
            <p style={{ fontSize: 12, color: '#6b7280', textAlign: 'center', margin: '8px 0 0' }}>
              Kerangka saja — tidak mengirim ke API mana pun.
            </p>
          </div>
        </main>

        {/* App.tsx portion: <SearchPanel /> - skeleton overlay */}
        {showSearch && (
          <div className="sk-panel" onClick={() => setShowSearch(false)}>
            <div className="sk-dialog" onClick={(e) => e.stopPropagation()}>
              <h3 style={{ margin: '0 0 8px' }}>Search</h3>
              <p style={{ fontSize: 14, color: '#6b7280' }}>Kerangka panel pencarian. Belum nyambung mesin.</p>
              <button className="sk-btn" onClick={() => setShowSearch(false)}>Tutup</button>
            </div>
          </div>
        )}

        {/* App.tsx portion: MobileSider drawer */}
        {isMobile && mobileSiderOpen && (
          <div className="sk-panel" style={{ justifyContent: 'flex-start' }} onClick={() => setMobileSiderOpen(false)}>
            <div className="sk-mobile-sider" onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>Chat AI</strong>
                <button className="sk-icon-btn" onClick={() => setMobileSiderOpen(false)}>×</button>
              </div>
              <div className="sk-session" style={{ marginTop: 16 }}>{DUMMY_SESSION_TITLE}</div>
            </div>
          </div>
        )}
      </div>

      {/* App.tsx portion: <SettingsDialog /> - skeleton, no API key storage */}
      {showSettings && (
        <div className="sk-panel" onClick={() => setShowSettings(false)}>
          <div className="sk-dialog" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 8px' }}>Settings</h3>
            <p style={{ fontSize: 14, color: '#6b7280' }}>
              Kerangka settings. Tidak menyimpan API key / tidak memanggil mesin.
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="sk-btn" onClick={() => setTheme('light')}>Light</button>
              <button className="sk-btn" onClick={() => setTheme('dark')}>Dark</button>
              <button className="sk-btn" onClick={() => setShowSettings(false)}>Tutup</button>
            </div>
          </div>
        </div>
      )}

      {/* App.tsx portion: <Toast /> */}
      {toast && <div className="sk-toast">{toast}</div>}
    </>
  )
}
