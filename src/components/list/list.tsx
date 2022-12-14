import { component$, useWatch$, useContext, useStore } from '@builder.io/qwik'
import deburr from 'lodash.deburr'
import { Person } from '~/@types/Person'
import { AppContext } from '~/appContext'
import { Card } from '~/components/card/card'

export function sortPersons(personsList: Person[]) {
  return personsList.sort(
    (p1, p2) => p1.daysUntilBirthday - p2.daysUntilBirthday
  )
}

type State = {
  persons: Person[]
}

export default component$(() => {
  const userState = useContext(AppContext)

  const state = useStore<State>({
    persons: [],
  })

  useWatch$(({ track }) => {
    track(userState, 'importantPersons')
    const importantPersons = Object.values(userState.importantPersons)
    state.persons = sortPersons(importantPersons)
  })

  useWatch$(({ track }) => {
    track(userState, 'selectedGroups')
    track(userState, 'searchTerm')
    const importantPersons = Object.values(userState.importantPersons)
    if (userState.selectedGroups.length || userState.searchTerm) {
      let filteredPersons = importantPersons
      if (userState.selectedGroups.length) {
        filteredPersons = importantPersons.filter(person => {
          const commonGroups = userState.selectedGroups.filter(group => {
            return person.groups && person.groups.includes(group)
          })
          return commonGroups.length > 0
        })
      }
      if (userState.searchTerm) {
        filteredPersons = filteredPersons.filter(
          person =>
            deburr(person.name.toLowerCase()).indexOf(userState.searchTerm) !==
            -1
        )
      }
      state.persons = sortPersons(filteredPersons)
    } else {
      state.persons = sortPersons(importantPersons)
    }
  })

  return (
    <>
      {Object.keys(state.persons).length > 1 && (
        <div class="mb-3 text-right text-sm">
          {Object.keys(state.persons).length} persons
        </div>
      )}
      <div class="grid gap-5">
        {state.persons.map(person => (
          <Card key={person.id} person={person} />
        ))}
      </div>
    </>
  )
})
