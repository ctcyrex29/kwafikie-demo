import { fridaysFlame, site, type OpeningHours } from '../config/site'

/** "YYYY-MM-DD" for a local date (not UTC). */
export function toIsoDate(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

/** Parses "YYYY-MM-DD" as a local date. */
export function fromIsoDate(iso: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso)
  if (!match) return null
  const d = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  return Number.isNaN(d.getTime()) ? null : d
}

export function startOfToday(): Date {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

export function addDays(d: Date, days: number): Date {
  const next = new Date(d)
  next.setDate(next.getDate() + days)
  return next
}

export function formatLongDate(d: Date): string {
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export function formatShortDate(d: Date): string {
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
}

/** "18:30" -> "6:30 PM" */
export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 === 0 ? 12 : h % 12
  return m === 0 ? `${hour} ${suffix}` : `${hour}:${String(m).padStart(2, '0')} ${suffix}`
}

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}
const fromMinutes = (mins: number) =>
  `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`

export function hoursFor(d: Date): OpeningHours | undefined {
  return site.hours.find((h) => h.days.includes(d.getDay()))
}

export function isFridaysFlame(d: Date): boolean {
  return d.getDay() === fridaysFlame.weekday
}

/** Bookable time slots for a date. Past slots are removed when the date is today. */
export function reservationSlots(d: Date, now = new Date()): string[] {
  const hours = hoursFor(d)
  if (!hours) return []
  const { slotMinutes, lastSeatingBeforeCloseMinutes } = site.reservations
  const open = toMinutes(hours.open)
  const last = toMinutes(hours.close) - lastSeatingBeforeCloseMinutes
  const isToday = toIsoDate(d) === toIsoDate(now)
  const earliest = isToday ? now.getHours() * 60 + now.getMinutes() + 30 : 0
  const slots: string[] = []
  for (let t = open; t <= last; t += slotMinutes) {
    if (t >= earliest) slots.push(fromMinutes(t))
  }
  return slots
}

/** The next `count` Fridays Flame dates. Today counts until the event ends. */
export function upcomingFridays(count: number, now = new Date()): Date[] {
  const today = startOfToday()
  let offset = (fridaysFlame.weekday - today.getDay() + 7) % 7
  if (offset === 0 && now.getHours() * 60 + now.getMinutes() >= toMinutes(fridaysFlame.end)) offset = 7
  return Array.from({ length: count }, (_, i) => addDays(today, offset + i * 7))
}

/** Date-time when the next Fridays Flame starts (or the current one, if it is on now). */
export function nextFlameStart(now = new Date()): { start: Date; isLive: boolean } {
  const [first] = upcomingFridays(1, now)
  const start = new Date(first)
  const [h, m] = fridaysFlame.start.split(':').map(Number)
  start.setHours(h, m, 0, 0)
  return { start, isLive: now >= start }
}

export function todaysHoursLabel(now = new Date()): string {
  const h = hoursFor(now)
  return h ? `Open today ${formatTime(h.open)} – ${formatTime(h.close)}` : 'Closed today'
}
