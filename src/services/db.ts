import { getDatabase, ref, child, get, set, update } from 'firebase/database'
import type { User } from '~/@types/User'
import type { Person } from '~/@types/Person'
import type { Group } from '~/@types/Group'
// FOR TESTS
import dbTestContent from './dbTestContent.json'
import { YEAR_FOR_NO_YEAR } from '~/constants/constants'

export async function getUserData(userId: string) {
  // const userDataSnapshot = await readUserDataOnce(userId)
  // return userDataSnapshot.val()

  // FOR TESTS
  return {
    importantPersons: formatFromDb(dbTestContent.importantPersons),
    groups: dbTestContent.groups,
  }
}

function formatFromDb(persons: Record<string, Person>) {
  return Object.values(persons).reduce((result, person) => {
    result[person.id] = {
      ...person,
      // Until everything is string in db
      birthday: getBirthdayFromIsoDate(person.birthday),
    }
    return result
  }, {} as Record<string, Person>)
}

function getBirthdayFromIsoDate(birthday: string) {
  const year = birthday.substring(0, 4)
  if (year === String(YEAR_FOR_NO_YEAR)) {
    return birthday.substring(5, 5)
  }
  return birthday.substring(0, 10)
}

export function readUserDataOnce(userId: string) {
  const dbRef = ref(getDatabase())
  return get(child(dbRef, `users/${userId}`))
}

export function updateUserLastSeenAt(userId: string) {
  const db = getDatabase()
  return update(ref(db, `users/${userId}/user`), {
    '/lastSeenAt': new Date(),
  })
}

export function setImportantPersons(
  userId: string,
  importantPersons: Person[]
) {
  const db = getDatabase()
  return set(ref(db, `users/${userId}/importantPersons`), importantPersons)
}

export function setGroups(userId: string, groups: Group[]) {
  const db = getDatabase()
  return set(ref(db, `users/${userId}/groups`), groups)
}

export function setUserData(
  userId: string,
  {
    user,
    importantPersons,
    groups,
  }: {
    user: User & { createdAt: string }
    importantPersons: Person[]
    groups: Group[]
  }
) {
  const db = getDatabase()
  return set(ref(db, `users/${userId}`), {
    user,
    importantPersons,
    groups,
  })
}

export function getImportantPersonsRef(userId: string) {
  const db = getDatabase()
  return ref(db, `users/${userId}/importantPersons`)
}

export function getGroupsRef(userId: string) {
  const db = getDatabase()
  return ref(db, `users/${userId}/groups`)
}

// To add / update / remove a Firebase important person
export function setNewImportantPerson(
  userId: string,
  personId: string,
  personToAddOrUpdate: Person | null
) {
  const db = getDatabase()
  if (!personToAddOrUpdate) {
    return set(ref(db, `users/${userId}/importantPersons/${personId}`), null)
  }
  const newPersonForDb = {
    ...personToAddOrUpdate,
    birthday: personToAddOrUpdate.birthday.toISOString(),
    groups: personToAddOrUpdate.groups || null, // Firebase doesn't like undefined?...
  }
  return set(
    ref(db, `users/${userId}/importantPersons/${personId}`),
    newPersonForDb
  )
}
