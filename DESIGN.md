---
name: Muammal A. Fadhil Portfolio
description: A dark research bench for an ML and robotics engineer, made of frosted glass, mono readouts and one cyan signal, animated with GSAP.
colors:
  signal-cyan: "#00bae2"
  telemetry-green: "#0ae448"
  lab-violet: "#9d95ff"
  night: "#080808"
  night-raised: "#0e0e0e"
  night-well: "#151515"
  bench-white: "#ffffff"
  fog: "#e4e4e4"
  ash: "#a4a4a4"
  press-white: "#e6e6e6"
  ink: "#0a0a0a"
  hairline: "rgba(255, 255, 255, 0.1)"
  hairline-strong: "rgba(255, 255, 255, 0.22)"
  glass-tint: "rgba(255, 255, 255, 0.045)"
  glass-deep: "rgba(20, 20, 20, 0.62)"
  field-tint: "rgba(255, 255, 255, 0.035)"
  nav-glass: "rgba(14, 14, 14, 0.55)"
typography:
  display:
    fontFamily: "Geist, ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "clamp(3.25rem, 1.5rem + 6.5vw, 8.5rem)"
    fontWeight: 500
    lineHeight: 0.92
    letterSpacing: "-0.055em"
  headline:
    fontFamily: "Geist, ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "clamp(2.25rem, 1.4rem + 3vw, 4rem)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Geist, ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "clamp(1.5rem, 1.25rem + 1vw, 2.25rem)"
    fontWeight: 500
    lineHeight: 1.12
    letterSpacing: "-0.035em"
  lead:
    fontFamily: "Geist, ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "clamp(1.25rem, 1.1rem + 0.8vw, 1.625rem)"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "-0.012em"
  body:
    fontFamily: "Geist, ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.075rem"
    fontWeight: 400
    lineHeight: 1.65
    fontFeature: "'ss01', 'cv11'"
  button:
    fontFamily: "Geist, ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.975rem"
    fontWeight: 500
    letterSpacing: "-0.005em"
  label:
    fontFamily: "'Geist Mono', ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    letterSpacing: "0.12em"
  chip:
    fontFamily: "'Geist Mono', ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace"
    fontSize: "0.875rem"
    fontWeight: 500
    letterSpacing: "0.06em"
rounded:
  xs: "6px"
  sm: "10px"
  md: "16px"
  lg: "22px"
  xl: "30px"
  pill: "999px"
spacing:
  "1": "0.25rem"
  "2": "0.5rem"
  "3": "0.75rem"
  "4": "1rem"
  "5": "1.5rem"
  "6": "2rem"
  "7": "3rem"
  "8": "4rem"
  "9": "6rem"
  gutter: "clamp(1.25rem, 0.6rem + 3vw, 3rem)"
  section-y: "clamp(5.5rem, 3.5rem + 7vw, 10rem)"
components:
  button-primary:
    backgroundColor: "{colors.bench-white}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0 1.4rem"
    height: "3rem"
  button-primary-hover:
    backgroundColor: "{colors.press-white}"
    textColor: "{colors.ink}"
  button-glass:
    backgroundColor: "{colors.glass-tint}"
    textColor: "{colors.bench-white}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0 1.4rem"
    height: "3rem"
  chip:
    backgroundColor: "{colors.glass-tint}"
    textColor: "{colors.bench-white}"
    typography: "{typography.chip}"
    rounded: "{rounded.pill}"
    padding: "0 0.85rem"
    height: "1.85rem"
  tag:
    backgroundColor: "{colors.field-tint}"
    textColor: "{colors.bench-white}"
    rounded: "{rounded.pill}"
    padding: "0.35rem 0.8rem"
  input:
    backgroundColor: "{colors.field-tint}"
    textColor: "{colors.bench-white}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "0.75rem 1rem"
    height: "3rem"
  nav:
    backgroundColor: "{colors.nav-glass}"
    textColor: "{colors.fog}"
    rounded: "{rounded.pill}"
    padding: "0 0.6rem 0 0.85rem"
    height: "3.5rem"
  nav-link:
    textColor: "{colors.fog}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "0 0.85rem"
    height: "2.25rem"
  card-glass:
    backgroundColor: "{colors.glass-tint}"
    rounded: "{rounded.lg}"
  card-glass-strong:
    backgroundColor: "{colors.glass-deep}"
    rounded: "{rounded.lg}"
  project-card:
    backgroundColor: "{colors.glass-tint}"
    rounded: "{rounded.xl}"
    padding: "0.6rem"
  timeline-entry:
    backgroundColor: "{colors.glass-tint}"
    rounded: "{rounded.xl}"
    padding: "clamp(1.75rem, 1.25rem + 2vw, 3rem)"
  cert-row:
    textColor: "{colors.bench-white}"
    rounded: "{rounded.sm}"
    padding: "1.25rem 0.75rem"
