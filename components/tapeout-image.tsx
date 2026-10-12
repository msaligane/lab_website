import type { Tapeout } from "@/content/tapeouts"
import { tapeoutPresentation } from "@/content/tapeouts"
import { responsiveImage } from "@/lib/responsive-images"

/** Use individual chip assets where available; otherwise frame the original
 * timeline region without modifying the scientific figure or inventing imagery. */
export function TapeoutImage({ project, large = false }: { project: Tapeout; large?: boolean }) {
  const image = tapeoutPresentation[project.id]?.image
  const height = large ? 280 : 152
  if (image) {
    return (
      // The existing image pipeline supplies WebP variants and intrinsic dimensions.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        {...responsiveImage(image, `${height}px`, large ? 384 : 192)}
        alt={`${project.name} chip layout`}
        className="mx-auto h-full max-w-full object-contain"
        style={{ maxHeight: height }}
      />
    )
  }
  const { x, y, width, height: regionHeight } = project.region
  return (
    <div
      role="img"
      aria-label={`${project.name}: chip images from the lab timeline`}
      className="relative mx-auto w-full overflow-hidden bg-white"
      style={{ aspectRatio: `${width} / ${regionHeight}`, maxWidth: height * width / regionHeight }}
    >
      {/* Full resolution is necessary because this is a small region of the timeline. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        {...responsiveImage("/images/research/tapeouts.png", "1373px", 1373)}
        alt=""
        aria-hidden="true"
        className="absolute h-auto max-w-none"
        style={{ width: `${1373 / width * 100}%`, left: `${-x / width * 100}%`, top: `${-y / regionHeight * 100}%` }}
      />
    </div>
  )
}
