import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Info, Minus, Plus, UtensilsCrossed } from 'lucide-react'
import { site } from '../config/site'

/** Text wordmark. Swap for the official logo by setting site.logo.src. */
export function Wordmark({ className = '' }: { className?: string }) {
  if (site.logo.src) return <img src={site.logo.src} alt={site.logo.alt} className={`h-9 w-auto ${className}`} />
  return (
    <span className={`font-display text-2xl font-semibold tracking-tight text-cream-50 ${className}`}>
      Kwa<span className="text-flame-400 italic">Fikie</span>
    </span>
  )
}

/** Image that keeps its box and shows a tasteful fallback if the URL fails. */
export function SmartImage({
  src,
  alt,
  className = '',
  eager = false,
}: {
  src: string
  alt: string
  className?: string
  eager?: boolean
}) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#3a2414,#171310_70%)] ${className}`}
      >
        <UtensilsCrossed className="size-8 text-flame-400/50" aria-hidden />
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
      className={`bg-ink-800 object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
    />
  )
}

/** Fades children up the first time they scroll into view. */
export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      className={`${visible ? 'animate-fade-up' : 'opacity-0'} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  children,
  align = 'left',
}: {
  eyebrow?: string
  title: ReactNode
  children?: ReactNode
  align?: 'left' | 'center'
}) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="heading-lg">{title}</h2>
      {children && <div className="mt-4 text-base leading-relaxed text-cream-300">{children}</div>}
    </div>
  )
}

/** Small label for anything that is demo/placeholder content. */
export function DemoChip({ children = 'Demo content' }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-dashed border-cream-300/40 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-cream-300 uppercase">
      {children}
    </span>
  )
}

export function Notice({ children, tone = 'info' }: { children: ReactNode; tone?: 'info' | 'warn' }) {
  const styles =
    tone === 'warn' ? 'border-flame-400/40 bg-flame-400/10 text-flame-300' : 'border-cream-100/15 bg-cream-100/5 text-cream-300'
  return (
    <div className={`flex gap-3 rounded-xl border p-4 text-sm leading-relaxed ${styles}`}>
      <Info className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div>{children}</div>
    </div>
  )
}

export function QuantityStepper({
  value,
  onChange,
  min = 0,
  max = 50,
  label,
  size = 'md',
}: {
  value: number
  onChange: (next: number) => void
  min?: number
  max?: number
  label: string
  size?: 'sm' | 'md'
}) {
  const btn = size === 'sm' ? 'size-8' : 'size-10'
  return (
    <div className="inline-flex items-center rounded-full border border-cream-100/15 bg-ink-850" role="group" aria-label={label}>
      <button
        type="button"
        className={`${btn} flex items-center justify-center rounded-full text-cream-100 transition hover:bg-cream-100/10 disabled:opacity-30`}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label={`Decrease ${label}`}
      >
        <Minus className="size-4" aria-hidden />
      </button>
      <span className="min-w-8 text-center text-sm font-semibold tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={`${btn} flex items-center justify-center rounded-full text-cream-100 transition hover:bg-cream-100/10 disabled:opacity-30`}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={`Increase ${label}`}
      >
        <Plus className="size-4" aria-hidden />
      </button>
    </div>
  )
}

export function PageHero({
  eyebrow,
  title,
  children,
  image,
}: {
  eyebrow: string
  title: ReactNode
  children?: ReactNode
  image?: string
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-cream-100/10">
      {image && (
        <>
          <SmartImage src={image} alt="" eager className="absolute inset-0 -z-20 size-full" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-950/80 via-ink-950/85 to-ink-950" />
        </>
      )}
      {!image && <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,#2a1a10,transparent_60%)]" />}
      <div className="container-page py-16 sm:py-24">
        <p className="eyebrow mb-4">{eyebrow}</p>
        <h1 className="heading-xl max-w-3xl">{title}</h1>
        {children && <div className="mt-5 max-w-2xl text-lg leading-relaxed text-cream-300">{children}</div>}
      </div>
    </section>
  )
}

export function Field({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string
  label: ReactNode
  error?: string
  hint?: ReactNode
  children: ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-cream-500">{hint}</p>}
      {error && (
        <p id={`${id}-error`} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export function Spinner() {
  return <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
}

/** Numbered steps indicator used by checkout flows. */
export function Steps({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm" aria-label="Progress">
      {steps.map((s, i) => {
        const state = i < current ? 'done' : i === current ? 'current' : 'todo'
        return (
          <li key={s} className="flex items-center gap-2" aria-current={state === 'current' ? 'step' : undefined}>
            <span
              className={`flex size-7 items-center justify-center rounded-full text-xs font-bold ${
                state === 'todo' ? 'border border-cream-100/20 text-cream-500' : 'bg-ember-500 text-ink-950'
              }`}
            >
              {i + 1}
            </span>
            <span className={state === 'todo' ? 'text-cream-500' : 'font-semibold text-cream-50'}>{s}</span>
            {i < steps.length - 1 && <span className="hidden h-px w-6 bg-cream-100/20 sm:block" aria-hidden />}
          </li>
        )
      })}
    </ol>
  )
}
