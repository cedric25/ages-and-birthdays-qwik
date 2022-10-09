import dayjs from 'dayjs'
import { DateOfBirth } from '~/@types/DateOfBirth'

export function getReadableBirthday(birthday: DateOfBirth): string {
  if (birthday.length === 10) {
    return dayjs(birthday).format('D MMM YYYY')
  }
  if (birthday.length === 5) {
    return dayjs(birthday, 'MM-DD').format('D MMM')
  }
  if (birthday.length === 7) {
    return dayjs(birthday, 'YYYY-MM').format('MMM YYYY')
  }
  return birthday
}
