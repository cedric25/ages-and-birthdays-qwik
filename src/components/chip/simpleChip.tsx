import { component$, Slot } from '@builder.io/qwik'

export const SimpleChip = component$(
  ({ color }: { color: 'emerald' | 'indigo' | 'sky' }) => {
    const cssClasses = {
      emerald: 'text-emerald-500 bg-emerald-500/10',
      indigo: 'text-indigo-500 bg-indigo-500/10',
      sky: 'text-sky-500 bg-sky-500/10',
    }
    return (
      <div
        class={`inline-flex h-[28px] items-center rounded-full text-sm ${cssClasses[color]}`}
      >
        <span class="py-[0.1rem] px-3">
          <Slot />
        </span>
      </div>
    )
  }
)
