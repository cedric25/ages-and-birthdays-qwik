import { component$, mutable, useContext, useStore } from '@builder.io/qwik'
import { Chip } from '~/components/chip/chip'
import { AppContext, UserState } from '~/root'

type State = {
  showFilters: boolean
}

export function toggleGroup(groupLabel: string, userState: UserState) {
  if (userState.selectedGroups.indexOf(groupLabel) !== -1) {
    userState.selectedGroups = userState.selectedGroups.filter(group => {
      return group !== groupLabel
    })
  } else {
    userState.selectedGroups = [...userState.selectedGroups, groupLabel]
  }
}

export function isGroupSelected(groupLabel: string, userState: UserState) {
  return userState.selectedGroups.indexOf(groupLabel) !== -1
}

export default component$(() => {
  const state = useStore<State>({
    // showFilters: false,
    showFilters: true,
  })

  const userState = useContext(AppContext)

  return (
    <div class="w-full flex">
      {!state.showFilters ? (
        <button
          class="m-2 flex-1 rounded-lg bg-sky-200 tracking-wide h-top-filters"
          onClick$={() => {
            state.showFilters = true
          }}
        >
          Filters
        </button>
      ) : (
        <div class="p-3 flex flex-col gap-3 w-full border-b border-b-primary">
          <input
            placeholder="Search..."
            class="border py-1 rounded-lg px-2 w-full"
          />
          <div>
            {userState.groups.map(group => (
              <span class="inline-block mr-1.5 mb-1.5">
                <Chip
                  color={'sky'}
                  count={group.count}
                  selected={mutable(isGroupSelected(group.label, userState))}
                  onClick$={() => {
                    toggleGroup(group.label, userState)
                    // userState.selectedGroups = ['Toto']
                  }}
                >
                  {group.label}
                </Chip>
              </span>
            ))}
          </div>
          {/*<div>Sort by upcoming birthday</div>*/}
          <div class="text-center">
            <button
              class="rounded-md px-3 py-1 bg-sky-200"
              onClick$={() => {
                state.showFilters = false
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
})
