import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { menuById, type MenuItem } from '../config/menu'
import { readJson, writeJson } from './storage'

export interface CartLine {
  item: MenuItem
  quantity: number
  lineTotalUsd: number
}

interface CartState {
  lines: CartLine[]
  count: number
  subtotalUsd: number
  totalUsd: number
  quantityOf: (id: string) => number
  add: (id: string, qty?: number) => void
  setQuantity: (id: string, qty: number) => void
  remove: (id: string) => void
  clear: () => void
  isOpen: boolean
  open: () => void
  close: () => void
  /** Last item added, for the "added to order" toast. */
  lastAdded: { id: string; at: number } | null
}

const MAX_QTY = 50
const CartContext = createContext<CartState | null>(null)

type Stored = Record<string, number>

function sanitise(stored: Stored): Stored {
  const clean: Stored = {}
  for (const [id, qty] of Object.entries(stored ?? {})) {
    // Drop items removed from the menu since the cart was saved.
    if (menuById.has(id) && Number.isInteger(qty) && qty > 0) clean[id] = Math.min(qty, MAX_QTY)
  }
  return clean
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [quantities, setQuantities] = useState<Stored>(() => sanitise(readJson<Stored>('cart', {})))
  const [isOpen, setIsOpen] = useState(false)
  const [lastAdded, setLastAdded] = useState<CartState['lastAdded']>(null)

  useEffect(() => {
    writeJson('cart', quantities)
  }, [quantities])

  const setQuantity = useCallback((id: string, qty: number) => {
    setQuantities((prev) => {
      const next = { ...prev }
      if (qty <= 0) delete next[id]
      else next[id] = Math.min(Math.floor(qty), MAX_QTY)
      return next
    })
  }, [])

  const add = useCallback((id: string, qty = 1) => {
    if (!menuById.has(id)) return
    setQuantities((prev) => ({ ...prev, [id]: Math.min((prev[id] ?? 0) + qty, MAX_QTY) }))
    setLastAdded({ id, at: Date.now() })
  }, [])

  const value = useMemo<CartState>(() => {
    const lines: CartLine[] = Object.entries(quantities).flatMap(([id, quantity]) => {
      const item = menuById.get(id)
      return item ? [{ item, quantity, lineTotalUsd: round2(item.priceUsd * quantity) }] : []
    })
    const subtotalUsd = round2(lines.reduce((sum, l) => sum + l.lineTotalUsd, 0))
    return {
      lines,
      count: lines.reduce((n, l) => n + l.quantity, 0),
      subtotalUsd,
      // No fees in the demo: delivery fees are agreed on WhatsApp.
      totalUsd: subtotalUsd,
      quantityOf: (id) => quantities[id] ?? 0,
      add,
      setQuantity,
      remove: (id) => setQuantity(id, 0),
      clear: () => setQuantities({}),
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      lastAdded,
    }
  }, [quantities, add, setQuantity, isOpen, lastAdded])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartState {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}

export const round2 = (n: number) => Math.round(n * 100) / 100
