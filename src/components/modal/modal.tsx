import {
  $,
  component$,
  useContext,
  useStore,
  useWatch$,
} from '@builder.io/qwik'
import { setNewImportantPerson } from '~/services/db'
import { AppContext } from '~/appContext'

export const Modal = component$(() => {
  const state = useStore<{
    isEdit: boolean
    personId: string
    name: string
  }>({
    isEdit: false,
    personId: '',
    name: '',
  })

  const resetState = $(() => {
    state.name = ''
  })

  const closeModal = $(() => {
    document.getElementById('ab-modal')?.click()
  })

  const userState = useContext(AppContext)

  useWatch$(({ track }) => {
    track(userState, 'clickedPersonId')
    if (!userState.clickedPersonId) {
      state.isEdit = false
      resetState()
      return
    }
    state.isEdit = true
    const person = userState.importantPersons[userState.clickedPersonId]
    state.personId = person.id
    state.name = person.name
  })

  const addOrUpdatePerson = $(async () => {
    console.log('plop', state.name)

    if (userState.user) {
      const personId = state.personId || crypto.randomUUID()
      await setNewImportantPerson({
        userId: userState.user.id,
        personId,
        personToAddOrUpdate: {
          id: personId,
          name: state.name,
          birthday: '2022-09-26',
        },
      })
    }

    resetState()

    closeModal()
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
            {state.isEdit && (
              <label for="ab-modal" class="btn btn-ghost">
                Cancel
              </label>
            )}
            <button
              type="button"
              class="btn btn-primary"
              onClick$={addOrUpdatePerson}
            >
              {state.isEdit ? 'Ok' : 'Add'}
            </button>
          </div>
        </label>
      </label>
    </>
  )
})
