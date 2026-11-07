import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <div className="container-page flex flex-col items-center py-32 text-center">
      <p className="font-display text-8xl text-flame-400 italic">404</p>
      <h1 className="heading-lg mt-4">This page went up in smoke.</h1>
      <p className="mt-3 text-cream-300">The page you are looking for does not exist.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link to="/" className="btn-primary">
          Back home
        </Link>
        <Link to="/menu" className="btn-secondary">
          See the menu
        </Link>
      </div>
    </div>
  )
}
