// ** Ability Context
import { createContext } from 'react'
import { createMongoAbility } from '@casl/ability'

export const AbilityContext = createContext(undefined)

// 🔥 TEMPORAL: Crear una habilidad que permita todo
export const buildAbilityFor = user => {
  return createMongoAbility([{ action: 'manage', subject: 'all' }])
}

// 🔥 TEMPORAL: Exportar un objeto de permisos por defecto
export const defaultACLObj = {
  action: 'manage',
  subject: 'all'
}

/* CÓDIGO ORIGINAL COMENTADO
export const defineRulesFor = (user, subject) => {
  const { can, rules } = createMongoAbility()
  
  if (user && user.role === 'admin') {
    can('manage', 'all')
  } else {
    if (user && user.permissions && user.permissions.length > 0) {
      can(user.permissions, 'all')
    }
  }
  
  return rules
}

export const buildAbilityFor = user => {
  return createMongoAbility(defineRulesFor(user))
}

export const defaultACLObj = {
  action: 'read',
  subject: 'all'
}
*/