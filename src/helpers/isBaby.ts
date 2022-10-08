import { Age } from '~/@types/Age'

export function isBaby(age: Age | null) {
  if (!age) {
    return false
  }
  return age.unit === 'months' || age.value < 3
}
