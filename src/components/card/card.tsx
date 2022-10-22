import { $, component$, useContext } from '@builder.io/qwik'
import { getBirthdayText } from './getBirthdayText'
import { computeAge } from '~/helpers/computeAge'
import { Person } from '~/@types/Person'
import { SimpleChip } from '~/components/chip/simpleChip'
import { getReadableBirthday } from '~/helpers/readableBirthday'
import { getReadableAge } from '~/helpers/readableAge'
import { AppContext } from '~/appContext'

export const Card = component$(({ person }: { person: Person }) => {
  const userState = useContext(AppContext)

  const age = computeAge(person.birthday)
  const readableBirthday = getReadableBirthday(person.birthday)
  const readableAge = getReadableAge(person.birthday)
  const birthdayLine = getBirthdayText(person.birthday, age)

  const editPerson = $(() => {
    userState.clickedPersonId = null
    userState.clickedPersonId = person.id
  })

  return (
    <label
      for="ab-modal"
      class="cursor-pointer rounded-lg bg-white p-2 shadow"
      data-id={person.id}
      onClick$={editPerson}
    >
      <div>
        {person.groups?.map(group => (
          <SimpleChip color={'sky'}>{group}</SimpleChip>
        ))}
      </div>
      <div class="flex flex-col gap-y-1">
        {person.parentOne && person.parentTwo ? (
          <div class="mt-2 -mb-1 text-center text-sm">
            ({person.parentOne} + {person.parentTwo})
          </div>
        ) : (
          ''
        )}
        <div class="text-center text-xl">
          {person.name} {person.isBaby && <span>👶</span>}
        </div>
        <div class="flex gap-x-2">
          <span class="flex-1 text-right">
            <SimpleChip color="emerald">{readableBirthday}</SimpleChip>
          </span>
          <span class="flex-1">
            <SimpleChip color="indigo">{readableAge}</SimpleChip>
          </span>
        </div>
        {birthdayLine}
        {person.children && (
          <div class="mt-3">
            {person.children.map(child => (
              <div class="grid grid-cols-3 border-t px-3 py-1 text-sm text-gray-600">
                <div>👶&nbsp; {child.name}</div>
                <div>{getReadableBirthday(child.birthday)}</div>
                <div>{getReadableAge(child.birthday)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </label>
  )
})
