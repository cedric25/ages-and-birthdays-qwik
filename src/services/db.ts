import dayjs from 'dayjs'
import { getDatabase, ref, child, get, set, update } from 'firebase/database'
import type { User } from '~/@types/User'
import type { DbPerson, Person } from '~/@types/Person'
import type { Group } from '~/@types/Group'
import { YEAR_FOR_NO_YEAR } from '~/constants/constants'
import { getDaysUntilBirthday } from '~/helpers/daysUntilBirthday'
import { computeAge } from '~/helpers/computeAge'
import { isBaby } from '~/helpers/isBaby'

// FOR TESTS
import dbTestContent from './dbTestContent.json'

export async function getUserData(userId: string) {
  // const userDataSnapshot = await readUserDataOnce(userId)
  // return userDataSnapshot.val()

  // FOR TESTS
  return {
    importantPersons: formatPersonsFromDb(dbTestContent.importantPersons),
    groups: formatGroupsFromDb(
      dbTestContent.groups,
      dbTestContent.importantPersons
    ),
  }
}

function formatPersonsFromDb(dbPersons: Record<string, DbPerson>) {
  const persons = Object.values(dbPersons).reduce((result, person) => {
    result[person.id] = formatPerson(person, dbPersons)
    return result
  }, {} as Record<string, Person>)
  return persons
}

function formatPerson(person: DbPerson, dbPersons: Record<string, DbPerson>) {
  const age = computeAge(person.birthday)
  return {
    ...person,
    // Until everything is string in db
    birthday: getBirthdayFromIsoDate(person.birthday),
    age,
    daysUntilBirthday: getDaysUntilBirthday(person.birthday),
    isBaby: isBaby(age),
    children: lookForChildren(person.name, dbPersons),
  }
}

function lookForChildren(
  personName: string,
  dbPersons: Record<string, DbPerson>
): Person[] {
  const children = []
  for (const person of Object.values(dbPersons)) {
    if (person.parentOne === personName || person.parentTwo === personName) {
      children.push(formatPerson(person, dbPersons))
    }
  }
  return children.sort((kidOne, kidTwo) => {
    if (kidOne.birthday === kidTwo.birthday) {
      return kidOne.name.localeCompare(kidTwo.name)
    }
    if (kidOne.birthday.length !== 10 || kidTwo.birthday.length !== 10) {
      return kidOne.name.localeCompare(kidTwo.name)
    }
    return dayjs(kidOne.birthday).unix() < dayjs(kidTwo.birthday).unix()
      ? -1
      : 1
  })
}

function formatGroupsFromDb(
  groups: string[],
  persons: Record<string, DbPerson>
) {
  return groups.map(groupLabel => ({
    label: groupLabel,
    count: Object.values(persons).filter(
      person => person.groups && person.groups.includes(groupLabel)
    ).length,
  }))
}

function getBirthdayFromIsoDate(birthday: string) {
  const year = birthday.substring(0, 4)
  if (year === String(YEAR_FOR_NO_YEAR)) {
    return birthday.substring(5, 10)
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
// export function setNewImportantPerson(
//   userId: string,
//   personId: string,
//   personToAddOrUpdate: Person | null
// ) {
//   const db = getDatabase()
//   if (!personToAddOrUpdate) {
//     return set(ref(db, `users/${userId}/importantPersons/${personId}`), null)
//   }
//   const newPersonForDb = {
//     ...personToAddOrUpdate,
//     birthday: personToAddOrUpdate.birthday.toISOString(),
//     groups: personToAddOrUpdate.groups || null, // Firebase doesn't like undefined?...
//   }
//   return set(
//     ref(db, `users/${userId}/importantPersons/${personId}`),
//     newPersonForDb
//   )
// }
