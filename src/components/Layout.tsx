import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { CalendarDays, Flame, Mail, MapPin, Menu as MenuIcon, Phone, ShoppingBag, X } from 'lucide-react'
import { site, fridaysFlame, type CurrencyCode } from '../config/site'
import { menuById } from '../config/menu'
import { useCart } from '../lib/cart'
import { useCurrency } from '../lib/currency'
import { formatTime } from '../lib/dates'
import { CartDrawer } from './CartDrawer'
import { Wordmark } from './ui'

export const navLinks = [
  { to: '/menu', label: 'Menu' },
  { to: '/order', label: 'Order Online' },
  { to: '/fridays-flame', label: 'Fridays Flame' },
  { to: '/tickets', label: 'Tickets' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export function Layout() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only z-[100] rounded-full bg-ember-500 px-4 py-2 font-semibold text-ink-950 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <DemoBar />
      <Header />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <AddedToast />
    </div>
  )
}

function DemoBar() {
  return (
    <div className="no-print border-b border-cream-100/10 bg-ink-900 text-center text-xs text-cream-300">
      <p className="container-page py-2">
        <span className="font-semibold text-flame-300">Demo website</span> by {site.builtBy.name}. Menu, prices,
        tickets and contact details are placeholders for presentation.
      </p>
    </div>
  )
}

export function CurrencySwitch({ className = '' }: { className?: string }) {
  const { code, setCode } = useCurrency()
  if (!site.currency.allowSwitching) return null
  const codes = Object.keys(site.currency.options) as CurrencyCode[]
  return (
    <div
      className={`inline-flex rounded-full border border-cream-100/15 p-0.5 text-xs font-semibold ${className}`}
      role="radiogroup"
      aria-label="Display prices in"
    >
      {codes.map((c) => (
        <button
          key={c}
          type="button"
          role="radio"
          aria-checked={code === c}
          onClick={() => setCode(c)}
          className={`rounded-full px-2.5 py-1 transition ${code === c ? 'bg-cream-100 text-ink-950' : 'text-cream-300 hover:text-cream-50'}`}
        >
          {site.currency.options[c].prefix.trim()}
        </button>
      ))}
    </div>
  )
}

