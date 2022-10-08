import dayjs from 'dayjs'
import { Age } from '~/@types/Age'

export function computeAge(dateOfBirth: Date | string): Age | null {
  if (dateOfBirth instanceof String && dateOfBirth.length !== 10) {
    return null
  }

  const diffYears = dayjs()
    .startOf('day')
    .diff(dayjs(dateOfBirth).startOf('day'), 'years')
  if (diffYears > 0) {
    return {
      value: diffYears,
      unit: 'years',
    }
  }
  const diffMonths = dayjs().diff(dateOfBirth, 'months')
  return {
    value: diffMonths,
    unit: 'months',
  }
}
