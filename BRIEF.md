# adedayobabalola.com v3 — Implementation Brief

**For:** Claude Code, working in this repo (`adedayo-portfolio-v3`)
**Owner:** Adedayo Babalola (Emmanuel Adedayo Babalola) — Design Engineer, Lagos, Nigeria
**Date:** 2026-07-06
**Design system:** Optimus — see `design.md` in this repo. `design.md` is law; this brief is the build order.

---

## 0. Ground rules

1. **All content is Adedayo Babalola's.** Everything ships from `src/data.ts` and this brief — real case studies, real testimonials, real links. No lorem, no invented clients, no stock copy. If content is missing, render a clearly-marked `TODO` state and list it in the PR description.
2. **NDA boundary.** Optimus is forked *in spirit* from the Inkwell architecture (RepliHaus, confidential). Never copy Inkwell tokens, component code, names (`--rk-*`), or any RepliKit product content into this repo. Architecture patterns only. RepliHaus appears solely as a line in work history ("UX Designer — RepliKit") and the "Currently" note.
3. **Obey the Optimus laws** (`design.md` §2): sharp edges (radius 0 everywhere), semantic-tokens-only, closed token schema (`--opt-*`), glass as a first-class surface, one motion rhythm, compose from blocks. Never reach past a layer.
4. **Every new block gets a Storybook story** before it lands in a page. Storybook runs at `npm run storybook` → localhost:6008. A11y addon is installed — stories should pass it.
5. **Performance is a feature.** Budgets in §9. Heavy effects (shader, ASCII field, WebGL) must lazy-load, run on transform/opacity or canvas, and pause off-screen.
6. **Motion is the experience (owner decision, 2026-07-07).** The loader, island transitions, scatter-to-bento, ASCII field, and footer shader ship in full, by default, for everyone. Do **not** build static/gutted variants — that ruins the flow. This amends `design.md` Law 5's reduced-motion clause: where the OS sets `prefers-reduced-motion`, *simplify* (shorter durations, fewer layers) but never strip a signature sequence to a static render.
7. **Build in the app, review on the dev server.** Pages and blocks are written in VSCode and reviewed live at `npm run dev` → **localhost:5173**. Storybook (6008) remains the home for the type specimen, foundations, and atoms — it is no longer the review gate for blocks/pages.
8. Work in phases (§10), commit per phase, keep `npm run build` green (it is green as of this brief — `tsc -b` passes).

---

## 1. What already exists (don't rebuild)

- **Tokens & foundations** — `src/styles/tokens.css` (3-layer, `--opt-*`), `src/index.css` (fonts, `.glass`, `.eyebrow`), Foundations stories.
- **24 UI atoms** in `src/components/ui/` with stories (button, tag, segmented, dialog, popover, toast, tooltip, avatar, badge, input, etc.).
- **8 blocks** in `src/blocks/`: `Hero`, `Nav`, `ProjectGrid`, `Services`, `TestimonialBand`, `ClientLogos`, `Contact`, `FooterWordmark` (+ `_parts.tsx`, `Blocks.stories.tsx`).
- **Content** — `src/data.ts` (profile, metrics, 4 case studies with real product shots in `src/assets/work/`, work history, socials).
- **Stack** — Vite + React 19 + TS + Tailwind 4 + Framer Motion + GSAP + Radix + React Router 7 + Storybook 10 (port 6008) + next-themes + sonner.

The work below **evolves** these blocks toward the v3 art direction. Prefer editing an existing block over creating a parallel one.

---

## 2. Type exploration (Phase 0 — do this first)

Recoleta stays as the current display face **until Adedayo picks its replacement**. He wants a squarish display font that pairs with Switzer — "Optimus" energy (greek-mythology-meets-autobot: geometric, confident, slightly brutal).

Build **`Foundations/Type Specimen`** story:

