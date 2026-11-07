import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { site, type CurrencyCode } from '../config/site'
import { readJson, writeJson } from './storage'

export function formatMoney(amountUsd: number, code: CurrencyCode): string {
  const c = site.currency.options[code]
  const value = amountUsd * c.ratePerUsd
  const number = value.toLocaleString('en-US', {
    minimumFractionDigits: c.decimals,
    maximumFractionDigits: c.decimals,
  })
  return `${c.prefix}${number}`
}

interface CurrencyState {
  code: CurrencyCode
  setCode: (code: CurrencyCode) => void
  format: (amountUsd: number) => string
}

const CurrencyContext = createContext<CurrencyState | null>(null)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [code, setCodeState] = useState<CurrencyCode>(() => {
    const saved = readJson<CurrencyCode | null>('currency', null)
    return site.currency.allowSwitching && saved && saved in site.currency.options ? saved : site.currency.default
  })

  const setCode = useCallback((next: CurrencyCode) => {
    setCodeState(next)
    writeJson('currency', next)
  }, [])

  const value = useMemo(
    () => ({ code, setCode, format: (amountUsd: number) => formatMoney(amountUsd, code) }),
    [code, setCode],
  )
  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}

export function useCurrency(): CurrencyState {
  const ctx = useContext(CurrencyContext)
  if (!ctx) throw new Error('useCurrency must be used inside CurrencyProvider')
  return ctx
}
