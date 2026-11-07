import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { ArrowRight, CalendarDays, Clock, Flame, MapPin, Music, Send, ShoppingBag, Users, UtensilsCrossed, Wine } from 'lucide-react'
import { fridaysFlame, site, ticketTypes } from '../config/site'
import { images, menuItems } from '../config/menu'
import { MenuCard } from '../components/MenuCard'
import { DemoChip, Reveal, SectionHeading, SmartImage } from '../components/ui'
import { formatLongDate, todaysHoursLabel, toIsoDate, startOfToday, upcomingFridays } from '../lib/dates'
import { useCurrency } from '../lib/currency'

export function HomePage() {
  return (
    <>
      <Hero />
      <InfoStrip />
      <AboutIntro />
      <FeaturedMenu />
      <HowOrderingWorks />
      <FlameFeature />
      <ReservationBand />
    </>
  )
}

function Hero() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-6rem)] items-end overflow-hidden">
      <SmartImage src={images.hero} alt="Meat grilling over an open flame" eager className="absolute inset-0 -z-20 size-full" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/30" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-950/90 via-ink-950/55 to-ink-950/10" />

      <div className="container-page pt-24 pb-16 sm:pb-24">
        <Link
          to="/fridays-flame"
          className="mb-7 inline-flex animate-fade-up items-center gap-2.5 rounded-full border border-ember-500/40 bg-ink-950/60 py-1.5 pr-4 pl-1.5 text-xs whitespace-nowrap backdrop-blur transition hover:border-ember-400 sm:text-sm"
        >
          <span className="flex items-center gap-1 rounded-full bg-ember-500 px-2.5 py-1 text-xs font-bold text-ink-950">
            <Flame className="size-3.5 animate-flicker" aria-hidden /> {fridaysFlame.name}
          </span>
          <span className="text-cream-100">
            <span className="hidden sm:inline">Every </span>Friday · {fridaysFlame.timeDisplay}
          </span>
          <ArrowRight className="hidden size-4 text-flame-400 sm:block" aria-hidden />
        </Link>

        <h1 className="max-w-4xl animate-fade-up font-display text-5xl leading-[0.98] font-semibold tracking-tight text-cream-50 [animation-delay:80ms] sm:text-7xl lg:text-8xl">
          Good Food. Great Company.{' '}
          <span className="bg-gradient-to-r from-flame-300 via-flame-400 to-ember-500 bg-clip-text text-transparent italic">
            Fridays on Fire.
          </span>
        </h1>
        <p className="mt-6 max-w-xl animate-fade-up text-lg leading-relaxed text-cream-300 [animation-delay:160ms] sm:text-xl">
          Experience unforgettable braai, food, drinks and music at KwaFikie in Masvingo.
        </p>
        <div className="mt-9 flex animate-fade-up flex-col gap-3 [animation-delay:240ms] sm:flex-row">
          <Link to="/menu" className="btn-primary px-7 py-3.5 text-base">
            Explore Our Menu <ArrowRight className="size-4" aria-hidden />
          </Link>
          <Link to="/reserve" className="btn-secondary px-7 py-3.5 text-base backdrop-blur">
            <CalendarDays className="size-4" aria-hidden /> Reserve a Table
          </Link>
        </div>
      </div>
    </section>
  )
}

