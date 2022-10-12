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
    showFilters: false,
    // FOR TESTS
    // showFilters: true,
  })

  const userState = useContext(AppContext)

  const expandAnimationProps = {
    duration: 300,
    easing: 'ease-out',
  }

  const toggleShowFilters = $(() => {
    const el = document.getElementsByClassName('filters-wrap')[0]
    // Expand
    if (!state.showFilters) {
      const expandAnimation = el.animate(
        {
          height: ['0px', '200px'],
        },
        expandAnimationProps
      )
      expandAnimation.onfinish = () => {
        ;(el as HTMLElement).style.height = '200px'
      }
    }
    // Collapse
    else {
      const collapseAnimation = el.animate(
        {
          height: ['200px', '0px'],
        },
        expandAnimationProps
      )
      collapseAnimation.onfinish = () => {
        ;(el as HTMLElement).style.height = '0px'
      }
    }

    state.showFilters = !state.showFilters
  })

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
    <>
      <div class="m-2 mb-0 text-center">
        <button
          class={`h-12 rounded-lg px-3 tracking-wide h-10 transition-all ${
            state.showFilters ? 'bg-gray-200 w-[72px]' : 'bg-sky-200 w-full'
          }`}
          onClick$={toggleShowFilters}
        >
          {state.showFilters ? 'Close' : 'Filters'}
        </button>
      </div>
      <div
        class={`h-0 overflow-hidden filters-wrap w-full ${
          state.showFilters ? 'border-b border-b-primary' : ''
        }`}
      >
        <div class="p-3 flex flex-col gap-3">
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
        </div>
      </div>
    </>
  )
})
