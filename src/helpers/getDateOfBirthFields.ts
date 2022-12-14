import { DateOfBirth } from '~/@types/DateOfBirth'

export function getDateOfBirthFields(dateOfBirth: string) {
  const fields = dateOfBirth.split('-')
  if (dateOfBirth.length === 10) {
    return {
      year: fields[0],
      month: fields[1],
      day: fields[2],
    }
  }
  if (dateOfBirth.length === 5) {
    return {
      month: fields[0],
      day: fields[1],
    }
  }
  if (dateOfBirth.length === 7) {
    return {
      year: fields[0],
      month: fields[1],
    }
  }
  return {}
}

export function formatDateOfBirth({
  day = '',
  monthKey = '',
  year = '',
}: {
  day?: string
  monthKey?: string
  year?: string
}): DateOfBirth {
  return `${year}-${monthKey.padStart(2, '0')}-${day.padStart(2, '0')}`
    .replaceAll('00', '')
    .replace(/^\-+|\-+$/g, '')
}
