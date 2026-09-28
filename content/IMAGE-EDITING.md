# Website images

Keep original images in `public/images`. After adding or replacing a PNG, JPEG, or WebP, run `npm run images:generate` (or `pnpm images:generate`) and commit the generated files in `public/optimized` and `lib/image-manifest.json` with the original.

The generator uses Sharp to create responsive WebP versions. Research diagrams, publication figures, funding artwork, and the lab logo use lossless encoding; their largest variant retains the original dimensions. Photos use quality 84 at up to 1600 pixels wide. Decorative hero layers use quality 70 at up to 768 pixels wide. All versions preserve aspect ratio; originals are never overwritten.

Use `responsiveImage(originalPath, sizes)` in components. The helper supplies source candidates, intrinsic dimensions, asynchronous decoding, and lazy loading. Set `loading="eager"` only for above-the-fold artwork. Use a 192-pixel fallback for small avatars and logos. Choose `sizes` to match the actual layout.

The Markdown component also applies responsive sources to known local images while preserving alt text, styles, and original image URLs in `data-original-src`. Unrecognized or external images retain their original source. Galleries mount only the selected photo.

Run the production build and `check:news` after updating images. Inspect desktop/mobile renders, especially small labels in scientific figures. The optimized assets are static files; this approach does not depend on Next.js's runtime image optimizer.
