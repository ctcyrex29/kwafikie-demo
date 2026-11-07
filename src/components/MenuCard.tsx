import { Check, Plus } from 'lucide-react'
import type { MenuItem } from '../config/menu'
import { useCart } from '../lib/cart'
import { useCurrency } from '../lib/currency'
import { QuantityStepper, SmartImage } from './ui'

export function MenuCard({ item }: { item: MenuItem }) {
  const cart = useCart()
  const { format } = useCurrency()
  const qty = cart.quantityOf(item.id)

  return (
    <article className="card group flex flex-col overflow-hidden transition duration-300 hover:-translate-y-0.5 hover:border-flame-400/30">
      <div className="relative aspect-[4/3] overflow-hidden">
        <SmartImage src={item.image} alt={item.name} className="size-full transition duration-700 group-hover:scale-105" />
        {item.tag && (
          <span className="absolute top-3 left-3 rounded-full bg-ink-950/80 px-3 py-1 text-xs font-semibold text-flame-300 backdrop-blur">
            {item.tag}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-semibold text-cream-50">{item.name}</h3>
          <p className="shrink-0 font-semibold text-flame-300 tabular-nums">{format(item.priceUsd)}</p>
        </div>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-cream-300">{item.description}</p>
        <div className="mt-5 flex items-center justify-between gap-3">
          {qty > 0 ? (
            <>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-flame-300">
                <Check className="size-4" aria-hidden /> In your order
              </span>
              <QuantityStepper
                size="sm"
                label={`${item.name} quantity`}
                value={qty}
                onChange={(q) => cart.setQuantity(item.id, q)}
              />
            </>
          ) : (
            <button type="button" onClick={() => cart.add(item.id)} className="btn-primary w-full py-2.5">
              <Plus className="size-4" aria-hidden /> Add to Order
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