---

# Design System: Muammal A. Fadhil Portfolio

## Overview

**Creative North Star: "The Night Lab"**

The site is a research bench after hours. The room is near-black, the instruments are frosted glass and hairline metal, and the readouts are small uppercase mono. One cyan signal light marks what is live. Everything is monochrome by default (black, white and four greys). Colour shows up only to point at something: an employer, an active timeline node, a link you can follow, a highlighted claim. The lab is precise but alive. A dot grid under the hero lights up around the pointer, glass panels catch a moving edge-light, and GSAP choreographs every entrance.

Motion is part of the personality, not decoration bolted on: **playful and kinetic.** Headlines rise out of masks, technical glyphs burst outward from the portrait with an overshoot, scrubbed paragraphs illuminate word by word as you scroll, and buttons pull magnetically toward the cursor and spring back elastically. That energy sits inside a strict, quiet frame of one typeface family, one radius language, one accent and one light source. The calm frame is what lets the motion read as intentional instead of noisy.

Density is generous and editorial: large fluid display type, a 62ch reading measure, sections separated by long vertical rhythm (`section-y`) and hairline rules rather than background changes. The page ships as plain HTML, CSS and JS with no build step. The same stylesheet dresses the public site and the private admin dashboard.

**Key Characteristics:**
- Permanent near-black canvas (`night`) with fine static film grain over everything.
- Frosted glass panels (blur + saturate + top sheen + inset highlight) as the only container material.
- Geist for everything readable; Geist Mono, uppercase and tracked wide, for every label, index and readout.
- Pill-shaped interactive controls; generously rounded containers (22–30px).
- A single signal accent (Signal Cyan) and a strictly decorative spectrum reserved for ambient shapes.
- GSAP + ScrollTrigger choreography: mask reveals, overshoot bursts, scrubbed illumination and magnetic, elastic buttons. Fully disabled under `prefers-reduced-motion`.
- Pointer-reactive light (dot grid, glass spotlight) on fine pointers only.

## Colors

A monochrome night palette with one signal accent, two supporting telemetry colours, and a decorative spectrum that never touches text or controls.

### Primary
- **Signal Cyan** (`signal-cyan`): The only accent with a job. It marks the dashboard brand on hover, the subtitle braces around section eyebrows, the hero asterisk flair, `.text-accent`, and the arrow on hovered certificate rows. In Experience it marks employer names, active timeline nodes and bullet ticks. In the hero it marks the star glyphs on the burst items, and in the admin dashboard it marks the active tab and focused fields.

### Secondary
- **Telemetry Green** (`telemetry-green`): A second readout colour, used only for the "Agentic AI" highlight in the About statement and the midpoint of the timeline fill gradient.

### Tertiary
- **Lab Violet** (`lab-violet`): A third readout colour, used for the "Raw Data into Stories" highlight, the hero diamond glyph, the tail of the timeline fill gradient and one floating corner mark.

