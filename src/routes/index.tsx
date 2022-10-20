import { component$, useContext } from '@builder.io/qwik'
import type { DocumentHead } from '@builder.io/qwik-city'
import { AppContext } from '~/appContext'
import List from '~/components/list/list'
import Filters from '~/components/filters/filters'

export default component$(() => {
  const userState = useContext(AppContext)

  const hasAtLeastOnePerson =
    Object.values(userState.importantPersons).length > 0

  return (
    <>
      {hasAtLeastOnePerson && <Filters />}
      <div class="mb-24 py-3 px-5">
        <List />
      </div>
    </>
  )
})

export const head: DocumentHead = {
  title: 'Birthdays',
}
