

export const COLOR_COMPLETADO_FORMULARIO = valor => {
  if (valor < 30) {
    return 'error'
  } else if (valor > 30 && valor <= 60) {
    return 'warning'
  } else if (valor > 61 && valor <= 99) {
    return 'info'
  } else if (valor == 100) {
    return 'success'
  } else {
    return 'error'
  }
}