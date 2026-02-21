import React from 'react'
import Error401 from 'src/pages/401'

const NoAutorizado = () => {
  return <Error401 />
}

NoAutorizado.acl = {
  action: 'home-ver'
}
export default NoAutorizado
