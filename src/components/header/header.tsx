import { component$, useContext } from '@builder.io/qwik'
import { Link } from '@builder.io/qwik-city'
import { AppContext } from '~/appContext'
import { signUserWithGoogle } from '~/services/firebase/firebase'
import UserMenu from '~/components/header/userMenu'

export default component$(() => {
  const userState = useContext(AppContext)

  return (
    <header class="bg-primary pl-5 pr-2 flex fixed w-full h-top-menu flex items-center z-10">
      <div class="flex-1">
        <Link class="text-white text-xl" href="/">
          Ages & Birthdays
        </Link>
      </div>
      {userState.user ? (
        <UserMenu />
      ) : (
        <button
          type="button"
          class="mr-3"
          onClick$={() => signUserWithGoogle(userState)}
        >
          <img src="/icon-smile.svg" className="w-[25px]" />
        </button>
      )}
    </header>
  )
})
