import { Link } from 'react-router'
import { Plus, ShoppingBag } from 'lucide-react'
import { images, menuCategories, menuItems } from '../config/menu'
import { DemoChip, PageHero, Reveal, SmartImage } from '../components/ui'
import { useCart } from '../lib/cart'
import { useCurrency } from '../lib/currency'

export function MenuPage() {
  const cart = useCart()
  const { format } = useCurrency()

  return (
    <>
      <PageHero eyebrow="The menu" title="Fire-cooked, generously served." image={images.platter}>
        <p>From the braai to the bar. Add anything to your order as you browse.</p>
        <div className="mt-5">
          <DemoChip>Demo items &amp; prices, editable for KwaFikie</DemoChip>
        </div>
      </PageHero>

      <nav
        aria-label="Menu categories"
        className="sticky top-16 z-30 border-b border-cream-100/10 bg-ink-950/90 backdrop-blur-md lg:top-20"
      >
        <div className="container-page flex gap-2 overflow-x-auto py-3">
          {menuCategories.map((c) => (
            <a key={c.id} href={`#${c.id}`} className="shrink-0 rounded-full border border-cream-100/15 px-4 py-2 text-sm font-medium text-cream-100 transition hover:border-flame-400 hover:text-flame-300">
              {c.name}
            </a>
          ))}
        </div>
      </nav>

      <div className="container-page grid gap-20 py-16 sm:py-20">
        {menuCategories.map((cat) => (
          <section key={cat.id} id={cat.id} className="scroll-mt-40" aria-labelledby={`${cat.id}-title`}>
            <div className="mb-8 flex items-baseline justify-between gap-4 border-b border-cream-100/10 pb-4">
              <h2 id={`${cat.id}-title`} className="font-display text-4xl font-semibold text-cream-50">
                {cat.name}
              </h2>
              <p className="text-sm text-cream-500 italic">{cat.blurb}</p>
            </div>
            <ul className="grid gap-x-12 gap-y-8 md:grid-cols-2">
              {menuItems
                .filter((i) => i.category === cat.id)
                .map((item, idx) => {
                  const qty = cart.quantityOf(item.id)
                  return (
                    <Reveal key={item.id} delay={(idx % 2) * 60}>
                      <li className="flex gap-5">
                        <SmartImage src={item.image} alt={item.name} className="size-20 shrink-0 rounded-2xl sm:size-24" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline gap-3">
                            <h3 className="font-display text-lg font-semibold text-cream-50">{item.name}</h3>
                            <span className="mb-1 flex-1 border-b border-dotted border-cream-100/20" aria-hidden />
                            <span className="font-semibold text-flame-300 tabular-nums">{format(item.priceUsd)}</span>
                          </div>
                          <p className="mt-1.5 text-sm leading-relaxed text-cream-300">{item.description}</p>
                          <button
                            type="button"
                            onClick={() => cart.add(item.id)}
                            className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-cream-100/15 px-3 py-1.5 text-xs font-semibold text-cream-100 transition hover:border-ember-500 hover:bg-ember-500 hover:text-ink-950"
                            aria-label={`Add ${item.name} to order`}
                          >
                            <Plus className="size-3.5" aria-hidden /> Add{qty > 0 ? ` · ${qty} in order` : ''}
                          </button>
                        </div>
                      </li>
                    </Reveal>
                  )
                })}
            </ul>
          </section>
        ))}
      </div>

      <section className="container-page pb-20">
        <div className="card flex flex-col items-center gap-5 p-10 text-center">
          <h2 className="heading-lg">Ready to order?</h2>
          <p className="max-w-md text-cream-300">Review your items, choose collection or delivery and send your order to us on WhatsApp.</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={cart.open} className="btn-secondary">
              <ShoppingBag className="size-4" aria-hidden /> View order ({cart.count})
            </button>
            <Link to={cart.count ? '/order/checkout' : '/order'} className="btn-primary">
              {cart.count ? 'Go to checkout' : 'Order online'}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
