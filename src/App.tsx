import { Route, Routes } from 'react-router'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { MenuPage } from './pages/MenuPage'
import { OrderPage } from './pages/OrderPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { ReservePage } from './pages/ReservePage'
import { FridaysFlamePage } from './pages/FridaysFlamePage'
import { TicketsPage } from './pages/TicketsPage'
import { TicketViewPage } from './pages/TicketViewPage'
import { VerifyTicketPage } from './pages/VerifyTicketPage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { NotFoundPage } from './pages/NotFoundPage'

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="order" element={<OrderPage />} />
        <Route path="order/checkout" element={<CheckoutPage />} />
        <Route path="reserve" element={<ReservePage />} />
        <Route path="fridays-flame" element={<FridaysFlamePage />} />
        <Route path="tickets" element={<TicketsPage />} />
        <Route path="tickets/verify" element={<VerifyTicketPage />} />
        <Route path="tickets/:reference" element={<TicketViewPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
