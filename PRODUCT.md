# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML/CSS/JS: a single `index.html` plus assets, deployed to GitHub Pages, no build step. Lenis (smooth scroll) is loaded from a pinned CDN version. Interface sound uses `uisfx` (mechanical pack) through `sfx.js`, resolved by an import map to the same pinned version as `package.json`; npm is only used for its tests and checks (`npm test`, `npm run build`).

## Users

Founders and hiring leads at security startups who are looking for an early hire who can cover product, engineering and go-to-market. They arrive from a LinkedIn message, a referral or a resume link and decide within a minute whether to reach out. Recruiters scanning fast are a secondary audience. They need the work history and the resume one click away.

## Product Purpose

The personal portfolio of Mayank Joshi. It exists to get him hired into a founding engineer or product role at a security startup (remote or in India; available immediately). Success means the visitor sends an email (sayhi@mayankjoshi.dev) or a LinkedIn message.

## Positioning

"One person, the whole early team." He has built a security product end to end (RuleForge at TryHackMe: concept to monetisation, covering product, code, infrastructure and selling), and he comes from two years of hands-on detection engineering. A pure engineer or a pure PM can't honestly claim both halves.

## Operating Context

The visitor is a founder or hiring lead skimming between other tasks, usually on a laptop and sometimes on a phone. They compare the site against LinkedIn profiles and resumes. The detection-engineering world (SIEM, EDR, ATT&CK, detection rules, git logs, threat hunting) is the visitor's and the candidate's shared language.

## Capabilities and Constraints

- Sections: intro, what I do, work history (as a git-log style timeline), selected work and writing, and an all-work index (dialog), contact.
- The pixel bug field, shield figure and the "click a bug to catch it" counter are part of the identity and are kept.
- Must respect `prefers-reduced-motion`; must work at phone width.
- `resume.pdf` is linked at the repo root but **not yet provided** by the user.

## Brand Commitments

- Name: Mayank Joshi. Role line: "Security product builder".
- Pixel / cell-grid identity with pixel bugs and a shield; Geist and Geist Mono type (user chose to keep this DNA in the November 2026 rebuild).
- Voice: plain, first person, specific, no hype.

## Evidence on Hand

- RuleForge, Head of RuleForge at TryHackMe (UK, remote), Jan–Nov 2026: concept to monetisation, first engineering hire onward.
- OneCard: 100+ production detections, 40% more ATT&CK coverage.
- Bobble AI: SIEM, SOAR, EDR and SSO stood up from zero.
- Threat-intel internship: collection across 20+ deep and dark web sources.
- Research: XCSSET malware found in 40 public GitHub repositories via dorking; XCSSET 2025 analysis; scripts on GitHub.
- Writing on Medium: detection coverage, anatomy of a detection rule, what detectioneers do, AWS from GCP.
- Google Cloud Professional Cloud Security Engineer (Credly); TryHackMe profile.
- Photos of Mayank in `me/`. On 22 Nov 2026 the user asked for them to be blurred out, so the site shows them only as 56x70 pixel-art portraits (`assets/exhibit-a-px.png`, `assets/exhibit-b-px.png`); the real photographs never ship.
- Absent: testimonials, client logos, metrics beyond the above. Do not fabricate.

## Product Principles

1. The work history must be reachable fast. Founders bounce on decoration that delays proof.
2. Show, don't claim: real numbers, real artifacts, real links.
3. The pixel world should carry meaning (detection: bugs caught, signal out of noise), not just decorate the page.
4. Contact is always one action away.
