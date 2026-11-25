// Tiny highlighter, no new dependency. Good enough to test code render.
export function highlightCode(code: string) {
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
