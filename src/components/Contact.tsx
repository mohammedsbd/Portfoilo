import { profile } from '@/data/profile';
import Reveal from './Reveal';
import ContactScene from './ContactScene';
import Magnetic from './Magnetic';

/**
 * There is no mail service behind this site, so there is no form. A form that
 * posts into a void is worse than no form at all — it takes a message and
 * quietly loses it. The channels are listed directly instead, each one a live
 * link that opens the app that owns it.
 */
const CHANNELS = [
  {
    label: 'Email',
    handle: profile.email,
    href: `mailto:${profile.email}`,
    note: 'Best for anything with detail',
  },
  {
    label: 'Telegram',
    handle: profile.telegramHandle,
    href: profile.telegram,
    note: 'Fastest reply',
  },
  {
    label: 'Phone',
    handle: profile.phone,
    href: `tel:${profile.phoneHref}`,
    note: 'Call or text',
  },
  {
    label: 'GitHub',
    handle: '@mohammedsbd',
    href: profile.github,
    note: 'The code itself',
  },
];

export default function Contact() {
  return (
    <section className="section contact" id="contact">
      <ContactScene />
      <div className="shell contact__grid">
        <Reveal>
          <div className="sec-head__num" style={{ marginBottom: '1.6rem' }}>
            <span>07 / Contact</span>
          </div>

          <h2 className="contact__title">
            Let&rsquo;s build
            <br />
            <em>something good.</em>
          </h2>

          <p className="contact__lede">
            I&rsquo;m {profile.available ? 'currently available' : 'booking ahead'} for freelance
            projects and full-time roles. Tell me what you&rsquo;re working on. I reply within a
            day or two.
          </p>

          <Magnetic strength={10}>
            <a href={`mailto:${profile.email}`} className="contact__mail">
              {profile.email}
              <span aria-hidden="true">↗</span>
            </a>
          </Magnetic>
        </Reveal>

        <Reveal delay={140}>
          <div className="channels">
            <span className="channels__label">Reach me on</span>

            {CHANNELS.map((c) => (
              <a
                key={c.label}
                className="channel"
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel={c.href.startsWith('http') ? 'noreferrer noopener' : undefined}
              >
                <span className="channel__label">{c.label}</span>
                <span className="channel__handle">{c.handle}</span>
                <span className="channel__note">{c.note}</span>
                <span className="channel__arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
