/**
 * KwaFikie demo configuration.
 *
 * Every business detail on the website comes from this file (and menu.ts).
 * Values marked PLACEHOLDER must be replaced with KwaFikie's real details
 * before the site goes live.
 */

export type CurrencyCode = 'USD' | 'ZWG'

export interface CurrencyConfig {
  code: CurrencyCode
  /** Shown before the amount, e.g. "US$12.00" or "ZiG 320.00". */
  prefix: string
  /** Units of this currency per 1 USD. Menu and ticket prices are stored in USD. */
  ratePerUsd: number
  decimals: number
  label: string
}

export interface OpeningHours {
  label: string
  /** JavaScript day numbers: 0 = Sunday … 6 = Saturday. */
  days: number[]
  open: string // "HH:MM", 24-hour
  close: string
}

export const site = {
  name: 'KwaFikie',
  tagline: 'Restaurant · Braai · Entertainment',

  /** Replace `src` with the official logo path (e.g. "/logo.svg") when supplied. */
  logo: { src: null as string | null, alt: 'KwaFikie' },

  location: {
    address: 'Street address to be confirmed', // PLACEHOLDER
    city: 'Masvingo',
    country: 'Zimbabwe',
    directions: 'Directions and landmarks to be confirmed by KwaFikie.', // PLACEHOLDER
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Masvingo%2C%20Zimbabwe', // PLACEHOLDER: link to the exact pin
  },

  contact: {
    /** Digits only, international format, no "+". PLACEHOLDER: not a working number. */
    whatsapp: '263780814941',
    whatsappDisplay: '+263 78 081 4941',
    phone: '+263 78 081 4941', // PLACEHOLDER
    phoneDisplay: '+263 78 081 4941',
    email: 'hello@kwafikie.example', // PLACEHOLDER (.example never delivers)
    /** While true the site shows a notice that contact details are placeholders. */
    isPlaceholder: true,
  },

  /** `href: null` renders as "coming soon" so the demo has no dead links. */
  social: [
    { label: 'Facebook', href: null as string | null },
    { label: 'Instagram', href: null as string | null },
    { label: 'TikTok', href: null as string | null },
  ],

  /** PLACEHOLDER opening hours. */
  hours: [
    { label: 'Monday – Thursday', days: [1, 2, 3, 4], open: '10:00', close: '21:00' },
    { label: 'Friday', days: [5], open: '10:00', close: '23:00' },
    { label: 'Saturday', days: [6], open: '10:00', close: '23:00' },
    { label: 'Sunday', days: [0], open: '11:00', close: '20:00' },
  ] satisfies OpeningHours[],
  hoursArePlaceholder: true,

  ordering: {
    /** Delivery is offered in the checkout form while true. */
    deliveryEnabled: true,
    deliveryNote: 'Delivery areas and fees are confirmed by KwaFikie on WhatsApp.',
  },

  reservations: {
    maxGuests: 20,
    slotMinutes: 30,
    /** Last booking this many minutes before closing. */
    lastSeatingBeforeCloseMinutes: 60,
    /** How far ahead guests may book. */
    maxDaysAhead: 60,
  },

  currency: {
    default: 'USD' as CurrencyCode,
    /** Set to false to hide the US$ / ZiG switch. */
    allowSwitching: true,
    options: {
      USD: { code: 'USD', prefix: 'US$', ratePerUsd: 1, decimals: 2, label: 'US Dollar' },
      // PLACEHOLDER rate. Confirm the rate KwaFikie uses, or set allowSwitching to false.
      ZWG: { code: 'ZWG', prefix: 'ZiG ', ratePerUsd: 26.8, decimals: 2, label: 'Zimbabwe Gold (ZiG)' },
    } satisfies Record<CurrencyCode, CurrencyConfig>,
    zigRateIsDemo: true,
  },

  builtBy: {
    name: 'InkGenius Technologies',
    location: 'Masvingo, Zimbabwe',
    url: null as string | null, // add the InkGenius website URL here
  },
}

export const fridaysFlame = {
  name: 'Fridays Flame',
  /** 5 = Friday */
  weekday: 5,
  start: '18:00',
  end: '22:00',
  timeDisplay: '6 PM – 10 PM',
  shortPitch: 'Braai, food, drinks and music. Every Friday at KwaFikie.',
  description:
    'Fridays Flame is KwaFikie’s weekly braai night: the grills are lit, the drinks are cold and the music carries the evening. Come straight from work, bring the whole crew and end the week properly.',
  highlights: [
    { title: 'Open-flame braai', text: 'Meat grilled over the fire all evening, plated hot as it comes off the grill.' },
    { title: 'Cold drinks', text: 'A full bar and soft drinks to carry you from sunset to the last song.' },
    { title: 'Live music & DJs', text: 'Music from 6 PM. Line-ups are announced each week.' },
    { title: 'Good company', text: 'Tables for two or twenty. Bring friends, family or the office.' },
  ],
  /** Sample flow for the demo; KwaFikie to confirm the real programme. */
  sampleEvening: [
    { time: '18:00', title: 'Grills are lit', text: 'Doors open and the first platters come off the fire.' },
    { time: '19:00', title: 'Music starts', text: 'DJ or live act takes over (line-up announced weekly).' },
    { time: '20:30', title: 'Peak of the night', text: 'Full grill, full bar, full dance floor.' },
    { time: '22:00', title: 'Last call', text: 'The fire burns down. See you next Friday.' },
  ],
  venue: 'KwaFikie, Masvingo. Exact venue details to be confirmed.', // PLACEHOLDER
}

export interface TicketType {
  id: string
  name: string
  priceUsd: number
  description: string
  inclusions: string[]
  maxPerOrder: number
}

/** DEMO ticket prices and inclusions, pending confirmation from KwaFikie. */
export const ticketTypes: TicketType[] = [
  {
    id: 'general',
    name: 'General Admission',
    priceUsd: 5,
    description: 'Entry to Fridays Flame for one person.',
    inclusions: ['Entry from 6 PM', 'Access to the braai and bar', 'Live music all night'],
    maxPerOrder: 10,
  },
  {
    id: 'vip',
    name: 'VIP',
    priceUsd: 15,
    description: 'Reserved seating close to the action.',
    inclusions: ['Priority entry', 'Reserved VIP seating', 'Welcome drink (example inclusion)'],
    maxPerOrder: 8,
  },
]
