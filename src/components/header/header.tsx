import { component$ } from '@builder.io/qwik'
import { Link } from '@builder.io/qwik-city'
import { signUserInGoogle } from './signUserInGoogle'

export default component$(() => {
  return (
    <header class="bg-primary px-5 flex fixed w-full h-top-menu flex items-center">
      <Link class="flex-1 text-white text-xl" href="/">
        Ages & Birthdays
      </Link>
      <button
        type="button"
        onClick$={() => {
          signUserInGoogle()
        }}
      >
        <img src="/icon-smile.svg" class="w-[25px]" />
      </button>
    </header>
  )
})