function Header() {
  const cart = useCart()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setOpen(false)
  }, [pathname])
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative py-2 text-sm font-medium transition ${isActive ? 'text-flame-300' : 'text-cream-300 hover:text-cream-50'}`

  return (
    <header
      className={`no-print sticky top-0 z-40 border-b transition-colors duration-300 ${
        scrolled ? 'border-cream-100/10 bg-ink-950/90 backdrop-blur-md' : 'border-transparent bg-ink-950/60 backdrop-blur-sm'
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4 lg:h-20">
        <Link to="/" aria-label={`${site.name} home`} className="shrink-0">
          <Wordmark />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-6 whitespace-nowrap xl:flex">
          {navLinks.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {l.label === 'Fridays Flame' ? (
                <span className="inline-flex items-center gap-1">
                  <Flame className="size-3.5 text-ember-400" aria-hidden />
                  {l.label}
                </span>
              ) : (
                l.label
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden xl:block">
            <CurrencySwitch />
          </span>
          <button
            type="button"
            onClick={cart.open}
            className="relative flex size-11 items-center justify-center rounded-full text-cream-100 transition hover:bg-cream-100/10"
            aria-label={`Open your order, ${cart.count} item${cart.count === 1 ? '' : 's'}`}
          >
            <ShoppingBag className="size-5" aria-hidden />
            {cart.count > 0 && (
              <span className="absolute top-1 right-1 flex min-w-5 items-center justify-center rounded-full bg-ember-500 px-1 text-[11px] font-bold text-ink-950">
                {cart.count}
              </span>
            )}
          </button>
          <Link to="/reserve" className="btn-primary hidden py-2.5 whitespace-nowrap sm:inline-flex">
            <CalendarDays className="size-4" aria-hidden />
            Reserve a Table
          </Link>
          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-full text-cream-100 hover:bg-cream-100/10 xl:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            <MenuIcon className="size-6" aria-hidden />
          </button>
        </div>
      </div>

      {open &&
        createPortal(
        <div className="fixed inset-0 z-50 xl:hidden" id="mobile-nav" role="dialog" aria-modal="true" aria-label="Site menu">
          <div className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-ink-900 shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-cream-100/10 px-5">
              <Wordmark />
              <button
                ref={closeRef}
                type="button"
                className="flex size-11 items-center justify-center rounded-full hover:bg-cream-100/10"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <X className="size-6" aria-hidden />
              </button>
            </div>
            <nav aria-label="Mobile" className="flex flex-1 flex-col gap-1 overflow-y-auto p-5">
              {[{ to: '/', label: 'Home' }, ...navLinks, { to: '/reserve', label: 'Reservations' }].map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === '/'}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-3 font-display text-xl transition ${isActive ? 'bg-cream-100/5 text-flame-300' : 'text-cream-100 hover:bg-cream-100/5'}`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
            </nav>
            <div className="space-y-3 border-t border-cream-100/10 p-5">
              <div className="flex items-center justify-between text-sm text-cream-300">
                Prices in <CurrencySwitch />
              </div>
              <Link to="/reserve" className="btn-primary w-full">
                Reserve a Table
              </Link>
              <Link to="/order" className="btn-secondary w-full">
                Order Online
              </Link>
            </div>
          </div>
        </div>,
          document.body,
        )}
    </header>
  )
}

function Footer() {
  return (
    <footer className="no-print border-t border-cream-100/10 bg-ink-900">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Wordmark className="text-3xl" />
          <p className="mt-3 text-sm text-cream-300">{site.tagline}</p>
          <p className="mt-4 flex items-start gap-2 text-sm text-cream-300">
            <MapPin className="mt-0.5 size-4 shrink-0 text-flame-400" aria-hidden />
            {site.location.city}, {site.location.country}
          </p>
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-ember-500/10 px-3 py-1 text-xs font-semibold text-ember-400">
            <Flame className="size-3.5" aria-hidden /> {fridaysFlame.name}: Fridays {fridaysFlame.timeDisplay}
          </p>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-cream-50">Explore</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[{ to: '/', label: 'Home' }, ...navLinks, { to: '/reserve', label: 'Reservations' }, { to: '/tickets/verify', label: 'Verify a ticket' }].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-cream-300 transition hover:text-flame-300">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-cream-50">Contact</h2>
          <ul className="mt-4 space-y-3 text-sm text-cream-300">
            <li className="flex items-center gap-2">
              <Phone className="size-4 text-flame-400" aria-hidden />
              <a href={`tel:${site.contact.phone}`} className="hover:text-flame-300">
                {site.contact.phoneDisplay}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 text-flame-400" aria-hidden />
              <a href={`mailto:${site.contact.email}`} className="break-all hover:text-flame-300">
                {site.contact.email}
              </a>
            </li>
            {site.contact.isPlaceholder && <li className="text-xs text-cream-500">Placeholder contact details.</li>}
          </ul>
          <h2 className="mt-6 text-sm font-semibold text-cream-50">Follow</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {site.social.map((s) => (
              <li key={s.label}>
                {s.href ? (
                  <a href={s.href} target="_blank" rel="noreferrer" className="chip">
                    {s.label}
                  </a>
                ) : (
                  <span className="inline-flex rounded-full border border-cream-100/15 px-3 py-1 text-xs text-cream-500" title="Link coming soon">
                    {s.label} · soon
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-cream-50">Opening hours</h2>
          <dl className="mt-4 space-y-2 text-sm">
            {site.hours.map((h) => (
              <div key={h.label} className="flex justify-between gap-4">
                <dt className="text-cream-300">{h.label}</dt>
                <dd className="text-cream-100 tabular-nums">
                  {formatTime(h.open)} – {formatTime(h.close)}
                </dd>
              </div>
            ))}
          </dl>
          {site.hoursArePlaceholder && <p className="mt-3 text-xs text-cream-500">Hours to be confirmed.</p>}
        </div>
      </div>
      <div className="border-t border-cream-100/10">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-cream-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}, {site.location.city}. All rights reserved.
          </p>
          <p>
            Website demo designed &amp; built by{' '}
            {site.builtBy.url ? (
              <a href={site.builtBy.url} className="font-semibold text-cream-300 hover:text-flame-300">
                {site.builtBy.name}
              </a>
            ) : (
              <span className="font-semibold text-cream-300">{site.builtBy.name}</span>
            )}
            , {site.builtBy.location}
          </p>
        </div>
      </div>
    </footer>
  )
}

function AddedToast() {
  const { lastAdded, open, isOpen } = useCart()
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (!lastAdded) return
    setVisible(true)
    const t = window.setTimeout(() => setVisible(false), 2600)
    return () => window.clearTimeout(t)
  }, [lastAdded])
  const item = lastAdded ? menuById.get(lastAdded.id) : undefined
  if (!item || !visible || isOpen) return null
  return (
    <div className="no-print fixed inset-x-4 bottom-4 z-40 flex justify-center sm:inset-x-auto sm:right-6 sm:bottom-6" role="status">
      <div className="flex w-full max-w-sm animate-fade-up items-center justify-between gap-4 rounded-2xl border border-cream-100/10 bg-ink-800 px-4 py-3 shadow-2xl">
        <p className="text-sm">
          <span className="font-semibold text-cream-50">{item.name}</span> <span className="text-cream-300">added to your order</span>
        </p>
        <button type="button" onClick={open} className="shrink-0 text-sm font-semibold text-flame-300 hover:text-flame-400">
          View
        </button>
      </div>
    </div>
  )
}
