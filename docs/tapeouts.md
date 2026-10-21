# Chip gallery and project pages

`components/tapeouts-section.tsx` is shared by the homepage and research page.
The homepage shows the entries marked `featured`; Research shows every entry in
`content/tapeouts`.
Cards navigate to shareable, server-rendered `/tapeouts/[slug]` project pages.
These links and the timeline disclosure work without client JavaScript.

Each entry is one JSON file in `content/tapeouts`; the file name is the slug and
its schema is documented in `content/tapeouts/README.md`. Chip dates are blank
unless known. Some `YYYY-MM` values in the folder were confirmed by the lab;
the rest were estimated from each chip's position on the original timeline
figure and should be replaced as exact tapeout dates are confirmed. `lib/tapeouts.ts` reads
the folder at build time, validates the records, and sorts them newest
publication first so the grid order is deterministic. Entries carry category,
title, tagline, description, authors, publications, "explore further" resources
and a list of chips; `featured: true` adds an entry to the homepage row and
`cover` sets the card/social image (defaulting to the first chip).

A record with more than one chip renders a cover-flow carousel in
`components/chip-gallery.tsx` on the project page and in the gallery cards. It
advances every 4.5 seconds, holds while keyboard focus is inside it, and never
rotates for visitors who prefer reduced motion. Card previews are decorative and
hidden from assistive technology; the project-page gallery exposes buttons, dots
and a live caption instead.

`public/images/gds/raw` is the bitmap inventory behind the figure:
`scripts/extract-svg-bitmaps.mjs` extracts every embedded chip from
`content/figures/tapeouts-source.svg` and records its size, declared geometry
and hash in `raw/manifest.json`. Records that need a single picture of several
dies are composed from those bitmaps with `scripts/build-chip-collage.mjs`.
Its default `figure` layout reads the placements from the figure's own
transform matrices, so relative sizes, overlaps and stacking order match the
source figure; `--layout=side-by-side` instead puts the chips in a row at a
common height, in the order given:

```sh
node scripts/build-chip-collage.mjs public/images/gds/cryogenic-open-silicon.png 3 5 6 7 10
node scripts/build-chip-collage.mjs public/images/gds/openfasoc-generators.png 8 9 --layout=side-by-side
```

Composite output is a normal asset: run `npm run images:generate` afterwards to
refresh the WebP variants and `lib/image-manifest.json`.

## Timeline figure

The figure at the bottom of Research is generated from the JSON entries, not
from a hand-exported file:

```sh
npm run timeline:build
```

`scripts/build-timeline.mjs` reads every entry in `content/tapeouts`, derives the
vertical lane from each chip's technology node and the horizontal position from
its date, and packs an entry's chips together in two rows per lane. Chips that
carry a `figure` index reuse the source figure's relative offset inside their
group, so a multi-chip record keeps the original stagger and overlap instead of
a flat row. It also
measures each image's content box (transparent or background margins trimmed) so
the picture, the hover target and the glow cover only the die. The result is
`content/figures/timeline-layout.json`.

`components/timeline-figure.tsx` renders that layout as an inline SVG with an
HTML interaction layer on top. The figure is rendered wider than its column and
sits in a horizontal scroller (keyboard focusable, native touch panning) so the
chips stay legible without shrinking the whole timeline to fit. Only entries with a project page are interactive:
hovering or focusing a chip lights up the union of every chip in that entry — a
single blurred silhouette, so overlaps never draw interior outlines — and shows
an information card; activating it opens the project page. Figure-only chips
(`"page": false`) are inert: no glow, no card, no link.

## Attribution and dates

- Authorship credits come from each entry's `authors` list. Publication first
  authorship does not establish who led a tapeout, and no project leads are
  claimed.
- Publication years and tapeout dates are separate. Dates estimated from the
  figure are approximate; the graphic places CICC 2026 work near 2024, so do not
  read those positions as exact tapeout dates.
- A chip `node` such as `180/130nm` identifies the figure's combined technology
  lane, not a confirmed process for that individual chip.
- `related: true` identifies relevant research without claiming that the paper
  reports measured results for the pictured die.
- Preserve the equal-contribution credit for Qirui Zhang / Wenbo Duan and
  Guanchen Tao / Junyi Luo.

## Sources checked

- Existing research pages, publication catalog, and the source timeline figure.
- Temperature sensor: DOI 10.1109/LSSC.2022.3188925, author-hosted PDF:
  https://blaauw.engin.umich.edu/wp-content/uploads/sites/342/2022/09/An-Open-Source-and-Autonomous-Temperature-Sensor-Generator-Verified-With-64-Instances-in-SkyWater-130-nm-for-Comprehensive-Design-Space-Exploration.pdf
- Digital LDO: DOI 10.1109/ISCAS46773.2023.10181884; conference paper:
  https://confcats-event-sessions.s3.amazonaws.com/iscas23/papers/2273.pdf
- Cryogenic modeling: DOI 10.1109/BCICTS54660.2023.10310944.
- Open silicon at 4 K: DOI 10.1109/MSSC.2024.3385734; Brown-hosted paper:
  https://bpb-us-w2.wpmucdn.com/sites.brown.edu/dist/c/328/files/2024/07/2024IEEE-SSCMv16p39.pdf
- Cryogenic DC–DC: DOI 10.1109/LSSC.2023.3349129, SSCL volume 7 (2024).
  The DOI's 2023 suffix is not the journal publication year.
- Open Se Cura: DOI 10.1109/MSSC.2024.3382071; hardware-security research page.
- HBC and rDXE: local CICC 2026 paper PDFs and presentation slides.
  The rDXE title follows the PDF, including 11.16 μJ/token and “SLM”.
- CryoZip: https://arxiv.org/abs/2606.30805. Characterized technology and PPA
  analysis are not a claim of measured results for the depicted chip.
- OpenFASoC code: https://github.com/idea-fasoc/OpenFASOC.

## Details still needed from the lab

- Confirm project leads and exact tapeout years for every entry.
- Confirm individual chip-to-paper mappings within the cryogenic cluster.
- Identify the SSCM 2024 and SSCS SRP 2024 top-lane clusters precisely. Do not
  assign the LIG sensor paper from its year alone.
- Identify the unlabeled upper-right and purple lower-right layouts.
- Confirm publications/contributors for DNA, 65 nm body-coupled communication
  and Edge AI, eDRAM, and the probe-attack detector.
- Confirm that the 65 nm chip is SIMFONY before attaching its ESSERC paper.

The data intentionally leaves unsupported metadata absent. Designs without
publication records remain only in the bitmap inventory (`public/images/gds/raw`)
and the source figure; they get no placeholder gallery card or public route.

## Verification

Run the production build, TypeScript, `node scripts/check-tapeouts.mjs`, and the
existing news, metadata, image, and accessibility checks. The tapeout check
verifies featured/full gallery membership, all generated detail pages, citation
links and years, author credit, local resources, and sitemap coverage. Verify
that unknown project URLs return 404 and that navigation back to the Research
gallery works. Visual keyboard/mobile review requires a connected browser;
generated HTML checks do not establish visual correctness.
