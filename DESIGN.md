---
name: 你是傻逼.com
description: Viral meme certificate generator with modern restraint
colors:
  terracotta: "#c8553d"
  terracotta-deep: "#a8412e"
  gold: "#c9a24b"
  gold-soft: "#e6d6ad"
  cream-bg: "#fbf7f0"
  apricot-bg: "#f3ead9"
  ink: "#4a3f35"
  ink-soft: "#8a7d6e"
  line: "#e7dcc8"
  card: "#fffdf8"
typography:
  display:
    fontFamily: "Noto Serif SC, Songti SC, STSong, SimSun, Georgia, serif"
    fontSize: "clamp(48px, 10vw, 96px)"
    fontWeight: 900
    lineHeight: 1.1
    letterSpacing: "0.08em"
  title:
    fontFamily: "Noto Serif SC, Songti SC, STSong, SimSun, Georgia, serif"
    fontSize: "clamp(32px, 7vw, 64px)"
    fontWeight: 700
    lineHeight: 1.1
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif"
    fontSize: "clamp(14px, 2.4vw, 17px)"
    fontWeight: 400
    lineHeight: 1.8
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Hiragino Sans GB, Microsoft YaHei, sans-serif"
    fontSize: "clamp(12px, 2.2vw, 15px)"
    fontWeight: 600
    letterSpacing: "0.42em"
rounded:
  sm: "12px"
  md: "16px"
  lg: "20px"
spacing:
  card-padding: "clamp(22px, 3.6vh, 42px) clamp(20px, 4.5vw, 56px)"
  frame-padding: "clamp(28px, 4vh, 50px) clamp(20px, 5vw, 64px)"
  gap-sm: "clamp(6px, 1.2vh, 12px)"
components:
  button-primary:
    backgroundColor: "{colors.terracotta}"
    textColor: "#fff"
    rounded: "{rounded.sm}"
    padding: "0 clamp(20px, 4vw, 30px)"
    typography: "16px / normal / 600"
  button-primary-hover:
    backgroundColor: "{colors.terracotta-deep}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.terracotta}"
    rounded: "{rounded.sm}"
    padding: "11px 18px"
  input:
    backgroundColor: "#fff"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "16px 18px"
---

# Design System: 你是傻逼.com

## 1. Overview

**Creative North Star: "The Modern Seal"**

A single-purpose meme site where official restraint amplifies absurd content. The design borrows the visual language of formal certificates and government seals — warm neutrals, serif typography, circular stamps — then applies modern minimalism to strip away decorative excess. The tension is the joke: the cleaner and more professional the presentation, the funnier the insult.

The palette is warm but not nostalgic, restrained but not timid. Muted terracotta and soft gold act as deliberate punctuation, not decoration. Typography pairs a Chinese serif (Noto Serif SC) for names and declarations with a system sans for body text, creating hierarchy through contrast rather than ornament. Spacing is generous and fluid (all `clamp()` scales); the certificate breathes.

**What this explicitly rejects** (from PRODUCT.md anti-references):
- The original saturated-yellow elementary-school aesthetic (loud orange borders, red stroke text, busy flourishes)
- Generic AI slop (cream/sand body bg as a category reflex, uppercase eyebrows, identical card grids)
- Over-designed or maximalist decoration

**Key Characteristics:**
- Deadpan modern: serious design stating an absurd thing
- Restrained warm palette: cream + terracotta + gold, each with a job
- Fluid responsive: all spacing/typography uses `clamp()` for seamless viewport scaling
- Inline-everything architecture: CSS/SVG/JS in one HTTP request for instant load
- Chinese-first typography: Noto Serif SC for authenticity, system sans for UI

## 2. Colors: The Restrained Certificate Palette

Two deliberate accents (terracotta, gold) on a warm neutral foundation. Color is punctuation, not decoration.

