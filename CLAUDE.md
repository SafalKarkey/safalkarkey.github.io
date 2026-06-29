# CLAUDE.md

Project-specific guidance for Safal Karki's portfolio (React + Vite + Tailwind v4).

## Design Context

This project uses the [impeccable](.claude/skills/impeccable) design skill. Before any UI work, read these two files — they define the brand and the visual system:

- **[PRODUCT.md](PRODUCT.md)** — strategic context: register (`brand`), dual audience (recruiters + security peers), the "PDT-3000 Personal Data Terminal" voice (precise / signal-rich / distinctive), anti-references (generic SaaS portfolio, cheesy hacker pastiche), and 5 design principles.
- **[DESIGN.md](DESIGN.md)** — the visual system spec: the Phosphor Console palette (CRT Phosphor `#6ee7c7` + Radio Lamp `#e8a87c` as the only two non-neutral colors), Instrument Serif / Inter / Space Mono typography, tonal + inset elevation with glow-on-state, sharp corners, diegetic motion with mandatory reduced-motion paths, and Do's / Don'ts. Machine-readable tokens are in its YAML frontmatter; the full component snippets, tonal ramps, and motion tokens live in [.impeccable/design.json](.impeccable/design.json).

### Standing rules (from DESIGN.md)
- **Two-Lamp Rule:** only CRT Phosphor (accent) + Radio Lamp (indicator). No third hue.
- **Readability Floor:** `--muted` must clear AA (≥4.5:1) against its surface in both dark and light themes — bump toward the ink ramp when close, never toward "elegance."
- **Mono-Is-Instrument:** Space Mono is for labels, codes, readouts, and the terminal feed only — never body prose.
- **Recessed-Not-Floating:** depth = tonal layering + inset shadows; no drop shadows on cards/chips.
- **Reduced motion is mandatory** for every animation. Keyboard nav (arrows + 1–8) is identity, not a bonus.

The committed fonts (Instrument Serif, Inter, Space Mono) are identity — do not swap them on variants.
