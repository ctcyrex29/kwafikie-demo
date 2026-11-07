import { z } from 'zod'

const digits = (v: string) => v.replace(/[\s\-()]/g, '')

/** Zimbabwe numbers (07X…, +263 7X…) or any international number in + format. */
export function isValidPhone(value: string, { mobileOnly = false } = {}): boolean {
  const v = digits(value)
  const zim = mobileOnly ? /^(\+?263|0)7\d{8}$/ : /^(\+?263|0)\d{8,9}$/
  return zim.test(v) || /^\+(?!263)\d{9,15}$/.test(v)
}

export const phoneField = (mobileOnly = false) =>
  z
    .string()
    .trim()
    .min(1, 'Please enter your phone number.')
    .refine((v) => isValidPhone(v, { mobileOnly }), {
      message: mobileOnly
        ? 'Enter a valid WhatsApp number, e.g. 07X XXX XXXX or +263 7X XXX XXXX.'
        : 'Enter a valid phone number, e.g. 07X XXX XXXX or +263 …',
    })

export const nameField = z
  .string()
  .trim()
  .min(2, 'Please enter your name.')
  .max(80, 'Please keep your name under 80 characters.')
