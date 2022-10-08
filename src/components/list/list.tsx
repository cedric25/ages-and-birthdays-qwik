import { component$, useContext } from '@builder.io/qwik'
import { Card } from '~/components/card/card'
import { AppContext } from '~/root'

export default component$(() => {
  const userState = useContext(AppContext)

  const importantPersons = Object.values(userState.importantPersons)

  return (
    <div class="grid gap-5 mt-5">
      {importantPersons.map(person => (
        <Card person={person} />
      ))}
    </div>
  )
})
