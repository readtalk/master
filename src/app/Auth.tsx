'use client'

import { useEffect, useState } from 'react'

function AuthStyles() {
  return (
    <style>{`
      .sk-modal-mask { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 900; }
      .sk-modal { background: #111; color: #fff; width: min(420px, 90vw); border-radius: 16px; padding: 18px; }
      .sk-btn { border: 1px solid rgba(255,255,255,0.2); background: #1a1a1a; color: #fff; border-radius: 999px; padding: 7px 12px; font-size: 13px; cursor: pointer; }
      .sk-btn-primary { background: #fff; color: #000; border-color: #fff; }
      .sk-modal-title { margin: 0 0 8px; font-size: 16px; line-height: 22px; font-weight: 600; }
      .sk-modal-desc { font-size: 14px; color: #888; margin: 0 0 16px; line-height: 20px; }
      .sk-modal-actions { display: flex; gap: 8px; justify-content: flex-end; }
    `}</style>
  )
}

export default function Auth() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const dismissed = localStorage.getItem("sk-pwa-dismissed")
    if (dismissed) return

    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setVisible(true)
    }

    window.addEventListener("beforeinstallprompt", handler)
    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  if (!visible) return null

  return (
    <>
      <AuthStyles />
      <div className="sk-modal-mask" onClick={() => setVisible(false)}>
        <div className="sk-modal" onClick={(e) => e.stopPropagation()}>
          <h3 className="sk-modal-title">Install ReadTalk?</h3>
          <p className="sk-modal-desc">
            Install ReadTalk sebagai aplikasi biar bisa dibuka lebih cepat dan tetap jalan offline.
          </p>
          <div className="sk-modal-actions">
            <button
              className="sk-btn"
              onClick={() => {
                localStorage.setItem("sk-pwa-dismissed", "1")
                setVisible(false)
              }}
            >
              Nanti
            </button>
            <button
              className="sk-btn sk-btn-primary"
              onClick={async () => {
                if (!deferredPrompt) {
                  setVisible(false)
                  return
                }
                deferredPrompt.prompt()
                await deferredPrompt.userChoice
                setDeferredPrompt(null)
                setVisible(false)
              }}
            >
              Install
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
