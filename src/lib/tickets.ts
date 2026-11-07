/**
 * DEMO ticket store. Tickets live in this browser's localStorage only.
 * Anyone can edit localStorage, so this is not secure: production ticketing
 * needs server-side issuing, signed references and a shared redemption log.
 */
import { readJson, writeJson } from './storage'

export interface DemoTicket {
  reference: string
  eventName: string
  eventDate: string // YYYY-MM-DD
  ticketTypeId: string
  ticketTypeName: string
  quantity: number
  unitPriceUsd: number
  totalUsd: number
  purchaserName: string
  email: string
  whatsapp: string
  createdAt: string
  usedAt: string | null
}

const KEY = 'demo-tickets'

export function loadTickets(): DemoTicket[] {
  const list = readJson<DemoTicket[]>(KEY, [])
  return Array.isArray(list) ? list : []
}

function saveTickets(list: DemoTicket[]) {
  writeJson(KEY, list)
}

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no 0/O/1/I

function randomCode(length: number): string {
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join('')
}

/** e.g. "FF-261113-7KQ2MX" (event date + random part). */
export function newReference(eventDate: string): string {
  const existing = new Set(loadTickets().map((t) => t.reference))
  const datePart = eventDate.replace(/-/g, '').slice(2)
  let ref: string
  do ref = `FF-${datePart}-${randomCode(6)}`
  while (existing.has(ref))
  return ref
}

export function normaliseReference(input: string): string {
  return input.trim().toUpperCase().replace(/\s+/g, '')
}

export function addTicket(ticket: DemoTicket): void {
  saveTickets([ticket, ...loadTickets()])
}

export function findTicket(reference: string): DemoTicket | undefined {
  const ref = normaliseReference(reference)
  return loadTickets().find((t) => t.reference === ref)
}

export function redeemTicket(reference: string): DemoTicket | undefined {
  const ref = normaliseReference(reference)
  let updated: DemoTicket | undefined
  const list = loadTickets().map((t) => {
    if (t.reference !== ref || t.usedAt) return t
    updated = { ...t, usedAt: new Date().toISOString() }
    return updated
  })
  if (updated) saveTickets(list)
  return updated
}
