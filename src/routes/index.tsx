import { component$ } from '@builder.io/qwik'
import type { DocumentHead } from '@builder.io/qwik-city'
import List from '~/components/list/list'
import Filters from '~/components/filters/filters'

export default component$(() => {
  return (
    <>
      <Filters />
      <div class="py-3 px-5 mb-24">
        <List />
      </div>
    </>
  )
})

export const head: DocumentHead = {
  // title: 'Birthdays',
  title: 'Qwik',
}
