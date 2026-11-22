---
name: Mayank Joshi
description: A security product builder's portfolio, set as a ruled report sheet over a live pixel-cell grid.
colors:
  action-green: "#55d394"
  action-green-hover: "#74e2aa"
  action-ink: "#06140c"
  finding-coral: "#ec6a5e"
  exhibit-amber: "#f0ab3e"
  research-blue: "#6b8cff"
  bone: "#e3ddcc"
  ink: "#e8eaf0"
  soft: "#a9afbd"
  dim: "#8a91a3"
  sheet: "#0e1117"
  well: "#12151c"
  bar: "#0a0c10"
  grid-line: "rgba(6,7,10,.92)"
  rule: "rgba(255,255,255,.12)"
  rule-faint: "rgba(255,255,255,.07)"
typography:
  display:
    fontFamily: "Geist, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(46px, min(8.1vw, 12.6vh), 118px)"
    fontWeight: 600
    lineHeight: 0.9
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Geist, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(38px, 5.6vw, 80px)"
    fontWeight: 600
    lineHeight: 0.96
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Geist, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(24px, 2.5vw, 36px)"
    fontWeight: 600
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  lede:
    fontFamily: "Geist, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(17px, 1.5vw, 20px)"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Geist, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Geist Mono, ui-monospace, Menlo, monospace"
    fontSize: "11.5px"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.1em"
  data:
    fontFamily: "Geist Mono, ui-monospace, Menlo, monospace"
    fontSize: "12.5px"
    fontWeight: 500
    lineHeight: 1.3
    fontFeature: "tnum"
rounded:
  none: "0px"
spacing:
  cell: "10px"
  gap: "10px"
  inset: "clamp(10px, 1.9vw, 28px)"
  panel: "clamp(20px, 3.4vw, 48px)"
  margin-column: "clamp(210px, 18.5vw, 268px)"
  section: "clamp(40px, 6vw, 88px)"
components:
  button-ruled:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0 22px"
    height: "48px"
  button-ruled-hover:
    backgroundColor: "rgba(255,255,255,.05)"
    textColor: "{colors.ink}"
  button-action:
    backgroundColor: "{colors.action-green}"
    textColor: "{colors.action-ink}"
    rounded: "{rounded.none}"
    padding: "0 22px"
    height: "48px"
  button-action-hover:
    backgroundColor: "{colors.action-green-hover}"
    textColor: "{colors.action-ink}"
  legend:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.dim}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "2px 8px"
  header-field:
    textColor: "{colors.ink}"
    typography: "{typography.data}"
    padding: "13px 22px"
  indicator-tag:
    backgroundColor: "transparent"
    typography: "{typography.data}"
    rounded: "{rounded.none}"
    padding: "6px 10px"
  exhibit-note:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.exhibit-amber}"
    rounded: "{rounded.none}"
    padding: "5px 7px"
  report-bar:
    backgroundColor: "{colors.bar}"
    textColor: "{colors.soft}"
    height: "56px"
---

# Design System: Mayank Joshi

## Overview

**Creative North Star: "The Case File"**

The site is a single filed report: a near-black sheet, inset from the viewport edge and ruled into cells by 1px hairlines, lying over a live canvas of 10px pixel cells where small bugs crawl and can be caught. Everything reads as a form someone filled in. Boxes are labelled by legends that sit on their rules, facts sit in mono field cells, and the work is entered as numbered findings, exhibits and log rows rather than cards. Density is that of a working document: generous display type at the top of each part, then tight ruled rows.

Colour is a classification, not decoration. Five accents each mean one kind of thing (a finding, an exhibit, a status or action, research, emphasis), and any element that carries one declares what it is. Type is one family in two voices: Geist, set large, heavy and tightly tracked for statements, and Geist Mono for every label, ID, date and number. Imagery is pixel art, built in whole cells and rendered with hard edges; the subject appears only as cell portraits, and the one softer view of him is a small smoothed layer seen through a glass lens.

