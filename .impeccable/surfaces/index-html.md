---
version: 1
slug: "index-html"
primary_target: "index.html"
related_targets: []
---

# Surface: index.html (portfolio home)

Mode: Persuade. Visitor: founder or hiring lead at a security startup, skimming in under a minute. Action: email Mayank (LinkedIn secondary). Proof: RuleForge 0→1, OneCard detections and ATT&CK coverage, Bobble AI stack from zero, CTI internship, XCSSET research, writing, GCP cert. Constraints: static single file, GitHub Pages, reduced motion, phone width, no resume.pdf yet.

## Direction contract

THESIS: The whole page is one incident report filed about Mayank, and its recommended action is "email him". It refuses the name-left/photo-right hero, numbered section kickers and rows of equal glass cards.

OWN-WORLD: Near-black report sheet (#0e1117) ruled in 1px hairlines over a 10px cell grid; bone (#e3ddcc) for emphasis; coral = finding, amber = evidence/exhibit, green = status/action, blue = research. Report header strip of labelled fields, § section markers in Geist Mono caps, severity-tag indicators in outline boxes, amber crop marks and annotation labels on exhibits. Geist display huge and tight; Geist Mono for every field label.

STORY: §1 Summary: who he is, one claim. §2 Selected work (exhibits): the product, research and writing, moved second at the user's request on Nov 22; each item opens a case-sheet pop-up (<template id="w-*"> content) with a Medium/GitHub button or none. §3 Findings: the proof as stacked numbered findings with evidence. §4 Chronology: the git-log work history. §5 Recommended action: hire, email. The visitor believes one person can cover the early team, and writes.

FIRST VIEWPORT: Full-width header strip (CASE MJ-2026, SUBJECT, ROLE, STATUS Available now in green, LOCAL TIME, ATTACHED resume). Left ~60%: "§1 Summary", h1 "One person, the whole early team." at ~118px/1440, the paragraph, then indicator tags. Right ~36%: Exhibit A, his photo as a 56x70-cell pixel portrait (user asked Nov 22 that real photos never ship) in a crop-marked frame. Bottom strip: "§5 Recommended action / Hire for a founding engineer or product role." with Work timeline and the green Email Mayank button at the right edge.

FORM: Case File, position 3 on the ordered list (dealt second), seed:88dd2b384688b149. Signature interaction: the exhibit resolves from cell noise to the pixel portrait as the shield sweeps it ("signal out of noise", progress annotation counts up); pixel bugs crawl the sheet and catching them files them into the report's counter. A glass sphere lens (user asked Nov 22; removed from the hero Exhibit A at the user's request, kept on Exhibit H) floats over the portrait, shows a sharper 84x105-cell layer, hops onto the face every few seconds and follows the pointer on hover. Motion grammar: every part enters as a scan, top to bottom, once; scroll itself is choreographed (user asked for Awwwards-style scroll): Lenis smoothing, hero depth parallax, headings settle from the right, Exhibit B frame opens once with scroll. Findings stay stacked rows: the user rejected a pinned sideways track on Nov 22.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