function InfoStrip() {
  const [next] = upcomingFridays(1)
  const items = [
    { icon: MapPin, label: 'Find us', value: `${site.location.city}, ${site.location.country}` },
    { icon: Clock, label: 'Hours', value: todaysHoursLabel() },
    { icon: Flame, label: 'Next Fridays Flame', value: formatLongDate(next).replace(/ \d{4}$/, '') },
  ]
  return (
    <section className="border-y border-cream-100/10 bg-ink-900" aria-label="Quick information">
      <div className="container-page grid divide-cream-100/10 sm:grid-cols-3 sm:divide-x">
        {items.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-4 py-5 sm:justify-center sm:px-6">
            <Icon className="size-5 shrink-0 text-flame-400" aria-hidden />
            <div>
              <p className="text-xs tracking-wider text-cream-500 uppercase">{label}</p>
              <p className="font-medium text-cream-50">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function AboutIntro() {
  const pillars = [
    { icon: UtensilsCrossed, title: 'Braai & grill', text: 'Meat cooked over real fire, the way it should be.' },
    { icon: Wine, title: 'Drinks', text: 'Cold drinks and a bar built for long evenings.' },
    { icon: Music, title: 'Music', text: 'Sound that sets the mood without drowning the conversation.' },
  ]
  return (
    <section className="container-page grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-2 lg:gap-20">
      <Reveal>
        <SectionHeading eyebrow="Welcome to KwaFikie" title={<>Where Masvingo comes to eat, meet and celebrate.</>}>
          <p>
            KwaFikie brings together the things that make a good evening: food from the grill, drinks with friends and music
            that keeps the table talking. Come for a quick lunch, a family dinner or a long Friday night.
          </p>
        </SectionHeading>
        <ul className="mt-10 grid gap-6 sm:grid-cols-3">
          {pillars.map(({ icon: Icon, title, text }) => (
            <li key={title}>
              <span className="flex size-11 items-center justify-center rounded-full bg-ember-500/10">
                <Icon className="size-5 text-ember-400" aria-hidden />
              </span>
              <h3 className="mt-4 font-semibold text-cream-50">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-cream-300">{text}</p>
            </li>
          ))}
        </ul>
        <Link to="/about" className="mt-10 inline-flex items-center gap-2 font-semibold text-flame-300 hover:text-flame-400">
          More about KwaFikie <ArrowRight className="size-4" aria-hidden />
        </Link>
      </Reveal>
      <Reveal delay={120} className="relative">
        <div className="grid grid-cols-5 grid-rows-6 gap-4" style={{ height: 'min(560px, 110vw)' }}>
          <SmartImage src={images.friends} alt="Friends sharing a meal" className="col-span-3 row-span-6 size-full rounded-3xl" />
          <SmartImage src={images.ribs} alt="Ribs on the grill" className="col-span-2 row-span-3 size-full rounded-3xl" />
          <SmartImage src={images.drinks} alt="Cocktails at the bar" className="col-span-2 row-span-3 size-full rounded-3xl" />
        </div>
      </Reveal>
    </section>
  )
}

function FeaturedMenu() {
  const featured = menuItems.filter((i) => i.featured).slice(0, 6)
  return (
    <section className="border-t border-cream-100/10 bg-ink-900/50 py-20 sm:py-28">
      <div className="container-page">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow="From the grill" title="Featured on the menu">
            <p>A taste of what comes off the fire. Add to your order and send it straight to us on WhatsApp.</p>
          </SectionHeading>
          <DemoChip>Demo menu &amp; prices</DemoChip>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((item, i) => (
            <Reveal key={item.id} delay={(i % 3) * 80}>
              <MenuCard item={item} />
            </Reveal>
          ))}
        </div>
        <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/menu" className="btn-secondary">
            See the full menu
          </Link>
          <Link to="/order" className="btn-primary">
            <ShoppingBag className="size-4" aria-hidden /> Start an order
          </Link>
        </div>
      </div>
    </section>
  )
}

function HowOrderingWorks() {
  const steps = [
    { icon: UtensilsCrossed, title: 'Pick your food', text: 'Browse the menu and add what you like to your order.' },
    { icon: ShoppingBag, title: 'Check out', text: 'Choose collection or delivery and add your details.' },
    { icon: Send, title: 'Send on WhatsApp', text: 'Your order opens in WhatsApp, ready to send. We confirm it there.' },
  ]
  return (
    <section className="container-page py-20 sm:py-24">
      <SectionHeading align="center" eyebrow="Order online" title="Three steps to your table">
        <p>No app to download. No account to create.</p>
      </SectionHeading>
      <ol className="mt-12 grid gap-6 md:grid-cols-3">
        {steps.map(({ icon: Icon, title, text }, i) => (
          <Reveal key={title} delay={i * 100}>
            <li className="card relative h-full p-7">
              <span className="absolute top-6 right-7 font-display text-5xl text-cream-100/10">{i + 1}</span>
              <Icon className="size-7 text-flame-400" aria-hidden />
              <h3 className="mt-5 font-display text-xl text-cream-50">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream-300">{text}</p>
            </li>
          </Reveal>
        ))}
      </ol>
    </section>
  )
}

function FlameFeature() {
  const { format } = useCurrency()
  const from = Math.min(...ticketTypes.map((t) => t.priceUsd))
  return (
    <section className="relative isolate overflow-hidden py-24 sm:py-32">
      <SmartImage src={images.grillFlames} alt="" className="absolute inset-0 -z-20 size-full" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-950 via-ink-950/85 to-ink-950/40" />
      <div className="absolute -bottom-40 -left-20 -z-10 size-[30rem] rounded-full bg-ember-500/20 blur-3xl" />
      <div className="container-page">
        <Reveal className="max-w-2xl">
          <p className="eyebrow flex items-center gap-2">
            <Flame className="size-4 animate-flicker" aria-hidden /> Every Friday
          </p>
          <h2 className="mt-4 font-display text-5xl font-semibold tracking-tight text-cream-50 sm:text-7xl">
            Fridays <span className="text-flame-400 italic">Flame</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-cream-300">{fridaysFlame.description}</p>
          <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              ['When', 'Fridays'],
              ['Time', fridaysFlame.timeDisplay],
              ['On the night', 'Braai · Drinks'],
              ['Plus', 'Music'],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl border border-cream-100/10 bg-ink-950/50 p-4 backdrop-blur">
                <dt className="text-xs tracking-wider text-cream-500 uppercase">{k}</dt>
                <dd className="mt-1 font-semibold text-cream-50">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link to="/tickets" className="btn-primary px-7 py-3.5">
              Get Tickets · from {format(from)}
            </Link>
            <Link to="/fridays-flame" className="btn-secondary px-7 py-3.5">
              Event details
            </Link>
          </div>
          <p className="mt-4 text-xs text-cream-500">Ticket prices are demo prices pending confirmation.</p>
        </Reveal>
      </div>
    </section>
  )
}

function ReservationBand() {
  const navigate = useNavigate()
  const today = toIsoDate(startOfToday())
  const [date, setDate] = useState(today)
  const [guests, setGuests] = useState('2')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    navigate(`/reserve?date=${date}&guests=${guests}`)
  }

  return (
    <section className="container-page py-20 sm:py-28">
      <div className="card grid gap-10 overflow-hidden p-8 sm:p-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div>
          <p className="eyebrow">Reservations</p>
          <h2 className="heading-lg mt-3">Save your table</h2>
          <p className="mt-4 max-w-md text-cream-300">
            Planning a dinner, a birthday or a big Friday? Pick a date and we will take you through the rest. Bookings are
            confirmed by KwaFikie on WhatsApp.
          </p>
        </div>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-[1fr_auto_auto] sm:items-end">
          <div>
            <label htmlFor="home-date" className="field-label">
              Date
            </label>
            <input id="home-date" type="date" className="field-input" min={today} value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="home-guests" className="field-label">
              Guests
            </label>
            <div className="relative">
              <Users className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-cream-500" aria-hidden />
              <select id="home-guests" className="field-input pl-9" value={guests} onChange={(e) => setGuests(e.target.value)}>
                {Array.from({ length: site.reservations.maxGuests }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="btn-primary py-3.5">
            Continue <ArrowRight className="size-4" aria-hidden />
          </button>
        </form>
      </div>
    </section>
  )
}
