import { DbPerson } from '~/@types/Person'

export function formatGroups({
  dbGroups,
  dbPersons,
}: {
  dbGroups: string[]
  dbPersons: Record<string, DbPerson>
}) {
  return dbGroups.map(groupLabel => ({
    label: groupLabel,
    count: Object.values(dbPersons).filter(
      person => person.groups && person.groups.includes(groupLabel)
    ).length,
  }))
}
