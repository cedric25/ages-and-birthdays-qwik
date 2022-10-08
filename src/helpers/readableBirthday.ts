import dayjs from 'dayjs'

export function getReadableBirthday(birthday: Date | string): string {
  if (birthday instanceof String) {
    return birthday as string
  }
  return dayjs(birthday).format('D MMM YYYY')
}
