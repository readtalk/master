// src/app/chat-types.ts
export const DUMMY_USER_MESSAGE = 'Buatin tombol yang rapi buat Next.js'
export const DUMMY_AI_INTRO = 'Siap, ini tombol yang konsisten dan gampang dipakai. Copy aja lalu tempel di project kamu.'
export const DUMMY_AI_CODE = `export default function PrimaryButton() {
  return (
    <button className="primary-button">
      Simpan
    </button>
  )
}`
export const DUMMY_AI_OUTRO = 'Tombol ini pakai satu gaya yang sama di semua halaman, jadi tampilan coding kamu tetap konsisten'
export type Phase = 'thinking' | 'streaming' | 'done'
