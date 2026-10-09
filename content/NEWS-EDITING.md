# Editing news

Write news in a warm, personal voice where appropriate. For the PI's milestones, a concise headline such as “Honored to receive a 2026 DARPA Young Faculty Award” is welcome; avoid awkward wording such as “I received” or “My talk.” Name students and other researchers explicitly so credit is clear, and use “we” or “our” for the lab collectively. Keep the summary clear about who received the award or gave the talk. Keep headlines factual and concise, with acknowledgments or congratulations in the body when useful.

Preserve the distinction between an invitation or scheduled event and a confirmed completed activity. Describe research goals as goals, and distinguish cloud credits from cash funding. Apply the same voice to the summary and any linked article.

Use a single exclamation mark for celebrations, welcomes, congratulations, and personal thanks. Keep technical descriptions and informational talk or publication headlines neutral; avoid repeated exclamation marks.

The homepage shows the four most recent entries under “Latest from the Lab,” with an “All news” link to the complete archive. Keep technical details in summaries and specific acknowledgments in articles rather than crowding headlines.

Each entry in `news.yaml` has a permanent `slug`. Keep it unchanged when editing the title: homepage links, news links, detail pages, and the sitemap all use this value. The existing public URLs have been preserved, including their long identifiers.

For a full article, set `body` to the exact markdown filename in `content/news/`, including `.md`. The filename can differ from the URL. Missing or empty mapped articles fail the build instead of displaying a placeholder.

For a short announcement, omit `body`. The detail page displays the existing `summary`, date, location, gallery, and source link where provided. The listing labels this action “View announcement.” Do not create a duplicate markdown file just to repeat the summary.

Every entry needs a unique lowercase, hyphen-separated slug and a nonempty summary. Use only a filename in `body`, not a path. Keep external source links in the existing `link` field.

After editing, run the production build, then `npm run check:news` (or `pnpm check:news`). This checks the generated news bodies, internal links, source links, galleries, homepage links, sitemap entries, and unmapped markdown files. Run against a fresh build so generated output matches the content.
