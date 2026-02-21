const MAX_FONT_SIZE_PX = 14

export function limpiarHTMLPegado(html) {
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html

  // Reemplazar encabezados por párrafos
  for (let i = 1; i <= 5; i++) {
    const headers = tempDiv.querySelectorAll(`h${i}`)
    headers.forEach(h => {
      const p = document.createElement('p')
      p.innerHTML = h.innerHTML
      h.replaceWith(p)
    })
  }

  // Limitar font-size en cualquier unidad
  const elements = tempDiv.querySelectorAll('[style]')
  elements.forEach(el => {
    const style = el.getAttribute('style')
    let updatedStyle = style.replace(/font-size:\s*(\d+(?:\.\d+)?)(px|pt|em|rem|%)?/gi, (match, value, unit) => {
      let sizePx = parseFloat(value)
      unit = unit?.toLowerCase() || 'px'

      switch (unit) {
        case 'pt':
          sizePx = sizePx * 1.33 // aproximado
          break
        case 'em':
        case 'rem':
          sizePx = sizePx * 16 // asumiendo 1em = 16px
          break
        case '%':
          sizePx = (sizePx / 100) * 16 // 100% = 16px
          break
        // 'px' u otros: se dejan igual
      }

      return sizePx > MAX_FONT_SIZE_PX ? `font-size: ${MAX_FONT_SIZE_PX}px` : match
    })

    el.setAttribute('style', updatedStyle)
  })

  return tempDiv.innerHTML
}
