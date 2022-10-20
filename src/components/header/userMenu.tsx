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
      <label tabIndex={0} class="avatar btn btn-ghost btn-circle">
        <div class="w-10 rounded-full border border-white">
          {userState.user && userState.user.photoUrl ? (
            <img
              src={userState.user.photoUrl}
              alt={userState.user.name}
              class="-mr-2 rounded-full"
            />
          ) : (
            <div class="flex h-full w-full items-center justify-center text-xl">
              {userState.user && userState.user.name.substring(0, 1)}
            </div>
          )}
        </div>
      </label>
      <ul
        tabIndex={0}
        class="dropdown-content menu rounded-box menu-compact z-[1000] mt-2 w-52 bg-base-100 p-2 shadow"
      >
        <li>
          <button type="button" onClick$={signOut}>
            <img src="/fa6-solid_arrow-right-from-bracket.svg" />
            Sign out
          </button>
        </li>
      </ul>
    </div>
  )
})
