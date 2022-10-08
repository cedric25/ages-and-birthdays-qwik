import {
  component$,
  useClientEffect$,
  useStore,
  useContextProvider,
  createContext,
  useContext,
} from '@builder.io/qwik'
import {
  QwikCity,
  RouterOutlet,
  ServiceWorkerRegister,
} from '@builder.io/qwik-city'
import { RouterHead } from '~/components/router-head/router-head'
import { User } from '~/@types/User'
import { Person } from '~/@types/Person'
import { Group } from '~/@types/Group'
import { initFirebase } from '~/services/firebase/firebase.js'
import { getUserData } from '~/services/db'

import './global.css'

export interface UserState {
  user: User | null
  importantPersons: Record<string, Person>
  groups: Group[]
  selectedGroups: string[]
}
export const AppContext = createContext<UserState>('app-context')

export default component$(() => {
  const userState = useStore<UserState>({
    user: null,
    importantPersons: {},
    groups: [],
    selectedGroups: [],
  })

  useContextProvider(AppContext, userState)

  useClientEffect$(
    async () => {
      userState.user = await initFirebase()

      if (!userState.user) {
        return
      }
      const { importantPersons, groups } = await getUserData(userState.user.id)
      userState.importantPersons = importantPersons
      userState.groups = groups
    },
    { eagerness: 'load' }
  )

  /**
   * The root of a QwikCity site always start with the <QwikCity> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Dont remove the `<head>` and `<body>` elements.
   */
  return (
    <QwikCity>
      <head>
        <meta charSet="utf-8" />
        <link href="/dist/output.css" rel="stylesheet" />
        <RouterHead />
      </head>
      <body lang="en">
        <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </QwikCity>
  )
})
