import { component$, useContext } from '@builder.io/qwik'
import { Link } from '@builder.io/qwik-city'
import { AppContext } from '~/root'
import { signUserInGoogle } from './signUserInGoogle'

export default component$(() => {
  const userState = useContext(AppContext)

  return (
    <header class="bg-primary px-5 flex fixed w-full h-top-menu flex items-center">
      <Link class="flex-1 text-white text-xl" href="/">
        Ages & Birthdays
      </Link>
      {userState.user ? (
        <button
          type="button"
          class="flex border border-white rounded-full"
          style="width: 36px; height: 36px"
        >
          {userState.user.photoUrl ? (
            <img
              src={userState.user.photoUrl}
              alt={userState.user.name}
              class="rounded-full"
            />
          ) : (
            <div className="flex w-full h-full items-center justify-center text-xl">
              {userState.user.name.substring(0, 1)}
            </div>
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick$={() => {
            signUserInGoogle()
          }}
        >
          <img src="/icon-smile.svg" className="w-[25px]" />
        </button>
      )}
    </header>
  )
})
