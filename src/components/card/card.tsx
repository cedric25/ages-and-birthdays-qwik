import { component$ } from '@builder.io/qwik'
import { getBirthdayText } from './getBirthdayText'
import { computeAge } from '~/helpers/computeAge'
import { Person } from '~/@types/Person'
import { Chip } from '~/components/chip/chip'
import { getReadableBirthday } from '~/helpers/readableBirthday'
import { getReadableAge } from '~/helpers/readableAge'

export const Card = component$(({ person }: { person: Person }) => {
  const age = computeAge(person.birthday)
  const readableBirthday = getReadableBirthday(person.birthday)
  const readableAge = getReadableAge(person.birthday)
  const birthdayText = getBirthdayText(person.birthday, age)

  return (
    <div class="bg-white shadow px-2 pb-4 pt-2 rounded-lg">
      <div>
        {person.groups?.map(group => (
          <Chip color={'sky'}>{group}</Chip>
        ))}
      </div>
      <div class="flex flex-col gap-y-1">
        {person.parentOne && person.parentTwo ? (
          <div class="mt-2 text-center text-sm -mb-1">
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
            <Chip color="emerald">{readableBirthday}</Chip>
          </span>
          <span class="flex-1">
            <Chip color="indigo">{readableAge}</Chip>
          </span>
        </div>
        <div class="text-center">{birthdayText}</div>
      </div>
    </div>
  )
})
