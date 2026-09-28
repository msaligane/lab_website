import { responsiveMarkdown } from "@/lib/responsive-images"

type MarkdownProps = {
  html: string
  className?: string
}

export function Markdown({ html, className }: MarkdownProps) {
  return <div className={`markdown-content ${className ?? ""}`} dangerouslySetInnerHTML={{ __html: responsiveMarkdown(html) }} />
}
