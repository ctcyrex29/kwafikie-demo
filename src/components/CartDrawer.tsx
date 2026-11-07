import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { ShoppingBag, Trash2, X } from 'lucide-react'
import { useCart } from '../lib/cart'
import { useCurrency } from '../lib/currency'
import { QuantityStepper, SmartImage } from './ui'

export function CartDrawer() {
  const cart = useCart()
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!cart.isOpen) return
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && cart.close()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [cart.isOpen, cart.close])

  if (!cart.isOpen) return null

  return (
    <div className="no-print fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="cart-title">
      <div className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm" onClick={cart.close} />
      <div className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-ink-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-cream-100/10 px-5 py-4">
          <h2 id="cart-title" className="font-display text-2xl text-cream-50">
            Your order
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={cart.close}
            className="flex size-11 items-center justify-center rounded-full hover:bg-cream-100/10"
            aria-label="Close order"
          >
            <X className="size-6" aria-hidden />
          </button>
        </div>
        <CartContents onNavigate={cart.close} />
      </div>
    </div>
  )
}

/** Line items, totals and the checkout button. Used in the drawer and on the Order page. */
export function CartContents({ onNavigate, compact = false }: { onNavigate?: () => void; compact?: boolean }) {
  const cart = useCart()
  const { format } = useCurrency()

  if (cart.lines.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-cream-100/5">
          <ShoppingBag className="size-7 text-flame-400" aria-hidden />
        </span>
        <div>
          <p className="font-display text-xl text-cream-50">Your order is empty</p>
          <p className="mt-1 text-sm text-cream-300">Add something from the grill to get started.</p>
        </div>
        {!compact && (
          <Link to="/order" onClick={onNavigate} className="btn-primary">
            Browse the menu
          </Link>
        )}
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ul className={`min-h-0 flex-1 divide-y divide-cream-100/10 overflow-y-auto ${compact ? '' : 'px-5'}`}>
        {cart.lines.map(({ item, quantity, lineTotalUsd }) => (
          <li key={item.id} className="flex gap-4 py-4">
            <SmartImage src={item.image} alt={item.name} className="size-16 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold text-cream-50">{item.name}</p>
                <p className="font-semibold text-cream-50 tabular-nums">{format(lineTotalUsd)}</p>
              </div>
              <p className="text-xs text-cream-500">{format(item.priceUsd)} each</p>
              <div className="mt-2 flex items-center justify-between">
                <QuantityStepper
                  size="sm"
                  label={`${item.name} quantity`}
                  value={quantity}
                  min={1}
                  onChange={(q) => cart.setQuantity(item.id, q)}
                />
                <button
                  type="button"
                  onClick={() => cart.remove(item.id)}
                  className="flex items-center gap-1 rounded-full px-2 py-1 text-xs text-cream-500 hover:text-red-300"
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 className="size-3.5" aria-hidden /> Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className={`space-y-3 border-t border-cream-100/10 py-5 ${compact ? '' : 'px-5'}`}>
        <div className="flex justify-between text-sm text-cream-300">
          <span>Subtotal ({cart.count} item{cart.count === 1 ? '' : 's'})</span>
          <span className="tabular-nums">{format(cart.subtotalUsd)}</span>
        </div>
        <div className="flex justify-between text-sm text-cream-500">
          <span>Delivery</span>
          <span>Confirmed on WhatsApp</span>
        </div>
        <div className="flex justify-between border-t border-cream-100/10 pt-3 text-lg font-semibold text-cream-50">
          <span>Total</span>
          <span className="tabular-nums">{format(cart.totalUsd)}</span>
        </div>
        <Link to="/order/checkout" onClick={onNavigate} className="btn-primary w-full">
          Checkout
        </Link>
        <button type="button" onClick={cart.clear} className="btn-ghost w-full py-2 text-xs">
          Clear order
        </button>
      </div>
    </div>
  )
}
