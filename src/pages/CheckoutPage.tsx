import { useState } from 'react'
import { Link } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Bike, ShoppingBag, Store } from 'lucide-react'
import { site } from '../config/site'
import { Field, Notice, SmartImage, Steps } from '../components/ui'
import { WhatsAppSend } from '../components/WhatsAppSend'
import { useCart } from '../lib/cart'
import { useCurrency } from '../lib/currency'
import { orderMessage } from '../lib/messages'
import { nameField, phoneField } from '../lib/validation'

const schema = z
  .object({
    name: nameField,
    whatsapp: phoneField(true),
    orderType: z.enum(['collection', 'delivery']),
    address: z.string().trim().max(300).optional(),
    notes: z.string().trim().max(500, 'Please keep notes under 500 characters.').optional(),
  })
  .superRefine((v, ctx) => {
    if (v.orderType === 'delivery' && (!v.address || v.address.length < 8)) {
      ctx.addIssue({ code: 'custom', path: ['address'], message: 'Please enter a delivery address (street, suburb, landmark).' })
    }
  })

type FormValues = z.infer<typeof schema>

export function CheckoutPage() {
  const cart = useCart()
  const { format } = useCurrency()
  const [message, setMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { orderType: 'collection', name: '', whatsapp: '', address: '', notes: '' },
  })
  const orderType = watch('orderType')

  if (cart.lines.length === 0 && !message) {
    return (
      <div className="container-page flex flex-col items-center py-28 text-center">
        <ShoppingBag className="size-10 text-flame-400" aria-hidden />
        <h1 className="heading-lg mt-6">Your order is empty</h1>
        <p className="mt-3 text-cream-300">Add a few items before checking out.</p>
        <Link to="/order" className="btn-primary mt-8">
          Browse the menu
        </Link>
      </div>
    )
  }

  // Snapshot the message so clearing the cart afterwards does not change it.
  const onSubmit = (v: FormValues) =>
    setMessage(
      orderMessage(
        {
          name: v.name,
          whatsapp: v.whatsapp,
          orderType: v.orderType,
          address: v.orderType === 'delivery' ? v.address : undefined,
          notes: v.notes || undefined,
        },
        cart.lines,
        cart.totalUsd,
        format,
      ),
    )

  return (
    <div className="container-page py-12 sm:py-16">
      <Link to="/order" className="inline-flex items-center gap-2 text-sm text-cream-300 hover:text-flame-300">
        <ArrowLeft className="size-4" aria-hidden /> Back to menu
      </Link>
      <h1 className="heading-xl mt-4">Checkout</h1>
      <div className="mt-6">
        <Steps steps={['Your details', 'Review & send', 'Confirmation on WhatsApp']} current={message ? 1 : 0} />
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_24rem]">
        <div className="card p-6 sm:p-8">
          {message ? (
            <WhatsAppSend
              message={message}
              sendLabel="Send order on WhatsApp"
              onBack={() => setMessage(null)}
              sentState={
                <>
                  <p className="font-semibold text-cream-50">Your order message is ready in WhatsApp.</p>
                  <p>
                    Your order is <strong>not yet confirmed</strong>. Make sure you press send in WhatsApp. KwaFikie will reply
                    to confirm availability, the total and the collection or delivery time.
                  </p>
                  <button type="button" onClick={cart.clear} className="font-semibold text-flame-300 underline-offset-4 hover:underline">
                    I&apos;ve sent it. Clear my order.
                  </button>
                </>
              }
            />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
              <h2 className="font-display text-2xl text-cream-50">Your details</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="name" label="Full name" error={errors.name?.message}>
                  <input id="name" className="field-input" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} {...register('name')} />
                </Field>
                <Field id="whatsapp" label="WhatsApp number" error={errors.whatsapp?.message} hint="We reply to this number.">
                  <input id="whatsapp" type="tel" inputMode="tel" className="field-input" autoComplete="tel" placeholder="07X XXX XXXX" aria-invalid={!!errors.whatsapp} aria-describedby={errors.whatsapp ? 'whatsapp-error' : undefined} {...register('whatsapp')} />
                </Field>
              </div>

              <fieldset>
                <legend className="field-label">Order type</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    { value: 'collection', label: 'Collection', text: `Pick up at ${site.name}`, icon: Store },
                    ...(site.ordering.deliveryEnabled
                      ? [{ value: 'delivery', label: 'Delivery', text: 'We bring it to you', icon: Bike }]
                      : []),
                  ].map(({ value, label, text, icon: Icon }) => (
                    <label
                      key={value}
                      className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                        orderType === value ? 'border-flame-400 bg-flame-400/5' : 'border-cream-100/15 hover:border-cream-100/30'
                      }`}
                    >
                      <input type="radio" value={value} className="sr-only" {...register('orderType')} />
                      <Icon className={`size-6 ${orderType === value ? 'text-flame-400' : 'text-cream-500'}`} aria-hidden />
                      <span>
                        <span className="block font-semibold text-cream-50">{label}</span>
                        <span className="block text-xs text-cream-300">{text}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {orderType === 'delivery' && (
                <Field id="address" label="Delivery address" error={errors.address?.message} hint={site.ordering.deliveryNote}>
                  <textarea id="address" rows={3} className="field-input" autoComplete="street-address" placeholder="House number, street, suburb and a landmark" aria-invalid={!!errors.address} aria-describedby={errors.address ? 'address-error' : undefined} {...register('address')} />
                </Field>
              )}

              <Field id="notes" label={<>Order notes <span className="text-cream-500">(optional)</span></>} error={errors.notes?.message}>
                <textarea id="notes" rows={3} className="field-input" placeholder="E.g. no onions, extra relish, collection time" aria-invalid={!!errors.notes} {...register('notes')} />
              </Field>

              <Notice>
                Next you will see your order as a WhatsApp message. Your order is only placed once you send that message and
                KwaFikie confirms it.
              </Notice>

              <button type="submit" className="btn-primary w-full py-3.5 sm:w-auto">
                Review order
              </button>
            </form>
          )}
        </div>

        <aside aria-label="Order summary" className="card h-fit p-6 lg:sticky lg:top-28">
          <h2 className="font-display text-2xl text-cream-50">Summary</h2>
          {cart.lines.length === 0 ? (
            <p className="mt-4 text-sm text-cream-300">Your order has been cleared.</p>
          ) : (
            <>
              <ul className="mt-5 space-y-4">
                {cart.lines.map((l) => (
                  <li key={l.item.id} className="flex items-center gap-3 text-sm">
                    <SmartImage src={l.item.image} alt="" className="size-12 shrink-0 rounded-lg" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-cream-50">{l.item.name}</p>
                      <p className="text-xs text-cream-500">
                        {l.quantity} × {format(l.item.priceUsd)}
                      </p>
                    </div>
                    <p className="font-semibold text-cream-50 tabular-nums">{format(l.lineTotalUsd)}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-5 space-y-2 border-t border-cream-100/10 pt-4 text-sm">
                <div className="flex justify-between text-cream-300">
                  <span>Subtotal</span>
                  <span className="tabular-nums">{format(cart.subtotalUsd)}</span>
                </div>
                <div className="flex justify-between text-cream-500">
                  <span>Delivery</span>
                  <span>{orderType === 'delivery' ? 'Confirmed on WhatsApp' : 'n/a'}</span>
                </div>
                <div className="flex justify-between pt-2 text-lg font-semibold text-cream-50">
                  <span>Total</span>
                  <span className="tabular-nums">{format(cart.totalUsd)}</span>
                </div>
              </div>
              {!message && (
                <button type="button" onClick={cart.open} className="mt-4 text-sm font-semibold text-flame-300 hover:text-flame-400">
                  Edit items
                </button>
              )}
            </>
          )}
        </aside>
      </div>
    </div>
  )
}
