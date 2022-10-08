import type { Group } from '@/@types/Group'
import type { Parent } from '@/@types/Parent'
import type { Age } from '~/@types/Age'

export type DbPerson = {
  id: string
  name: string
  birthday: string
  groups?: Group[]
  parentOne?: Parent
  parentTwo?: Parent
  children?: Child[]
  meta?: {
    from: string // 'google'
  }
}

export type Person = DbPerson & {
  age: Age | null
  daysUntilBirthday: number
  isBaby: boolean
}

export type PersonUpdateInput = {
  name?: string
  birthday?: Date
  groups?: Group[]
  parentOne?: Parent
  parentTwo?: Parent
  children?: Child[]
}
