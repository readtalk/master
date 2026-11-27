'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { ChatText, Phone, Heart, Globe, LockKey } from '@phosphor-icons/react'

function AuthStyles() {
  return (
    <style>{`
      .sk-auth-mask { position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center; background: #000; color: #fff; padding: 0; }
      .sk-auth-card { width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 24px; box-sizing: border-box; text-align: center; background: #000; }
      .sk-auth-logo-wrap { position: relative; width: 160px; height: 160px; display: flex; align-items: center; justify-content: center; margin-bottom: 8px; }
      .sk-auth-logo { width: 96px; height: 96px; border-radius: 24px; background: #fff; position: absolute; z-index: 10; transition: all .5s cubic-bezier(0.16,1,0.3,1); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 40px; color: #000; }
      .sk-auth-icons { position: absolute; width: 100%; height: 100%; transition: all .5s cubic-bezier(0.16,1,0.3,1); }
      .sk-auth-hide { opacity: 0; transform: scale(.75); pointer-events: none; }
      .sk-auth-show { opacity: 1; transform: scale(1); }
      .sk-auth-title { font-size: 20px; font-weight: 700; margin: 16px 0 8px; }
      .sk-auth-desc { font-size: 12px; color: #888; margin-bottom: 32px; max-width: 280px; line-height: 18px; }
      .sk-auth-desc a { text-decoration: underline; color: #fff; }
      .sk-auth-btn { width: 100%; height: 48px; border: none; border-radius: 12px; background: #fff; color: #000; font-size: 16px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; }
      .sk-auth-btn:disabled { opacity: .7; }
      .sk-auth-spinner { width: 40px; height: 40px; border: 4px solid rgba(255,255,255,.25); border-top-color: #fff; border-radius: 999px; animation: sk-spin 1s linear infinite; }
      @keyframes sk-spin { to { transform: rotate(360deg); } }
      @media (min-width: 769px) {
        .sk-auth-mask { padding: 16px; background: rgba(0,0,0,.6); }
        .sk-auth-card { width: 100%; max-width: 384px; height: auto; border-radius: 16px; }
      }
    `}</style>
  )
}

export default function Auth() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isVisible, setIsVisible] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showLogo, setShowLogo] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => setShowLogo((p) => !p), 2500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // kerjasama sama Sidebar: jangan nongol di halaman publik / callback
    if (pathname.startsWith('/@') || pathname.startsWith('/u/') || pathname === '/callback') {
      setIsVisible(false)
      return
    }
    const hasTokenInUrl = searchParams.get('token')
    const session = localStorage.getItem('session')
    if (hasTokenInUrl || session) {
      setIsLoggedIn(true)
      setIsVisible(false) // udah login -> biarin Sidebar / app yang tampil
      return
    }
    setIsLoggedIn(false)
    setIsVisible(true)
  }, [pathname, searchParams])

  // CARA login ngikutin file global
  const handleLoginClick = () => {
    setIsLoading(true)
    setTimeout(() => {
      window.location.href = '/api/auth/login'
    }, 800)
  }

  if (!isVisible || isLoggedIn === null) return null

  if (isLoading) {
    return (
      <>
        <AuthStyles />
        <div className="sk-auth-mask">
          <div className="sk-auth-spinner" />
        </div>
      </>
    )
  }

  if (isLoggedIn) return null

  
  return (
    <>
      <AuthStyles />
      <div className="sk-auth-mask">
        <div className="sk-auth-card">
          <div className="sk-auth-logo-wrap">
            <div className={showLogo ? 'sk-auth-logo sk-auth-show' : 'sk-auth-logo sk-auth-hide'}>R</div>
            <div className={!showLogo ? 'sk-auth-icons sk-auth-show' : 'sk-auth-icons sk-auth-hide'}>
              <ChatText size={120} weight="fill" style={{ position: 'absolute', top: 24, left: 8, color: '#262626' }} />
              <Phone size={28} weight="fill" style={{ position: 'absolute', top: 8, left: 16, color: '#888' }} />
              <Heart size={26} weight="fill" style={{ position: 'absolute', bottom: 40, left: 0, color: '#888' }} />
              <Globe size={50} weight="fill" style={{ position: 'absolute', top: 0, right: 0, color: '#333' }} />
              <LockKey size={36} weight="fill" style={{ position: 'absolute', bottom: 8, right: 16, color: '#888' }} />
            </div>
          </div>
          <h2 className="sk-auth-title">Welcome to READTalk</h2>
          <p className="sk-auth-desc">
            By continuing, you agree to our{' '}
            <a href="https://readtalk.web.id/" target="_blank" rel="noopener noreferrer">Terms &amp; Conditions</a>
          </p>
          <button onClick={handleLoginClick} disabled={isLoading} className="sk-auth-btn">
            Agree and continue
          </button>
        </div>
      </div>
    </>
  )
}
