import { initializeApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
} from 'firebase/auth'
import firebaseConfig from './firebase-config.js'
import { watchForDbChanges, oneTimeUploadToDb, fetchUser } from '~/services/db'
import { UserState } from '~/appContext'
import { User } from '~/@types/User'

export function initFirebase(): Promise<User | null> {
  console.log('-> initFirebase')
  initializeApp(firebaseConfig)
  return new Promise(resolve => {
    getAuth().onAuthStateChanged(async firebaseUser => {
      if (!firebaseUser) {
        return resolve(null)
      }
      const user = formatUser(firebaseUser)

      resolve(user)
    })
  })
}

export async function signUserWithGoogle(userState: UserState) {
  try {
    const result = await signInWithPopup(getAuth(), new GoogleAuthProvider())
    console.log('-> sign in result:', result)

    userState.user = formatUser(result.user)

    const dbUser = await fetchUser({
      userId: userState.user.id,
    })

    // Create user and initialize its db state
    if (!dbUser) {
      // TODO Get what's in localStorage
      await oneTimeUploadToDb({
        user: userState.user,
        importantPersons: {},
        groups: [],
      })
    }

    watchForDbChanges({
      userId: userState.user.id,
      userState,
    })
  } catch (err) {
    console.log(err)
  }
}

export function signOut() {
  return getAuth().signOut()
}

function formatUser(firebaseUser: FirebaseUser) {
  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || '',
    email: firebaseUser.email || '',
    photoUrl: firebaseUser.photoURL || '',
  }
}
