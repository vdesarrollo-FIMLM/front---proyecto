import { AbilityBuilder, Ability } from '@casl/ability'

export const AppAbility = Ability

/**
 * Please define your own Ability rules according to your app requirements.
 * We have just shown Admin and Client rules for demo purpose where
 * admin can manage everything and client can just visit ACL page
 */
const defineRulesFor = (user, subject) => {
  const { can, rules } = new AbilityBuilder(AppAbility)
  if (user.role.includes('all')) {
    can('manage', 'all')
  } else {
    if (user.permissions.length > 0) {
      can(user.permissions, 'all')
    }
  }

  return rules
}

export const buildAbilityFor = (user, subject) => {
  return new AppAbility(defineRulesFor(user, subject), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    // @ts-ignore
    detectSubjectType: object => object.type
  })
}

export const defaultACLObj = {
  action: 'manage',
  subject: 'all'
}

export default defineRulesFor