- Load trial/free weights of **Clash Display**, **Cabinet Grotesk**, and **Space Grotesk** (self-host woff2 in `src/assets/fonts/`, subset if possible; respect Fontshare/Google licenses).
- Render each candidate against Switzer body copy at the real scale tokens (`display`, `h1`, `h2`, `h3` vs `lead`/`body`) using real site copy: the wordmark "Adedayo", the hero line, a case-study card, the footer wordmark.
- Include current Recoleta as control. Add a Storybook control to switch candidates globally.
- **Do not** swap `--opt-font-display` site-wide until Adedayo confirms in Storybook. Everything else in this brief proceeds with the token, so the swap is one line later.

---

## 3. Global chrome

### 3.1 Loader → dynamic island (signature sequence)

First visit, `100vh` overlay on `surface-base`:

1. **Shader/animated background** fills the viewport under the logo lockup (subtle — this is the same family as the ASCII field in §3.3, not a light show).
2. Lockup animates: the **"B" mark slides right** while the **"Adedayo" wordmark reveals sliding left** (clip-path or mask reveal; GSAP timeline, `--opt-easing-expo`).
3. The whole lockup **scrolls up and collapses into the floating nav island** at the top; the shader background collapses from `100vh` to `0` height in sync.
4. Total sequence ≤ 2.0s; skippable on click/keypress; session-stored so it plays once per session. The sequence always plays (§0 rule 6 — under OS reduced-motion it may compress to ~1s, never to a static frame). Reserve the nav's layout box from the start — **zero layout shift** when the island lands.

### 3.2 Nav — the square island (`Nav.tsx` rework)

Reference images: `Pasted image 20260706144629.png` / `...144704.png` in the vault (B mark + "Adedayo" + three oscillating shapes).

- Floating, centered top island, **sharp corners** (Law 1 — "dynamic island but squareish"), `.glass` surface, hairline `border-subtle`.
- Anatomy: **B logo left** · **current active section label center** (scroll-spy driven) · **right: three shapes — a dot, a square, a triangle — oscillating** on a gentle sine/cos phase offset (CSS keyframes, transform-only, always animating).
- **Hover/focus (desktop):** island expands along the **x-axis** to reveal links — Home · Work · About · Writing · Contact · Résumé. Use Framer Motion `layout` on a fixed-position element so expansion never reflows the page ("no page bounce").
- **Mobile:** tap expands along the **y-axis** into a dropdown panel (reference: second pasted image — stacked Work/About/Blog + CONTACT button). Focus-trapped, Esc/blur closes.
- Island also hosts the **theme toggle** and **sound toggle** (§8) in the expanded state.
- Keyboard accessible throughout; `aria-current` on the active section.

### 3.3 Page frame & ASCII background

- **Two vertical hairline strokes** frame the whole site — subtle padding from left and right viewport edges (visible in the Frame 42 screenshots). All section content lives inside them. `border-subtle`, they persist across pages and both themes.
- **ASCII/pixel cursor field:** the page background reacts to the cursor with an ASCII-style effect as the user moves/scrolls through sections (desktop, fine-pointer only). Implementation: single fixed `<canvas>` behind content, character/pixel grid sampled from `--opt-*` neutrals, ripple radius around cursor position; heavily throttled (rAF, cap ~30fps), disabled on touch and while the tab is hidden. This is the successor to the v2 **DotField** experiment — same DNA, new clothes. Build as `blocks/AsciiField.tsx` + story.

### 3.4 Footer — the metallic wordmark (`FooterWordmark.tsx` rework)

- Full-bleed **"Adedayo"** wordmark with a **metallic shader effect** (WebGL — lazy-loaded; graceful fallback to a static metallic CSS gradient only when WebGL is unavailable). Responsive: scales from mobile to desktop without cropping.
- **Easter egg:** hovering the wordmark reveals a **reset/shuffle icon** (bottom corner of the footer) — clicking it cycles the wordmark through alternate shader effects (chrome, liquid, holographic… start with 3). Ships as a tiny effect registry so new shaders can be forked in over time. On the site this is framed as "played with in the effects studio."
- Below the wordmark: contact line + links from §6 Contact, copyright, **local time in Lagos (WAT)** as a live clock, availability line.
- Story with an effect-switcher control.

