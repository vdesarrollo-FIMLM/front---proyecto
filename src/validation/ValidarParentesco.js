// Función de validación de relación y género
export function getRelacionValidada(relacion, genero) {
  const parentesco = relacion.toUpperCase()

  if (parentesco === 'HIJO(A)') {
    return genero === 'M' ? 'HIJO' : 'HIJA'
  }
  if (parentesco === 'ABUELO') {
    return genero === 'M' ? 'ABUELO' : 'ABUELA'
  }
  if (parentesco === 'NIETO(A)') {
    return genero === 'M' ? 'NIETO' : 'NIETA'
  }
  if (parentesco === 'TÍO') {
    return genero === 'M' ? 'TÍO' : 'TÍA'
  }
  if (parentesco === 'SOBRIN(A)') {
    return genero === 'M' ? 'SOBRINO' : 'SOBRINA'
  }
  if (parentesco === 'HERMANO(A)') {
    return genero === 'M' ? 'HERMANO' : 'HERMANA'
  }
  if (parentesco === 'PRIMO(A)') {
    return genero === 'M' ? 'PRIMO' : 'PRIMA'
  }
  if (parentesco === 'ESPOSO') {
    return genero === 'M' ? 'ESPOSO' : 'ESPOSA'
  }
  if (parentesco === 'SUEGRO(A)') {
    return genero === 'M' ? 'SUEGRO' : 'SUEGRA'
  }

  return parentesco
}
