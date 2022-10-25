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
import { formatPerson } from '~/helpers/formatPerson'
import { formatGroups } from '~/helpers/formatGroups'

export async function fetchUser({ userId }: { userId: string }) {
  const dbRef = ref(getDatabase())
  const userDataSnapshot = await get(child(dbRef, `users/${userId}`))
  return userDataSnapshot.val()
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
    // appStore.setSyncingDb(true)

    const dbPersons: Record<string, DbPerson> = personsSnapshot.val()

    if (!dbPersons) {
      userState.importantPersons = {}
      return
    }

    userState.importantPersons = Object.values(dbPersons).reduce(
      (result: Record<string, Person>, dbPerson: DbPerson) => {
        result[dbPerson.id] = formatPerson(dbPerson, dbPersons)
        return result
      },
      {}
    )

    // setTimeout(() => {
    //   appStore.setSyncingDb(false)
    // }, MIN_LOADING_TIME)
  })

  const groupsRef = getGroupsRef(userId)
  onValue(groupsRef, groupsSnapshot => {
    // appStore.setSyncingDb(true)

    const dbGroups: string[] = groupsSnapshot.val()

    if (!dbGroups) {
      userState.groups = []
      return
    }

    userState.groups = formatGroups({ dbGroups, dbPersons: {} })

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

export function updateUserLastSeenAt(userId: string) {
  const db = getDatabase()
  return update(ref(db, `users/${userId}/user`), {
    '/lastSeenAt': new Date(),
  })
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
