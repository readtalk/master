// src/app/page.tsx
'use client'
import { useEffect, useState } from 'react'
import { Sidebar, CollapsedSidebar, MobileSidebar } from '@/components/Sidebar'

export default function Home() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Ini cara deteksi WA Web vs WA APK
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <div style={{ display: 'flex', flex: 1, minWidth: 0 }}>
      {/* 1. Mobile: Sidebar jadi Drawer */}
      {isMobile ? (
        <>
          <MobileSidebar
            open={mobileOpen}
            sessions={[]}
            activeId=""
            onCloseMobile={() => setMobileOpen(false)}
          />
        </>
      ) : collapsed ? (
        /* 2. Desktop collapsed: cuma tombol */
        <CollapsedSidebar onExpand={() => setCollapsed(false)} />
      ) : (
        /* 3. Desktop normal: Sidebar full */
        <Sidebar
          sessions={[]}
          activeId=""
          onCollapse={() => setCollapsed(true)}
        />
      )}

      {/* Page Reading */}
      <main style={{ flex: 1, minWidth: 0, overflow: 'auto', padding: 24 }}>
        {isMobile && (
          <button onClick={() => setMobileOpen(true)}>☰ Buka Sidebar</button>
        )}
        <h1>Reading Page</h1>
        <p>Ini kontennya. Di sini nanti FAB-nya nempel.</p>
      </main>
    </div>
  )
}
