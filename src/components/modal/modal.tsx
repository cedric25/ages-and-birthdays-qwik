import { $, component$, useContext, useStore } from '@builder.io/qwik'
import { setNewImportantPerson } from '~/services/db'
import { AppContext } from '~/appContext'

export const Modal = component$(() => {
  const state = useStore<{
    name: string
  }>({
    name: '',
  })

  const userState = useContext(AppContext)

  const addPerson = $(async () => {
    console.log('plop', state.name)

    if (userState.user) {
      await setNewImportantPerson({
        userId: userState.user.id,
        personId: crypto.randomUUID(),
        personToAddOrUpdate: {
          name: state.name,
          birthday: '2022-09-26',
        },
      })
    }

    document.getElementById('ab-modal').click()
  })

  return (
    <>
      <input type="checkbox" id="ab-modal" class="modal-toggle" />
      <label class="modal" for="ab-modal">
        <label class="modal-box">
          <div>
            <label for="name"></label>
            <input
              id="name"
              type="text"
              placeholder="Name"
              class="input input-bordered w-full max-w-xs"
              value={state.name}
              onInput$={e =>
                (state.name = (e.target as HTMLInputElement).value)
              }
            />
          </div>

          <div class="modal-action">
            {/*<label for="ab-modal" class="btn btn-primary">*/}
            {/*  Add*/}
            {/*</label>*/}
            <button type="button" class="btn btn-primary" onClick$={addPerson}>
              Add
            </button>
          </div>
        </label>
      </label>
    </>
  )
})
