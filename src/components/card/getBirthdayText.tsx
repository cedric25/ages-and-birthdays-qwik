import { DateOfBirth } from '~/@types/DateOfBirth'
import { Age } from '~/@types/Age'
import { getDaysUntilBirthday } from '~/helpers/daysUntilBirthday'

export function getBirthdayText(birthday: DateOfBirth, age: Age | null) {
  const daysUntilBirthday = getDaysUntilBirthday(birthday)
  const isBirthdayToday = daysUntilBirthday === 0
  const nextAge = age ? getNextAge(age) : null

  if (isBirthdayToday) {
    if (nextAge) {
      return `Turning ${nextAge - 1} today!`
    }
    return 'Birthday today!'
  }
  if (nextAge) {
    return (
      <div class="text-center">
        Will turn {nextAge} in{' '}
        <span class="font-bold">{daysUntilBirthday}</span>{' '}
        {(daysUntilBirthday > 1 && 'days') || 'day'}
      </div>
    )
  }
  return `Birthday in ${daysUntilBirthday} ${
    (daysUntilBirthday > 1 && 'days') || 'day'
  }`
}

function getNextAge(age: Age) {
  if (age.unit === 'months') {
    return 1
  }
  return age.value + 1
}