### Neutral
- **Night** (`night`): Page background and the colour behind every glass layer. Also the ink of selected text.
- **Night Raised** (`night-raised`): Slightly lifted dark used inside media wells (experience imagery).
- **Night Well** (`night-well`): Empty image wells (project media, certificate thumbnails) and the scrollbar thumb.
- **Bench White** (`bench-white`): Headings, primary button fill, dashboard monogram, focus rings, scroll progress bar, the lit state of scrubbed words.
- **Fog** (`fog`): Default body copy, nav links at rest, descriptions.
- **Ash** (`ash`): Mono labels, indices, placeholders, de-emphasised icons.
- **Press White** (`press-white`): Primary button hover.
- **Ink** (`ink`): Text on the white primary button.
- **Hairline / Hairline Strong** (`hairline`, `hairline-strong`): All rules, borders, dividers and the timeline rail. Strong is the hover state.
- **Glass Tint / Glass Deep / Field Tint / Nav Glass**: The translucent fills that make the glass system (see Elevation & Depth).

**Decorative spectrum (ambient shapes only).** The SVG gradients `gsapGradientCyan` (`#00F0FF` → `#7000FF`), `gsapGradientPurple` (`#F7BDF8` → `#2F3CC0`), `gsapGradientPink` (`#FF8709` → `#F7BDF8`) and `gsapGradientEmerald` (`#D1FFBC` → `#0AE448` → `#0AA3E4`) fill the floating curve, diamond, asterisk, windmill, orbit and flower shapes at 22–38% opacity, plus the ambient orbs (cyan 8%, violet 7%). They are atmosphere, never information.

### Named Rules
**The One Signal Rule.** Signal Cyan is the only colour allowed to mean "look here". Use it on small marks (a brace, a node, an arrow, an org name), never as a fill for large surfaces or buttons. If two cyan things compete in one viewport, one of them is wrong.

**The Spectrum Stays Ambient Rule.** Gradient spectrum colours live only on decorative, `aria-hidden` shapes at low opacity. They never colour text, controls, borders of interactive elements or data.

**The Monochrome Media Rule.** Experience photography renders `grayscale(1) contrast(1.06) brightness(0.9)` at rest and reveals full colour only on hover. Imagery joins the night palette until the visitor reaches for it.

**The Token-Only Accent Rule.** Accent colours are always referenced through `--accent-cyan`, `--accent-green` and `--accent-violet`: in the stylesheet, in page-level `<style>` blocks and in GSAP tweens (read the token with `getComputedStyle`). A raw accent hex anywhere outside the token block is a bug. The SVG spectrum gradients are the one exception.

## Typography

**Display Font:** Geist (with ui-sans-serif, system UI fallbacks)
**Body Font:** Geist (same family)
**Label/Mono Font:** Geist Mono (with ui-monospace, SF Mono, Menlo, Consolas)

**Character:** A single engineered grotesk carries both the shouting and the reading. It is set tight and heavy-ish (500) at display sizes, open and calm in body copy. Geist Mono is the instrument readout: small, uppercase, widely tracked, always grey. Together they read as a lab notebook typeset by a careful engineer. Body text enables Geist's stylistic sets `ss01` and `cv11`.

### Hierarchy
- **Display** (500, `clamp(3.25rem → 8.5rem)`, 0.92, −0.055em): The hero name only. Lines are masked and never wrap (`white-space: nowrap` per line).
- **Headline** (500, `clamp(2.25rem → 4rem)`, 1.08, −0.035em): Section titles (`.display-2`), capped at ~21ch; the contact title.
- **Title** (500, `clamp(1.5rem → 2.25rem)`, 1.12, −0.035em): Project titles. Experience roles and certificate titles use nearby one-off clamps (`1.4–2rem`, `1.125–1.45rem`).
- **Lead** (400, `clamp(1.25rem → 1.625rem)`, 1.5, −0.012em): Hero roles line and intro paragraphs; Bench White; 62ch max.
- **Body** (400, 1.075rem, 1.65): All running copy in Fog, 62ch measure (`--measure`). Description variants step up to 1.15rem (`--fs-md`).
- **Button** (500, 0.975rem, −0.005em): Buttons, nav links, brand name, project links.
- **Label** (Geist Mono 400, 0.8125rem, 0.12em, UPPERCASE): Eyebrows, form labels, fact-list terms, indices, meta readouts. Always Ash or Fog.

