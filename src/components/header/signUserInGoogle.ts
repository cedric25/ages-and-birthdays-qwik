import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'

export async function signUserInGoogle() {
  try {
    const result = await signInWithPopup(getAuth(), new GoogleAuthProvider())
    console.log('result', result)
  } catch (err) {
    console.log(err)
  }
}
