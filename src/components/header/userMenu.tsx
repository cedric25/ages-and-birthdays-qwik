import { component$, $, useContext } from '@builder.io/qwik'
import { AppContext } from '~/appContext'
import * as authService from '~/services/firebase/firebase'

export default component$(() => {
  const userState = useContext(AppContext)

  const signOut = $(() => {
    authService.signOut()
    // TODO Find a way to extract that as a function, and even to extract whole state logic
    // into its own file...
    userState.user = null
    userState.importantPersons = {}
    userState.groups = []
    userState.searchTerm = ''
    userState.selectedGroups = []
  })

  return (
    <div class="dropdown dropdown-end">
      <label tabIndex={0} class="btn btn-ghost btn-circle avatar">
        <div class="w-10 rounded-full border border-white">
          {userState.user && userState.user.photoUrl ? (
            <img
              src={userState.user.photoUrl}
              alt={userState.user.name}
              class="rounded-full -mr-2"
            />
          ) : (
            <div class="flex w-full h-full items-center justify-center text-xl">
              {userState.user && userState.user.name.substring(0, 1)}
            </div>
          )}
        </div>
      </label>
      <ul
        tabIndex={0}
        class="z-[1000] mt-2 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52"
      >
        <li>
          <button type="button" class="hover:bg-sky-100" onClick$={signOut}>
            Sign out
          </button>
        </li>
      </ul>
    </div>
  )
})
