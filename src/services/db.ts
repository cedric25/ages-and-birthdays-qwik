import dayjs from 'dayjs'
import {
  getDatabase,
  ref,
  child,
  get,
  set,
  update,
  onValue,
} from 'firebase/database'
import type { User } from '~/@types/User'
import type { DbPerson, Person } from '~/@types/Person'
import type { DbGroup, Group } from '~/@types/Group'
import { PersonUpdateInput } from '~/@types/Person'
import { UserState } from '~/appContext'

// FOR TESTS
// import dbTestContent from './dbTestContent.json'

export function fetchUser({ userId }: { userId: string }) {
  return get(getUserRef(userId))
}

export async function getUserData(userId: string) {
  const userDataSnapshot = await readUserDataOnce(userId)
  return userDataSnapshot.val()

  // FOR TESTS
  // return {
  //   importantPersons: formatPersonsFromDb(dbTestContent.importantPersons),
  //   groups: formatGroupsFromDb(
  //     dbTestContent.groups,
  //     dbTestContent.importantPersons
  //   ),
  // }
}

export function watchForDbChanges({
  userId,
  userState,
}: {
  userId: string
  userState: UserState
}) {
  // const MIN_LOADING_TIME = 250

  const importantPersonsRef = getImportantPersonsRef(userId)
  onValue(importantPersonsRef, personsSnapshot => {
    console.log('onValue!')
    // appStore.setSyncingDb(true)

    userState.importantPersons = personsSnapshot.val() || {}

    // setTimeout(() => {
    //   appStore.setSyncingDb(false)
    // }, MIN_LOADING_TIME)
  })

  const groupsRef = getGroupsRef(userId)
  onValue(groupsRef, groupsSnapshot => {
    // appStore.setSyncingDb(true)

    userState.groups = groupsSnapshot.val() || []

    // setTimeout(() => {
    //   appStore.setSyncingDb(false)
    // }, MIN_LOADING_TIME)
  })
}

export async function oneTimeUploadToDb({
  user,
  importantPersons,
  groups,
}: {
  user: User
  importantPersons: Record<string, DbPerson>
  groups: string[]
}) {
  console.log('-> oneTimeUploadToDb')
  try {
    await setUserData(user.id, {
      user: {
        ...user,
        createdAt: dayjs().toISOString(),
        countSessions: 1,
      },
      importantPersons,
      groups,
    })
  } catch (err) {
    console.error('Firebase write failed...', err)
    throw err
  }
}

// FOR TESTS
// function formatPersonsFromDb(dbPersons: Record<string, DbPerson>) {
//   const persons = Object.values(dbPersons).reduce((result, person) => {
//     result[person.id] = formatPerson(person, dbPersons)
//     return result
//   }, {} as Record<string, Person>)
//   return persons
// }

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
    user: User & { createdAt: string; countSessions: number }
    importantPersons: Record<string, DbPerson>
    groups: DbGroup[]
  }
) {
  const db = getDatabase()
  return set(ref(db, `users/${userId}`), {
    user,
    importantPersons,
    groups,
  })
}

export function getUserRef(userId: string) {
  const db = getDatabase()
  return ref(db, `users/${userId}/user`)
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
export function setNewImportantPerson({
  userId,
  personId,
  personToAddOrUpdate,
}: {
  userId: string
  personId: string
  personToAddOrUpdate: PersonUpdateInput | null
}) {
  const db = getDatabase()
  if (!personToAddOrUpdate) {
    return set(ref(db, `users/${userId}/importantPersons/${personId}`), null)
  }
  const newPersonForDb = {
    ...personToAddOrUpdate,
    birthday: personToAddOrUpdate.birthday,
    groups: personToAddOrUpdate.groups || null, // Firebase doesn't like undefined?...
  }
  return set(
    ref(db, `users/${userId}/importantPersons/${personId}`),
    newPersonForDb
  )
}
