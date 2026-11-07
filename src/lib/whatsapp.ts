import { site } from '../config/site'

export function whatsappUrl(message: string, number = site.contact.whatsapp): string {
  return `https://wa.me/${number.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
}

/** Opens WhatsApp in a new tab. Call from a click handler so it is not blocked as a pop-up. */
export function openWhatsApp(message: string): void {
  window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer')
}

/** Lines that are null/undefined are dropped; empty strings become blank lines. */
export function lines(...parts: Array<string | null | undefined | false>): string {
  return parts.filter((p): p is string => typeof p === 'string').join('\n')
}
