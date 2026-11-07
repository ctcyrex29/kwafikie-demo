import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { ArrowRight, Flame, HeartHandshake, Music, PenLine, UtensilsCrossed } from 'lucide-react'
import { fridaysFlame, site } from '../config/site'
import { images } from '../config/menu'
import { PageHero, Reveal, SectionHeading, SmartImage } from '../components/ui'

/** Content the client must supply. Shown as clearly marked placeholders. */
function Placeholder({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-cream-300/30 p-6">
      <p className="flex items-center gap-2 text-xs font-semibold tracking-wider text-cream-500 uppercase">
        <PenLine className="size-3.5" aria-hidden /> Placeholder: {title}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-cream-300">{children}</p>
    </div>
  )
}

export function AboutPage() {
  return (
    <>
      <PageHero eyebrow={`About ${site.name}`} title="Food, fire and good people." image={images.friends}>
        <p>
          {site.name} is a restaurant and entertainment spot in {site.location.city}: a place to eat well, meet friends and
          stay a while.
        </p>
      </PageHero>

      <section className="container-page grid gap-14 py-20 sm:py-28 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <SectionHeading eyebrow="Our place" title="Hospitality you can taste.">
            <p>
              At {site.name} the food comes from the grill and the welcome comes from the heart. Whether you stop by for lunch,
              sit down for a family dinner or stay late on a Friday, the idea is the same: generous plates, cold drinks and a
              table where everybody feels at home.
            </p>
          </SectionHeading>
          <div className="mt-8">
            <Placeholder title="our story">
              The story of {site.name}: who started it, when and why. To be written with the owner. We have deliberately not
              made this up.
            </Placeholder>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <SmartImage src={images.interior} alt="Restaurant dining room" className="aspect-[4/5] w-full rounded-3xl" />
        </Reveal>
      </section>

      <section className="border-y border-cream-100/10 bg-ink-900/60 py-20 sm:py-28">
        <div className="container-page">
          <SectionHeading align="center" eyebrow="The experience" title="What brings people back" />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: UtensilsCrossed,
                title: 'The food',
                text: 'Braai cooked over real fire, hearty plates like sadza and meat, and sides that do their job well.',
              },
              {
                icon: HeartHandshake,
                title: 'Social dining',
                text: 'Long tables, shared platters and space for groups: birthdays, work dinners or a night out with friends.',
              },
              {
                icon: Music,
                title: 'Entertainment',
                text: 'Music that sets the mood, and a weekly event that has become the way to end the week.',
              },
            ].map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 100}>
                <div className="card h-full p-8">
                  <Icon className="size-7 text-ember-400" aria-hidden />
                  <h3 className="mt-5 font-display text-2xl text-cream-50">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-cream-300">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page grid gap-14 py-20 sm:py-28 lg:grid-cols-2 lg:items-center">
        <Reveal className="lg:order-2">
          <p className="eyebrow flex items-center gap-2">
            <Flame className="size-4" aria-hidden /> {fridaysFlame.name}
          </p>
          <h2 className="heading-lg mt-3">Fridays are on fire.</h2>
          <p className="mt-4 leading-relaxed text-cream-300">{fridaysFlame.description}</p>
          <p className="mt-4 font-semibold text-cream-50">Every Friday · {fridaysFlame.timeDisplay}</p>
          <Link to="/fridays-flame" className="mt-8 inline-flex items-center gap-2 font-semibold text-flame-300 hover:text-flame-400">
            Discover Fridays Flame <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Reveal>
        <Reveal delay={120} className="lg:order-1">
          <SmartImage src={images.grillFlames} alt="Braai flames" className="aspect-[4/3] w-full rounded-3xl" />
        </Reveal>
      </section>

      <section className="container-page pb-24">
        <div className="grid gap-4 md:grid-cols-3">
          <Placeholder title="team">Photos and names of the team, if KwaFikie would like to feature them.</Placeholder>
          <Placeholder title="reviews">
            Real customer reviews, with permission. No testimonials have been invented for this demo.
          </Placeholder>
          <Placeholder title="gallery">Photos of KwaFikie’s own venue and food to replace the stock photography.</Placeholder>
        </div>
      </section>
    </>
  )
}
