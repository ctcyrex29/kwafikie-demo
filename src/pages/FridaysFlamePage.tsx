import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight, Beer, Check, Flame, MapPin, Music, Users, UtensilsCrossed } from 'lucide-react'
import { fridaysFlame, site, ticketTypes } from '../config/site'
import { images } from '../config/menu'
import { DemoChip, Reveal, SectionHeading, SmartImage } from '../components/ui'
import { useCurrency } from '../lib/currency'
import { formatLongDate, formatTime, nextFlameStart } from '../lib/dates'

const highlightIcons = [UtensilsCrossed, Beer, Music, Users]

export function FridaysFlamePage() {
  const { format } = useCurrency()
  return (
    <>
      <FlameHero />

      <section className="container-page grid gap-12 py-20 sm:py-28 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <Reveal>
          <SectionHeading eyebrow="The event" title="The best way to end the week in Masvingo.">
            <p>{fridaysFlame.description}</p>
          </SectionHeading>
        </Reveal>
        <Reveal delay={100}>
          <ul className="grid gap-4 sm:grid-cols-2">
            {fridaysFlame.highlights.map((h, i) => {
              const Icon = highlightIcons[i % highlightIcons.length]
              return (
                <li key={h.title} className="card p-6 transition hover:border-ember-500/40">
                  <Icon className="size-6 text-ember-400" aria-hidden />
                  <h3 className="mt-4 font-display text-xl text-cream-50">{h.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream-300">{h.text}</p>
                </li>
              )
            })}
          </ul>
        </Reveal>
      </section>

      <section className="relative isolate overflow-hidden border-y border-cream-100/10 py-20 sm:py-28">
        <SmartImage src={images.crowd} alt="" className="absolute inset-0 -z-20 size-full" />
        <div className="absolute inset-0 -z-10 bg-ink-950/88" />
        <div className="container-page">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading eyebrow="How the night goes" title="An evening on the fire" />
            <DemoChip>Sample programme</DemoChip>
          </div>
          <ol className="mt-12 grid gap-8 md:grid-cols-4">
            {fridaysFlame.sampleEvening.map((s, i) => (
              <Reveal key={s.time} delay={i * 90}>
                <li className="relative border-t border-ember-500/50 pt-6">
                  <span className="absolute -top-1.5 left-0 size-3 rounded-full bg-ember-500 shadow-[0_0_20px_4px_rgba(226,96,42,0.6)]" aria-hidden />
                  <p className="font-display text-3xl text-flame-300">{formatTime(s.time)}</p>
                  <h3 className="mt-2 font-semibold text-cream-50">{s.title}</h3>
                  <p className="mt-1 text-sm text-cream-300">{s.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-page py-20 sm:py-28" aria-labelledby="ticket-heading">
        <div className="flex flex-col items-center text-center">
          <p className="eyebrow">Tickets</p>
          <h2 id="ticket-heading" className="heading-lg mt-3">
            Get in on Friday
          </h2>
          <div className="mt-4">
            <DemoChip>Demo pricing, pending confirmation</DemoChip>
          </div>
        </div>
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
          {ticketTypes.map((t, i) => (
            <Reveal key={t.id} delay={i * 100}>
              <div
                className={`relative flex h-full flex-col rounded-3xl border p-8 ${
                  i === ticketTypes.length - 1
                    ? 'border-ember-500/50 bg-gradient-to-b from-ember-500/10 to-ink-900'
                    : 'border-cream-100/10 bg-ink-900'
                }`}
              >
                <h3 className="font-display text-2xl text-cream-50">{t.name}</h3>
                <p className="mt-1 text-sm text-cream-300">{t.description}</p>
                <p className="mt-6 font-display text-5xl text-cream-50">
                  {format(t.priceUsd)}
                  <span className="ml-1 font-sans text-sm text-cream-500">/ person</span>
                </p>
                <ul className="mt-6 flex-1 space-y-3 text-sm">
                  {t.inclusions.map((inc) => (
                    <li key={inc} className="flex gap-2 text-cream-100">
                      <Check className="size-4 shrink-0 text-flame-400" aria-hidden /> {inc}
                    </li>
                  ))}
                </ul>
                <Link to={`/tickets?type=${t.id}`} className={`mt-8 w-full ${i === ticketTypes.length - 1 ? 'btn-primary' : 'btn-secondary'}`}>
                  Choose {t.name}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-page pb-24">
        <div className="card grid overflow-hidden lg:grid-cols-2">
          <SmartImage src={images.interior} alt="The dining area" className="h-64 w-full lg:h-full" />
          <div className="p-8 sm:p-12">
            <p className="eyebrow">Where</p>
            <h2 className="heading-lg mt-3">{site.name}, {site.location.city}</h2>
            <p className="mt-4 flex gap-2 text-cream-300">
              <MapPin className="mt-1 size-4 shrink-0 text-flame-400" aria-hidden />
              <span>
                {fridaysFlame.venue}
                <br />
                {site.location.address}, {site.location.city}, {site.location.country}
              </span>
            </p>
            <p className="mt-2 text-sm text-cream-500">{site.location.directions}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={site.location.mapsUrl} target="_blank" rel="noreferrer" className="btn-secondary">
                Open in Maps
              </a>
              <Link to="/reserve" className="btn-primary">
                Reserve a table
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function FlameHero() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(t)
  }, [])
  const { start, isLive } = nextFlameStart(now)
  const diff = Math.max(0, start.getTime() - now.getTime())
  const parts = [
    ['Days', Math.floor(diff / 86_400_000)],
    ['Hours', Math.floor(diff / 3_600_000) % 24],
    ['Minutes', Math.floor(diff / 60_000) % 60],
    ['Seconds', Math.floor(diff / 1000) % 60],
  ] as const

  return (
    <section className="relative isolate flex min-h-[calc(100svh-6rem)] items-center overflow-hidden">
      <SmartImage src={images.grillFlames} alt="Flames rising from a braai grill" eager className="absolute inset-0 -z-30 size-full scale-105" />
      <div className="absolute inset-0 -z-20 bg-gradient-to-t from-ink-950 via-ink-950/60 to-ink-950/70" />
      <div className="absolute -bottom-1/3 left-1/2 -z-10 size-[60rem] -translate-x-1/2 rounded-full bg-ember-500/25 blur-[120px]" />

      <div className="container-page py-20 text-center">
        <p className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-ember-500/50 bg-ink-950/50 px-4 py-1.5 text-sm font-semibold text-flame-300 backdrop-blur">
          <Flame className="size-4 animate-flicker" aria-hidden /> Every Friday · {fridaysFlame.timeDisplay}
        </p>
        <h1 className="mt-8 animate-fade-up font-display text-7xl leading-[0.9] font-semibold tracking-tight text-cream-50 [animation-delay:80ms] sm:text-8xl lg:text-[10rem]">
          Fridays
          <br />
          <span className="bg-gradient-to-b from-flame-300 via-flame-400 to-ember-600 bg-clip-text text-transparent italic">Flame</span>
        </h1>
        <p className="mx-auto mt-8 max-w-xl animate-fade-up text-lg text-cream-300 [animation-delay:160ms] sm:text-xl">
          {fridaysFlame.shortPitch}
        </p>

        <div className="mt-10 animate-fade-up [animation-delay:240ms]" aria-live="off">
          {isLive ? (
            <p className="inline-flex items-center gap-2 rounded-full bg-ember-500 px-5 py-2 font-semibold text-ink-950">
              <span className="size-2 animate-ping rounded-full bg-ink-950" aria-hidden /> On now, until {formatTime(fridaysFlame.end)}
            </p>
          ) : (
            <>
              <p className="text-sm text-cream-500">Next one: {formatLongDate(start)}</p>
              <dl className="mx-auto mt-4 grid max-w-md grid-cols-4 gap-3">
                {parts.map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-cream-100/10 bg-ink-950/60 py-3 backdrop-blur">
                    <dd className="font-display text-3xl text-cream-50 tabular-nums sm:text-4xl">{String(value).padStart(2, '0')}</dd>
                    <dt className="text-[11px] tracking-wider text-cream-500 uppercase">{label}</dt>
                  </div>
                ))}
              </dl>
            </>
          )}
        </div>

        <div className="mt-10 flex animate-fade-up flex-col justify-center gap-3 [animation-delay:320ms] sm:flex-row">
          <Link to="/tickets" className="btn-primary px-8 py-4 text-base">
            Get Tickets <ArrowRight className="size-4" aria-hidden />
          </Link>
          <Link to="/reserve" className="btn-secondary px-8 py-4 text-base backdrop-blur">
            Reserve a Table
          </Link>
        </div>
      </div>
    </section>
  )
}
