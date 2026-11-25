'use client'

import { useState } from 'react'
import { Copy, Download } from '@phosphor-icons/react'

type Props = {
  code: string
  lang?: string
}

function highlightCode(code: string) {
  const parts = code.split(/(\/\/.*|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|\b(?:const|let|return|if|throw|new|async|await|function|export|default|import|from)\b|\b(?:string|number|boolean|Promise)\b)/g)
  return parts.map((p, i) => {
    if (/^(const|let|return|if|throw|new|async|await|function|export|default|import|from)$/.test(p))
      return <span key={i} style={{ color: '#c678dd' }}>{p}</span>
    if (p.startsWith("'") || p.startsWith('`') || p.startsWith('//'))
      return <span key={i} style={{ color: '#98c379' }}>{p}</span>
    if (/^(string|number|boolean|Promise)$/.test(p))
      return <span key={i} style={{ color: '#61afef' }}>{p}</span>
    if (/^(PrimaryButton|button)$/.test(p))
      return <span key={i} style={{ color: '#e5c07b' }}>{p}</span>
    return <span key={i}>{p}</span>
  })
}

export default function CodeBlock({ code, lang = 'tsx' }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `code.${lang}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="my-3 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-gray-50 dark:bg-[#1b1b1d]">
      <div className="flex justify-between items-center px-3 py-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[#222224]">
        <span>{lang}</span>
        <div className="flex gap-2">
          <button 
            onClick={handleCopy}
            className="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            {copied ? 'Copied' : <><Copy size={14} className="inline mr-1" />Copy</>}
          </button>
          <button 
            onClick={handleDownload}
            className="px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <Download size={14} className="inline mr-1" />Download
          </button>
        </div>
      </div>
      <pre className="m-0 p-4 overflow-x-auto text-sm leading-6 font-mono whitespace-pre">
        {highlightCode(code)}
      </pre>
    </div>
  )
}
