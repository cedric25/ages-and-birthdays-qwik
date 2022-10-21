import { $, component$, useContext } from '@builder.io/qwik'
import { AppContext } from '~/appContext'

export default component$(() => {
  const userState = useContext(AppContext)

  const addBirthday = $(() => {
    userState.clickedPersonId = null
  })

  return (
    <div class="dropdown">
      <label tabIndex={0} class="btn btn-ghost btn-circle text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="inline-block h-5 w-5 stroke-current"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      </label>
      <ul
        tabIndex={0}
        class="dropdown-content menu rounded-box menu-compact mt-3 bg-base-100 p-2 shadow"
      >
        <li>
          <label
            for="ab-modal"
            class="modal-button whitespace-nowrap text-lg"
            onClick$={addBirthday}
          >
            <img src="/fa6-solid_plus.svg" alt="icon-plus" />
            Add new birthday <span class="mr-2">🎂</span>
          </label>
        </li>
      </ul>
    </div>
  )
})
