import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CalendarDays, Clock, Flame, Users } from 'lucide-react'
import { fridaysFlame, site } from '../config/site'
import { images } from '../config/menu'
import { Field, Notice, PageHero, Steps } from '../components/ui'
import { WhatsAppSend } from '../components/WhatsAppSend'
import { reservationMessage, type ReservationDetails } from '../lib/messages'
import { addDays, formatLongDate, formatTime, fromIsoDate, hoursFor, isFridaysFlame, reservationSlots, startOfToday, toIsoDate } from '../lib/dates'
import { nameField, phoneField } from '../lib/validation'

const maxDate = () => addDays(startOfToday(), site.reservations.maxDaysAhead)

const schema = z
  .object({
    name: nameField,
    phone: phoneField(),
    date: z.string().min(1, 'Please choose a date.'),
    time: z.string().min(1, 'Please choose a time.'),
    guests: z.coerce.number().int().min(1, 'At least 1 guest.').max(site.reservations.maxGuests),
    requests: z.string().trim().max(500, 'Please keep requests under 500 characters.').optional(),
  })
  .superRefine((v, ctx) => {
    const d = fromIsoDate(v.date)
    if (!d) return ctx.addIssue({ code: 'custom', path: ['date'], message: 'Please choose a valid date.' })
    if (d < startOfToday()) return ctx.addIssue({ code: 'custom', path: ['date'], message: 'That date has already passed.' })
    if (d > maxDate())
      return ctx.addIssue({ code: 'custom', path: ['date'], message: `Bookings open up to ${site.reservations.maxDaysAhead} days ahead.` })
    if (!hoursFor(d)) return ctx.addIssue({ code: 'custom', path: ['date'], message: 'We are closed on that day.' })
    if (v.time && !reservationSlots(d).includes(v.time))
      ctx.addIssue({ code: 'custom', path: ['time'], message: 'Please choose an available time for this date.' })
  })

type FormInput = z.input<typeof schema>
type FormValues = z.output<typeof schema>

