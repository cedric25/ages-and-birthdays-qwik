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
    name: string
  }>({
    name: '',
  })

  const resetState = $(() => {
    state.name = ''
  })

  const closeModal = $(() => {
    document.getElementById('ab-modal').click()
  })

  const userState = useContext(AppContext)

  useWatch$(({ track }) => {
    track(userState, 'clickedPersonId')
    console.log('watch | userState.clickedPersonId', userState.clickedPersonId)
    if (!userState.clickedPersonId) {
      resetState()
      return
    }
    const person = userState.importantPersons[userState.clickedPersonId]
    state.name = person.name
  })

  const addPerson = $(async () => {
    console.log('plop', state.name)

    if (userState.user) {
      const personId = crypto.randomUUID()
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
