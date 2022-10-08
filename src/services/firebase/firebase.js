import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import firebaseConfig from './firebase-config'
import * as db from '../db'

export function initFirebase() {
  console.log('-> initFirebase')
  initializeApp(firebaseConfig)
  return new Promise(resolve => {
    getAuth().onAuthStateChanged(firebaseUser => {
      if (!firebaseUser) {
        return resolve(null)
      }
      const user = {
        id: firebaseUser.uid,
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        photoUrl: firebaseUser.photoURL,
      }

      resolve(user)
    })
  })
}

async function signInDone(user) {
  const userDataSnapshot = await db.readUserDataOnce(user.id)
  const userData = userDataSnapshot.val()
  console.log('userData', userData)
}
