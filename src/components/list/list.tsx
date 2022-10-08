import { component$, useContext } from '@builder.io/qwik'
import { Card } from '~/components/card/card'
import { AppContext } from '~/root'

export default component$(() => {
  const userState = useContext(AppContext)

  const importantPersons = Object.values(userState.importantPersons)
  const sortedPersons = importantPersons.sort(
    (p1, p2) => p1.daysUntilBirthday - p2.daysUntilBirthday
  )

  return (
    <div class="grid gap-5 mt-5">
      {sortedPersons.map(person => (
        <Card person={person} />
      ))}
    </div>
  )
})
