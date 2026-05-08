export const generarCombinacionNombres = (nombre_1, nombre_2, apellido_1, apellido_2, genero) => {
  const combinacionNombres = []
  if (nombre_1 !== '' && apellido_1 !== '') {
    combinacionNombres.push(nombre_1 + ' ' + apellido_1)
  }
  if (nombre_1 !== '' && apellido_2 !== '') {
    combinacionNombres.push(nombre_1 + ' ' + apellido_2)
  }
  if (nombre_2 !== '' && apellido_1 !== '') {
    combinacionNombres.push(nombre_2 + ' ' + apellido_1)
  }
  if (nombre_2 !== '' && apellido_2 !== '') {
    combinacionNombres.push(nombre_2 + ' ' + apellido_2)
  }
  if (nombre_1 && nombre_2 && apellido_1) {
    combinacionNombres.push(nombre_1 + ' ' + nombre_2 + ' ' + apellido_1)
  }
  if (nombre_1 && nombre_2 && apellido_2) {
    combinacionNombres.push(nombre_1 + ' ' + nombre_2 + ' ' + apellido_2)
  }

  //console.log("🚀 ~ file: InformacionPersonal.js:156 ~ generarCombinacionNombres ~ combinacionNombres:", combinacionNombres)
  return combinacionNombres
}
