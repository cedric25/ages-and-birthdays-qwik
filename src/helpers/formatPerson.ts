import dayjs from 'dayjs'
import { DbPerson, Person } from '~/@types/Person'
import { computeAge } from '~/helpers/computeAge'
import { getDaysUntilBirthday } from '~/helpers/daysUntilBirthday'
import { isBaby } from '~/helpers/isBaby'
import { YEAR_FOR_NO_YEAR } from '~/constants/constants'

export function formatPerson(
  person: DbPerson,
  dbPersons: Record<string, DbPerson>
) {
  const age = computeAge(person.birthday)
  return {
    ...person,
    // Until everything is string in db
    birthday: getBirthdayFromIsoDate(person.birthday),
    age,
    daysUntilBirthday: getDaysUntilBirthday(person.birthday),
    isBaby: isBaby(age),
    children: lookForChildren(person.name, dbPersons),
  }
}

function getBirthdayFromIsoDate(birthday: string) {
  const year = birthday.substring(0, 4)
  if (year === String(YEAR_FOR_NO_YEAR)) {
    return birthday.substring(5, 10)
  }
  return birthday.substring(0, 10)
}

function lookForChildren(
  personName: string,
  dbPersons: Record<string, DbPerson>
): Person[] {
  const children = []
  for (const person of Object.values(dbPersons)) {
    if (person.parentOne === personName || person.parentTwo === personName) {
      children.push(formatPerson(person, dbPersons))
    }
  }
  return children.sort((kidOne, kidTwo) => {
    if (kidOne.birthday === kidTwo.birthday) {
      return kidOne.name.localeCompare(kidTwo.name)
    }
    if (kidOne.birthday.length !== 10 || kidTwo.birthday.length !== 10) {
      return kidOne.name.localeCompare(kidTwo.name)
    }
    return dayjs(kidOne.birthday).unix() < dayjs(kidTwo.birthday).unix()
      ? -1
      : 1
  })
}
