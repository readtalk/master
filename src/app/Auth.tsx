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
      .sk-modal-mask { position: fixed; inset: 0; background: #000; display: flex; align-items: center; justify-content: center; z-index: 900; }
      .sk-modal { background: #000; color: #fff; width: min(400px, 90vw); padding: 18px; box-sizing: border-box; }
      .sk-btn { border: 1px solid rgba(255,255,255,0.2); background: #1a1a1a; color: #fff; border-radius: 12px; padding: 7px 12px; font-size: 13px; cursor: pointer; }
      .sk-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      .sk-btn-primary { background: #fff; color: #000; border-color: #fff; border-radius: 12px; height: 48px; padding: 0 12px; font-size: 16px; font-weight: 700; width: 100%; cursor: pointer; }
      .sk-auth-title { margin: 0 0 8px; font-size: 20px; line-height: 26px; font-weight: 700; text-align: center; }
      .sk-auth-desc { font-size: 12px; line-height: 18px; color: #888; margin: 0 0 16px; text-align: center; }
      .sk-auth-desc a { color: #fff; text-decoration: underline; }
      .sk-auth-label { display: block; font-size: 12px; font-weight: 500; color: #888; margin-bottom: 4px; }
      .sk-auth-input { box-sizing: border-box; width: 100%; height: 48px; padding: 0 12px; border-radius: 12px; border: 1px solid #fff; background: #1a1a1a; color: #fff; font: inherit; font-size: 16px; outline: none; }
      select.sk-auth-input { appearance: none; }
      .sk-auth-field { margin-bottom: 12px; }
      .sk-auth-loading { position: fixed; inset: 0; z-index: 900; display: flex; align-items: center; justify-content: center; background: #000; color: #fff; }
      .sk-spin { animation: sk-spin 1s linear infinite; }
      @keyframes sk-spin { to { transform: rotate(360deg); } }
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

  useEffect(() => {
    if (pathname.startsWith('/@') || pathname.startsWith('/u/') || pathname === '/callback') {
      setIsVisible(false)
      return
    }

    const tokenInUrl = searchParams.get('token')
    if (tokenInUrl) {
      localStorage.setItem('session', tokenInUrl)
      const url = new URL(window.location.href)
      url.searchParams.delete('token')
      window.history.replaceState({}, '', url.toString())
    }

    const session = localStorage.getItem('session')
    setIsLoggedIn(!!session)
    setIsVisible(true)
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

  if (!isVisible || isLoggedIn === null) return null

  if (isLoading || isProfileLoading) {
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
                <select value={formLocation} onChange={(e) => setFormLocation(e.target.value)} className="sk-auth-input">
                  <option value="">Select Location</option>
                  {REGIONS.map((r) => (
                    <option key={r.code} value={r.code}>{r.nativeName} - {r.label}</option>
                  ))}
                </select>
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

  return (
    <>
      <AuthStyles />
      <div className="sk-modal-mask">
        <div className="sk-modal" style={{ textAlign: 'center' }}>
          <h3 className="sk-auth-title">Welcome to READTalk</h3>
          <p className="sk-auth-desc">
            By continuing, you agree to our <a href="https://readtalk.web.id/" target="_blank" rel="noopener noreferrer">Terms &amp; Conditions</a>
          </p>
          <button onClick={handleLoginClick} disabled={isLoading} className="sk-btn sk-btn-primary">
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
