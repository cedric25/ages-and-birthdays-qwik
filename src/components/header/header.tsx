import { component$, useContext } from '@builder.io/qwik'
import { Link } from '@builder.io/qwik-city'
import { AppContext } from '~/appContext'
import { signUserWithGoogle } from '~/services/firebase/firebase'
import UserMenu from '~/components/header/userMenu'

export default component$(() => {
  const userState = useContext(AppContext)

  return (
    <header class="fixed z-10 flex flex h-top-menu w-full items-center bg-primary pl-5 pr-2">
      <div class="flex-1">
        <Link class="text-xl text-white" href="/">
          Ages & Birthdays
        </Link>
      </div>
      {userState.user ? (
        <UserMenu />
      ) : (
        <div class="tooltip tooltip-bottom mr-3" data-tip="Sign in">
          <button type="button" onClick$={() => signUserWithGoogle(userState)}>
            <img src="/icon-smile.svg" className="w-[25px]" />
          </button>
        </div>
      )}
    </header>
  )
})
