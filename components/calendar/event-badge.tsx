"use client"

import type React from "react"

import type { CalendarEvent } from "@/hooks/use-calendar-state"
import { cn } from "@/lib/utils"

interface EventBadgeProps {
  event: CalendarEvent
  onClick: (e: React.MouseEvent) => void
  compact?: boolean
}

export function EventBadge({ event, onClick, compact }: EventBadgeProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left rounded px-2 py-1 text-xs font-medium text-white transition-transform hover:scale-105 active:scale-95",
        event.color,
        "opacity-90 hover:opacity-100 truncate",
        compact ? "text-xs" : "text-sm",
      )}
      aria-label={`${event.title} at ${event.startTime}`}
    >
      {event.allDay ? (
        <span className="truncate">{event.title}</span>
      ) : (
        <span className="truncate">
          {event.startTime} {event.title}
        </span>
      )}
    </button>
  )
}
