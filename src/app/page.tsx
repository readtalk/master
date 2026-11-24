// src/app/page.tsx
// Skeleton only - Chat AI presentation frame v2.
// Fixes from screenshot: Sider now uses real Sider component,
// composer aligned with content width, no duplicate Search/Dark in sider.
// No engine: no fetch, no SSE network, no API key, no store, no persistence.
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { CollapsedSider, MobileSider, Sider } from '../components/sider/Sider'

// ---------------------------------------------------------------------------
// Dummy data - 1 user message + 1 AI response.
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
const DUMMY_SESSIONS = [{ id: '1', title: 'Tombol Next.js' }]

type SsePhase = 'thinking' | 'streaming' | 'done'

export default function Home() {
  const [isMobile, setIsMobile] = useState(false)
  const [siderCollapsed, setSiderCollapsed] = useState(false)
  const [mobileSiderOpen, setMobileSiderOpen] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [toast, setToast] = useState('')
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [deepThink, setDeepThink] = useState(true)
  const [searchEnabled, setSearchEnabled] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [hasSession] = useState(true)
  const [activeId] = useState('1')

  const [phase, setPhase] = useState<SsePhase>('thinking')
  const [streamedIntro, setStreamedIntro] = useState('')
  const [streamedCode, setStreamedCode] = useState('')
  const [streamedOutro, setStreamedOutro] = useState('')
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<number | null>(null)

  const fullAiText = useMemo(
    () => `${DUMMY_AI_INTRO}\n\n${DUMMY_AI_CODE}\n\n${DUMMY_AI_OUTRO}`,
    []
  )

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

  // Fake SSE: Thinking pause, then reveal text char by char.
  useEffect(() => {
    if (!hasSession) return
    let index = 0
    const thinkingTimer = window.setTimeout(() => {
      setPhase('streaming')
      timerRef.current = window.setInterval(() => {
        index += 3
        const sliced = fullAiText.slice(0, index)
        const introEnd = DUMMY_AI_INTRO.length
        const codeEnd = introEnd + 2 + DUMMY_AI_CODE.length
        setStreamedIntro(sliced.slice(0, Math.min(introEnd, sliced.length)))
        setStreamedCode(
          sliced.length > introEnd + 2
            ? sliced.slice(introEnd + 2, Math.min(codeEnd, sliced.length))
            : ''
        )
        setStreamedOutro(sliced.length > codeEnd + 2 ? sliced.slice(codeEnd + 2) : '')
        if (index >= fullAiText.length) {
          if (timerRef.current) window.clearInterval(timerRef.current)
          setPhase('done')
        }
      }, 18)
    }, 900)
    return () => {
      window.clearTimeout(thinkingTimer)
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
    } catch {}
    setCopied(true)
    showToastMessage('Code disalin')
    window.setTimeout(() => setCopied(false), 2000)
  }

  const handleSend = () => {
    if (!inputValue.trim()) return
    showToastMessage('Kerangka saja - pesan tidak dikirim ke API')
    setInputValue('')
  }

  const phaseLabel =
    phase === 'thinking' ? 'Thinking...' : phase === 'streaming' ? 'Menulis...' : 'Selesai'

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        .sk-frame { display: flex; width: 100%; height: 100dvh; overflow: hidden; background: #fff; color: #171717; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        .sk-frame.sk-dark { background: #151517; color: #f9fafb; }
        .sk-main { position: relative; display: flex; flex-direction: column; flex: 1; min-width: 0; height: 100%; }
        .sk-content { position: relative; flex: 1; min-height: 0; overflow-y: auto; }
        .sk-topbar { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-bottom: 1px solid rgba(0,0,0,0.06); flex-shrink: 0; }
        .sk-dark .sk-topbar { border-bottom-color: rgba(255,255,255,0.08); }
        .sk-btn { border: 1px solid rgba(0,0,0,0.1); background: #fff; color: inherit; border-radius: 999px; padding: 7px 12px; font-size: 13px; cursor: pointer; white-space: nowrap; }
        .sk-dark .sk-btn { background: #2a2a2e; border-color: rgba(255,255,255,0.12); }
        .sk-btn-active { background: #e4edfd !important; border-color: #b7c8fe !important; color: #3964fe !important; }
        .sk-dark .sk-btn-active { background: #28304a !important; border-color: #4868b2 !important; color: #a9bfff !important; }
        .sk-icon-btn { width: 36px; height: 36px; flex-shrink: 0; border-radius: 999px; border: 1px solid rgba(0,0,0,0.08); background: transparent; color: inherit; cursor: pointer; }
        /* FIX: content + composer share ONE centered column width */
        .sk-column { width: 100%; max-width: 840px; margin: 0 auto; padding-left: 44px; padding-right: 44px; }
        .sk-wrap { padding-top: 28px; padding-bottom: 24px; }
        .sk-welcome { min-height: 55vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 18px; text-align: center; }
        .sk-bubble-user { margin-left: auto; width: fit-content; max-width: 78%; background: #eff3fe; padding: 12px 16px; border-radius: 18px 18px 4px 18px; font-size: 15px; line-height: 1.6; }
        .sk-dark .sk-bubble-user { background: #2a2a2e; }
        .sk-ai { margin-top: 22px; font-size: 16px; line-height: 28px; overflow-wrap: break-word; }
        .sk-status { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; color: #6b7280; margin-bottom: 10px; }
        .sk-dot { width: 8px; height: 8px; border-radius: 50%; background: #3964fe; display: inline-block; animation: sk-blink 1s infinite; }
        @keyframes sk-blink { 0%,100% { opacity: 1; } 50% { opacity: 0.25; } }
        .sk-code { margin: 14px 0; border: 1px solid rgba(0,0,0,0.08); border-radius: 12px; overflow: hidden; background: #f9fafb; }
        .sk-dark .sk-code { background: #1b1b1d; border-color: rgba(255,255,255,0.1); }
        .sk-code-head { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; font-size: 12px; color: #6b7280; }
        .sk-code pre { margin: 0; padding: 14px; overflow-x: auto; font-family: Menlo, Monaco, Consolas, 'Courier New', monospace; font-size: 13px; line-height: 22px; white-space: pre-wrap; word-break: break-word; }
        .sk-cursor { display: inline-block; width: 8px; height: 16px; background: #3964fe; margin-left: 2px; vertical-align: -2px; animation: sk-blink 1s infinite; }
        /* FIX: composer is NOT floating - it is a normal footer row, same column as content */
        .sk-composer { flex-shrink: 0; padding: 8px 0 14px; }
        .sk-input-box { border: 1px solid rgba(0,0,0,0.1); border-radius: 18px; padding: 10px 12px; background: #fff; box-shadow: 0 8px 24px rgba(0,0,0,0.06); }
        .sk-dark .sk-input-box { background: #222224; border-color: rgba(255,255,255,0.1); }
        .sk-input { width: 100%; border: 0; outline: 0; background: transparent; color: inherit; font-size: 15px; resize: none; font-family: inherit; }
        .sk-panel { position: fixed; inset: 0; background: rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .sk-dialog { background: #fff; color: #171717; width: min(420px, 90vw); border-radius: 16px; padding: 18px; }
        .sk-dark .sk-dialog { background: #222224; color: #f9fafb; }
        .sk-toast { position: fixed; left: 50%; bottom: 92px; transform: translateX(-50%); background: #353538; color: #fff; padding: 9px 14px; border-radius: 999px; font-size: 13px; z-index: 1100; }
        @media (max-width: 768px) {
          .sk-column { padding-left: 18px; padding-right: 18px; }
          .sk-frame { position: fixed; top: 0; }
        }
      `}</style>

      <div className={theme === 'dark' ? 'sk-frame sk-dark' : 'sk-frame'}>
        {!isMobile && !siderCollapsed && (
          <Sider
            sessions={DUMMY_SESSIONS}
            activeId={activeId}
            onCollapse={() => setSiderCollapsed(true)}
            onNewChat={() => showToastMessage('Kerangka saja - new chat belum nyambung mesin')}
            onOpenSettings={() => setShowSettings(true)}
          />
        )}

        <main className="sk-main">
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

          <div className="sk-content">
            {siderCollapsed && !isMobile && (
              <CollapsedSider
                onExpand={() => setSiderCollapsed(false)}
                onNewChat={() => showToastMessage('Kerangka saja - new chat belum nyambung mesin')}
              />
            )}
            {!hasSession ? (
              <div className="sk-column sk-wrap">
                <div className="sk-welcome">
                  <h1 style={{ fontSize: 28, margin: 0 }}>How can I help you?</h1>
                  <p style={{ color: '#6b7280', margin: 0 }}>Tanya coding apa pun, jawabannya ditampilkan selangkah demi selangkah.</p>
                </div>
              </div>
            ) : (
              <div className="sk-column sk-wrap">
                <div className="sk-bubble-user">{DUMMY_USER_MESSAGE}</div>
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

          <div className="sk-column sk-composer">
            <div className="sk-input-box">
              <textarea
                className="sk-input"
                rows={2}
                placeholder="Enter a message"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <button className={deepThink ? 'sk-btn sk-btn-active' : 'sk-btn'} onClick={() => setDeepThink(!deepThink)}>
                  DeepThink {deepThink ? '• On' : '• Off'}
                </button>
                <button className={searchEnabled ? 'sk-btn sk-btn-active' : 'sk-btn'} onClick={() => setSearchEnabled(!searchEnabled)}>
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

        <MobileSider
          open={isMobile && mobileSiderOpen}
          sessions={DUMMY_SESSIONS}
          activeId={activeId}
          onSelect={() => setMobileSiderOpen(false)}
          onNewChat={() => showToastMessage('Kerangka saja')}
          onOpenSettings={() => setShowSettings(true)}
          onCloseMobile={() => setMobileSiderOpen(false)}
        />
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
