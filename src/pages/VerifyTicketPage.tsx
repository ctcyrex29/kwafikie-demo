import { useState, type FormEvent, type ReactNode } from 'react'
import { useSearchParams } from 'react-router'
import { CheckCircle2, ScanLine, ShieldAlert, XCircle } from 'lucide-react'
import { Notice, PageHero } from '../components/ui'
import { formatLongDate, fromIsoDate } from '../lib/dates'
import { findTicket, loadTickets, normaliseReference, redeemTicket, type DemoTicket } from '../lib/tickets'

type Result = { kind: 'valid' | 'used'; ticket: DemoTicket } | { kind: 'invalid'; reference: string } | null

function check(reference: string): Result {
  const ref = normaliseReference(reference)
  if (!ref) return null
  const ticket = findTicket(ref)
  if (!ticket) return { kind: 'invalid', reference: ref }
  return { kind: ticket.usedAt ? 'used' : 'valid', ticket }
}

export function VerifyTicketPage() {
  const [params] = useSearchParams()
  const [reference, setReference] = useState(params.get('ref') ?? '')
  const [result, setResult] = useState<Result>(() => check(params.get('ref') ?? ''))
  const [justRedeemed, setJustRedeemed] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setJustRedeemed(false)
    setResult(check(reference))
  }

  const redeem = (ref: string) => {
    const updated = redeemTicket(ref)
    if (updated) {
      setResult({ kind: 'used', ticket: updated })
      setJustRedeemed(true)
    }
  }

  const recent = loadTickets().slice(0, 4)

  return (
    <>
      <PageHero eyebrow="Door staff" title="Ticket verification">
        <p>Enter the reference printed under a ticket’s QR code to check it and mark it as used.</p>
      </PageHero>

      <div className="container-page grid gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <form onSubmit={submit} className="card flex flex-col gap-3 p-6 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label htmlFor="ref" className="field-label">
                Ticket reference
              </label>
              <input
                id="ref"
                className="field-input font-mono tracking-wider uppercase"
                placeholder="FF-YYMMDD-XXXXXX"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            <button type="submit" className="btn-primary py-3.5" disabled={!reference.trim()}>
              <ScanLine className="size-4" aria-hidden /> Check ticket
            </button>
          </form>

          <div aria-live="polite">
            {result?.kind === 'invalid' && (
              <ResultCard tone="red" icon={XCircle} title="Invalid ticket">
                No demo ticket with reference <span className="font-mono font-semibold">{result.reference}</span> exists on this
                device. Do not admit.
              </ResultCard>
            )}
            {result?.kind === 'valid' && (
              <ResultCard tone="green" icon={CheckCircle2} title="Valid demo ticket">
                <TicketFacts ticket={result.ticket} />
                <button type="button" onClick={() => redeem(result.ticket.reference)} className="btn-primary mt-5">
                  Admit &amp; mark as used
                </button>
              </ResultCard>
            )}
            {result?.kind === 'used' && (
              <ResultCard tone={justRedeemed ? 'green' : 'amber'} icon={justRedeemed ? CheckCircle2 : ShieldAlert} title={justRedeemed ? 'Admitted: ticket marked as used' : 'Ticket already used'}>
                <TicketFacts ticket={result.ticket} />
                <p className="mt-3">
                  Redeemed {new Date(result.ticket.usedAt!).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}.
                  {!justRedeemed && ' Do not admit again.'}
                </p>
              </ResultCard>
            )}
          </div>

          <Notice>
            <strong> Demonstration only.</strong> This check reads tickets saved in this browser, so it only recognises tickets
            bought on this device and anyone could edit them. A production system checks a shared server-side record for every
            scan, which is what stops copied or reused tickets. A QR code on its own does not prevent fraud.
          </Notice>
        </div>

        <aside className="card h-fit p-6">
          <h2 className="font-semibold text-cream-50">Try it</h2>
          {recent.length === 0 ? (
            <p className="mt-3 text-sm text-cream-300">Buy a demo ticket first, then check its reference here.</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {recent.map((t) => (
                <li key={t.reference}>
                  <button
                    type="button"
                    onClick={() => {
                      setReference(t.reference)
                      setJustRedeemed(false)
                      setResult(check(t.reference))
                    }}
                    className="flex w-full items-center justify-between rounded-xl bg-ink-850 px-4 py-3 text-left text-sm transition hover:bg-ink-800"
                  >
                    <span className="font-mono font-semibold text-cream-50">{t.reference}</span>
                    <span className={`text-xs ${t.usedAt ? 'text-cream-500' : 'text-emerald-300'}`}>{t.usedAt ? 'Used' : 'Valid'}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            onClick={() => {
              setReference('FF-000000-NOTREAL')
              setJustRedeemed(false)
              setResult(check('FF-000000-NOTREAL'))
            }}
            className="mt-3 text-xs font-semibold text-flame-300 hover:text-flame-400"
          >
            Try an invalid reference
          </button>
        </aside>
      </div>
    </>
  )
}

function ResultCard({
  tone,
  icon: Icon,
  title,
  children,
}: {
  tone: 'green' | 'red' | 'amber'
  icon: typeof CheckCircle2
  title: string
  children: ReactNode
}) {
  const styles = {
    green: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300',
    red: 'border-red-400/40 bg-red-400/10 text-red-300',
    amber: 'border-flame-400/50 bg-flame-400/10 text-flame-300',
  }[tone]
  return (
    <div className={`animate-fade-up rounded-2xl border p-6 ${styles}`} role="status">
      <p className="flex items-center gap-2 font-display text-2xl">
        <Icon className="size-6" aria-hidden /> {title}
      </p>
      <div className="mt-3 text-sm text-cream-100">{children}</div>
    </div>
  )
}

function TicketFacts({ ticket }: { ticket: DemoTicket }) {
  const d = fromIsoDate(ticket.eventDate)
  return (
    <dl className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
      {[
        ['Reference', ticket.reference],
        ['Name', ticket.purchaserName],
        ['Event', ticket.eventName],
        ['Date', d ? formatLongDate(d) : ticket.eventDate],
        ['Type', ticket.ticketTypeName],
        ['Admits', String(ticket.quantity)],
      ].map(([k, v]) => (
        <div key={k}>
          <dt className="text-xs text-cream-500">{k}</dt>
          <dd className="font-semibold text-cream-50">{v}</dd>
        </div>
      ))}
    </dl>
  )
}
