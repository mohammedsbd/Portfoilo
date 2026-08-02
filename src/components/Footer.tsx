import { navItems, profile } from '@/data/profile';
import { HERO_VIDEO } from '@/data/media';
import LocalClock from './LocalClock';
import Magnetic from './Magnetic';
import FooterGlow from './FooterGlow';

/** The wordmark, one letter per span so each can be hovered on its own. */
const words = profile.name.toUpperCase().split(' ');

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      {/* The hero plate, run edge to edge again at the bottom of the page.
          Plain element on purpose: no state, so the footer stays a server
          component, and the file is already in cache from the landing frame. */}
      <div className="footer__reel" aria-hidden="true">
        <video src={HERO_VIDEO} autoPlay loop muted playsInline preload="metadata" />
      </div>

      <FooterGlow />

      <div className="shell">
        <div className="footer__top">
          <div>
            <p className="footer__eyebrow">Still here?</p>
            <p className="footer__lede">
              The rest is <em>a conversation.</em>
            </p>

            <Magnetic strength={10}>
              <a href={`mailto:${profile.email}`} className="footer__mail">
                {profile.email}
                <span aria-hidden="true">↗</span>
              </a>
            </Magnetic>
          </div>

          <div className="footer__cols">
            <div className="footer__col">
              <h4>Sections</h4>
              <ul>
                {navItems.map((n) => (
                  <li key={n.id}>
                    <a href={`#${n.id}`}>{n.label}</a>
                  </li>
                ))}
                <li>
                  <a href="#education">Education</a>
                </li>
                <li>
                  <a href="#facts">Facts</a>
                </li>
              </ul>
            </div>

            <div className="footer__col">
              <h4>Elsewhere</h4>
              <ul>
                {profile.socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.url}
                      target={s.url.startsWith('http') ? '_blank' : undefined}
                      rel={s.url.startsWith('http') ? 'noreferrer noopener' : undefined}
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a href={profile.resume} target="_blank" rel="noreferrer noopener">
                    Résumé
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span>
            © {year} {profile.name}. Built with Next.js.
          </span>
          <span className="footer__clock">
            <i />
            Addis Ababa <LocalClock />
          </span>
          <a href="#top" className="to-top">
            Back to top <span aria-hidden="true">↑</span>
          </a>
        </div>

        {/* The page does not end so much as run out of paper: the name is set
            as wide as the shell allows and cut off by the bottom edge. */}
        <div className="footer__markWrap">
          <div className="footer__mark" role="img" aria-label={profile.name}>
            {words.map((word) => (
              <span className="footer__word" key={word} aria-hidden="true">
                {[...word].map((letter, i) => (
                  <span key={`${word}-${i}`}>{letter}</span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
