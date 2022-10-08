import { DateOfBirth } from '~/@types/DateOfBirth'
import { computeAge } from '~/helpers/computeAge'

export function getReadableAge(birthday: DateOfBirth): string | null {
  const age = computeAge(birthday)
  if (!age) {
    return null
  }
  if (age.value === 0) {
    return 'New born!'
  }
  if (age.unit === 'years') {
    return `${age.value}y old`
  }
  if (age.unit === 'months') {
    if (age.value === 1) {
      return '1 month old'
    }
    return `${age.value} months old`
  }
  return null
}
