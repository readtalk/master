'use client'

import { useState } from 'react'
import CodeBlock from './CodeBlock'
import Composer from './Composer'

export default function ChatRoom({ isMobile, onBack, activeId }: {
  isMobile: boolean
  onBack: () => void
  activeId: string
}) {
  const [phase, setPhase] = useState<'thinking' | 'streaming' | 'done'>('done')
  
  // Pindahin semua state dari page.tsx ke sini:
  // streamedIntro, streamedCode, streamedOutro, dll
  
  if (!activeId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <h1 className="text-2xl font-semibold">How can I help you?</h1>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header ala WA */}
      <div className="p-4 border-b bg-white dark:bg-[#222224] flex items-center gap-3">
        {isMobile && (
          <button onClick={onBack} className="md:hidden">←</button>
        )}
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-600">
          A
        </div>
        <span className="font-semibold">AI Dummy</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#e7dfd5] dark:bg-[#1b1b1d]">
        {/* User bubble */}
        <div className="ml-auto w-fit max-w-[78%] bg-[#eff3fe] dark:bg-[#2a2a2e] px-4 py-3 rounded-[18px_18px_4px_18px]">
          Buatin tombol yang rapi buat Next.js
        </div>

        {/* AI bubble */}
        <div className="space-y-2">
          <div className="flex justify-end">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-600">
              A
            </div>
          </div>
          
          <p>Siap, ini tombol yang konsisten dan gampang dipakai.</p>
          
          <CodeBlock code={`export default function PrimaryButton() {
  return (
    <button className="primary-button">
      Simpan
    </button>
  )
}`} />
          
          <p>Tombol ini pakai satu gaya yang sama di semua halaman.</p>
        </div>
      </div>

      {/* Input */}
      <Composer />
    </div>
  )
}
