import { component$, PropFunction, Slot } from '@builder.io/qwik'

export const Chip = component$(
  ({
    color,
    count,
    selected = false,
    onClick$,
  }: {
    color: 'emerald' | 'indigo' | 'sky'
    count?: number
    selected?: boolean
    onClick$: PropFunction<() => void>
  }) => {
    const cssClasses = {
      emerald: 'text-emerald-500 bg-emerald-500/10',
      indigo: 'text-indigo-500 bg-indigo-500/10',
      sky: 'text-sky-500 bg-sky-500/10',
    }
    return (
      <button
        type="button"
        class={`inline-flex h-[28px] items-center rounded-full text-sm ${
          cssClasses[color]
        } ${selected ? 'border border-2 border-primary px-0' : 'px-[2px]'}`}
        onClick$={onClick$}
      >
        {count != null && (
          <div class="-mr-1 ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-xs font-bold">
            {count}
          </div>
        )}
        <span class="py-[0.1rem] px-3">
          <Slot />
        </span>
      </button>
    )
  }
)