### Primary
- **Muted Terracotta** (#c8553d / `--accent`): The primary emphasis. Used for the core declaration ("你是傻逼！"), buttons, and the circular stamp. A brick-red that's saturated enough to command attention but muted enough to read as official rather than aggressive.
- **Deep Terracotta** (#a8412e / `--accent-deep`): Hover state for terracotta elements. Slightly darker, slightly more serious.

### Secondary
- **Soft Gold** (#c9a24b / `--gold`): Decorative accents only. The badge outline, flourish lines, input focus rings. Warm, subdued, never loud. Used sparingly (≤10% of any surface).
- **Light Gold** (#e6d6ad / `--gold-soft`): Extremely light gold for borders and subtle tints. Appears in the internal frame lines and input hover states.

### Neutral
- **Cream Body** (#fbf7f0 / `--bg1`): The primary background. A warm off-white with very slight yellow tint. Not the saturated AI-default sand/beige; this is closer to true neutral with warmth as accent, not identity.
- **Apricot Gradient** (#f3ead9 / `--bg2`): Slightly darker warm tone used in the radial gradient to add depth to the certificate area. Never used as a flat fill.
- **Warm Ink** (#4a3f35 / `--ink`): Main body text. A warm dark gray-brown, high contrast against cream (10.2:1).
- **Soft Ink** (#8a7d6e / `--ink-soft`): Secondary text, hints, placeholders. Hits WCAG AA contrast (4.7:1 on white).
- **Line** (#e7dcc8 / `--line`): Borders and dividers. Subtle, warm, nearly invisible.
- **Card** (#fffdf8 / `--card`): Certificate card background. Near-white with a hint of warmth, layered over the cream body.

### Named Rules
**The Punctuation Rule.** Terracotta and gold are punctuation, not decoration. Terracotta carries semantic weight (the insult, the action). Gold is ornamental accent only (≤10% surface coverage). Neither appears casually.

## 3. Typography

**Display Font:** Noto Serif SC 900 (with Songti SC, STSong, SimSun fallback)  
**Title Font:** Noto Serif SC 700  
**Body/UI Font:** System sans stack (-apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Microsoft YaHei)

**Character:** A Chinese-first hierarchy. The serif (Noto Serif SC) carries all content weight — names, declarations, stamp text — grounding the design in formal document tradition. The system sans handles UI (buttons, inputs, hints) and stays invisible. The pairing creates instant hierarchy: serif = content, sans = interface.

### Hierarchy
- **Display** (900 weight, `clamp(48px, 10vw, 96px)`, 1.1 line-height, 0.08em letter-spacing): The core declaration ("你是傻逼！"). Maximum visual impact, used once per certificate. Always terracotta.
- **Title** (700 weight, `clamp(32px, 7vw, 64px)`, 1.1 line-height): The recipient's name. Large, confident, ink-colored. Word-breaks gracefully on narrow viewports.
- **Body** (400 weight, `clamp(14px, 2.4vw, 17px)`, 1.8 line-height): Hints, instructions, footer text. System sans, soft-ink color. Max-width controlled where applicable (30em for prose).
- **Label** (600 weight, `clamp(12px, 2.2vw, 15px)`, 0.42em letter-spacing, uppercase indent): Small eyebrow text (e.g. "恭喜" header). Gold color, wide tracking. Used sparingly (one per page max).

### Named Rules
**The Serif-for-Content Rule.** All user-facing content (names, declarations, stamp text, "恭喜" header) uses Noto Serif SC. The system sans is UI infrastructure only (buttons, inputs, hints). This creates instant hierarchy without relying on size alone.

## 4. Elevation

This system is **flat by default with subtle tonal layering**. No heavy shadows. Depth is conveyed through warm tinted backgrounds and delicate borders, not drop shadows.

### Shadow Vocabulary
- **Card Lift** (`0 12px 40px -18px rgba(74,63,53,.28), 0 2px 8px -4px rgba(74,63,53,.1)`): The certificate card floats gently above the cream body. Soft, diffuse, warm-toned (uses `--ink` color at low opacity). This is the only shadow in the system.

All other depth comes from layering warm backgrounds (cream → apricot → card-white) and thin gold/line-colored borders.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. The one shadow (card lift) is permanent and structural, not a hover effect. No button shadows, no input glows (focus uses border color shift instead).

## 5. Components

### Buttons
- **Shape:** Gently rounded (12px radius)
- **Primary:** Terracotta background (`#c8553d`), white text, 16px sans 600 weight, horizontal padding scales with viewport (`clamp(20px, 4vw, 30px)`). Hover: deep terracotta (`#a8412e`). Active: slight scale-down (`.97`). Focus: 2px gold outline, 3px offset.
- **Ghost:** Transparent background, terracotta text, 1px line-colored border, 11px × 18px padding, 14px font. Hover: light cream tint (`#fbf3ee`), gold-soft border. Focus: 2px terracotta outline, 3px offset.
- **Transitions:** Background 180ms, transform 100ms. Reduced-motion: instant color shift, no transform.

### Input Pill
- **Style:** White background, warm-ink text, 16px padding, 1px line-colored border, 16px rounded corners. Embedded in a larger pill container (the `.row`) with flex layout.
- **Focus:** The parent `.row` container (not the input itself) gets a gold border + soft shadow on `:focus-within`. Creates a cohesive focus ring around input + button as one unit.
- **Placeholder:** Soft-ink color (`#8a7d6e`), 4.7:1 contrast (WCAG AA compliant).

### Cards / Containers
- **Corner Style:** 20px radius (large, modern)
- **Background:** Card-white (`#fffdf8`) layered over cream body
- **Shadow:** Soft warm lift (see Elevation section)
- **Border:** 1px line-colored stroke (`#e7dcc8`), nearly invisible
- **Internal Padding:** Fluid, `clamp(22px, 3.6vh, 42px)` vertical × `clamp(20px, 4.5vw, 56px)` horizontal

### Decorative Elements
- **Stamp (seal):** Circular terracotta border (1.5px), terracotta text, Noto Serif SC 600, rotated -8°, 56-76px diameter (fluid). Three lines of Chinese text stacked vertically. Opacity 0.8 to feel stamped, not printed.
- **Badge:** Inline SVG, gold stroke (1.2px), radial gradient fill (cream to line-color), 36-60px (fluid). Eight curved petal-like strokes radiating from center, with concentric circles.
- **Flourish lines:** Inline SVG, 1px gold stroke, opacity 0.45-0.9. Top flourish: horizontal lines + center dot. Bottom: gentle S-curve. Used to frame the certificate vertically.
- **Chevron arrow:** CSS-only (18×18px box with rotated borders), gold, 55% opacity, subtle vertical bob animation (1.8s ease-in-out, 3px range). Points down to guide input. Respects `prefers-reduced-motion`.

### Frame
- **Outer container:** Full viewport height, centered flex column, cream radial gradient background (fixed attachment). Generous fluid padding.
- **Inner border:** Decorative gold-soft stroke (1px) inset 12-24px from edges (fluid), 18px radius, with inset white shadow + outer gold glow (extremely subtle). Creates the "certificate frame" effect.

## 6. Do's and Don'ts

Concrete guardrails to preserve the deadpan restraint.

### Do:
- **Do** use Noto Serif SC for all content (names, declarations, stamp text). The system sans is UI-only.
- **Do** keep terracotta and gold as rare punctuation. Terracotta = semantic emphasis (the insult, actions). Gold = decorative accent (≤10% of any surface).
- **Do** use `clamp()` for all spacing and typography. Every dimension should scale fluidly from mobile to desktop.
- **Do** maintain the warm neutral foundation (cream + apricot + card-white). Depth through tonal layering, not shadows.
- **Do** keep interactions subtle. Hover = color shift, no dramatic scale/shadow. Focus = colored outline, no glow.
- **Do** respect the flat-by-default elevation philosophy. The one shadow (card lift) is structural; everything else is flat or uses tonal layering.

### Don't:
- **Don't** revert to the loud elementary-school aesthetic (saturated yellow/orange backgrounds, red stroke text, busy clipart flourishes). That was the first draft; we've moved on.
- **Don't** add cream/sand/beige as a generic "warm" reflex. The current warm palette is tied to the brand seed (muted terracotta as the anchor), not a category default.
- **Don't** introduce uppercase eyebrows above every section, numbered scaffolding (01/02/03), or gradient text. These are AI slop tells per PRODUCT.md anti-references.
- **Don't** pair similar fonts (two sans-serifs, two serifs). The current pairing (serif display + system sans body) works through contrast, not similarity.
- **Don't** add decorative shadows, glass effects, or bounce/elastic easing. The system is restrained, not playful.
- **Don't** use gray text on colored backgrounds. Use a darker shade of the background's own hue or a transparency of the text color.
- **Don't** gate content visibility on animations. The chevron bob enhances an already-visible default; it doesn't hide the input until it fires.
