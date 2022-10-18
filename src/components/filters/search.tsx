import {
  component$,
  useStore,
  $,
  useContext,
  useWatch$,
} from '@builder.io/qwik'
import deburr from 'lodash.deburr'
import { AppContext } from '~/appContext'

export default component$(() => {
  const state = useStore<{
    searchTerm: string
  }>({
    searchTerm: '',
  })

  const userState = useContext(AppContext)

  useWatch$(({ track }) => {
    track(userState, 'searchTerm')
    state.searchTerm = userState.searchTerm
  })

  const onSearchTerm = $((searchTerm: string) => {
    state.searchTerm = searchTerm
    if (searchTerm.length < 2) {
      userState.searchTerm = ''
      return
    }
    userState.searchTerm = deburr(searchTerm.toLowerCase())
  })

  const onKeyUp = $((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      state.searchTerm = ''
      userState.searchTerm = ''
    }
  })

  return (
    <input
      placeholder="Search..."
      className="w-full rounded-lg border py-1 px-2"
      value={state.searchTerm}
      onInput$={e => onSearchTerm((e.target as HTMLInputElement).value)}
      onKeyUp$={onKeyUp}
    />
  )
})
