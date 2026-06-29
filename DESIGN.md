---
name: Safal Karki · PDT-3000
description: A terminal-inspired personal data terminal for a security engineer — phosphor console, operator voice.
colors:
  ink: "#0a0f14"
  ink-elev: "#10171e"
  ink-elev-2: "#141d25"
  text: "#e6ecf0"
  muted: "#8195a0"
  muted-2: "#728995"
  signal: "#6ee7c7"
  ember: "#e8a87c"
  chassis: "#0c1419"
  chassis-2: "#0f1a21"
  line: "#b4d2dc24"
  line-soft: "#b4d2dc12"
  line-strong: "#6ee7c759"
  button-ink: "#06241d"
  # Light theme canonicals (body[data-theme="light"])
  ink-light: "#eef2f4"
  ink-elev-light: "#ffffff"
  text-light: "#122026"
  muted-light: "#4a5b64"
  muted-2-light: "#657279"
  signal-light: "#0c8f74"
  ember-light: "#b96a2f"
typography:
  display:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "clamp(2.6rem, 8vw, 5.4rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.01em"
  headline:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "clamp(2rem, 4vw, 3.2rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "0.005em"
  title:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "1.3rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.01em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.06rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Space Mono, monospace"
    fontSize: "0.72rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "0.18em"
rounded:
  none: "0px"
  circular: "50%"
spacing:
  xs: "0.5rem"
  sm: "0.8rem"
  md: "1.1rem"
  lg: "1.6rem"
components:
  button-primary:
    backgroundColor: "{colors.signal}"
    textColor: "#06241d"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.8rem 1.25rem"
  button-primary-hover:
    backgroundColor: "{colors.signal}"
    textColor: "#06241d"
  button-ghost:
    backgroundColor: "{colors.ink-elev}"
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.8rem 1.25rem"
  tab:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    rounded: "{rounded.none}"
    padding: "0.7rem 0.9rem"
  tab-active:
    backgroundColor: "#6ee7c714"
    textColor: "{colors.text}"
  chip:
    backgroundColor: "{colors.ink-elev}"
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.42rem 0.6rem"
  card:
    backgroundColor: "{colors.ink-elev}"
    textColor: "{colors.text}"
    rounded: "{rounded.none}"
    padding: "1.15rem"
  stat-block:
    backgroundColor: "{colors.ink-elev}"
    textColor: "{colors.text}"
    rounded: "{rounded.none}"
    padding: "1rem"
---

# Design System: Safal Karki · PDT-3000

## 1. Overview

**Creative North Star: "The Phosphor Console"**

The interface is a wrist-mounted personal data terminal — a phosphor CRT console a security operator reads instruments off of. The whole system is one device: a recessed chassis of controls on the left (brand, channel tabs, a tuning scroll-wheel, a radio dial with an ember indicator lamp, a theme toggle) and a CRT screen on the right that "tunes" between channels with a flicker, roll-band, and skew. The voice is the calm operator reading readouts: terse monospace labels, no exclamation, no hype.

Aesthetically it pairs an editorial serif (Instrument Serif) for display against a workhorse sans (Inter) for body and a terminal monospace (Space Mono) for every label, code, and readout. The contrast axis is serif-vs-mono — soft human warmth on the headlines, hard machine precision on the instruments — with Inter as the quiet connective tissue. Corners are sharp throughout (`border-radius: 0`); the only curves in the system are the dial, the wheel, radar blips, and the radio lamp — physical parts that are physically round. Motion is diegetic to the device: a sweeping radar, a typing terminal feed, scanlines, a travelling desk scan, and a channel-change flicker. Every animated element has a `prefers-reduced-motion` path; that is a standing rule, not a nicety.

This system explicitly rejects the generic SaaS/dev-portfolio template (indigo gradients, centered hero, three feature cards) and the cheesy "hacker" pastiche (matrix rain, neon-on-black cliché, skull iconography, tryhard script-kiddie energy). The terminal here is a refined instrument, not a movie prop — credibility over costume, always. Readability is never sacrificed for effect: the CRT texture serves the brand only while copy stays legible.

**Key Characteristics:**
- One device, two regions: control chassis + CRT screen. The frame IS the brand.
- Phosphor signal green is the single accent; ember is the single indicator. Two colors do all the work.
- Sharp corners everywhere except round physical parts (dials, lamps, blips).
- Serif display + mono labels as the contrast axis; Inter for body.
- Diegetic motion (radar sweep, typing terminal, channel tuning) with mandatory reduced-motion paths.
- Tonal layering + inset shadows carry depth; outward lift is glow-on-state only.

## 2. Colors: The Phosphor Console Palette

The palette is a cool-ink chassis with one phosphor accent and one ember indicator — restraint is the voice. The dark theme is canonical; a light theme inverts to a cool paper with a deeper phosphor and a burnt-orange ember.

