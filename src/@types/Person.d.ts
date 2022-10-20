import { DbGroup, Group } from '~/@types/Group'
import { Parent } from '~/@types/Parent'
import { Age } from '~/@types/Age'
import { DateOfBirth } from '~/@types/DateOfBirth'

export type DbPerson = {
  id: string
  name: string
  birthday: string
  groups?: DbGroup[]
  parentOne?: Parent
  parentTwo?: Parent
  children?: DbPerson[]
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
  name: string
  birthday: DateOfBirth
  groups?: Group[]
  parentOne?: Parent
  parentTwo?: Parent
  children?: Child[]
}
