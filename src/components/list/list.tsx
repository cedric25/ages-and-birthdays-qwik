import { component$, useWatch$, useContext, useStore } from '@builder.io/qwik'
import { Person } from '~/@types/Person'
import { AppContext } from '~/root'
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
    // rerun this function  when `value` property changes.
    track(userState, 'selectedGroups')
    const importantPersons = Object.values(userState.importantPersons)
    if (userState.selectedGroups.length) {
      const filteredPersons = importantPersons.filter(person => {
        const commonGroups = userState.selectedGroups.filter(group => {
          return person.groups && person.groups.includes(group)
        })
        return commonGroups.length > 0
      })
      state.persons = sortPersons(filteredPersons)
    } else {
      state.persons = importantPersons
    }
  })

  return (
    <div class="grid gap-5 mt-5">
      {state.persons.map(person => (
        <Card key={person.id} person={person} />
      ))}
    </div>
  )
})
