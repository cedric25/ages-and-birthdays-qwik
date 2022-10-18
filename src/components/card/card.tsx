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
  const birthdayLine = getBirthdayText(person.birthday, age)

  return (
    <div class="rounded-lg bg-white p-2 shadow">
      <div>
        {person.groups?.map(group => (
          <Chip color={'sky'}>{group}</Chip>
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
            <Chip color="emerald">{readableBirthday}</Chip>
          </span>
          <span class="flex-1">
            <Chip color="indigo">{readableAge}</Chip>
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
    </div>
  )
})
