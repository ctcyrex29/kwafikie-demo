import { Link, useParams } from 'react-router'
import { ArrowLeft, TicketX } from 'lucide-react'
import { TicketCard } from '../components/TicketCard'
import { findTicket } from '../lib/tickets'

export function TicketViewPage() {
  const { reference = '' } = useParams()
  const ticket = findTicket(reference)

  return (
    <div className="container-page py-12 sm:py-16">
      <Link to="/tickets" className="no-print inline-flex items-center gap-2 text-sm text-cream-300 hover:text-flame-300">
        <ArrowLeft className="size-4" aria-hidden /> Back to tickets
      </Link>
      {ticket ? (
        <div className="mt-8">
          <h1 className="sr-only">Demo ticket {ticket.reference}</h1>
          <TicketCard ticket={ticket} />
        </div>
      ) : (
        <div className="flex flex-col items-center py-20 text-center">
          <TicketX className="size-10 text-flame-400" aria-hidden />
          <h1 className="heading-lg mt-6">Ticket not found</h1>
          <p className="mt-3 max-w-md text-cream-300">
            Demo tickets are stored in the browser they were bought in. This reference is not on this device.
          </p>
          <Link to="/tickets" className="btn-primary mt-8">
            Get tickets
          </Link>
        </div>
      )}
    </div>
  )
}
