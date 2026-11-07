import { useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { menuCategories, menuItems, type MenuCategoryId } from '../config/menu'
import { MenuCard } from '../components/MenuCard'
import { CartContents } from '../components/CartDrawer'
import { DemoChip } from '../components/ui'
import { useCart } from '../lib/cart'
import { useCurrency } from '../lib/currency'

export function OrderPage() {
  const [category, setCategory] = useState<MenuCategoryId | 'all'>('all')
  const cart = useCart()
  const { format } = useCurrency()
  const items = category === 'all' ? menuItems : menuItems.filter((i) => i.category === category)

  return (
    <div className="container-page py-12 sm:py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Order online</p>
          <h1 className="heading-xl mt-3">What are you having?</h1>
          <p className="mt-4 max-w-xl text-cream-300">
            Build your order, then send it to KwaFikie on WhatsApp for confirmation. Collection or delivery.
          </p>
        </div>
        <DemoChip>Demo menu &amp; prices</DemoChip>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_22rem]">
        <div>
          <div role="tablist" aria-label="Filter by category" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
            {[{ id: 'all' as const, name: 'All' }, ...menuCategories].map((c) => (
              <button
                key={c.id}
                type="button"
                role="tab"
                aria-selected={category === c.id}
                onClick={() => setCategory(c.id)}
                className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  category === c.id ? 'bg-cream-100 text-ink-950' : 'border border-cream-100/15 text-cream-300 hover:text-cream-50'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        <aside className="hidden lg:block" aria-label="Your order">
          <div className="card sticky top-28 flex max-h-[calc(100vh-8rem)] flex-col p-5">
            <h2 className="font-display text-2xl text-cream-50">Your order</h2>
            <CartContents compact />
          </div>
        </aside>
      </div>

      {cart.count > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-cream-100/10 bg-ink-900/95 p-4 backdrop-blur lg:hidden">
          <button type="button" onClick={cart.open} className="btn-primary w-full justify-between py-3.5">
            <span className="flex items-center gap-2">
              <ShoppingBag className="size-4" aria-hidden /> View order ({cart.count})
            </span>
            <span className="tabular-nums">{format(cart.totalUsd)}</span>
          </button>
        </div>
      )}
      {cart.count > 0 && <div className="h-20 lg:hidden" aria-hidden />}
    </div>
  )
}
