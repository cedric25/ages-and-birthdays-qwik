import { component$, useStore } from '@builder.io/qwik'
import { Chip } from '~/components/chip/chip'

type State = {
  showFilters: boolean
}

export default component$(() => {
  const state = useStore<State>({
    // showFilters: false,
    showFilters: true,
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
          <input
            placeholder="Search..."
            class="border py-1 rounded-lg px-2 w-full"
          />
          <div>
            <Chip color={'sky'}>Belle famille</Chip>
            <Chip color={'sky'}>Family</Chip>
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