### Named Rules
**The Readout Rule.** Anything that labels, counts, indexes or dates is Geist Mono, uppercase, tracked 0.06–0.12em, in grey. Anything that says something is Geist. Never set sentences in mono, and never set labels in the sans.

**The Negative Tracking Rule.** Tracking tightens as size grows: −0.055em at display, −0.035em at headline/title, −0.012em at lead, 0 at body. Never track large type positively.

## Layout

A centred single column of full-width sections. The container is 1320px plus fluid gutters (`clamp(1.25rem → 3rem)` each side). Sections breathe with `section-y` (`clamp(5.5rem → 10rem)`) top and bottom and are separated by hairline rules or nothing at all. Background shifts are never used to separate sections.

- **Hero:** full viewport height (`100svh`). It is a two-column grid with content left and a background-free portrait cutout right, both bottom-aligned to the hero's hairline floor. Behind them is a 28px dot grid masked to an ellipse that lights up in a 200px radius around the pointer.
- **Section heads:** a grid of eyebrow, headline and optional right-aligned aside (`section-head--split`), with a 3–5.5rem gap before content.
- **Projects:** stacked full-width glass cards, media and body side by side at 1.3fr / 1fr, alternating sides with `project--reverse`.
- **Experience:** an editorial timeline. A left rail sits at a fluid inset, glass entries hang off it with circular nodes, and each entry is split text 1.4fr / media 1fr.
- **Certifications:** a ruled table-like list (index, thumbnail, title, org, arrow) with hairlines between rows.
- **Contact:** a glass form with a two-column field row.

**Breakpoints** (declared in the stylesheet header): **1100px** switches to compact navigation and tighter grids; **860px** stacks the two-column layouts; **560px** applies phone refinements (with extra steps at 640px and 480px). Pointer media queries (`hover: hover` and `pointer: fine`) gate every hover lift, spotlight and parallax effect. Touch devices get static, always-visible equivalents, such as inline certificate thumbnails.

**Spacing rhythm:** a 4px-based scale (`0.25rem → 6rem`) for component internals; fluid clamps for anything section-level.

## Elevation & Depth

Depth comes from **layered frosted glass over a near-black void**, not from stacked shadows. A surface is "higher" when it is blurrier, more opaque and has a brighter rim.

- **Base glass** (`.glass`): Glass Tint fill under a top-down white sheen (6% fading out by 38%), `blur(20px) saturate(140%)`, a 1px hairline border, a 1px inset top highlight, and one deep, soft drop shadow.
- **Strong glass** (`.glass--strong`): Glass Deep fill, `blur(28px)`, for overlays and the mobile menu.
- **Nav glass:** Nav Glass fill at `blur(28px) saturate(160%)`, darkening to 78% and gaining a stronger rim once the page scrolls.
- **Fallback:** without `backdrop-filter` support, glass becomes an opaque `rgba(22, 22, 22, 0.94)`.

### Shadow Vocabulary
- **Glass drop** (`0 24px 60px -28px rgba(0, 0, 0, 0.75)`): Under every glass panel. A long, tight-spread shadow that seats the panel without a visible halo.
- **Inset rim** (`inset 0 1px 0 rgba(255, 255, 255, 0.08)`): The top-edge highlight that makes glass read as a solid sheet.
- **Nav float** (`0 10px 30px rgba(0, 0, 0, 0.35)`): The floating pill nav.
- **Entry lift** (`0 12px 36px rgba(0,0,0,0.3)` → `0 18px 48px rgba(0,0,0,0.45)` on hover): Timeline entries.
- **Cutout ground** (`drop-shadow(0 20px 45px rgba(0, 0, 0, 0.85))`): Grounds the portrait cutout into the hero.
- **Signal glow** (`0 0 18px rgba(0, 186, 226, 0.65)`): The active timeline node, plus a softer version on the timeline progress fill (`0 0 16px` at 0.5). Glow is reserved for tiny "this is live" marks; the hero asterisk and one floating dot carry the same treatment as `drop-shadow`.

