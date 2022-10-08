import dayjs from 'dayjs'
import { DateOfBirth } from '~/@types/DateOfBirth'

export function getDaysUntilBirthday(birthday: DateOfBirth): number {
  const today = dayjs().startOf('day')
  let nextBirthday = dayjs(birthday).year(dayjs().year())
  if (nextBirthday.isBefore(today)) {
    nextBirthday = nextBirthday.add(1, 'year')
  }
  return nextBirthday.diff(today, 'days')
}
