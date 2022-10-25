import {
  $,
  component$,
  noSerialize,
  NoSerialize,
  useClientEffect$,
  useContext,
  useStore,
  useWatch$,
} from '@builder.io/qwik'
import dayjs from 'dayjs'
import MobileSelect from 'mobile-select'
import { setNewImportantPerson } from '~/services/db'
import { AppContext } from '~/appContext'
import { Chip } from '~/components/chip/chip'
import {
  formatDateOfBirth,
  getDateOfBirthFields,
} from '~/helpers/getDateOfBirthFields'

export const Modal = component$(() => {
  const state = useStore<{
    isEdit: boolean
    personId: string
    name: string
    selectedGroups: string[]
    dateOfBirthSelect: NoSerialize<() => MobileSelect | null>
    day?: string
    month?: { label: string; key: string }
    year?: string
    dateOfBirthStr: string
  }>({
    isEdit: false,
    personId: '',
    name: '',
    selectedGroups: [],
    dateOfBirthSelect: undefined,
    day: '',
    month: { label: '', key: '' },
    year: '',
    dateOfBirthStr: '',
  })

  useWatch$(({ track }) => {
    track(state, 'day')
    track(state, 'month')
    track(state, 'year')
    if (!state.day && !state.month?.label && !state.year) {
      state.dateOfBirthStr = ''
      return
    }
    state.dateOfBirthStr = `${Number(state.day) || '-'} ${
      state.month?.label || '-'
    } ${state.year || '-'}`
  })

  const userState = useContext(AppContext)

  const resetState = $(() => {
    userState.clickedPersonId = null
    state.personId = ''
    state.name = ''
    state.selectedGroups = []
    state.dateOfBirthSelect?.()?.locatePosition(0, 0)
    state.dateOfBirthSelect?.()?.locatePosition(1, 0)
    state.dateOfBirthSelect?.()?.locatePosition(2, 91)
    state.day = ''
    state.month = { label: '', key: '' }
    state.year = ''
  })

  const closeModal = $(() => {
    document.getElementById('ab-modal')?.click()
  })

  const months = [
    '',
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  useClientEffect$(() => {
    const days = ['', ...[...Array(30).keys()].map(key => String(key + 1))]
    const lastTwoDigitsYear = Number(String(dayjs().year()).substring(2, 4))
    const years = [
      '',
      ...Array.from(
        { length: 100 + lastTwoDigitsYear + 1 },
        (_, i) => i + 1900
      ),
    ]
    const dateOfBirthSelect = new MobileSelect({
      trigger: document.querySelector('#date-of-birth') as HTMLElement,
      title: 'Date of Birth',
      wheels: [{ data: days }, { data: months }, { data: years }],
      initValue: '',
      ensureBtnText: 'Confirm',
      cancelBtnText: 'Cancel',
      triggerDisplayValue: false,
      onChange: (data, indexArr) => {
        state.day = data[0] as string
        state.month = {
          label: data[1] as string,
          key: String(indexArr[1]),
        }
        state.year = data[2] as string
      },
    })
    state.dateOfBirthSelect = noSerialize(() => dateOfBirthSelect)
    // Set initial year to '1990'
    state.dateOfBirthSelect?.()?.locatePosition(2, 91)
  })

  useClientEffect$(({ track }) => {
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

    const { day, month, year } = getDateOfBirthFields(person.birthday)
    state.day = day
    state.month = month
      ? {
          key: month,
          label: months[Number(month)],
        }
      : undefined
    state.year = year
    state.dateOfBirthSelect?.()?.locatePosition(0, Number(day))
    state.dateOfBirthSelect?.()?.locatePosition(1, Number(month))
    state.dateOfBirthSelect?.()?.locatePosition(2, Number(year) - 1899)

    // --- Selected groups
    state.selectedGroups = person.groups || []
  })

  const isGroupSelected = (groupLabel: string) => {
    return state.selectedGroups.includes(groupLabel)
  }

  const toggleGroup = $((groupLabel: string) => {
    const groupIndex = state.selectedGroups.indexOf(groupLabel)
    if (groupIndex !== -1) {
      state.selectedGroups = state.selectedGroups.filter(
        group => group !== groupLabel
      )
    } else {
      state.selectedGroups = [...state.selectedGroups, groupLabel]
    }
  })

  const addOrUpdatePerson = $(async () => {
    if (userState.user) {
      const personId = state.personId || crypto.randomUUID()
      const birthday = formatDateOfBirth({
        day: state.day,
        monthKey: state.month?.key,
        year: state.year,
      })
      await setNewImportantPerson({
        userId: userState.user.id,
        personId,
        personToAddOrUpdate: {
          id: personId,
          name: state.name,
          birthday,
          groups: state.selectedGroups,
        },
      })
    }
    resetState()
    closeModal()
  })

  const removePerson = $(async () => {
    if (userState.user) {
      await setNewImportantPerson({
        userId: userState.user.id,
        personId: state.personId,
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
            <div class="mt-2">Photo...</div>

            <div class="mt-2">
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

            <div class="mt-3">
              {userState.groups.map(group => (
                <span className="mr-1.5 mb-1.5 inline-block">
                  <Chip
                    color={'sky'}
                    selected={isGroupSelected(group.label)}
                    onClick$={() => toggleGroup(group.label)}
                  >
                    {group.label}
                  </Chip>
                </span>
              ))}
            </div>

            <input
              id="date-of-birth"
              value={state.dateOfBirthStr}
              placeholder="Date of Birth"
              readOnly
              class="input input-bordered mt-2 flex w-full max-w-xs cursor-pointer items-center"
            />

            <div class="modal-action justify-start">
              {state.isEdit ? (
                <>
                  <div class="flex-1">
                    <label for="ab-modal" className="btn btn-ghost">
                      Cancel
                    </label>
                  </div>
                  <button
                    type="button"
                    className="btn btn-error"
                    onClick$={removePerson}
                  >
                    Remove
                  </button>
                </>
              ) : (
                <div class="flex-1">
                  <label for="ab-modal" className="btn btn-ghost">
                    Cancel
                  </label>
                </div>
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
