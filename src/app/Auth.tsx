'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { ChatText, Phone, Heart, Globe, LockKey } from '@phosphor-icons/react/dist/ssr'

export type UserProfile = {
  username: string | null
  yourname: string | null
  date_of_birth: string | null
  avatar: string | null
  header: string | null
  headline: string | null
  about: string | null
  socials: string | null
  location: string | null
}

function AuthStyles() {
  return (
    <style>{`
      .sk-modal-mask { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 900; }
      .sk-modal { background: #111; color: #fff; width: min(420px, 90vw); border-radius: 16px; padding: 18px; box-sizing: border-box; }
      .sk-modal-full { width: 100%; height: 100%; border-radius: 0; display: flex; flex-direction: column; justify-content: center; align-items: center; }
      .sk-btn { border: 1px solid rgba(255,255,255,0.2); background: #1a1a1a; color: #fff; border-radius: 999px; padding: 7px 12px; font-size: 13px; cursor: pointer; }
      .sk-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      .sk-btn-primary { background: #fff; color: #000; border-color: #fff; border-radius: 12px; padding: 12px 16px; font-size: 16px; font-weight: 700; width: 100%; }
      .sk-auth-title { margin: 0 0 8px; font-size: 20px; line-height: 26px; font-weight: 700; text-align: center; }
      .sk-auth-desc { font-size: 12px; line-height: 18px; color: #888; margin: 0 0 16px; text-align: center; }
      .sk-auth-desc a { color: #fff; text-decoration: underline; }
      .sk-auth-label { display: block; font-size: 12px; font-weight: 500; color: #888; margin-bottom: 4px; }
      .sk-auth-input { box-sizing: border-box; width: 100%; height: 40px; padding: 0 10px; border-radius: 12px; border: 1px solid #fff; background: #1a1a1a; color: #fff; font: inherit; font-size: 14px; outline: none; }
      .sk-auth-field { margin-bottom: 12px; }
      .sk-auth-logo-wrap { position: relative; width: 160px; height: 160px; display: flex; align-items: center; justify-content: center; margin-bottom: 8px; }
      .sk-auth-logo { width: 96px; height: 96px; border-radius: 24px; position: absolute; z-index: 10; background: #fff; transition: all 0.5s; }
      .sk-auth-icons { position: absolute; width: 100%; height: 100%; transition: all 0.5s; }
      .sk-auth-loading { position: fixed; inset: 0; z-index: 900; display: flex; align-items: center; justify-content: center; background: #000; color: #fff; }
      .sk-spin { animation: sk-spin 1s linear infinite; }
      @keyframes sk-spin { to { transform: rotate(360deg); } }
      @media (max-width: 768px) {
        .sk-auth-input { height: 44px; padding: 0 12px; font-size: 16px; }
      }
    `}</style>
  )
}