### Primary
- **CRT Phosphor** (`#6ee7c7`): the single brand accent. The CRT's phosphor glow. Used for active channel markers, active tab code, panel titles' text-shadow glow, radar blips/sweep/core, terminal cursor, the scroll-wheel readout, kicker labels, focus borders, and the primary button fill. It is the voice of "signal."
- **CRT Phosphor (light)** (`#0c8f74`): the deepened phosphor for the light theme, where the bright mint would blow out on paper.

### Secondary
- **Radio Lamp** (`#e8a87c`): the single indicator. A warm ember used sparingly — the pulsing radio-dial lamp, the middle terminal-window dot, and the ember-tinted secondary status dot. Never a second brand color; it is a single physical indicator on the device.
- **Radio Lamp (light)** (`#b96a2f`): a burnt-orange ember for the light theme.

### Neutral
- **Ink** (`#0a0f14`): body background — the deepest chassis black, cool and slightly blue.
- **Ink Elevated** (`#10171e`): first raised surface — cards, stat-blocks, chips, ghost-button fill.
- **Ink Elevated 2** (`#141d25`): the CRT screen surface, the highest tonal step before the glow.
- **Chassis** (`#0c1419`) / **Chassis 2** (`#0f1a21`): the control-cluster and bezel gradient pair.
- **Text** (`#e6ecf0`): primary body ink, a cool near-white.
- **Muted** (`#8195a0`): secondary text, lede, panel copy. The highest-risk token for contrast — see the rule below.
- **Muted Deep** (`#728995` dark / `#657279` light): tertiary labels, serial numbers, status-bar hints. Bumped from `#5f727c` / `#7a8a92` to clear AA (≥4.5:1) on both surfaces in both themes — see the Readability Floor Rule.
- **Line** (`#b4d2dc24`, 14% cool hairline), **Line Soft** (`#b4d2dc12`, 7%), **Line Strong** (`#6ee7c759`, phosphor-tinted 35%): the three border weights. Default borders are cool hairlines; emphasis borders lean phosphor.

### Named Rules
**The Two-Lamp Rule.** CRT Phosphor and Radio Lamp are the only non-neutral colors in the system. Phosphor is the accent; ember is one indicator. Never introduce a third hue. If you reach for a new color, you are leaving the device.

**The Readability Floor Rule.** Muted text must clear AA (≥4.5:1) against its surface in both themes. `#8195a0` on `#141d25` and `#4a5b64` on `#f4f7f8` are the known edge cases — if contrast is even close, bump the muted token toward the ink ramp (toward `--text` / `--text-light`), never toward "elegance." Light gray for elegance is the single biggest reason this kind of design feels hard to read.

**The Glow-Belongs-to-State Rule.** Phosphor glow (`text-shadow`/`box-shadow` with `--signal-dim` or `--glow`) marks active state, focus, or a live readout — active panel title, radar core, the scroll-wheel readout, a hovered button. Static elements do not glow. Glow that decorates instead of signalling is costume.

## 3. Typography

**Display Font:** Instrument Serif (fallback: Georgia, serif)
**Body Font:** Inter (fallback: system-ui, sans-serif)
**Label/Mono Font:** Space Mono (monospace)

**Character:** The contrast axis is serif-vs-mono, not serif-vs-sans. Instrument Serif brings editorial human warmth to the headlines (the operator is a person, not a machine); Space Mono brings hard terminal precision to every label, code, and readout (the device is real). Inter is the quiet connective tissue for prose — competent and invisible. These families are the committed identity; do not swap them on variants.

### Hierarchy
- **Display** (Instrument Serif, 400, `clamp(2.6rem, 8vw, 5.4rem)`, line-height 1): the boot intro name only — the power-on moment. Capped at ~5.4rem; above that the page shouts, not designs.
- **Headline** (Instrument Serif, 400, `clamp(2rem, 4vw, 3.2rem)`, line-height 1.05, letter-spacing 0.005em): panel titles inside the CRT. Carries a phosphor `text-shadow` glow at rest. Capped at ~22ch.
- **Title** (Instrument Serif, 400, 1.3–1.35rem, letter-spacing 0.01em): card headings, timeline entries, project titles.
- **Body** (Inter, 400, 1.06rem, line-height 1.7): all prose — lede, panel copy, card body, notes. Cap line length at 65–75ch (`.lede` is 46ch, `.panel-copy` is grid-spaced).
- **Label** (Space Mono, 700, 0.6–0.72rem, uppercase, letter-spacing 0.08–0.18em): kickers, tab codes, stat labels, chip text, status bars, serial numbers, terminal feed, the scroll-wheel readout. The instrument voice. Tracking widens as size drops.

### Named Rules
**The Mono-Is-Instrument Rule.** Space Mono is reserved for labels, codes, readouts, and the terminal feed — the device's own text. It is never used for body prose. Body in mono reads as a tryhard hacker costume, which is an explicit anti-reference.

