# Tapeout entries

The research gallery (`/research#tapeouts`) and the project pages
(`/tapeouts/<slug>`) are generated from this folder. One JSON file is one entry,
and the file name becomes the URL slug: `hbc-transceiver.json` →
`/tapeouts/hbc-transceiver`.

Entries are ordered newest publication first, then by title, so the grid and the
"featured" row stay stable without a separate order field.

## Fields

| Field | Required | Notes |
| --- | --- | --- |
| `category` | yes | Shown above the title on cards and project pages, e.g. `Biomedical sensing`. |
| `title` | yes | Entry heading. |
| `tagline` | yes | One short line used on the gallery card. |
| `description` | yes | Longer copy shown on the project page. |
| `page` | no | `false` marks a figure-only chip: it is drawn on the timeline but gets no project page, sitemap entry or card. Defaults to `true`. |
| `featured` | no | `true` also lists the entry in the homepage "Featured Tapeouts" row (three entries). |
| `cover` | no | Image for the card and social preview. Defaults to the first chip's `image`. |
| `authors` | yes | `[{ "credit": "First author", "name": "Anhang Li" }]`. Credits are labels, not claims about who led the tapeout. |
| `publications` | yes | `[{ title, venue, year, authors, credit, href, related? }]`. `related: true` marks a paper that is relevant without reporting this chip's measurements. |
| `resources` | no | "Explore further" links: `[{ "label": "Research overview", "href": "/research/…" }]`. |
| `chips` | yes | `[{ "image": "/images/gds/chip.png", "node": "16nm", "date": "2024-06", "figure": 16 }]`. |

### Chips

Each chip is one die image plus its technology node. `date` is a free-form
string (for example `2024` or `2024-06`) and should be **blank when unknown** —
an empty string is expected, not a guess. Values in this folder are either
confirmed by the lab or estimated from the chip's horizontal position on the
original timeline figure (`content/figures/tapeouts-source.svg`), whose year
labels are not evenly spaced — so an estimated month is approximate and should
be replaced once an exact tapeout date is known. Chips that are not drawn on
that figure stay blank.

One chip renders a single picture; two or more render the rotating cover flow on
the project page and in the gallery cards.

The timeline is generated from these files. A chip's `node` chooses its vertical
lane (`180/130nm`, `65nm`, `22nm FDSOI`, `12/16nm`) and its `date` chooses the
horizontal position, so adding an entry is enough to place it. The optional
`figure` index (position inside `content/figures/tapeouts-source.svg`) keeps the
original drawing's within-group stagger and overlap, so chips of one record sit
the way they do in the source figure instead of in a flat row. Chips of one entry
stay together and glow as a single group on hover; entries with `"page": false`
are drawn without any interaction (no glow, no card, no link) until a project
record exists.

Chip images must live under `public/`, and their WebP variants come from
`npm run images:generate` (see `content/IMAGE-EDITING.md`).
