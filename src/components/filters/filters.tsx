import { $, component$, mutable, useContext, useStore } from '@builder.io/qwik'
import { AppContext, UserState } from '~/root'
import { Chip } from '~/components/chip/chip'
import Search from '~/components/filters/search'

type State = {
  showFilters: boolean
}

export function isGroupSelected(groupLabel: string, userState: UserState) {
  return userState.selectedGroups.indexOf(groupLabel) !== -1
}

export default component$(() => {
  const state = useStore<State>({
    // showFilters: false,
    // FOR TESTS
    showFilters: true,
  })

  const userState = useContext(AppContext)

  const toggleGroup = $((groupLabel: string) => {
    if (userState.selectedGroups.indexOf(groupLabel) !== -1) {
      userState.selectedGroups = userState.selectedGroups.filter(group => {
        return group !== groupLabel
      })
    } else {
      userState.selectedGroups = [...userState.selectedGroups, groupLabel]
    }
  })

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
          <Search />
          <div>
            {userState.groups.map(group => (
              <span class="inline-block mr-1.5 mb-1.5">
                <Chip
                  color={'sky'}
                  count={group.count}
                  selected={mutable(isGroupSelected(group.label, userState))}
                  onClick$={() => {
                    toggleGroup(group.label)
                  }}
                >
                  {group.label}
                </Chip>
              </span>
            ))}
          </div>
          <div class="text-center -mt-1.5">
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
