'use client'

import { useState} from 'react'
import { ArrowUp, Atom, Globe, Microphone, Paperclip} from '@phosphor-icons/react'

type Props = {
onSend?: (msg: string) => void
}

export default function Composer({ onSend}: Props) {
const [inputValue, setInputValue] = useState('')
const [deepThink, setDeepThink] = useState(false)
const [searchEnabled, setSearchEnabled] = useState(false)

const handleSend = () => {
if (!inputValue.trim()) return
onSend?.(inputValue)
setInputValue('')
}

return (
<div className="p-3 border-t bg-white dark:bg-[#222224]">
<div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-3 bg-white dark:bg-[#222224] shadow-lg">
<textarea
className="w-full border-0 outline-none bg-transparent text-base resize-none font-inherit"
rows={2}
placeholder="Enter a message"
value={inputValue}
onChange={(e) => setInputValue(e.target.value)}
onKeyDown={(e) => {
if (e.key === 'Enter' && !e.shiftKey) {
e.preventDefault()
handleSend()
}
}}
/>
<div className="flex gap-2 mt-2 flex-wrap items-center">
<button
className={`inline-flex items-center gap-1 border rounded-full px-3 py-1 text-sm ${deepThink? 'bg-blue-100 border-blue-300 text-blue-600': 'bg-white border-gray-200'}`}
onClick={() => setDeepThink(!deepThink)}
>
<Atom size={16} /> Brain
</button>
<button
className={`inline-flex items-center gap-1 border rounded-full px-3 py-1 text-sm ${searchEnabled? 'bg-blue-100 border-blue-300 text-blue-600': 'bg-white border-gray-200'}`}
onClick={() => setSearchEnabled(!searchEnabled)}
>
<Globe size={16} /> Search
</button>
<div className="ml-auto flex gap-1 items-center">
<button className="w-9 h-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center">
<Microphone size={20} />
</button>
<button className="w-9 h-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center">
<Paperclip size={20} />
</button>
<button
disabled={!inputValue.trim()}
onClick={handleSend}
className="w-10 h-10 rounded-full bg-blue-400 text-white disabled:opacity-60 flex items-center justify-center"
>
<ArrowUp size={20} weight="bold" />
</button>
</div>
</div>
</div>
<p className="text-xs text-gray-500 text-center mt-2">
AI-generated, for reference only
</p>
</div>
)
}
