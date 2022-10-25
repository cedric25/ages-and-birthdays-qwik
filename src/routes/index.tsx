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
      {userState.isSyncingPersons || userState.isSyncingGroups ? (
        <div className="mx-auto w-full py-3 px-4">
          <div className="flex animate-pulse space-x-4">
            <div className="flex-1 py-1">
              <div className="h-12 rounded-lg bg-slate-200"></div>
              <div className="mt-5 grid grid-cols-5 gap-4">
                <div className="col-span-4 h-0 rounded-lg bg-slate-200"></div>
                <div className="col-span-1 h-5 rounded-lg bg-slate-200"></div>
              </div>
              <div className="mt-3 space-y-5">
                <div className="h-[150px] rounded-lg bg-slate-200"></div>
                <div className="h-[150px] rounded-lg bg-slate-200"></div>
                <div className="h-[150px] rounded-lg bg-slate-200"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {hasAtLeastOnePerson && <Filters />}
          <div class="mb-24 py-3 px-5">
            <List />
          </div>
        </>
      )}
    </>
  )
})

export const head: DocumentHead = {
  title: 'Birthdays',
}