**The Caps-For-Labels Rule.** Uppercase + wide tracking belongs to short labels and the terminal feed only. Body copy is sentence case. All-caps prose is banned.

## 4. Elevation

Depth is tonal layering plus inset shadows, not drop shadows. The device is recessed, not floating: surfaces step up through `--ink` → `--ink-elev` → `--ink-elev-2`, and the chassis and CRT are *sunk* with large inset shadows (`inset 0 0 60px rgba(0,0,0,0.5)`, `inset 0 0 90px rgba(0,0,0,0.55)`) so the screen reads as a cavity, not a card. The only outward lift in the system is phosphor glow applied to state (hover, focus, active readout). A single ambient drop shadow (`0 24px 70px rgba(0,0,0,0.5)`) grounds the chassis and bezel against the desk.

### Shadow Vocabulary
- **Cavity** (`inset 0 0 90px rgba(0, 0, 0, 0.55)`): the CRT screen surface — sinks the screen into the bezel.
- **Chassis Sink** (`inset 0 0 40px rgba(0, 0, 0, 0.4)`): the control cluster — sinks the controls into the plate.
- **Wheel Well** (`inset 0 2px 10px rgba(0,0,0,0.5), inset 0 0 0 6px rgba(0,0,0,0.25)`): the tuning scroll-wheel — a recessed physical dial.
- **Ground** (`0 24px 70px rgba(0, 0, 0, 0.5)`): the chassis and bezel resting on the desk. The only drop shadow.
- **State Glow** (`0 0 22px rgba(110, 231, 199, 0.16)` / `0 0 26px rgba(110, 231, 199, 0.5)`): hover/focus lift on buttons, the wheel, active elements. Glow-on-state only.

### Named Rules
**The Recessed-Not-Floating Rule.** Surfaces sink via inset shadows and step up via tone. Do not add drop shadows to cards, stat-blocks, or chips — they are flat panels on the device, lifted only by their tonal step. A card with a drop shadow reads as a floating SaaS card, which is an explicit anti-reference.

## 5. Components

Every control is a tactile instrument part. Buttons lift and glow on press, tabs are channels you "tune" to, cards are panels with a scanline sweep on hover.

### Buttons
- **Shape:** sharp corners (`border-radius: 0`), uppercase Space Mono label, letter-spacing 0.1em.
- **Primary:** CRT Phosphor fill (`#6ee7c7`), near-black ink text (`#06241d`), bold; padding `0.8rem 1.25rem`. The one filled control on the page.
- **Ghost / Secondary:** Ink Elevated fill (`#10171e`), Text color, cool hairline border (`--line`); padding `0.8rem 1.25rem`. Used for "Download Resume" and link-buttons.
- **Hover / Focus:** translate up 2px + phosphor State Glow border (`--signal`). Primary intensifies its glow. Transitions over 0.22s ease.
- **Active:** no special state beyond the hover lift.

### Tabs (Channels)
- **Shape:** sharp, full-width buttons in a vertical grid (horizontal scroll-strip on mobile), padding `0.7rem 0.9rem`.
- **Default:** transparent fill, Muted text, Space Mono code label (HOME / STATS / INV / DATA / MAP / EDU / LOG / COMM).
- **Active:** phosphor-tinted fill (`#6ee7c714`), phosphor Line Strong border, code label turns CRT Phosphor.
- **Hover / Focus:** border steps to Line Strong, text steps to Text. 0.18s ease.

### Chips (Tags)
- **Style:** Ink Elevated fill, Muted Space Mono uppercase text, Line Soft border; padding `0.42rem 0.6rem`.
- **Behavior:** on hover/focus, border steps to CRT Phosphor and text turns phosphor — and the label scrambles through hacker glyphs before resolving (the `Tag` component). Scramble is diegetic to the device; reduced-motion users get the static label.

### Cards / Panels
- **Corner Style:** sharp (`0`).
- **Background:** Ink Elevated (`#10171e`). Cards are flat panels — no drop shadow, no nested cards (nested cards are always wrong).
- **Border:** Line Soft at rest; Line Strong on hover/focus.
- **Shadow Strategy:** none at rest (see Recessed-Not-Floating Rule). On hover: translate up 3px + phosphor Line Strong border.
- **Internal Padding:** `1.15rem` (feature/project cards), `1rem` (stat-blocks).
- **Spotlight variant:** `SpotlightCard` adds a cursor-tracking phosphor radial glow + masked phosphor border that follows the pointer (`[data-glow]` pseudo-elements). Used on feature and project cards.

### Inputs / Fields
- The portfolio has no form inputs. The interactive "input" is the keyboard: arrow keys + number keys (1–8) tune channels, and the scroll-wheel button cycles forward. Keyboard operability is identity, not a nicety.

