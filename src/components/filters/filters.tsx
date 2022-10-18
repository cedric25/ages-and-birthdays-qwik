import {
  $,
  component$,
  mutable,
  useClientEffect$,
  useContext,
  useStore,
  useWatch$,
} from '@builder.io/qwik'
import { AppContext, UserState } from '~/appContext'
import { Chip } from '~/components/chip/chip'
import Search from '~/components/filters/search'

export function isGroupSelected(groupLabel: string, userState: UserState) {
  return userState.selectedGroups.indexOf(groupLabel) !== -1
}

export default component$(() => {
  const state = useStore<{
    isLoaded: boolean
    showFilters: boolean
    hasActiveFilters: boolean
    filtersWrapHeight: number | null
  }>({
    isLoaded: false,
    showFilters: true,
    hasActiveFilters: false,
    filtersWrapHeight: null,
  })

  const userState = useContext(AppContext)

  useWatch$(({ track }) => {
    track(userState, 'selectedGroups')
    track(userState, 'searchTerm')
    state.hasActiveFilters =
      !!userState.selectedGroups.length || !!userState.searchTerm
  })

  const expandAnimationProps = {
    duration: 300,
    easing: 'ease-out',
  }

  const expandFilters = $((filtersWrapElement: HTMLElement) => {
    const expandAnimation = filtersWrapElement.animate(
      {
        height: ['0px', `${state.filtersWrapHeight}px`],
      },
      expandAnimationProps
    )
    expandAnimation.onfinish = () => {
      ;(
        filtersWrapElement as HTMLElement
      ).style.height = `${state.filtersWrapHeight}px`
    }

    state.showFilters = true
  })

  const collapseFilters = $((filtersWrapElement: HTMLElement) => {
    const collapseAnimation = filtersWrapElement.animate(
      {
        height: [`${state.filtersWrapHeight}px`, '0px'],
      },
      expandAnimationProps
    )
    collapseAnimation.onfinish = () => {
      ;(filtersWrapElement as HTMLElement).style.height = '0px'
    }

    state.showFilters = false
  })

  const toggleShowFilters = $(() => {
    const filtersWrapElement = document.getElementsByClassName(
      'filters-wrap'
    )[0] as HTMLElement
    // Expand
    if (!state.showFilters) {
      expandFilters(filtersWrapElement)
    }
    // Collapse
    else {
      collapseFilters(filtersWrapElement)
    }
  })

  // On user groups loaded, calculate height of filters block
  useClientEffect$(async ({ track }) => {
    track(userState, 'groups')
    const filtersWrapElement = document.getElementsByClassName(
      'filters-wrap'
    )[0] as HTMLElement
    if (!state.showFilters) {
      state.showFilters = true
    }
    setTimeout(() => {
      state.filtersWrapHeight = filtersWrapElement.offsetHeight
      state.showFilters = false
      state.isLoaded = true
    }, 1) // Not sure why I need that. Without it, groups are not yet rendered into the view,
    // so the offsetHeight is wrong
  })

  const resetFilters = $(() => {
    userState.searchTerm = ''
    userState.selectedGroups = []
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
      <div class="mx-4 mt-4 mb-2 flex justify-center text-center">
        <button
          class={`relative h-10 flex-1 rounded-lg px-3 tracking-wide ${
            state.isLoaded && state.showFilters ? 'bg-gray-200' : 'bg-sky-200'
          }`}
          onClick$={toggleShowFilters}
        >
          {state.isLoaded && state.showFilters ? 'Close' : 'Filters'}
          {!state.showFilters && state.hasActiveFilters && (
            <span class="absolute top-[10px] ml-[4px] h-2 w-2 rounded-full bg-green-500">
              &nbsp;
            </span>
          )}
        </button>
        <button
          type="button"
          class={`grow-0 text-orange-400 duration-500 ease-in-out ${
            state.hasActiveFilters
              ? 'w-[68px] scale-100 opacity-100'
              : 'w-0 scale-0 overflow-hidden opacity-0'
          }`}
          style="transition-property: width, opacity, transform;"
          onClick$={resetFilters}
        >
          <div class="ml-2 inline-block px-2">Reset</div>
        </button>
      </div>
      <div
        class={`filters-wrap mx-4 overflow-hidden rounded-lg shadow-md ${
          state.isLoaded && !state.showFilters ? 'h-0 overflow-hidden' : ''
        } ${!state.isLoaded ? 'absolute opacity-0' : ''}`}
      >
        <div class="flex flex-col gap-3 p-3">
          <Search />
          <div>
            {userState.groups.map(group => (
              <span class="mr-1.5 mb-1.5 inline-block">
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