### Named Rules
**The One Light Source Rule.** Light comes from above (the top sheen and inset rim) and from the visitor's pointer (spotlight edge, lit dots, hero glow). Never add competing coloured glows, neon outlines or rim lights to containers.

**The Pointer Is The Lamp Rule.** Interactive light effects (`.spotlight`, the lit dot grid, the hero glow) appear only on fine pointers and only while the pointer is present. At rest, surfaces are calm.

## Shapes

Soft, machined geometry. Interactive controls are full pills (`999px`): buttons, chips, tags, nav links, the nav itself and the skip link. Containers are generously rounded: glass panels 22px, project cards and timeline entries 30px. Nested media subtract the parent's padding from its radius (`calc(var(--r-xl) - var(--pad))`) so the corners stay concentric. Small framed items such as certificate thumbnails and focus rings use 6–10px. Avatars, nodes, dots and icon buttons are perfect circles.

Borders are always 1px hairlines in white at 10% or 22% opacity, except the 2px timeline rail and 2px node rings. Ambient decorative shapes (curve, diamond, asterisk, windmill, orbit, flower, timer, cutout, brace) form a recurring glyph vocabulary that echoes the lab's "technical symbol" language.

## Components

### Buttons
Pill-shaped, confident and alive under the cursor.
- **Shape:** full pill (999px), 3rem minimum height, 1.4rem side padding, icon gap 0.65rem.
- **Primary:** Bench White fill, Ink text. Hover settles to Press White.
- **Glass:** Glass Tint fill, Bench White text, hairline border, `blur(12px)`, inset rim. Hover strengthens the border.
- **Hover / Active:** The trailing icon nudges 3px in its direction of travel (down for the "#portfolio" jump). Press scales to 0.98. Disabled is 50% opacity.
- **Magnetic (GSAP):** On fine pointers, primary and glass buttons follow the cursor by 28% of its offset (`power2.out`, 0.35s, `overwrite: 'auto'`) and spring home with `elastic.out(1.1, 0.4)` over 0.75s.
- **Icon button:** a 2.5rem circle with a faint white wash on hover.

### Chips & Tags
- **Chip:** mono, uppercase, 0.06em tracking, 1.85rem tall, Glass Tint fill with a strong hairline. Used for status-like readouts.
- **Tag:** sans 0.875rem at weight 450, Field Tint fill, hairline border, pill. Used for project tech stacks; borders strengthen when the parent card is hovered.

### Cards / Containers
- **Corner Style:** 22px (glass panels) or 30px (project cards, timeline entries).
- **Background:** Glass Tint over the night canvas, with a top sheen.
- **Shadow Strategy:** see Elevation & Depth. One glass drop and one inset rim, nothing more.
- **Border:** 1px hairline, strengthening on hover.
- **Internal Padding:** project cards use a 0.6rem frame around media and a `clamp(1.5rem → 2.75rem)` body; timeline entries use `clamp(1.75rem → 3rem)`.
- **Spotlight:** cards with `.spotlight` show a 420px soft interior light and a 260px bright edge-light that follow the pointer.
- **Hover:** project cards lift 4px and their media scales to 1.03 over a long 1.4s ease. Timeline entries lift 3px. Certificate rows lift 2px and slide their title 0.35rem right.

### Inputs / Fields
- **Style:** Field Tint fill, 1px hairline, 10px radius, 3rem minimum height, `0.75rem 1rem` padding, body-size text. Labels are mono readouts above the field.
- **Focus:** the border brightens to Fog and gains a 4px hairline halo (`box-shadow: 0 0 0 4px`). There's no colour change. Hover strengthens the hairline.
- **Error:** the border turns Bench White and **dashed** (`aria-invalid="true"`). The error is shown by the border pattern, not by red.
- **Textarea:** 9rem minimum height, vertical resize only.

