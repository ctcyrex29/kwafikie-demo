import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Clock, Mail, MapPin, MessageCircle, Phone, Share2 } from 'lucide-react'
import { site } from '../config/site'
import { Field, Notice, PageHero } from '../components/ui'
import { WhatsAppSend } from '../components/WhatsAppSend'
import { contactMessage } from '../lib/messages'
import { formatTime } from '../lib/dates'
import { isValidPhone, nameField } from '../lib/validation'
import { whatsappUrl } from '../lib/whatsapp'

const schema = z.object({
  name: nameField,
  contact: z
    .string()
    .trim()
    .min(1, 'Please tell us how to reach you.')
    .refine((v) => isValidPhone(v) || z.email().safeParse(v).success, 'Enter a valid phone number or email address.'),
  subject: z.enum(['General enquiry', 'Group booking', 'Events & Fridays Flame', 'Feedback']),
  message: z.string().trim().min(10, 'Please write a little more (at least 10 characters).').max(1000),
})
type FormValues = z.infer<typeof schema>

export function ContactPage() {
  const [message, setMessage] = useState<{ text: string; subject: string } | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { subject: 'General enquiry', name: '', contact: '', message: '' } })

  const cards = [
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: site.contact.whatsappDisplay,
      href: whatsappUrl(`Hi ${site.name}!`),
      external: true,
    },
    { icon: Phone, label: 'Phone', value: site.contact.phoneDisplay, href: `tel:${site.contact.phone}` },
    { icon: Mail, label: 'Email', value: site.contact.email, href: `mailto:${site.contact.email}` },
    {
      icon: MapPin,
      label: 'Location',
      value: `${site.location.city}, ${site.location.country}`,
      href: site.location.mapsUrl,
      external: true,
    },
  ]

  return (
    <>
      <PageHero eyebrow="Contact" title="Talk to us.">
        <p>Questions, group bookings or event enquiries. WhatsApp is the quickest way to reach {site.name}.</p>
      </PageHero>

      <div className="container-page py-12 sm:py-16">
        {site.contact.isPlaceholder && (
          <div className="mb-8">
            <Notice tone="warn">
              The phone number, WhatsApp number and email shown here are placeholders and do not work yet. They will be replaced
              with {site.name}’s real contact details.
            </Notice>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map(({ icon: Icon, label, value, href, external }) => (
            <a
              key={label}
              href={href}
              {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
              className="card group p-6 transition hover:border-flame-400/40"
            >
              <Icon className="size-6 text-flame-400" aria-hidden />
              <p className="mt-4 text-xs tracking-wider text-cream-500 uppercase">{label}</p>
              <p className="mt-1 font-semibold break-words text-cream-50 group-hover:text-flame-300">{value}</p>
            </a>
          ))}
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_22rem]">
          <div className="card p-6 sm:p-8">
            <h2 className="font-display text-2xl text-cream-50">Send a message</h2>
            <div className="mt-6">
              {message ? (
                <>
                  <WhatsAppSend
                    message={message.text}
                    sendLabel="Send on WhatsApp"
                    onBack={() => setMessage(null)}
                    sentState={<p>Your message is ready in WhatsApp. Press send there and {site.name} will get back to you.</p>}
                  />
                  <p className="mt-4 text-center text-sm text-cream-300">
                    Prefer email?{' '}
                    <a
                      href={`mailto:${site.contact.email}?subject=${encodeURIComponent(message.subject)}&body=${encodeURIComponent(message.text.replace(/\*/g, '').replace(/_/g, ''))}`}
                      className="font-semibold text-flame-300 hover:underline"
                    >
                      Send it by email instead
                    </a>
                  </p>
                </>
              ) : (
                <form onSubmit={handleSubmit((v) => setMessage({ text: contactMessage(v), subject: v.subject }))} noValidate className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field id="c-name" label="Name" error={errors.name?.message}>
                      <input id="c-name" className="field-input" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'c-name-error' : undefined} {...register('name')} />
                    </Field>
                    <Field id="c-contact" label="Phone or email" error={errors.contact?.message}>
                      <input id="c-contact" className="field-input" autoComplete="email" aria-invalid={!!errors.contact} aria-describedby={errors.contact ? 'c-contact-error' : undefined} {...register('contact')} />
                    </Field>
                  </div>
                  <Field id="c-subject" label="Subject">
                    <select id="c-subject" className="field-input" {...register('subject')}>
                      {schema.shape.subject.options.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </Field>
                  <Field id="c-message" label="Message" error={errors.message?.message}>
                    <textarea id="c-message" rows={5} className="field-input" aria-invalid={!!errors.message} aria-describedby={errors.message ? 'c-message-error' : undefined} {...register('message')} />
                  </Field>
                  <button type="submit" className="btn-primary">
                    Continue
                  </button>
                </form>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="card p-6">
              <h2 className="flex items-center gap-2 font-semibold text-cream-50">
                <Clock className="size-4 text-flame-400" aria-hidden /> Opening hours
              </h2>
              <dl className="mt-4 space-y-2 text-sm">
                {site.hours.map((h) => (
                  <div key={h.label} className="flex justify-between gap-3">
                    <dt className="text-cream-300">{h.label}</dt>
                    <dd className="tabular-nums">
                      {formatTime(h.open)} – {formatTime(h.close)}
                    </dd>
                  </div>
                ))}
              </dl>
              {site.hoursArePlaceholder && <p className="mt-3 text-xs text-cream-500">Placeholder hours.</p>}
            </div>
            <div className="card p-6">
              <h2 className="flex items-center gap-2 font-semibold text-cream-50">
                <MapPin className="size-4 text-flame-400" aria-hidden /> Address
              </h2>
              <p className="mt-3 text-sm text-cream-300">
                {site.location.address}
                <br />
                {site.location.city}, {site.location.country}
              </p>
              <p className="mt-2 text-xs text-cream-500">{site.location.directions}</p>
            </div>
            <div className="card p-6">
              <h2 className="flex items-center gap-2 font-semibold text-cream-50">
                <Share2 className="size-4 text-flame-400" aria-hidden /> Social media
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                {site.social.map((s) => (
                  <li key={s.label} className="flex justify-between">
                    <span className="text-cream-300">{s.label}</span>
                    {s.href ? (
                      <a href={s.href} target="_blank" rel="noreferrer" className="font-semibold text-flame-300">
                        Follow
                      </a>
                    ) : (
                      <span className="text-cream-500">Coming soon</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
