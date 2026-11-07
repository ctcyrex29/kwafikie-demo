import { useState, type ReactNode } from 'react'
import { CheckCircle2, Copy, MessageCircle } from 'lucide-react'
import { site } from '../config/site'
import { openWhatsApp, whatsappUrl } from '../lib/whatsapp'
import { Notice } from './ui'

/**
 * Preview of a WhatsApp message with a send button. After the customer opens
 * WhatsApp it shows `sentState`. Nothing is confirmed until the business replies.
 */
export function WhatsAppSend({
  message,
  sendLabel,
  onBack,
  sentState,
}: {
  message: string
  sendLabel: string
  onBack: () => void
  sentState: ReactNode
}) {
  const [sent, setSent] = useState(false)
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="space-y-6">
      {sent && (
        <div className="animate-fade-up rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-6" role="status">
          <div className="flex gap-3">
            <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-emerald-300" aria-hidden />
            <div className="space-y-2 text-sm leading-relaxed text-cream-100">{sentState}</div>
          </div>
        </div>
      )}

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-cream-100">WhatsApp message preview</h3>
          <button type="button" onClick={copy} className="inline-flex items-center gap-1 text-xs text-cream-300 hover:text-flame-300">
            <Copy className="size-3.5" aria-hidden /> {copied ? 'Copied' : 'Copy text'}
          </button>
        </div>
        <pre className="max-h-80 overflow-auto rounded-2xl rounded-tl-sm border border-emerald-500/20 bg-[#0b2a22] p-5 font-sans text-sm leading-relaxed whitespace-pre-wrap text-cream-50">
          {message}
        </pre>
        <p className="mt-2 text-xs text-cream-500">
          To: {site.name} on WhatsApp ({site.contact.whatsappDisplay}){site.contact.isPlaceholder ? ', placeholder number' : ''}
        </p>
      </div>

      <Notice tone="warn">
        Nothing is sent automatically. Tap the button to open WhatsApp, then press <strong>send</strong> in WhatsApp.
        KwaFikie will reply to confirm.
      </Notice>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <button type="button" onClick={onBack} className="btn-secondary">
          Edit details
        </button>
        <a
          href={whatsappUrl(message)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.preventDefault()
            openWhatsApp(message)
            setSent(true)
          }}
          className="btn inline-flex items-center justify-center gap-2 rounded-full bg-[#25d366] px-6 py-3 text-sm font-semibold text-ink-950 transition hover:bg-[#3ee07a]"
        >
          <MessageCircle className="size-4" aria-hidden /> {sent ? 'Open WhatsApp again' : sendLabel}
        </a>
      </div>
    </div>
  )
}