### Navigation
- **Style:** a floating, centred glass pill (3.5rem tall, max 680px) fixed 1rem from the top. On the public site it holds only the six section links plus the menu toggle; there's no logo.
- **Links:** Fog at rest, Bench White on hover or when active. A single sliding indicator pill (faint white wash plus hairline) glides between links. `script.js` writes its position into `--x` / `--w`, and it eases with `--ease-out`.
- **Brand (admin dashboard only):** a circular white monogram plus a name. On hover the name turns Signal Cyan and the monogram rotates −12°.
- **Scrolled state:** deeper glass and a stronger rim.
- **Mobile (≤1100px):** a compact pill with a two-line toggle that morphs into an X and opens a full-screen Strong glass menu.

### Section Eyebrow (signature)
The lab's label plate: a mono uppercase readout with a numeric index trailed by a 1.75rem hairline, sometimes a 6px white dot with a hairline halo. It is wrapped in two Signal Cyan curly braces that slide in from either side on scroll.

### Scrubbed Statement (signature)
Large headline-size statements (`[data-gsap-scrub-text]`) are split into words that start at 35% white. As the visitor scrolls through, they light up to Bench White one by one (ScrollTrigger `scrub: 1`, `ease: "none"`). Highlighted phrases get their own entrances: Signal Cyan with a spinning sparkle, Telemetry Green flipping up from `rotateX: 90`, violet springing in with `elastic.out(1, 0.45)`.

### Proof Labels (signature)
The pills that burst out of the hero portrait carry **verifiable facts only**: the published model, a placement, a founder role, a training-data figure, a shipped build. They are a real list (`role="list"`, readable by screen readers), not decoration. On screens ≤560px they use hand-placed `data-sm-x` / `data-sm-y` positions, and every label is clamped to stay inside the portrait area.

### Training Pipeline (signature)
The lead project shows how the work was built as a mini timeline (`.pipeline`): a 1px hairline rail with a Signal Cyan fill, 9px cyan dots, mono labels and sans values. As the card scrolls through the viewport, a scrubbed ScrollTrigger timeline fills the rail and lights each step in turn. This is the Work section's single authored motion moment. The default state is fully lit, so no-JS and reduced-motion visitors see the finished pipeline.

### Copy Actions
Contact offers a glass "Copy email" button beside the address, and the form shows a "Copy message" fallback if no email app opens. A successful copy swaps the label ("Email copied") and turns the border and icon Signal Cyan for ~2s. A failed copy says so in plain words and stays neutral.

### Motion Choreography (GSAP)
Motion follows the official GSAP skills (greensock/gsap-skills: core, timeline, scrolltrigger, performance). The site loads GSAP 3.13 and ScrollTrigger from jsDelivr.

- **Hero master timeline:** one `gsap.timeline({ defaults: { ease: "power3.out" } })` sequenced with the position parameter (`"-=0.55"`, `"<"`). The steps run in this order:
  1. The header drops in.
  2. The intro text staggers in.
  3. The name lines rise from a `105%` mask (stagger 0.12).
  4. The asterisk flair pops in with `back.out(1.8)`.
  5. The CTAs follow.
  6. The portrait fades in.
  7. The proof labels burst out from the portrait centre to their `data-x` / `data-y` positions (`back.out(1.8)`, at 48% scale on screens ≤860px), then drift forever with `sine.inOut` yoyo loops.
- **Scroll reveals:** `[data-reveal]`, headlines and cards enter from `y: 30–52`, `opacity: 0` (cards also from `scale: 0.96`) at `start: "top 85–88%"`, playing once (`toggleActions: "play none none none"`).
- **Scrubbed motion:** the hero asterisk rotates 240° and the burst field lifts 50px across the hero's scroll (`scrub: 1`, `ease: "none"`).
- **Counters:** `[data-count]` stats tick up over 1.8s with `power2.out`.
- **Ambient:** orbs and floating glass drift on long `sine.inOut` / `power1.inOut` yoyo loops. The hero flair spins once every 18s with `ease: "none"`. On fine pointers, floating glass and burst items parallax toward the cursor (`power2.out`, 1.2–1.3s).
- **CSS state transitions** use the tokens `--dur-fast` (0.2s), `--dur` (0.45s), `--dur-slow` (0.9s) with `--ease-out` `cubic-bezier(0.23, 1, 0.32, 1)`.
- **Reduced motion:** when `prefers-reduced-motion: reduce` matches, the GSAP engine and magnetic buttons never start. Counters jump straight to their values, CSS smooth scrolling is never enabled, and CSS collapses every transition and keyframe animation to 0.01ms so content appears in its final state.

