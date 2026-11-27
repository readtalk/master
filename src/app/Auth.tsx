'use client'

import { Suspense, useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { REGIONS } from '@/context/Regional'

const AUTH_URL = 'https://auth.readtalk.web.id'

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
      .skf-mask { position: fixed; inset: 0; background: #000; display: flex; align-items: center; justify-content: center; z-index: 900; }
      .skf-box { background: #000; color: #fff; width: 100%; max-width: 400px; padding: 18px; box-sizing: border-box; }
      .skf-btn-primary { background: #fff; color: #000; border: 1px solid #fff; border-radius: 12px; height: 48px; padding: 0 12px; font-size: 16px; font-weight: 700; width: 100%; cursor: pointer; }
      .skf-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
      .skf-title { margin: 0 0 8px; font-size: 20px; line-height: 26px; font-weight: 700; text-align: center; }
      .skf-desc { font-size: 12px; line-height: 18px; color: #888; margin: 0 0 16px; text-align: center; }
      .skf-desc a { color: #fff; text-decoration: underline; }
      .skf-label { display: block; font-size: 12px; font-weight: 500; color: #888; margin-bottom: 4px; }
      .skf-input { box-sizing: border-box; width: 100%; height: 48px; padding: 0 12px; border-radius: 12px; border: 1px solid #fff; background: #1a1a1a; color: #fff; font: inherit; font-size: 16px; outline: none; }
      select.skf-input { appearance: none; }
      .skf-field { margin-bottom: 12px; }
      .skf-loading { position: fixed; inset: 0; z-index: 900; display: flex; align-items: center; justify-content: center; background: #000; color: #fff; }
      .skf-spin { animation: skf-spin 1s linear infinite; }
      @keyframes skf-spin { to { transform: rotate(360deg); } }
    `}</style>
  )
}

function AuthInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isProfileLoading, setIsProfileLoading] = useState(false)
  const [formUsername, setFormUsername] = useState('')
  const [formYourname, setFormYourname] = useState('')
  const [formDob, setFormDob] = useState('')
  const [formLocation, setFormLocation] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isStandalone, setIsStandalone] = useState<boolean | null>(null)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    if (pathname.startsWith('/@') || pathname.startsWith('/u/') || pathname === '/callback') {
      setIsVisible(false)
      return
    }
    const checkStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as unknown as { standalone?: boolean }).standalone === true
    setIsStandalone(checkStandalone)
    const tokenInUrl = searchParams.get('token')
    if (tokenInUrl) {
      localStorage.setItem('session', tokenInUrl)
      const url = new URL(window.location.href)
      url.searchParams.delete('token')
      window.history.replaceState({}, '', url.toString())
    }
    const session = localStorage.getItem('session')
    if (tokenInUrl || session) {
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
    if (!isLoggedIn) return
    const session = localStorage.getItem('session')
    if (!session) return
    setIsProfileLoading(true)
    fetch(`${AUTH_URL}/settings`, {
      headers: { Authorization: `Bearer ${session}` },
    })
      .then(async (res) => {
        if (res.status === 401) {
          localStorage.removeItem('session')
          setIsLoggedIn(false)
          return null
        }
        return (await res.json()) as { success: boolean; user?: UserProfile }
      })
      .then((data) => {
        if (data?.success && data.user) {
          setProfile(data.user)
          setFormUsername(data.user.username || '')
          setFormYourname(data.user.yourname || '')
          setFormDob(data.user.date_of_birth || '')
          setFormLocation(data.user.location || '')
        }
      })
      .catch(() => {})
      .finally(() => setIsProfileLoading(false))
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
      const res = await fetch(`${AUTH_URL}/settings`, {
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
      if (res.ok) window.location.reload()
      else alert('Failed to save profile.')
    } catch (e) {
      console.error(e)
      alert('Error saving profile.')
    } finally {
      setIsSaving(false)
    }
  }

  if (!isVisible || isLoggedIn === null || isStandalone === null) return null

  if (isLoading) {
    return (
      <>
        <AuthStyles />
        <div className="skf-loading">
          <svg className="skf-spin" width="40" height="40" viewBox="0 0 24 24" fill="none">
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
          <div className="skf-loading">
            <svg className="skf-spin" width="40" height="40" viewBox="0 0 24 24" fill="none">
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
          <div className="skf-mask">
            <div className="skf-box">
              <h3 className="skf-title">Complete Your Profile</h3>
              <p className="skf-desc">Please fill in your details to continue.</p>
              <div className="skf-field">
                <label className="skf-label">Username</label>
                <input type="text" value={formUsername} onChange={(e) => setFormUsername(e.target.value)} placeholder="e.g. johndoe" className="skf-input" />
              </div>
              <div className="skf-field">
                <label className="skf-label">Your Name</label>
                <input type="text" value={formYourname} onChange={(e) => setFormYourname(e.target.value)} placeholder="e.g. John Doe" className="skf-input" />
              </div>
              <div className="skf-field">
                <label className="skf-label">Date of Birth</label>
                <input type="date" value={formDob} onChange={(e) => setFormDob(e.target.value)} className="skf-input" />
              </div>
              <div className="skf-field">
                <label className="skf-label">Location</label>
                <select value={formLocation} onChange={(e) => setFormLocation(e.target.value)} className="skf-input">
                  <option value="">Select Location</option>
                  {REGIONS.map((r) => (
                    <option key={r.code} value={r.code}>{r.nativeName} - {r.label}</option>
                  ))}
                </select>
              </div>
              <button onClick={handleSaveProfile} disabled={isSaving || !formUsername.trim() || !formYourname.trim() || !formDob || !formLocation.trim()} className="skf-btn-primary" style={{ marginTop: 4 }}>
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
        <div className="skf-mask">
          <div className="skf-box" style={{ textAlign: 'center' }}>
            <button onClick={handleInstallClick} disabled={!deferredPrompt} className="skf-btn-primary">
              INSTALL
            </button>
            <p className="skf-desc" style={{ marginTop: 8 }}>Progressive Web App</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <AuthStyles />
      <div className="skf-mask">
        <div className="skf-box" style={{ textAlign: 'center' }}>
          <h3 className="skf-title">Welcome to READTalk</h3>
          <p className="skf-desc">
            By continuing, you agree to our <a href="https://readtalk.web.id/" target="_blank" rel="noopener noreferrer">Terms &amp; Conditions</a>
          </p>
          <button onClick={handleLoginClick} disabled={isLoading} className="skf-btn-primary">
            Agree and continue
          </button>
        </div>
      </div>
    </>
  )
}

export default function Auth() {
  return (
    <Suspense fallback={null}>
      <AuthInner />
    </Suspense>
  )
}
