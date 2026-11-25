// src/app/code-highlight.ts
export function CodeWithHighlight(code: string) {
  const parts = code.split(/(\/\/.*$|\/\*.*?\*\/|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`|\b(?:const|let|return|if|throw|new|async|await|function|export|default|import|from)\b|\b(?:string|number|boolean|Promise)\b|\b(?:true|false|null|undefined)\b|\b\d+(?:\.\d+)?\b)/gm)
  return parts.map((p, i) => {
    if (/^\/\//.test(p) || p.startsWith('/*')) return <span key={i} style={{ color: '#6a737d' }}>{p}</span>
    if (p.startsWith('"') || p.startsWith("'") || p.startsWith('`')) return <span key={i} style={{ color: '#032f62' }}>{p}</span>
    if (/^(const|let|return|if|throw|new|async|await|function|export|default|import|from)$/.test(p))
      return <span key={i} style={{ color: '#d73a49' }}>{p}</span>
    if (/^(string|number|boolean|Promise)$/.test(p))
      return <span key={i} style={{ color: '#6f42c1' }}>{p}</span>
    if (/^(true|false|null|undefined)$/.test(p))
      return <span key={i} style={{ color: '#005cc5' }}>{p}</span>
    if (/^\d/.test(p))
      return <span key={i} style={{ color: '#005cc5' }}>{p}</span>
    return <span key={i}>{p}</span>
  })
}
