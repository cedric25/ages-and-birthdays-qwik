import { component$, Slot } from '@builder.io/qwik'

export const Chip = component$(
  ({
    color,
    count,
  }: {
    color: 'emerald' | 'indigo' | 'sky'
    count?: number
  }) => {
    const cssClasses = {
      emerald: 'text-emerald-500 bg-emerald-500/10',
      indigo: 'text-indigo-500 bg-indigo-500/10',
      sky: 'text-sky-500 bg-sky-500/10',
    }
    return (
      <div
        class={`inline-flex items-center h-[28px] text-sm rounded-full ${cssClasses[color]}`}
      >
        {count && (
          <div class="inline-flex items-center justify-center rounded-full bg-gray-200 -mr-1 w-5 h-5 ml-1 text-xs font-bold">
            {count}
          </div>
        )}
        <span className="py-[0.1rem] px-3">
          <Slot />
        </span>
      </div>
    )
  }
)