### Named Rules
**The Kinetic Entrance Rule.** Entrances are where personality lives. They may overshoot (`back.out`), spring (`elastic.out`) and stagger. State changes such as hover, focus and active stay short and well-mannered (`--dur-fast` / `--dur` on `--ease-out`). Never bounce a hover.

**The Transform-Only Rule (from gsap-performance).** Animate only `x`, `y`, `xPercent`, `yPercent`, `scale`, `rotation` and `opacity` (or `autoAlpha`). Never animate `width`, `height`, `top`, `left`, `margin` or `padding` for movement.

**The Top-Level Trigger Rule (from gsap-scrolltrigger).** ScrollTrigger goes on a timeline or a top-level tween, never on a tween nested inside a timeline. Each trigger chooses `scrub` or `toggleActions`, never both. Triggers are created top to bottom in page order. Call `ScrollTrigger.refresh()` after CMS content or images change the layout.

**The Reduced Motion Floor Rule.** Every new animation must have a reduced-motion outcome where content is visible, final and static. Prefer `gsap.matchMedia()` with a `reduceMotion` condition for new work, so animations are reverted automatically.

## Do's and Don'ts

### Do:
- **Do** keep every surface on the `night` canvas and build containers from the glass system: tint, top sheen, blur, 1px hairline, inset rim, one glass drop.
- **Do** reserve Signal Cyan for small "look here" marks: braces, nodes, arrows, org names, the dashboard brand hover.
- **Do** set every label, index, date and form label in Geist Mono, uppercase, tracked 0.06–0.12em, in Ash or Fog.
- **Do** make interactive controls full pills and containers 22–30px, with concentric radii on nested media.
- **Do** sequence multi-step motion with `gsap.timeline()` plus `defaults` and the position parameter, not chained `delay`s.
- **Do** use `gsap.quickTo()` for new pointer-following effects instead of creating a tween on every `mousemove`, per gsap-performance.
- **Do** gate hover lifts, spotlights, parallax and magnetic effects behind `(hover: hover) and (pointer: fine)`, and give touch devices a static equivalent.
- **Do** keep experience imagery greyscale at rest (`--img-filter`) and reveal colour on hover.
- **Do** keep the public page fully readable with JavaScript, GSAP or the backend unavailable.

### Don't:
- **Don't** introduce a light theme surface, a coloured section background or a second accent colour for UI.
- **Don't** put spectrum gradients on text, buttons, borders of controls or anything that carries meaning. They are for ambient `aria-hidden` shapes only.
- **Don't** add neon outlines, rainbow text, or coloured glows on containers, buttons or fields. Glow belongs only to tiny signal marks: the active timeline node, the timeline fill and the hero asterisk.
- **Don't** set sentences in mono or labels in the sans.
- **Don't** use red for errors. Fields signal invalid input with a dashed Bench White border plus a message.
- **Don't** animate layout properties (`width`, `height`, `top`, `left`, `margin`, `padding`). Use transforms and opacity.
- **Don't** attach ScrollTrigger to a tween nested inside a timeline, or use `scrub` and `toggleActions` on the same trigger.
- **Don't** leave `markers: true` in production or set `will-change` on elements that don't animate.
- **Don't** hard-code accent hexes in CSS, inline `<style>` blocks or GSAP tweens. Reference `--accent-cyan`, `--accent-green` and `--accent-violet`.
- **Don't** reference a custom property that isn't declared in the `:root` token block. An undefined `var()` silently drops the whole declaration.