export function ReservePage() {
  const [params] = useSearchParams()
  const today = toIsoDate(startOfToday())
  const initialDate = (() => {
    const d = fromIsoDate(params.get('date') ?? '')
    return d && d >= startOfToday() ? toIsoDate(d) : today
  })()
  const initialGuests = Math.min(Math.max(Number(params.get('guests')) || 2, 1), site.reservations.maxGuests)

  const [details, setDetails] = useState<ReservationDetails | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', phone: '', date: initialDate, time: '', guests: initialGuests, requests: '' },
  })

  const date = watch('date')
  const selected = fromIsoDate(date)
  const slots = useMemo(() => (selected ? reservationSlots(selected) : []), [date]) // eslint-disable-line react-hooks/exhaustive-deps
  const flameNight = selected ? isFridaysFlame(selected) : false

  // Clear a time that is not offered on the newly chosen date.
  useEffect(() => {
    const t = getValues('time')
    if (t && !slots.includes(t)) setValue('time', '')
  }, [slots, getValues, setValue])

  return (
    <>
      <PageHero eyebrow="Reservations" title="Book your table" image={images.dining}>
        <p>Tell us when you are coming and how many you are. KwaFikie confirms every booking on WhatsApp.</p>
      </PageHero>

      <div className="container-page py-12 sm:py-16">
        <Steps steps={['Booking details', 'Review & send', 'Confirmation from KwaFikie']} current={details ? 1 : 0} />

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem]">
          <div className="card p-6 sm:p-8">
            {details ? (
              <>
                <h2 className="font-display text-2xl text-cream-50">Review your booking</h2>
                <ReservationSummary details={details} />
                <div className="mt-8">
                  <WhatsAppSend
                    message={reservationMessage(details)}
                    sendLabel="Send booking request"
                    onBack={() => setDetails(null)}
                    sentState={
                      <>
                        <p className="font-semibold text-cream-50">Booking request ready in WhatsApp: pending confirmation.</p>
                        <p>
                          Your table is <strong>not confirmed yet</strong>. Press send in WhatsApp and KwaFikie will reply to
                          confirm your booking.
                        </p>
                      </>
                    }
                  />
                </div>
              </>
            ) : (
              <form onSubmit={handleSubmit((v) => setDetails({ ...v, requests: v.requests || undefined }))} noValidate className="space-y-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field id="r-name" label="Full name" error={errors.name?.message}>
                    <input id="r-name" className="field-input" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'r-name-error' : undefined} {...register('name')} />
                  </Field>
                  <Field id="r-phone" label="Phone number" error={errors.phone?.message} hint="WhatsApp preferred.">
                    <input id="r-phone" type="tel" inputMode="tel" className="field-input" autoComplete="tel" placeholder="07X XXX XXXX" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'r-phone-error' : undefined} {...register('phone')} />
                  </Field>
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                  <Field id="r-date" label="Date" error={errors.date?.message}>
                    <input id="r-date" type="date" min={today} max={toIsoDate(maxDate())} className="field-input" aria-invalid={!!errors.date} aria-describedby={errors.date ? 'r-date-error' : undefined} {...register('date')} />
                  </Field>
                  <Field
                    id="r-time"
                    label="Time"
                    error={errors.time?.message}
                    hint={selected && slots.length === 0 ? 'No times left on this date.' : undefined}
                  >
                    <select id="r-time" className="field-input" disabled={slots.length === 0} aria-invalid={!!errors.time} aria-describedby={errors.time ? 'r-time-error' : undefined} {...register('time')}>
                      <option value="">Select a time</option>
                      {slots.map((s) => (
                        <option key={s} value={s}>
                          {formatTime(s)}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field id="r-guests" label="Guests" error={errors.guests?.message}>
                    <select id="r-guests" className="field-input" {...register('guests')}>
                      {Array.from({ length: site.reservations.maxGuests }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? 'guest' : 'guests'}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>

                {flameNight && (
                  <div className="flex animate-fade-up gap-4 rounded-2xl border border-ember-500/40 bg-gradient-to-r from-ember-500/15 to-transparent p-5">
                    <Flame className="size-6 shrink-0 animate-flicker text-ember-400" aria-hidden />
                    <div className="text-sm">
                      <p className="font-semibold text-cream-50">This is a {fridaysFlame.name} night</p>
                      <p className="mt-1 text-cream-300">
                        Braai, drinks and music from {fridaysFlame.timeDisplay}. Event entry may need a ticket.{' '}
                        <Link to="/tickets" className="font-semibold text-flame-300 hover:underline">
                          Get tickets
                        </Link>
                      </p>
                    </div>
                  </div>
                )}

                <Field id="r-requests" label={<>Special requests <span className="text-cream-500">(optional)</span></>} error={errors.requests?.message}>
                  <textarea id="r-requests" rows={3} className="field-input" placeholder="Birthday, high chair, outdoor seating…" aria-invalid={!!errors.requests} {...register('requests')} />
                </Field>

                <button type="submit" className="btn-primary w-full py-3.5 sm:w-auto">
                  Review booking
                </button>
              </form>
            )}
          </div>

          <aside className="space-y-6">
            <div className="card p-6">
              <h2 className="font-semibold text-cream-50">Opening hours</h2>
              <dl className="mt-4 space-y-2 text-sm">
                {site.hours.map((h) => (
                  <div key={h.label} className="flex justify-between gap-3">
                    <dt className="text-cream-300">{h.label}</dt>
                    <dd className="tabular-nums">
                      {formatTime(h.open)} – {formatTime(h.close)}
                    </dd>
                  </div>
                ))}
              </dl>
              {site.hoursArePlaceholder && <p className="mt-3 text-xs text-cream-500">Placeholder hours.</p>}
            </div>
            <Notice>
              Live table availability is not part of this demo. Every request is checked and confirmed by KwaFikie in person.
            </Notice>
          </aside>
        </div>
      </div>
    </>
  )
}

function ReservationSummary({ details }: { details: ReservationDetails }) {
  const d = fromIsoDate(details.date)
  const rows = [
    { icon: CalendarDays, label: 'Date', value: d ? formatLongDate(d) : details.date },
    { icon: Clock, label: 'Time', value: formatTime(details.time) },
    { icon: Users, label: 'Guests', value: `${details.guests}` },
  ]
  return (
    <div className="mt-5 space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {rows.map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-xl bg-ink-850 p-4">
            <Icon className="size-4 text-flame-400" aria-hidden />
            <p className="mt-2 text-xs text-cream-500">{label}</p>
            <p className="font-semibold text-cream-50">{value}</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-cream-300">
        For <span className="font-semibold text-cream-50">{details.name}</span> · {details.phone}
        {details.requests && (
          <>
            <br />
            Requests: {details.requests}
          </>
        )}
      </p>
      {d && isFridaysFlame(d) && (
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-ember-400">
          <Flame className="size-4" aria-hidden /> {fridaysFlame.name} night
        </p>
      )}
    </div>
  )
}