---

## 4. Landing page (v1 deliverable — every section below, in order)

### 4.1 Hero

- **Centered text.** Content from `data.ts` profile: name/wordmark, role **Design Engineer**, intro — *"I'm a design engineer — I turn complex, technical systems into experiences that feel simple, human, and trustworthy, then build and ship them in code…"*, "Currently: Shaping RepliKit at RepliHaus…", CTA pair (View work → `#work`, Book a call → Calendly).
- **Scattered images:** 5–6 real product shots (`src/assets/work/` — lithium, zilliqa, lighthouse, tabulera covers) float scattered and slightly rotated around the hero background (Frame 42 reference: tilted KYMA-style card, but with **Adedayo's real shots**).
- **Scroll choreography (the signature move):** as the user scrolls past the hero, the scattered images **animate into their slots in the work bento grid** (§4.2). GSAP ScrollTrigger + FLIP (or Framer Motion shared layout). This plays for everyone (§0 rule 6).
- ~~Metrics strip~~ — **cut (owner decision, 2026-07-07).** No metrics strip in the hero; the numbers live inside the case-study cards and pages instead.

### 4.2 Work — bento grid (`ProjectGrid.tsx` rework)

- **Bento layout**, sharp edges, hairline dividers. Explore 2–3 arrangements as story variants; the 4 deep case studies get the large cells, "more work" items the small ones.
- **Tabs** (use `segmented` atom): **All · Case studies · Live projects · Playground**. Animate filter transitions with Framer Motion layout; no grid jump/page bounce.
- Each card: cover image, title, **year + tags + client**, headline metric; opens the case-study page or live project link.
- Content (already in `data.ts` + vault `02 — Work`):
  - **Case studies:** 01 Lithium Staking ($5M+ on-chain, 2024) · 02 Lighthouse DS (50+ components, 50% faster design-to-dev, 2024) · 03 Zilliqa Migration (lit-ZIL launch, 2025) · 04 Tabulera (30+ lawyer interviews, 2022).
  - **Live/more work:** Westgate Technologies (eCommerce 2026, +25% completed checkouts) · eMonie (fintech 2025, +40% engagement) · eBank Group (fintech 2025) · Nukodes (bookkeeping 2026, coming soon) · PostPaddy (social 2022, 2K+ users).
  - **Playground:** fetched from GitHub (§5 Work page) — landing shows a teaser cell.
- **"See all" →** `/work`.

### 4.3 Mini about

Reference: `Screenshot 2026-07-06 at 14.49.26.png` (v2's about band — photo left, essay right, work-history stack).

- Header in display type: **"Designing experiences that solve real problems."** (or the H1 Adedayo settles on — keep as a `data.ts` string).
- Photo + short bio cut from the About essay (§5), name + **Design Engineer**, link to `/about`.
- **Work history stack:** RepliHaus (Apr 2026–present, UX Designer — RepliKit & Inkwell DS) · Lithium Digital (Jul 2023–Nov 2025, Lead UX/UI) · Vizible Labs (2024–2025, Product Designer, Design Systems) · Tabulerasa (2022–2023) · Digital Figures (2021–2022). "Show all" expands.
- **Stack & process strip:** tool logos — Figma, Paper, Claude, Claude Code, Obsidian, Notion, Storybook, Linear, React/TypeScript, Tailwind. Use official SVGs (simpleicons or brand assets) rendered monochrome in `text-secondary`, accent on hover. Add to `src/assets/logos/index.tsx`.

### 4.4 Clients / companies (`ClientLogos.tsx`)

Logo band: Lithium Digital · Vizible Labs · Tabulerasa · Westgate Technologies · eMonie · eBank Group · Nukodes · PostPaddy · RepliHaus. Monochrome treatment, marquee optional (pausable, reduced-motion-aware). **TODO state per missing logo** — source real SVGs; never redraw a brand from memory.

### 4.5 Testimonials (`TestimonialBand.tsx`) — placeholder for now

**Owner decision (2026-07-07):** real references are being collected from Adedayo's referees — until they arrive, this section ships with **clearly-marked placeholder entries** (name + role slots, greeked quote text visually flagged as placeholder). Do **not** fabricate quotes and do not publish the old v2 quotes as final.

Build the band fully data-driven from `data.ts` (`testimonials: { quote, name, role, company, placeholder: boolean }[]`) so real references drop in with zero component changes. Referees to expect: Seun, Caleb, Dami, Tof(unmi), Ibukun, Temidayo, Martin. The v2 quotes (Thibaut Houdean — Lithium, Tofunmi Adewuyi — Check DC, Caleb Uzuegbunam — Vizible) are kept in the vault as candidates pending re-confirmation.

**Future TODO:** collect referee references → replace placeholders → flip `placeholder: false`.

### 4.6 Writing strip (Substack)

Three latest essays from **Adedayo 𓂀** (dedayo.substack.com), reading in-site (§5 Blog):

- **You can just do things. I did.** (Jan 2026) — lead card; ties to the engineering→design→building arc.
- **For my 27th, I write to my Mum.** (Mar 2026)
- **Channeling Your Inner Child: Chasing Your Dreams** (May 2026)

Card: title, date, read-time, one-line summary, signature pull-quote (e.g. *"Movement creates clarity, not the other way around."*). Subscribe CTA → Substack.

### 4.7 Footer

The §3.4 block.

---

## 5. Inner pages (v1 = routed stubs with real content structure; v1.1 = full)

- **/work** — full bento + the same tabs; **Playground** tab fetches Adedayo's public repos from the GitHub REST API (`users/Adedhayor/repos`, build-time fetch cached to JSON, same pattern as the blog): Community League, SPOB, Spotifeed, this site, etc.
- **/about** — the full essay from vault `08 — Portfolio/01 — About` (spine: *"I build software that earns trust"* — mechanical engineering at Ibadan → self-taught design → nearly 5 years across blockchain/fintech/legal-tech → ships own code; interests: HCI, accessibility, cognitive ergonomics, AI ethics; human side: 174km run, swimming, writing, mentoring designers across Africa; based in Lagos, remote with UK/Canada teams). Include: bio, background, work history, process, stack, **currently reading** (*Design Engineering Handbook*), the "meet me in 60s" quick-facts module, and Now items (playlist link, currently line).
- **/writing** — list + **in-site reader**: build-time script (`scripts/fetch-substack.ts`) pulls the RSS feed → `src/content/writing.json` (title, date, html body, hero image). Reader renders sanitized post HTML inside the site with Optimus typography; canonical link + "read on Substack" preserved. New posts land on rebuild.
- **/case-study/:slug** — one template, 4 instances. Structure per vault `03 — Case Studies`: tagline → overview (role, client, year, deliverables) → 3–4 narrative sections with one figure each (assets in `src/assets/work/`) → outcomes strip → live link if it exists → next-case-study footer nav. Narrative arc: *understand → design → test → land*.
- **/contact** (or landing section + footer): *"Have something complex that needs to feel simple? Let's talk."* — email `dayo@replikit.ai`, Calendly, LinkedIn, GitHub (`Adedhayor`), X/IG `@__dedayo`, photography IG `@optimus.randoms`, Substack, résumé PDF (TODO: hosted file — link from nav Résumé item too).

---

## 6. Theming, sound, and easter eggs

- **Light/dark** via next-themes + `.dark` semantic overrides (already tokenized). Toggle lives in the expanded nav island. Transition: brief cross-fade on a `::view-transition` or opacity ramp on root — must not flash, break the glass surfaces, or restart canvas effects. Both themes verified for contrast (design.md §7).
- **Sound (opt-in, off by default):** tiny UI sounds on nav open, tab switch, theme toggle, footer-shader shuffle. One `useSound` hook, Web Audio, total assets < 50KB, toggle persisted in `localStorage`. This is also a Lab experiment ("Sound study").
- **Easter eggs** beyond the footer (pick 2 for v1, keep cheap): konami/typed "optimus" swaps the wordmark shader; the nav's dot/square/triangle become click-to-scramble; local-time greeting in footer. Source inspiration: originkit.dev interactive elements — **inspiration only, write our own.**
- **Live local time** (Lagos, WAT) in the footer.

---

## 7. Content sources (single source of truth)

`src/data.ts` stays the one content file (+ generated `writing.json`, `repos.json`). This brief plus the Obsidian vault (`08 — Portfolio/*`) already reconciled: name form **Adedayo Babalola**, headline **Design Engineer**, location **Lagos**, experience **~5 yrs**, case-study order **Lithium → Lighthouse → Zilliqa → Tabulera**. Any copy edits go into `data.ts`, never inline in components.

---

## 8. References (tone, not theft)

calebuzu.com · launchfolio.framer.website · tolanidaniel.me · rauno.me · zero.university · animusstudios.com — study the restraint and interaction quality. Benji Taylor remains the editorial north star. Nothing is copied; Optimus has its own laws.

---

## 9. Performance & quality budgets

- Lighthouse (mobile, throttled): **Perf ≥ 90, A11y ≥ 95, SEO ≥ 95** on `/`.
- LCP ≤ 2.5s, CLS ≈ 0 (loader reserves layout; island never reflows), INP ≤ 200ms.
- JS on `/` ≤ ~180KB gz before lazy chunks; shader/ASCII/WebGL are lazy `import()`s behind interaction/visibility; fonts subset + `font-display: swap`; images pre-sized, lazy, modern formats. Motion stays full-fat (§0 rule 6) — hit the budgets through lazy-loading and canvas discipline, not by cutting animation.
- All stories pass the a11y addon; `npm run build` and `npx tsc -b` stay green; test the loader → island → scatter-to-bento sequence at 360px, 768px, 1440px on the local dev server.

---

## 10. Build order

**Workflow (owner decision, 2026-07-07):** built properly in VSCode, reviewed live on the **vite dev server (`npm run dev` → localhost:5173)**. Storybook (6008) is only the gate for Phase 0 and stays as the atoms/foundations catalog — blocks and pages are reviewed in the running app, in context, with the real loader → nav → scroll flow.

| Phase | Deliverable | Gate |
|---|---|---|
| 0 | Type Specimen story (Clash Display / Cabinet Grotesk / Space Grotesk vs Recoleta) | Adedayo picks in Storybook |
| 1 | Nav island (desktop x-expand, mobile y-dropdown, oscillating shapes) + page frame strokes | Review on localhost:5173 |
| 2 | Loader sequence + AsciiField canvas | Review on 5173 |
| 3 | Hero + scatter-to-bento + Work grid w/ tabs | Review on 5173 |
| 4 | Mini about, stack strip, clients, testimonial placeholders, writing strip | Review on 5173 |
| 5 | Footer wordmark shader + easter egg registry + time/theme/sound | Review on 5173 |
| 6 | Assemble `/` , route stubs, fetch-substack + fetch-repos scripts | `build` green, budgets met |
| 7 | Inner pages full (work, about, writing reader, 4 case studies) | Final pass |

**Open TODOs for Adedayo (not Claude Code):** host résumé PDF · confirm availability line · **collect referee references for testimonials (Seun, Caleb, Dami, Tof, Ibukun, Temidayo, Martin) — placeholders until then** · client logo SVGs · final font call after Phase 0.
