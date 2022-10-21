import { $, component$, useContext } from '@builder.io/qwik'
import { Link } from '@builder.io/qwik-city'
import { AppContext } from '~/appContext'
import { signUserWithGoogle } from '~/services/firebase/firebase'
import UserMenu from '~/components/header/userMenu'
import TopLeftMenu from '~/components/topLeftMenu/topLeftMenu'

export default component$(() => {
  const userState = useContext(AppContext)

  return (
    <div class="navbar bg-primary">
      <div class="flex-none">
        <TopLeftMenu />
      </div>
      <div class="flex-1">
        <Link href="/" class="btn btn-ghost text-xl normal-case text-white">
          Ages & Birthdays
        </Link>
      </div>
      <div class="flex-none">
        {userState.user ? (
          <UserMenu />
        ) : (
          <div class="tooltip tooltip-bottom mr-3 flex" data-tip="Sign in">
            <button
              type="button"
              onClick$={() => signUserWithGoogle(userState)}
            >
              <img src="/icon-smile.svg" class="w-[25px]" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
})