export default function Auth() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isStandalone, setIsStandalone] = useState<boolean | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [showLogo, setShowLogo] = useState(true)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isProfileLoading, setIsProfileLoading] = useState(false)
  const [formUsername, setFormUsername] = useState('')
  const [formYourname, setFormYourname] = useState('')
  const [formDob, setFormDob] = useState('')
  const [formLocation, setFormLocation] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setShowLogo((prev) => !prev)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (pathname.startsWith('/@') || pathname.startsWith('/u/') || pathname === '/callback') {
      setIsVisible(false)
      return
    }
    const checkStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as unknown as { standalone?: boolean }).standalone === true
    setIsStandalone(checkStandalone)
    const hasTokenInUrl = searchParams.get('token')
    const session = localStorage.getItem('session')
    if (hasTokenInUrl || session) {
      setIsLoggedIn(true)
      setIsVisible(true)
      return
    }
    setIsLoggedIn(false)
    setIsVisible(true)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  }, [pathname, searchParams])

  useEffect(() => {
    if (isLoggedIn) {
      const session = localStorage.getItem('session')
      if (session) {
        setIsProfileLoading(true)
        fetch('https://auth.readtalk.workers.dev/settings', {
          headers: { Authorization: `Bearer ${session}` },
        })
          .then((res) => res.json() as Promise<{ success: boolean; user?: UserProfile }>)
          .then((data) => {
            if (data.success && data.user) {
              setProfile(data.user)
              setFormUsername(data.user.username || '')
              setFormYourname(data.user.yourname || '')
              setFormDob(data.user.date_of_birth || '')
              setFormLocation(data.user.location || '')
            }
          })
          .catch(() => {})
          .finally(() => setIsProfileLoading(false))
      }
    }
  }, [isLoggedIn])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setDeferredPrompt(null)
    }
  }

  const handleLoginClick = () => {
    setIsLoading(true)
    setTimeout(() => {
      window.location.href = '/api/auth/login'
    }, 800)
  }

  const handleSaveProfile = async () => {
    if (!formUsername.trim() || !formYourname.trim() || !formDob || !formLocation.trim()) return
    const session = localStorage.getItem('session')
    if (!session) return
    setIsSaving(true)
    try {
      const res = await fetch('https://auth.readtalk.workers.dev/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session}`,
        },
        body: JSON.stringify({
          username: formUsername,
          yourname: formYourname,
          date_of_birth: formDob,
          avatar: profile?.avatar || null,
          header: profile?.header || null,
          headline: profile?.headline || null,
          about: profile?.about || null,
          socials: profile?.socials || null,
          location: formLocation,
        }),
      })
      if (res.ok) {
        window.location.reload()
      } else {
        alert('Failed to save profile.')
      }
    } catch (error) {
      console.error(error)
      alert('Error saving profile.')
    } finally {
      setIsSaving(false)
    }
  }

  if (!isVisible || isStandalone === null || isLoggedIn === null) return null

  if (isLoading) {
    return (
      <>
        <AuthStyles />
        <div className="sk-auth-loading">
          <svg className="sk-spin" width="40" height="40" viewBox="0 0 24 24" fill="none">
            <circle opacity="0.25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path opacity="0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      </>
    )
  }

  if (isLoggedIn) {
    if (isProfileLoading) {
      return (
        <>
          <AuthStyles />
          <div className="sk-auth-loading">
            <svg className="sk-spin" width="40" height="40" viewBox="0 0 24 24" fill="none">
              <circle opacity="0.25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path opacity="0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        </>
      )
    }
    if (profile && (!profile.username || !profile.yourname || !profile.date_of_birth || !profile.location)) {
      return (
        <>
          <AuthStyles />
          <div className="sk-modal-mask">
            <div className="sk-modal">
              <h3 className="sk-auth-title">Complete Your Profile</h3>
              <p className="sk-auth-desc">Please fill in your details to continue.</p>
              <div className="sk-auth-field">
                <label className="sk-auth-label">Username</label>
                <input type="text" value={formUsername} onChange={(e) => setFormUsername(e.target.value)} placeholder="e.g. johndoe" className="sk-auth-input" />
              </div>
              <div className="sk-auth-field">
                <label className="sk-auth-label">Your Name</label>
                <input type="text" value={formYourname} onChange={(e) => setFormYourname(e.target.value)} placeholder="e.g. John Doe" className="sk-auth-input" />
              </div>
              <div className="sk-auth-field">
                <label className="sk-auth-label">Date of Birth</label>
                <input type="date" value={formDob} onChange={(e) => setFormDob(e.target.value)} className="sk-auth-input" />
              </div>
              <div className="sk-auth-field">
                <label className="sk-auth-label">Location</label>
                <input type="text" value={formLocation} onChange={(e) => setFormLocation(e.target.value)} placeholder="e.g. Jakarta" className="sk-auth-input" />
              </div>
              <button onClick={handleSaveProfile} disabled={isSaving || !formUsername.trim() || !formYourname.trim() || !formDob || !formLocation.trim()} className="sk-btn sk-btn-primary" style={{ marginTop: 4 }}>
                {isSaving ? 'Saving...' : 'Continue'}
              </button>
            </div>
          </div>
        </>
      )
    }
    return null
  }

  if (!isStandalone) {
    return (
      <>
        <AuthStyles />
        <div className="sk-modal-mask">
          <div className="sk-modal" style={{ textAlign: 'center' }}>
            <button onClick={handleInstallClick} disabled={!deferredPrompt} className="sk-btn sk-btn-primary">
              INSTALL
            </button>
            <p className="sk-auth-desc" style={{ marginTop: 8 }}>Progressive Web App</p>
            <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, color: '#888' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993.0004.5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993 0 .5511-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 00-.1521-.5676.416.416 0 00-.5676.1521l-2.0223 3.503C15.5902 8.2439 13.8533 7.8508 12 7.8508s-3.5902.3931-5.1367 1.0493L4.841 5.3978a.416.416 0 00-.5677-.1521.416.416 0 00-.1521.5676l1.9973 3.4592C2.6889 11.1867.3432 14.6589 0 18.761h24c-.3435-4.1021-2.6891-7.5743-6.1185-9.4396" />
              </svg>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <AuthStyles />
      <div className="sk-modal-mask" style={{ padding: 0 }}>
        <div className="sk-modal sk-modal-full">
          <div className="sk-auth-logo-wrap">
            <img src="/192x192.png" alt="READTalk Logo" className="sk-auth-logo" style={{ opacity: showLogo ? 1 : 0, transform: showLogo ? 'scale(1)' : 'scale(0.75)' }} />
            <div className="sk-auth-icons" style={{ opacity: !showLogo ? 1 : 0, transform: !showLogo ? 'scale(1)' : 'scale(0.75)' }}>
              <ChatText size={120} weight="fill" style={{ position: 'absolute', top: 24, left: 8, color: '#333', transform: 'rotate(-8deg)' }} />
              <Phone size={28} weight="fill" style={{ position: 'absolute', top: 8, left: 16, color: '#888', transform: 'rotate(-15deg)' }} />
              <Heart size={26} weight="fill" style={{ position: 'absolute', bottom: 40, left: 0, color: '#888' }} />
              <Globe size={50} weight="fill" style={{ position: 'absolute', top: 0, right: 0, color: '#333' }} />
              <LockKey size={36} weight="fill" style={{ position: 'absolute', bottom: 8, right: 16, color: '#888' }} />
            </div>
          </div>
          <h3 className="sk-auth-title" style={{ marginTop: 16 }}>Welcome to READTalk</h3>
          <p className="sk-auth-desc" style={{ maxWidth: 320 }}>
            By continuing, you agree to our <a href="https://readtalk.web.id/" target="_blank" rel="noopener noreferrer">Terms &amp; Conditions</a>
          </p>
          <button onClick={handleLoginClick} disabled={isLoading} className="sk-btn sk-btn-primary" style={{ maxWidth: 360 }}>
            Agree and continue
          </button>
        </div>
      </div>
    </>
  )
}