### Navigation
- The left chassis IS the nav: brand button → channel tabs → scroll-wheel (next channel) → theme toggle. No top bar, no hamburger. On mobile (`≤980px`) the chassis collapses to a top control strip with a horizontal scroll-snap tab row; the CRT fills the rest. The radio dial drops off at `≤480px` (keep the wheel + toggle).

### Signature Components
- **Radar (HOME):** a circular scope — concentric rings, crosshair grid, a 4.5s conic-gradient sweep, five blips (SIEM / PENTESTING / SYSTEMS ENGINEERING / SOC / THREAT HUNTING) that glow as the sweep reaches their angle (per-blip `--delay`), and a pulsing core. Pure CSS, `aria-hidden`.
- **Terminal Feed (HOME):** a `pre` with three status dots (phosphor / ember / muted), typing out `terminalLines` character-by-character with a blinking phosphor cursor, looping every 2s. The device's live readout.
- **Channel Tuning:** switching tabs triggers a 0.52s CRT flicker (brightness/contrast/hue jitter) + a static burst + a vertical roll-band, then the new panel rolls/skews in (`channel-in`). Reduced-motion: instant swap, no flicker.
- **Boot Intro:** on load, the name and title scramble-resolve through hacker glyphs over the intro overlay, then the overlay fades and the console powers on (`pipboy.is-on`). Reduced-motion: near-instant resolve.
- **Brand Scramble:** hovering/focusing the brand button scramble-resolves "Safal Karki" through glyphs. Diegetic; reduced-motion shows the static name.

## 6. Do's and Don'ts

### Do:
- **Do** keep the palette to two non-neutral colors: CRT Phosphor (`#6ee7c7`) as the accent, Radio Lamp (`#e8a87c`) as the single indicator. Two lamps do all the work (The Two-Lamp Rule).
- **Do** use sharp corners (`border-radius: 0`) on every panel, card, button, tab, and chip. Reserve `50%` for round physical parts — dials, the scroll-wheel, radar blips, the radio lamp.
- **Do** carry depth with tonal layering (`--ink` → `--ink-elev` → `--ink-elev-2`) and inset shadows that sink the chassis and CRT. The device is recessed, not floating.
- **Do** reserve Space Mono for labels, codes, readouts, and the terminal feed. Pair it against Instrument Serif on the contrast axis; Inter carries prose.
- **Do** gate every animation behind `prefers-reduced-motion: reduce` with an instant or crossfade alternative. The codebase already does this — make it a standing rule for all future motion.
- **Do** preserve keyboard operability (arrows + 1–8 to tune channels). It is part of the identity, not a bonus.
- **Do** verify `--muted` clears AA (≥4.5:1) against its surface in both themes before shipping; bump toward the ink ramp when close (The Readability Floor Rule).
- **Do** keep the field-label kicker as a chassis radio-dial readout (`{code} · {kicker}`), not an eyebrow above every CRT panel. Only HOME carries an in-panel kicker (a discipline descriptor) — panel titles lead. Repeating the kicker above every section is the banned eyebrow reflex.

### Don't:
- **Don't** build the generic SaaS/dev-portfolio template — indigo-to-violet gradients, centered hero with two CTAs, three identical feature cards. The terminal identity exists precisely to not be this (PRODUCT.md anti-reference).
- **Don't** ship the cheesy "hacker" pastiche — matrix rain, neon-on-black cliché, skull/Anonymous iconography, tryhard script-kiddie energy. The terminal here is a refined instrument, not a movie prop (PRODUCT.md anti-reference).
- **Don't** introduce a third brand color. If you reach for one, you are leaving the device.
- **Don't** use Space Mono for body prose, or all-caps for body copy. Mono-prose and caps-prose read as costume.
- **Don't** add drop shadows to cards, stat-blocks, or chips. They are flat panels lifted only by their tonal step (The Recessed-Not-Floating Rule).
- **Don't** apply phosphor glow to static, non-state elements. Glow signals active/focus/live-readout; decorative glow is costume (The Glow-Belongs-to-State Rule).
- **Don't** use `border-left`/`border-right` greater than 1px as a colored stripe on cards or list items. (The `.timeline` and `.log-entry` use a 2–3px phosphor left edge as a *deliberate instrument rail* — a named, committed pattern — not a default scaffolding reflex; do not propagate the stripe to new components without that intent.)
- **Don't** use `background-clip: text` with a gradient (gradient text). Emphasis comes from weight, size, or the serif/mono contrast — never a gradient.
- **Don't** use glassmorphism decoratively. The one `backdrop-filter: blur(8px)` is on the terminal panel for a reason (it floats over the CRT); do not proliferate blurs.
- **Don't** swap Instrument Serif, Inter, or Space Mono on variants. They are the committed identity; identity-preservation wins.
