# Editing news

Each entry in `news.yaml` has a permanent `slug`. Keep it unchanged when editing the title: homepage links, news links, detail pages, and the sitemap all use this value. The existing public URLs have been preserved, including their long identifiers.

For a full article, set `body` to the exact markdown filename in `content/news/`, including `.md`. The filename can differ from the URL. Missing or empty mapped articles fail the build instead of displaying a placeholder.

For a short announcement, omit `body`. The detail page displays the existing `summary`, date, location, gallery, and source link where provided. The listing labels this action “View announcement.” Do not create a duplicate markdown file just to repeat the summary.

Every entry needs a unique lowercase, hyphen-separated slug and a nonempty summary. Use only a filename in `body`, not a path. Keep external source links in the existing `link` field.

After editing, run the production build, then `npm run check:news` (or `pnpm check:news`). This checks the generated news bodies, internal links, source links, galleries, homepage links, sitemap entries, and unmapped markdown files. Run against a fresh build so generated output matches the content.
