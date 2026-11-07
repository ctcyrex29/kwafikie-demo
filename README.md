# KwaFikie: restaurant & Fridays Flame demo website

Client demo by **InkGenius Technologies**, Masvingo. React + TypeScript + Vite + Tailwind CSS. No backend: everything runs in the browser.

## Run it locally (Windows)

Requires [Node.js](https://nodejs.org) 20.19+ or 22.12+ (LTS).

```powershell
cd C:\Users\HP\Desktop\ink-g\projects\kwafikie
npm install
npm run dev
```

Open http://localhost:5173. To test on a phone on the same Wi-Fi, run `npm run dev -- --host` and open the Network URL it prints.

Production build and preview:

```powershell
npm run build
npm run preview      # http://localhost:4173
```

`dist/` is a static site. When hosting it, rewrite unknown paths to `index.html` (Netlify `_redirects`, Vercel rewrites, Apache `FallbackResource /index.html`) so links like `/fridays-flame` load directly.

## Where to change things

| What | File |
|---|---|
| Business name, logo, address, WhatsApp, phone, email, social links, hours, currency & ZiG rate, delivery, reservation rules | `src/config/site.ts` |
| Fridays Flame details, sample programme, ticket types & prices | `src/config/site.ts` (`fridaysFlame`, `ticketTypes`) |
| Menu categories, items, prices, photos | `src/config/menu.ts` |
| WhatsApp message wording | `src/lib/messages.ts` |
| Colours & fonts | `src/index.css` (`@theme`) |

Prices are stored in USD. ZiG is converted with `site.currency.options.ZWG.ratePerUsd`; set `allowSwitching: false` to show USD only.

## Pages

`/` Home · `/menu` · `/order` · `/order/checkout` · `/reserve` · `/fridays-flame` · `/tickets` · `/tickets/:reference` · `/tickets/verify` · `/about` · `/contact`
