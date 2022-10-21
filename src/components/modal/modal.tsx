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

  const userState = useContext(AppContext)

  const resetState = $(() => {
    state.personId = ''
    state.name = ''
    userState.clickedPersonId = null
  })

  const closeModal = $(() => {
    document.getElementById('ab-modal')?.click()
  })

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

  const removePerson = $(async () => {
    if (userState.user) {
      const personId = state.personId || crypto.randomUUID()
      await setNewImportantPerson({
        userId: userState.user.id,
        personId,
        personToAddOrUpdate: null,
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
          <form preventdefault:submit onSubmit$={addOrUpdatePerson}>
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

            <div class="modal-action justify-start">
              {state.isEdit && (
                <>
                  <div class="flex-1">
                    <button
                      type="button"
                      class="btn btn-error"
                      onClick$={removePerson}
                    >
                      Remove
                    </button>
                  </div>
                  <label for="ab-modal" class="btn btn-ghost">
                    Cancel
                  </label>
                </>
              )}
              <button type="submit" class="btn btn-primary">
                {state.isEdit ? 'Ok' : 'Add'}
              </button>
            </div>
          </form>
        </label>
      </label>
    </>
  )
})
