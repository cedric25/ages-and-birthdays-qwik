import {
  component$,
  useClientEffect$,
  useStore,
  useContextProvider,
} from '@builder.io/qwik'
import {
  QwikCity,
  RouterOutlet,
  ServiceWorkerRegister,
} from '@builder.io/qwik-city'
import { RouterHead } from '~/components/router-head/router-head'
import { initFirebase } from '~/services/firebase/firebase'
import { getUserData } from '~/services/db'
import { AppContext, UserState } from '~/appContext'

import './global.css'

export default component$(() => {
  const userState = useStore<UserState>({
    user: null,
    importantPersons: {},
    groups: [],
    searchTerm: '',
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
        <RouterHead />
      </head>
      <body lang="en">
        <RouterOutlet />
        <ServiceWorkerRegister />
      </body>
    </QwikCity>
  )
})