Motion is the report being read into view. Each part is revealed once by a green scan line travelling top to bottom across a gridded overlay, scroll is smoothed, and a few elements respond to scroll position. Nothing loops for attention except the status pulse and the live canvas.

**Key Characteristics:**
- Near-black sheet (#0e1117) ruled in white hairlines at 12% and 7%, no fills, no radius, no shadows.
- A live 10px cell grid behind the sheet, visible through it, with pixel bugs on top.
- Five semantic accents, each assigned per element through one local colour variable.
- Geist display at weight 600 with -0.03 to -0.045em tracking; Geist Mono uppercase labels at 0.1em.
- Legends on rules, a left margin column for section identity, ruled rows for content.
- Pixel portraits (112x140 cells) in amber crop-mark frames with mono annotation notes, under a round glass lens.

## Colors

A dark, cool, almost colourless sheet where saturated colour appears only as small, labelled marks.

### Primary
- **Status Green** (action-green): the one action colour. Fills the Email button, marks "Available now" with a pulsing square, draws the scan line, the focus outline, the caret, and underlines the email address. Its hover lightens to action-green-hover; text on it is the near-black action-ink.

### Secondary
- **Finding Coral** (finding-coral): findings and the claim. Finding IDs (F-01), the summary legend, the product exhibit and its hover, the catch-the-bug hint square.

### Tertiary
- **Exhibit Amber** (exhibit-amber): evidence and exhibits. Crop marks, target boxes, annotation notes, exhibit legends and IDs, the square bullets on evidence lists, the chronology section.
- **Research Blue** (research-blue): research and the bug counter. Research log rows, the "caught" count, the selected-work section, the caught-bug flash.

### Neutral
- **Bone** (bone): warm emphasis against the cool sheet. The second line of the display headline, the finding category tags (at 40% border), writing rows, the "wip" ref, text selection.
- **Report Ink** (ink): headings and emphasised body text.
- **Soft Graphite** (soft): ledes, secondary prose, meta text, inactive nav.
- **Dim Graphite** (dim): field labels, dates, footers, the default legend colour.
- **Sheet** (sheet): page and sheet background, legend and note backgrounds (so they cut the rule they sit on).
- **Well** (well): the recessed ground behind pixel thumbnails and section icons.
- **Bar** (bar): the fixed report bar, one step darker than the sheet.
- **Rule** / **Faint Rule** (rule, rule-faint): structural hairlines and inner row dividers.
- **Grid Line** (grid-line): the 1px lines of the 10px cell canvas and of its CSS mirror under overlays.

### Named Rules
**The Colour Declares Type Rule.** An accent says what an element is: coral is a finding, amber is evidence or an exhibit, green is status or action, blue is research, bone is emphasis or writing. Each component reads its accent from a single local colour variable set on the row or section; never pick an accent for looks.

**The One Filled Door Rule.** Only the action button is a solid field of colour. Every other use of an accent is a 1px outline, a 7px square, a hairline underline or text.

## Typography

**Display Font:** Geist (with system-ui, -apple-system, Segoe UI, sans-serif)
**Body Font:** Geist
**Label/Mono Font:** Geist Mono (with ui-monospace, Menlo, monospace)

**Character:** One family, two registers. Geist states the case in large, dense, tightly tracked semibold; Geist Mono files the facts in small uppercase labels and tabular figures.

### Hierarchy
- **Display** (600, clamp to 118px, 0.9): the one headline at the top of the report; its second line turns bone.
- **Headline** (600, clamp to 80px, 0.96): each section heading in the report body; the all-work sheet uses up to 96px.
- **Title** (600, 24 to 36px, 1.08): finding statements, timeline employers (22 to 30px), the featured exhibit (34 to 60px), log titles (17 to 21px at -0.02em).
- **Lede** (400, 17 to 20px, 1.5, soft): one paragraph under each heading, capped at 34 to 38em. The opening lede runs 18 to 22px.
- **Body** (400, 17px, 1.55; 16px under 560px): evidence lists and prose at 15.5px, capped near 62ch.
- **Label** (Mono 500, 11.5px, 0.1em, uppercase, dim): field labels, legends, attachment numbers.
- **Data** (Mono 500, 12 to 13.5px, tabular): field values, IDs, dates, refs, counts, tags, notes.

### Named Rules
**The Mono Field Rule.** Anything a form would print (a label, an ID, a date, a count, a ref, a status) is Geist Mono. Statements and prose are Geist. Never set a heading in mono or a field label in sans.

**The Tight Statement Rule.** Display, headline and title sizes are always weight 600 with negative tracking (-0.02 to -0.045em) and line-height at or below 1.1. No light or regular weights at heading sizes.

## Layout

The page is one sheet inset from the viewport by the inset token and bordered by a rule. The first screen is a full-height case block: a header strip of labelled fields across the top, a two-column body (summary left, a portrait exhibit right at roughly 37% with a 340px floor), and a ruled action strip across the bottom whose first cell aligns with the margin column below.

Every later part is a report section: a left margin column (210 to 268px) holding the section number, its name and a 96px pixel icon, sticky at 96px from the top, and a body with section padding (40 to 88px top). Content inside sections is ruled rows: findings as a three-column grid (112px ID, statement, evidence), the chronology as full-width commit rows with an 80px graph gutter, the evidence log as a five-column row with a 4:3 thumbnail. Gaps run on 8 and 10px; panel padding is fluid (20 to 48px).

Behind everything a canvas draws a 10px cell grid with a soft radial vignette. Breakpoints: at 1280px the lowest-priority header fields drop; at 1100px the bar's section links and the scroll rail go; at 900px everything collapses to one column, the margin column becomes a horizontal strip with a 44px icon, and the report bar moves to the bottom edge and stays, so the email action is always one tap away.

**The Ruled Row Rule.** Content is entered as rows divided by hairlines, never as a grid of separate boxes. Each child carries its own padding; the rules are cell edges.

## Elevation & Depth

Flat. The sheet has no shadows; depth comes from the live cell canvas showing through behind the transparent sheet, from slightly darker wells under pixel imagery, and from the fixed bar sitting one tone below the sheet. The only box-shadow in the system is a 2px inset underline marking the current nav link. Overlays (the scan reveal, the all-work dialog) reuse the same 10px grid in CSS over the sheet colour rather than blurring or dimming.

**The Paper Rule.** Surfaces never lift. If something needs separation, give it a hairline or a darker well, not a shadow.

## Shapes

Square everywhere: zero radius on buttons, tags, fields, frames, thumbnails, dialogs and the bar. Bullets, status lights and legend keys are 6 to 8px filled squares, never dots. Exhibit frames carry four amber L-shaped crop marks (22px, 2px stroke) set 8px outside the corners; target boxes are 1.5px amber rectangles. Pixel imagery is drawn in whole cells and rendered pixelated; frames snap to whole portrait cells so every block is the same size. The one round form in the system is the glass lens over each portrait: a circle 17% of the frame width, its roundness reading as an optical object laid on the sheet, not as a component shape. Icons are authored SVG on a 20-unit box, 1.7 stroke, square caps.

## Components

### Buttons
Square, ruled, plain until they are the action.
- **Shape:** square (0px), 48px tall, 1px rule border, Geist 600 at 15px, 10px gap to a trailing arrow icon.
- **Ruled:** transparent with ink text; hover lifts the fill to 5% white and the border to 24% white, and the arrow nudges 3px in its direction.
- **Action:** filled Status Green with action-ink text and matching border; hover goes to action-green-hover. Reserved for emailing.
- **In strips:** inside the action strip and the bar, buttons lose their own border and take a left rule instead, filling the full cell height.
- **Focus:** 2px green outline, 3px offset, on every interactive element.

### Legends
A mono uppercase label sitting on a box's top rule, centred on the line, with a sheet-coloured background that cuts the rule behind it. Colour comes from the box's accent (dim by default). It names the box it sits on; it is never a free line of text above a heading.

### Header Field Strip
A row of field cells divided by vertical rules: a dim label over a mono value. The subject's name breaks to Geist 600; status is green with a 2.4s stepped pulse square; the attachment cell pushes to the far right with a hover tint. Fields wrap two-up on phones.

### Indicator Tags
Mono 12.5px in a 1px outline box of the tag's own accent, accent-coloured text, no fill. They summarise evidence in the summary, one accent per claim type. Finding category tags use the same form at 11px uppercase in bone with a 40% bone border.

### Margin Column
Section number in mono, accent-coloured; section name in Geist 600 at 20px; a 96px pixel icon in a well with a faint rule. Sticky on desktop, horizontal strip on mobile.

### Findings Rows
A coral mono ID with its category tag, a title-size statement, and an evidence list whose bullets are 7px amber squares and whose key figures are ink 600.

### Git-Log Timeline
Commit rows over a pixel commit graph drawn in cells. Each row shows a mono ref box and commit message, the employer in title type, a role line, dates, and a tenure bar of 9px accent cells. Rows expand on click (grid-row transition, .45s) with a plus icon that rotates 45 degrees; inside, stat cells show mono figures in the row's accent.

### Exhibit Frames
A 4:5 pixel portrait (112x140 cells, 32-colour palette) with amber crop marks, an amber target box and a mono amber note on a sheet background ("signal" progress, identity notes). Resolved portraits keep a faint cell grid over them (grid-line at 5% alpha). On the lead exhibit the portrait first arrives as posterised noise in 2x2-portrait-cell blocks (56x70 noise cells on the same grid) and resolves top to bottom while the progress note counts up.

### Glass Lens
A round glass sphere floating over each portrait, radius 17% of the frame width. Inside it a smoothed 224x280 layer of the same portrait is refracted through 22 concentric clipped discs, magnified about 1.32x at the centre and compressed toward the rim. The glass is drawn, not shadowed: a dark inner rim band, a bright white rim with a faint pink and cyan chromatic fringe, a top-left specular arc and dot, and a faint bottom-right reflection arc. It wanders on a spring, hops to the face every few seconds with a 6% scale pulse, and follows the pointer on hover. No drop shadow.

### Evidence Log
Ruled rows: amber exhibit ID, a 4:3 pixel thumbnail in a well, title and summary, a mono type label in the row's accent, an external-link arrow. Hover tints the row 3.5% white, turns the title and thumbnail border to the accent, and nudges the arrow up-right.

### Report Bar
A fixed 56px strip in the bar tone with rule-divided cells: case ID, current section (number in its accent), nav links, a blue caught-bug counter, and the action button at the far right. It slides in once the case header leaves the viewport; on phones it sits fixed at the bottom.

## Do's and Don'ts

### Do:
- **Do** set every accent through the element's local colour variable and let the accent say what the thing is (coral finding, amber evidence, green status and action, blue research, bone emphasis).
- **Do** divide space with 1px hairlines at 12% white for structure and 7% white for inner rows.
- **Do** label a box with a legend sitting on its own rule, or with the margin column; field facts go in Geist Mono.
- **Do** build imagery in whole pixel cells and render it pixelated, inside amber crop-mark frames when it is an exhibit; the glass lens is the only place a smoothed layer shows.
- **Do** reveal each part of the page once with the green scan line using cubic-bezier(.16,1,.3,1), and drop every reveal, parallax and smoothing under prefers-reduced-motion.
- **Do** keep the email action reachable from every scroll position (bar on desktop, fixed bottom bar on phones).

### Don't:
- **Don't** round a corner anywhere.
- **Don't** add drop shadows or offset shadows; the sheet is paper.
- **Don't** put a label line above a heading as a kicker or eyebrow; labels sit on rules or in the margin column.
- **Don't** fill a surface with an accent other than the green action button.
- **Don't** ship full-resolution photographs of the subject; portraits are cell portraits, with only the small lens layer smoothed.
- **Don't** set content in separate floating cards; enter it as ruled rows.
- **Don't** stand in Unicode glyphs or emoji for icons; icons are authored SVG with square caps.
