# Mohammed Salih — Portfolio

Personal portfolio site. **Next.js 15** (App Router) + TypeScript + Framer Motion.

```bash
npm run dev     # http://localhost:3000
npm run build
npm start
```

## Where things live

| Path | What |
| --- | --- |
| `src/data/profile.ts` | Name, bio, stats, contact channels, work history, services |
| `src/data/projects.ts` | The project list shown in the Work section |
| `src/data/facts.ts` | Random-facts cards + hero ticker |
| `src/app/globals.css` | All styling. Design tokens are at the top under `:root` |
| `public/media/showreel.mp4` | Showreel clip in the Work section |

**Editing content is a data-file change, not a component change.** Everything on
the page is driven from `src/data/`.

## Sections

Announcement bar → Hero → Ticker → About → Services → **Work** (showreel +
filterable projects) → Journey → Education → Random facts → Contact → Footer

## Notes

- **No contact form, by design.** There is no mail service behind the site, and
  a form that posts into a void loses messages. The Contact section lists the
  channels instead — email, Telegram, phone, GitHub — each read from
  `profile.socials`/`profile.telegram` and rendered as a live link.
- **Artwork is all vector.** The hero window/planet scene, the page starfield,
  the per-project cover art, and the contact horizon are SVG components, so
  there are no image assets to optimise and everything stays crisp at any size.
- **Reduced motion** is respected throughout — parallax, the preloader and the
  showreel autoplay all stand down for `prefers-reduced-motion: reduce`.

## Performance rules for this page

The page was once unusable on mid-range hardware. The causes, all now fixed —
please don't reintroduce them:

- **No SMIL** (`<animate>`, `animateTransform`, `animateMotion`). There were
  ~477 of them running non-stop, offscreen included. They run on the main
  thread and do not stop when out of view. The art is static; motion comes from
  CSS transforms on hover.
- **No `feGaussianBlur`.** Every soft edge here is a radial gradient with wide
  stops, which costs nothing. Blur filters re-rasterise whenever their layer
  moves on scroll.
- **No `backdrop-filter` on anything that moves every frame**, and **no
  `mix-blend-mode` on full-viewport or video-covering layers** — both force
  per-frame full-screen readbacks.
- Animated SVG layers (`.hero__scene svg`, `.backdrop__layer`) carry
  `will-change: transform` so scroll-linked scaling is a composited transform
  rather than a vector re-raster.
- **`content-visibility: auto` is deliberately not used** on `.section`. It
  helps paint cost but makes the document report a placeholder height, which
  breaks the `#anchor` nav on first click.

## Content

All copy comes from the resume (`Resume (1).pdf`). Edit these, not the
components:

| File | Holds |
| --- | --- |
| `src/data/profile.ts` | Contact details, bio, stats, experience, education, certifications |
| `src/data/projects.ts` | The four projects and their filters |
| `src/data/facts.ts` | The stack table entries and the hero ticker |

Two deliberate choices, so the site never claims more than the resume does:

- **Skills are listed, not scored.** The resume states no proficiency levels,
  so the stack table names what each tool is used for rather than scoring it
  out of ten.
- **Project "metrics" are facts, not numbers.** Tiles hold things like
  `Next.js 16 / App Router + React 19`, because the resume gives no traffic or
  performance figures to quote.

## Theme

Black + warm cream, cinematic. The whole site runs off the tokens in `:root`
(`src/app/globals.css`) — change those and every section follows:

| Token | Value | Role |
| --- | --- | --- |
| `--bg` / `--bg-1` / `--bg-2` | `#000000` / `#101010` / `#212121` | page, intro card, feature cards |
| `--fg` | `#e1e0cc` | primary cream text |
| `--accent` | `#dedbc8` | marks, rules, checks |
| `--fg-muted` / `--fg-dim` | `#9ca3af` / `#6b7280` | body grey, labels |

Fonts: **Almarai** global, **Instrument Serif italic** for accent words inside
headings, **JetBrains Mono** retained for small technical labels (section
numbers, chips, card details) — a developer portfolio reads better with them.

## Hero

`src/components/CinematicHero.tsx` — fullscreen looping video, glass
navigation, Instrument Serif display type.

- The spec's palette (`--background: 201 100% 13%` etc.) is scoped to `.vhero`,
  **not** `:root`. Applied globally the deep navy repaints all eleven thousand
  pixels of the page.
- The hero carries its own `relative` nav, which scrolls away. The fixed
  `.topbar` is therefore held above the fold (`.is-lifted`) until ~0.82 of a
  viewport has scrolled, then slides in to navigate the rest of the page.
- `src/components/Hero.tsx` + `HeroScene.tsx` (the vector window/planet scene)
  are retained but unused — swap the import in `src/app/page.tsx` to switch
  back.

## Project carousel

`src/components/ProjectCarousel.tsx` — a 3D cylinder of metal cards, one per
project. The transform maths, the eased magnetic dwell, the smoothstep bands
and the perspective-aware edge alignment are as specified; two things differ
for good reason:

- **Eight slots, not four.** The wrap happens at `±cardCount/2`, but a card is
  only pushed fully off-stage once `|offset|` passes 2. With four slots a card
  teleports 599px mid-view once per revolution; with the original five it still
  jumps 915px while ~17px of it is on stage. Eight slots wrap at `|offset| = 4`,
  well past the `3.0` hide threshold. Each project appears twice, half a
  revolution apart, so a twin is hidden whenever its pair is centred.
- **Everything is gated on visibility.** The rAF loop does not run and the
  `<video>` elements are not mounted until an IntersectionObserver says the
  section is on screen. Sixteen video elements — half of them under
  `filter: blur(16px)` — must never decode behind eleven thousand pixels of page.

`ProjectArt` renders underneath every card face, so a card still looks finished
if the remote CDN videos fail to load.

## Video

`public/media/showreel.mp4` — H.264, **1924×1076**, 10.0s, no audio track.

`.reel__frame` is pinned to `aspect-ratio: 481 / 269`, which is exactly the
source ratio, so the video is never cropped or rescaled. If you swap the clip
for one of a different size, update that ratio to match or it will soften.

On a HiDPI screen the frame is ~2600 device px wide, so a 1924px source is
still upscaled ~1.35×. The only way to get past that is a
higher-resolution export.
- Don't run `next build` while `next dev` is running; they share `.next` and the
  dev server will start throwing `__webpack_modules__[moduleId] is not a
  function`. Stop dev first, or delete `.next` afterwards.
