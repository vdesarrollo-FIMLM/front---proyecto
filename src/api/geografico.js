import { useState, useEffect } from 'react'

import Api from 'src/configs/axios'

export async function getPaises() {
  const token = window.localStorage.getItem('accessToken')
  try {
    let config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
    const response = await Api.get('geografico/paises', config)

    return response.data.labels
  } catch (error) {
    console.error(error)
    throw new Error('Error al obtener paises')
  }
}

export async function getDeps(selectPais) {
  const token = window.localStorage.getItem('accessToken')
  try {
    let config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }

    const response = await Api.get(`geografico/departamentos`, {
      params: { pais: selectPais },
      ...config
    })

    return response.data.labels
  } catch (error) {
    console.error(error)
    throw new Error('Error al obtener departamentos')
  }
}

export async function getMunicip(selectPais, selectDepto) {
  const token = window.localStorage.getItem('accessToken')
  try {
    let config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }

    const response = await Api.get(`geografico/municipios`, {
      params: { pais: selectPais, depto: selectDepto },
      ...config
    })

    return response.data.labels
  } catch (error) {
    console.error(error)
    throw new Error('Error al obtener municipios')
  }
}

export async function getPaisesNew() {
  const token = window.localStorage.getItem('accessToken')
  try {
    let config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
    const response = await Api.get('geografico/paises_new', { ...config })

    return response.data
  } catch (error) {
    // console.error(error)
    return []

    // throw new Error('Error al obtener paises')
  }
}

export async function getDepsNew(selectPais) {
  const token = window.localStorage.getItem('accessToken')
  try {
    let config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }

    const response = await Api.get(`geografico/departamentos_new`, {
      params: { pais: selectPais },
      ...config
    })

    return response.data
  } catch (error) {
    // console.error(error)
    return []

    // throw new Error('Error al obtener paises')
  }
}

export async function getMunicipNew(selectPais, selectDepto) {
  const token = window.localStorage.getItem('accessToken')
  try {
    let config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }

    const response = await Api.get(`geografico/municipios_new`, {
      params: { pais: selectPais, depto: selectDepto },
      ...config
    })

    return response.data
  } catch (error) {
    // console.error(error)
    return []

    // throw new Error('Error al obtener paises')
  }
}

export async function getIndicativos() {
  const token = window.localStorage.getItem('accessToken')
  try {
    let config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }

    const response = await Api.get('geografico/indicativos', config)

    return response.data
  } catch (error) {
    console.error(error)

    return []

    // throw new Error('Error al obtener indicativos')
  }
}

// TODOS // FUNCIÓN CASCADA
const useLocalizacionFields = (formik, locationField) => {
  const [paises, setPaises] = useState([])
  const [departamentos, setDepartamentos] = useState([])
  const [municipios, setMunicipios] = useState([])

  useEffect(() => {
    fetchPaises()
  }, [])

  const fetchPaises = async () => {
    try {
      const opcionesPaises = await getPaises()
      setPaises(opcionesPaises)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (formik.values[locationField].pais != '' && formik.values[locationField].pais != undefined) {
      fetchDepartamentos()
    }
  }, [formik.values[locationField].pais])

  const fetchDepartamentos = async () => {
    try {
      const deps = await getDeps(formik.values[locationField].pais)
      setDepartamentos(deps)
      setMunicipios([])
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (formik.values[locationField].departamento != '' && formik.values[locationField].departamento != undefined) {
      fetchMunicipios()
    }
  }, [formik.values[locationField].departamento])

  const fetchMunicipios = async () => {
    try {
      const municips = await getMunicip(formik.values[locationField].pais, formik.values[locationField].departamento)
      setMunicipios(municips)
    } catch (error) {
      console.error(error)
    }
  }

  return {
    paises,
    departamentos,
    municipios
  }
}

export default useLocalizacionFields
