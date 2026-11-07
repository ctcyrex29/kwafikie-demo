import { Link } from 'react-router'
import { QRCodeSVG } from 'qrcode.react'
import { Flame, Printer, ShieldCheck } from 'lucide-react'
import { fridaysFlame, site } from '../config/site'
import { formatLongDate, fromIsoDate } from '../lib/dates'
import { useCurrency } from '../lib/currency'
import type { DemoTicket } from '../lib/tickets'

export function TicketCard({ ticket }: { ticket: DemoTicket }) {
  const { format } = useCurrency()
  const date = fromIsoDate(ticket.eventDate)

  return (
    <div>
      <article className="print-area mx-auto max-w-2xl overflow-hidden rounded-3xl border border-ember-500/40 bg-ink-900 print:border-neutral-400 print:bg-white">
        <div className="relative bg-gradient-to-br from-ember-600 via-ember-500 to-flame-400 px-7 py-6 text-ink-950 print:bg-none">
          <span className="mb-3 inline-block rounded-full border-2 border-ink-950 px-3 py-1 text-xs font-extrabold tracking-wider uppercase sm:absolute sm:top-5 sm:right-5 sm:mb-0">
            Demo ticket
          </span>
          <p className="text-xs font-bold tracking-[0.2em] uppercase opacity-80">{site.name} presents</p>
          <p className="mt-1 flex items-center gap-2 font-display text-4xl font-semibold italic">
            <Flame className="size-7" aria-hidden /> {ticket.eventName}
          </p>
        </div>

        <div className="grid gap-6 p-7 sm:grid-cols-[1fr_auto] print:text-black">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <Item label="Name" value={ticket.purchaserName} wide />
            <Item label="Date" value={date ? formatLongDate(date) : ticket.eventDate} wide />
            <Item label="Time" value={fridaysFlame.timeDisplay} />
            <Item label="Venue" value={`${site.name}, ${site.location.city}`} />
            <Item label="Ticket type" value={ticket.ticketTypeName} />
            <Item label="Admits" value={`${ticket.quantity} ${ticket.quantity === 1 ? 'person' : 'people'}`} />
            <Item label="Paid (simulated)" value={format(ticket.totalUsd)} />
            <Item label="Status" value={ticket.usedAt ? 'Redeemed' : 'Valid (demo)'} />
          </dl>
          <div className="flex flex-col items-center justify-center gap-2 border-t border-dashed border-cream-100/20 pt-6 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-6">
            <div className="rounded-2xl bg-white p-3">
              <QRCodeSVG value={ticket.reference} size={148} level="M" marginSize={0} title={`QR code for ${ticket.reference}`} />
            </div>
            <p className="font-mono text-sm font-bold tracking-wider text-cream-50 print:text-black">{ticket.reference}</p>
          </div>
        </div>

        <p className="border-t border-cream-100/10 px-7 py-4 text-xs leading-relaxed text-cream-500 print:text-neutral-600">
          DEMONSTRATION TICKET. Not valid for entry. No payment was taken. Created by the {site.builtBy.name} website demo.
        </p>
      </article>

      <div className="no-print mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <button type="button" onClick={() => window.print()} className="btn-secondary">
          <Printer className="size-4" aria-hidden /> Print ticket
        </button>
        <Link to={`/tickets/verify?ref=${ticket.reference}`} className="btn-secondary">
          <ShieldCheck className="size-4" aria-hidden /> Verify this ticket
        </Link>
      </div>
    </div>
  )
}

function Item({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={wide ? 'col-span-2' : ''}>
      <dt className="text-xs tracking-wider text-cream-500 uppercase print:text-neutral-500">{label}</dt>
      <dd className="mt-0.5 font-semibold text-cream-50 print:text-black">{value}</dd>
    </div>
  )
}
