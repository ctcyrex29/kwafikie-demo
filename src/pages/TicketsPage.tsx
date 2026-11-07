import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AlertTriangle, ArrowLeft, Check, CreditCard, Flame, Smartphone, Ticket } from 'lucide-react'
import { fridaysFlame, ticketTypes, type TicketType } from '../config/site'
import { images } from '../config/menu'
import { TicketCard } from '../components/TicketCard'
import { DemoChip, Field, Notice, PageHero, QuantityStepper, Spinner, Steps } from '../components/ui'
import { round2 } from '../lib/cart'
import { useCurrency } from '../lib/currency'
import { formatShortDate, fromIsoDate, toIsoDate, upcomingFridays } from '../lib/dates'
import { addTicket, loadTickets, newReference, type DemoTicket } from '../lib/tickets'
import { nameField, phoneField } from '../lib/validation'

const detailsSchema = z.object({
  fullName: nameField,
  email: z.string().trim().min(1, 'Please enter your email address.').email('Please enter a valid email address.'),
  whatsapp: phoneField(true),
})
type Details = z.infer<typeof detailsSchema>

type Step = 0 | 1 | 2 | 3

export function TicketsPage() {
  const { format } = useCurrency()
  const [params] = useSearchParams()
  const fridays = upcomingFridays(4)

  const [step, setStep] = useState<Step>(0)
  const [typeId, setTypeId] = useState(() => ticketTypes.find((t) => t.id === params.get('type'))?.id ?? ticketTypes[0].id)
  const [quantity, setQuantity] = useState(1)
  const [eventDate, setEventDate] = useState(toIsoDate(fridays[0]))
  const [details, setDetails] = useState<Details | null>(null)
  const [ticket, setTicket] = useState<DemoTicket | null>(null)

  const type = ticketTypes.find((t) => t.id === typeId) as TicketType
  const qty = Math.min(quantity, type.maxPerOrder)
  const total = round2(type.priceUsd * qty)

  const go = (s: Step) => {
    setStep(s)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <PageHero eyebrow={`${fridaysFlame.name} tickets`} title="Your ticket to Friday night" image={images.crowd}>
        <p>Choose your tickets, pay and get a QR ticket on your phone. This is a demonstration of the ticketing flow.</p>
      </PageHero>

      <div className="container-page py-12 sm:py-16">
        <Notice tone="warn">
          <strong>Demo ticketing.</strong> Prices are demo prices pending confirmation, payment is simulated (no money is taken)
          and tickets are stored in this browser only. Demo tickets are not valid for entry.
        </Notice>

        <div className="mt-8">
          <Steps steps={['Tickets', 'Your details', 'Payment', 'Your ticket']} current={step} />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem]">
          <div>
            {step === 0 && (
              <div className="space-y-8">
                <fieldset>
                  <legend className="field-label">Which Friday?</legend>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {fridays.map((d) => {
                      const iso = toIsoDate(d)
                      return (
                        <label
                          key={iso}
                          className={`cursor-pointer rounded-xl border p-4 text-center transition ${
                            eventDate === iso ? 'border-flame-400 bg-flame-400/5' : 'border-cream-100/15 hover:border-cream-100/30'
                          }`}
                        >
                          <input type="radio" name="date" value={iso} checked={eventDate === iso} onChange={() => setEventDate(iso)} className="sr-only" />
                          <span className="block text-xs text-cream-500">{iso === toIsoDate(fridays[0]) ? 'This Friday' : 'Friday'}</span>
                          <span className="mt-1 block font-semibold text-cream-50">{formatShortDate(d).replace(/^\w+ /, '')}</span>
                        </label>
                      )
                    })}
                  </div>
                </fieldset>

                <fieldset>
                  <legend className="field-label flex items-center gap-2">
                    Ticket type <DemoChip>Demo prices</DemoChip>
                  </legend>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {ticketTypes.map((t) => (
                      <label
                        key={t.id}
                        className={`flex cursor-pointer flex-col rounded-2xl border p-6 transition ${
                          typeId === t.id ? 'border-flame-400 bg-flame-400/5' : 'border-cream-100/15 hover:border-cream-100/30'
                        }`}
                      >
                        <input type="radio" name="type" value={t.id} checked={typeId === t.id} onChange={() => setTypeId(t.id)} className="sr-only" />
                        <span className="flex items-start justify-between gap-3">
                          <span className="font-display text-xl text-cream-50">{t.name}</span>
                          <span className={`flex size-6 items-center justify-center rounded-full border ${typeId === t.id ? 'border-flame-400 bg-flame-400 text-ink-950' : 'border-cream-100/30'}`}>
                            {typeId === t.id && <Check className="size-4" aria-hidden />}
                          </span>
                        </span>
                        <span className="mt-1 text-sm text-cream-300">{t.description}</span>
                        <span className="mt-4 font-display text-3xl text-flame-300">{format(t.priceUsd)}</span>
                        <ul className="mt-4 space-y-1.5 text-xs text-cream-300">
                          {t.inclusions.map((i) => (
                            <li key={i} className="flex gap-1.5">
                              <Check className="size-3.5 shrink-0 text-flame-400" aria-hidden /> {i}
                            </li>
                          ))}
                        </ul>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-cream-100/10 p-5">
                  <div>
                    <p className="font-semibold text-cream-50">Quantity</p>
                    <p className="text-xs text-cream-500">Up to {type.maxPerOrder} per order</p>
                  </div>
                  <QuantityStepper label="ticket quantity" value={qty} min={1} max={type.maxPerOrder} onChange={setQuantity} />
                </div>

                <button type="button" onClick={() => go(1)} className="btn-primary w-full py-3.5 sm:w-auto">
                  Continue · {format(total)}
                </button>
              </div>
            )}

            {step === 1 && (
              <DetailsForm
                initial={details}
                quantity={qty}
                maxQuantity={type.maxPerOrder}
                onQuantity={setQuantity}
                onBack={() => go(0)}
                onSubmit={(d) => {
                  setDetails(d)
                  go(2)
                }}
              />
            )}

            {step === 2 && details && (
              <DemoPayment
                totalLabel={format(total)}
                onBack={() => go(1)}
                onPaid={() => {
                  const t: DemoTicket = {
                    reference: newReference(eventDate),
                    eventName: fridaysFlame.name,
                    eventDate,
                    ticketTypeId: type.id,
                    ticketTypeName: type.name,
                    quantity: qty,
                    unitPriceUsd: type.priceUsd,
                    totalUsd: total,
                    purchaserName: details.fullName,
                    email: details.email,
                    whatsapp: details.whatsapp,
                    createdAt: new Date().toISOString(),
                    usedAt: null,
                  }
                  addTicket(t)
                  setTicket(t)
                  go(3)
                }}
              />
            )}

            {step === 3 && ticket && (
              <div className="space-y-8">
                <div className="flex gap-3 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-5 text-sm" role="status">
                  <Check className="size-5 shrink-0 text-emerald-300" aria-hidden />
                  <p>
                    <span className="font-semibold text-cream-50">Demo payment simulated.</span>{' '}
                    <span className="text-cream-300">
                      Your demo ticket is saved in this browser. No money was received and this ticket is not valid for entry.
                    </span>
                  </p>
                </div>
                <TicketCard ticket={ticket} />
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setTicket(null)
                      setQuantity(1)
                      go(0)
                    }}
                    className="btn-ghost"
                  >
                    Get more tickets
                  </button>
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="card p-6 lg:sticky lg:top-28">
              <h2 className="flex items-center gap-2 font-display text-2xl text-cream-50">
                <Flame className="size-5 text-ember-400" aria-hidden /> Summary
              </h2>
              <dl className="mt-5 space-y-3 text-sm">
                <Row label="Event" value={fridaysFlame.name} />
                <Row label="Date" value={(() => { const d = fromIsoDate(eventDate); return d ? formatShortDate(d) : eventDate })()} />
                <Row label="Time" value={fridaysFlame.timeDisplay} />
                <Row label="Ticket" value={type.name} />
                <Row label="Quantity" value={`${qty} × ${format(type.priceUsd)}`} />
                {details && <Row label="Name" value={details.fullName} />}
              </dl>
              <div className="mt-5 flex justify-between border-t border-cream-100/10 pt-4 text-lg font-semibold text-cream-50">
                <span>Total</span>
                <span className="tabular-nums">{format(total)}</span>
              </div>
              <p className="mt-2 text-xs text-cream-500">Demo prices, pending confirmation.</p>
            </div>
            <MyTickets refreshKey={ticket?.reference} />
          </aside>
        </div>
      </div>
    </>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-cream-500">{label}</dt>
      <dd className="text-right font-medium text-cream-100">{value}</dd>
    </div>
  )
}

function DetailsForm({
  initial,
  quantity,
  maxQuantity,
  onQuantity,
  onBack,
  onSubmit,
}: {
  initial: Details | null
  quantity: number
  maxQuantity: number
  onQuantity: (q: number) => void
  onBack: () => void
  onSubmit: (d: Details) => void
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Details>({
    resolver: zodResolver(detailsSchema),
    defaultValues: initial ?? { fullName: '', email: '', whatsapp: '' },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="card space-y-5 p-6 sm:p-8">
      <h2 className="font-display text-2xl text-cream-50">Purchaser details</h2>
      <Field id="t-name" label="Full name" error={errors.fullName?.message} hint="Shown on the ticket.">
        <input id="t-name" className="field-input" autoComplete="name" aria-invalid={!!errors.fullName} aria-describedby={errors.fullName ? 't-name-error' : undefined} {...register('fullName')} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="t-email" label="Email address" error={errors.email?.message}>
          <input id="t-email" type="email" className="field-input" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? 't-email-error' : undefined} {...register('email')} />
        </Field>
        <Field id="t-wa" label="WhatsApp number" error={errors.whatsapp?.message}>
          <input id="t-wa" type="tel" inputMode="tel" className="field-input" autoComplete="tel" placeholder="07X XXX XXXX" aria-invalid={!!errors.whatsapp} aria-describedby={errors.whatsapp ? 't-wa-error' : undefined} {...register('whatsapp')} />
        </Field>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-ink-850 p-4">
        <span className="text-sm font-medium text-cream-100">Ticket quantity</span>
        <QuantityStepper label="ticket quantity" value={quantity} min={1} max={maxQuantity} onChange={onQuantity} />
      </div>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button type="button" onClick={onBack} className="btn-secondary">
          <ArrowLeft className="size-4" aria-hidden /> Back
        </button>
        <button type="submit" className="btn-primary">
          Continue to payment
        </button>
      </div>
    </form>
  )
}

function DemoPayment({ totalLabel, onBack, onPaid }: { totalLabel: string; onBack: () => void; onPaid: () => void }) {
  const [method, setMethod] = useState<'mobile' | 'card'>('mobile')
  const [state, setState] = useState<'idle' | 'processing' | 'failed'>('idle')

  const simulate = (outcome: 'success' | 'failure') => {
    setState('processing')
    window.setTimeout(() => {
      if (outcome === 'success') onPaid()
      else setState('failed')
    }, 1600)
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center gap-3 border-b border-dashed border-flame-400/40 bg-flame-400/10 px-6 py-4 text-sm text-flame-300">
        <AlertTriangle className="size-5 shrink-0" aria-hidden />
        <p>
          <strong>Demo Payment.</strong> This screen simulates checkout. No payment provider is connected and no money is taken.
        </p>
      </div>
      <div className="space-y-6 p-6 sm:p-8">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-2xl text-cream-50">Payment</h2>
          <p className="font-display text-3xl text-flame-300 tabular-nums">{totalLabel}</p>
        </div>

        <fieldset disabled={state === 'processing'}>
          <legend className="field-label">Payment method (simulated)</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { id: 'mobile' as const, label: 'Mobile money', icon: Smartphone },
              { id: 'card' as const, label: 'Bank card', icon: CreditCard },
            ].map(({ id, label, icon: Icon }) => (
              <label
                key={id}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                  method === id ? 'border-flame-400 bg-flame-400/5' : 'border-cream-100/15 hover:border-cream-100/30'
                }`}
              >
                <input type="radio" name="method" checked={method === id} onChange={() => setMethod(id)} className="sr-only" />
                <Icon className={`size-5 ${method === id ? 'text-flame-400' : 'text-cream-500'}`} aria-hidden />
                <span className="font-semibold text-cream-50">{label}</span>
                <span className="ml-auto text-xs text-cream-500">Demo</span>
              </label>
            ))}
          </div>
        </fieldset>

        {state === 'failed' && (
          <div className="rounded-xl border border-red-400/40 bg-red-400/10 p-4 text-sm text-red-200" role="alert">
            Simulated payment failed. No ticket was issued. You can try again.
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button type="button" onClick={() => simulate('success')} disabled={state === 'processing'} className="btn-primary py-3.5">
            {state === 'processing' ? (
              <>
                <Spinner /> Processing demo payment…
              </>
            ) : (
              <>
                <Ticket className="size-4" aria-hidden /> Simulate successful payment
              </>
            )}
          </button>
          <div className="flex flex-col-reverse justify-between gap-2 sm:flex-row">
            <button type="button" onClick={onBack} disabled={state === 'processing'} className="btn-ghost">
              <ArrowLeft className="size-4" aria-hidden /> Back
            </button>
            <button type="button" onClick={() => simulate('failure')} disabled={state === 'processing'} className="btn-ghost text-xs">
              Simulate a failed payment
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function MyTickets({ refreshKey }: { refreshKey?: string }) {
  void refreshKey // re-render when a new ticket is issued
  const tickets = loadTickets().slice(0, 5)
  if (tickets.length === 0) return null
  return (
    <div className="card p-6">
      <h2 className="font-semibold text-cream-50">Demo tickets on this device</h2>
      <ul className="mt-4 space-y-2">
        {tickets.map((t) => (
          <li key={t.reference}>
            <Link to={`/tickets/${t.reference}`} className="flex items-center justify-between gap-3 rounded-xl bg-ink-850 px-4 py-3 text-sm transition hover:bg-ink-800">
              <span>
                <span className="block font-mono font-semibold text-cream-50">{t.reference}</span>
                <span className="text-xs text-cream-500">
                  {t.quantity} × {t.ticketTypeName}
                </span>
              </span>
              <span className={`text-xs font-semibold ${t.usedAt ? 'text-cream-500' : 'text-emerald-300'}`}>{t.usedAt ? 'Used' : 'Valid'}</span>
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/tickets/verify" className="mt-4 inline-block text-sm font-semibold text-flame-300 hover:text-flame-400">
        Open ticket verification →
      </Link>
    </div>
  )
}
