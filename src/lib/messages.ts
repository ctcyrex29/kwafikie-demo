/** Formatted WhatsApp messages. *bold* and _italic_ use WhatsApp markup. */
import { fridaysFlame, site } from '../config/site'
import type { CartLine } from './cart'
import { formatLongDate, formatTime, fromIsoDate, isFridaysFlame } from './dates'
import { lines } from './whatsapp'

type Format = (usd: number) => string

export interface OrderDetails {
  name: string
  whatsapp: string
  orderType: 'collection' | 'delivery'
  address?: string
  notes?: string
}

export function orderMessage(order: OrderDetails, cartLines: CartLine[], totalUsd: number, format: Format): string {
  return lines(
    `*New order for ${site.name}*`,
    '_Sent from the KwaFikie website_',
    '',
    `*Name:* ${order.name}`,
    `*WhatsApp:* ${order.whatsapp}`,
    `*Order type:* ${order.orderType === 'delivery' ? 'Delivery' : 'Collection'}`,
    order.orderType === 'delivery' ? `*Delivery address:* ${order.address}` : null,
    '',
    '*Items*',
    ...cartLines.map((l) => `• ${l.quantity} × ${l.item.name} @ ${format(l.item.priceUsd)} = ${format(l.lineTotalUsd)}`),
    '',
    `*Order total: ${format(totalUsd)}*`,
    order.orderType === 'delivery' ? '_Delivery fee (if any) to be confirmed._' : null,
    order.notes ? '' : null,
    order.notes ? `*Notes:* ${order.notes}` : null,
    '',
    'Please confirm my order and the total. Thank you!',
  )
}

export interface ReservationDetails {
  name: string
  phone: string
  date: string
  time: string
  guests: number
  requests?: string
}

export function reservationMessage(r: ReservationDetails): string {
  const date = fromIsoDate(r.date)
  return lines(
    `*Table reservation request: ${site.name}*`,
    '_Sent from the KwaFikie website_',
    '',
    `*Name:* ${r.name}`,
    `*Phone:* ${r.phone}`,
    `*Date:* ${date ? formatLongDate(date) : r.date}`,
    `*Time:* ${formatTime(r.time)}`,
    `*Guests:* ${r.guests}`,
    date && isFridaysFlame(date) ? `_This is a ${fridaysFlame.name} night (${fridaysFlame.timeDisplay})._` : null,
    r.requests ? `*Special requests:* ${r.requests}` : null,
    '',
    'Please let me know if this booking is available. Thank you!',
  )
}

export interface ContactDetails {
  name: string
  contact: string
  subject: string
  message: string
}

export function contactMessage(c: ContactDetails): string {
  return lines(
    `*Message for ${site.name}*`,
    '_Sent from the KwaFikie website_',
    '',
    `*Name:* ${c.name}`,
    `*Reply to:* ${c.contact}`,
    `*Subject:* ${c.subject}`,
    '',
    c.message,
  )
}
