'use client'

import { useState } from 'react'
import { Sparkle, X } from '@phosphor-icons/react'

export default function FabAI({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-label="OpenAI"
        style={{
          position: 'fixed',
          right: 16,
          bottom: 96, // Floating above the bottom bar, like Meta AI in WhatsApp
          width: 48,
          height: 48,
          borderRadius: '50%',
          border: 'none',
          background: 'linear-gradient(135deg, #a855f7, #ec4899, #3b82f6)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
          zIndex: 1200,
        }}
      >
        {open ? <X size={22} /> : <Sparkle size={24} weight="fill" />}
      </button>

      {open && (
        <div
          style={{
            position: 'fixed',
            right: 16,
            bottom: 156,
            width: 'min(400px, calc(100vw - 32px))',
            height: 'min(600px, calc(100dvh - 180px))',
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 16px 48px rgba(0,0,0,0.3)',
            overflow: 'hidden',
            zIndex: 1199,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {children}
        </div>
      )}
    </>
  )
}
