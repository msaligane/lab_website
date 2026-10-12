# Chip gallery and project pages

`components/tapeouts-section.tsx` is shared by the homepage and research page.
The homepage shows three featured chips; Research shows the seven entries with
documented publications and a disclosure containing the original full timeline.
Cards navigate to shareable, server-rendered `/tapeouts/[slug]` project pages.
These links and the timeline disclosure work without client JavaScript.

Edit project records and presentation settings in `content/tapeouts.ts`.
`components/tapeout-image.tsx` uses individual optimized chip assets when
available. Otherwise it frames the existing timeline region with CSS. Regions
use the original 1373 × 686 image coordinate system; the figure stays unchanged.

## Attribution and dates

- `projectLead` requires explicit lab confirmation. Publication first authorship
  does not establish who led a tapeout. No project leads have been inferred.
- Publication years and tapeout years are separate. The graphic places CICC 2026
  work near 2024; do not turn those positions into exact tapeout dates.
- `process` values ending in “lane” identify the combined technology lane, not
  a confirmed process for an individual chip.
- `related: true` identifies relevant research without claiming that the paper
  reports measured results for the pictured die.
- Preserve the equal-contribution credit for Qirui Zhang / Wenbo Duan and
  Guanchen Tao / Junyi Luo.

## Sources checked

- Existing research pages, publication catalog, and original timeline.
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

The data intentionally leaves unsupported metadata absent. Entries without
publication records stay in the source inventory and original timeline but do
not get placeholder gallery cards or public project routes.

## Verification

Run the production build, TypeScript, `node scripts/check-tapeouts.mjs`, and the
existing news, metadata, image, and accessibility checks. The tapeout check
verifies featured/full gallery membership, all generated detail pages, citation
links and years, author credit, local resources, and sitemap coverage. Verify
that unknown project URLs return 404 and that navigation back to the Research
gallery works. Visual keyboard/mobile review requires a connected browser;
generated HTML checks do not establish visual correctness.
