# americanenergymoney.com

Static site. No build step, no dependencies, no framework. Push and it is live.

## Structure

```
index.html              Home
compute.html            Capital markets hub
compute-index.html      WTI — the Watt·Token Index
compute-futures.html    Futures spec
compute-bond.html       Bonds spec
compute-options.html    Options spec
infrastructure.html     Facilities + API/RPC
research.html           Thermoeconomics + corpus + paid reports
controller.html         Qi/Quai simulator

aem-theme.css           The entire design system
aem-theme.js            Scroll rail, reveal, video controls
images/                 12 files, all sized to their display dimensions
```

## Making changes

**Colour** — every colour resolves from tokens in `aem-theme.css`. Three themes
are defined: `paper` (live), `thermal`, `copper`. Switch with one attribute:

```html
<body data-theme="thermal">
```

**A new page** — copy any existing page, keep everything down to `<main>`, and
build the body from the component classes already in `aem-theme.css`:
`.band .seq`, `.bleed`, `.rise`, `.steps`, `.compare`, `.ctable`, `.cards`,
`.callout`, `.stats`, `.papers`, `.tiers`, `.reports`, `.panel`.

**A new section** — sections never paint their own background. The `.ground`
and `.grid-overlay` divs at the top of `<body>` are the single continuous
surface the whole page sits on. Adding a `background` to a section breaks that.

## Deploying to GitHub Pages

Push everything to the default branch, then Settings → Pages → deploy from
branch → root. Paths are relative and case-sensitive: `images/`, lowercase.

## Not included

`brief-01…09.png`, `shadow.png`, `shadow1.png`, `blockclock.png` and
`engineering.html` were dropped — the first three were the retired carousel,
and `engineering.html` duplicated `infrastructure.html` exactly.
