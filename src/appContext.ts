import { createContext } from '@builder.io/qwik'
import { User } from '~/@types/User'
import { Person } from '~/@types/Person'
import { Group } from '~/@types/Group'

export interface UserState {
  user: User | null
  isSyncingPersons: boolean
  isSyncingGroups: boolean
  importantPersons: Record<string, Person>
  groups: Group[]
  searchTerm: string
  selectedGroups: string[]
  clickedPersonId?: string | null
}

export const AppContext = createContext<UserState>('app-context')
