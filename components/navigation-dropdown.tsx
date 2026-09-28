"use client"

import Link from "next/link"
import { useEffect, useId, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"
import type { HeaderContent } from "@/lib/content"

export function NavigationDropdown({ link }: { link: HeaderContent["links"][number] }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!open) return
    const closeOutside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("pointerdown", closeOutside)
    return () => document.removeEventListener("pointerdown", closeOutside)
  }, [open])

  return (
    <div ref={root} className="relative flex items-center gap-1"
      onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false) }}
      onKeyDown={event => {
        if (event.key === "Escape" && open) {
          event.preventDefault()
          event.stopPropagation()
          setOpen(false)
          trigger.current?.focus()
        }
      }}>
      <Link href={link.href} className="text-sm font-medium text-muted-foreground hover:text-primary-text">{link.name}</Link>
      <button ref={trigger} type="button" aria-label={`${link.name} topics`} aria-expanded={open} aria-controls={id}
        onClick={() => setOpen(value => !value)} className="flex h-8 w-8 items-center justify-center rounded text-foreground">
        <ChevronDown aria-hidden="true" className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <div id={id} hidden={!open} className="absolute left-0 top-full z-50 min-w-[18rem] pt-3">
        <div className="rounded-lg border border-border bg-background p-2 shadow-lg">
          {link.children?.map(child => (
            <Link key={child.href} href={child.href} onClick={() => setOpen(false)}
              className="block rounded px-3 py-2 text-sm text-foreground hover:bg-secondary hover:text-primary-text">
              {child.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
