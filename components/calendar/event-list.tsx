"use client"

import type React from "react"
import type { CalendarEvent } from "@/hooks/use-calendar-state"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

interface EventListProps {
  events: CalendarEvent[]
  onEventClick: (e: React.MouseEvent, event: CalendarEvent) => void
  selectedDate: Date | null
}

export function EventList({ events, onEventClick, selectedDate }: EventListProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  // Sort events by date and time
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = a.date instanceof Date ? a.date : new Date(a.date)
    const dateB = b.date instanceof Date ? b.date : new Date(b.date)
    if (dateA.getTime() !== dateB.getTime()) {
      return dateA.getTime() - dateB.getTime()
    }
    return a.startTime.localeCompare(b.startTime)
  })

  const upcomingEvents = sortedEvents.filter((event) => {
    const eventDate = event.date instanceof Date ? event.date : new Date(event.date)
    return eventDate >= new Date()
  })

  const pastEvents = sortedEvents.filter((event) => {
    const eventDate = event.date instanceof Date ? event.date : new Date(event.date)
    return eventDate < new Date()
  })

  return (
    <div className="w-full max-w-xs bg-card border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 bg-muted/50 hover:bg-muted transition-colors"
        aria-label={isExpanded ? "Collapse events list" : "Expand events list"}
      >
        <h3 className="font-semibold text-foreground">Events</h3>
        <ChevronDown
          className="w-5 h-5 transition-transform"
          style={{
            transform: isExpanded ? "rotate(0)" : "rotate(-90deg)",
          }}
        />
      </button>

      {isExpanded && (
        <div className="divide-y divide-border max-h-96 overflow-y-auto">
          {upcomingEvents.length > 0 ? (
            <>
              <div className="p-4">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Upcoming</h4>
                <div className="space-y-2">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="p-2 rounded border border-border hover:bg-muted transition-colors">
                      <div className="flex items-start gap-2">
                        <div
                          className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 ${event.color}`}
                          aria-label={`Color indicator for ${event.title}`}
                        />
                        <button
                          onClick={(e) => onEventClick(e, event)}
                          className="flex-1 text-left hover:opacity-70 transition-opacity"
                          aria-label={`${event.title} - ${event.startTime}`}
                        >
                          <div className="text-sm font-medium text-foreground truncate">{event.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {event.date instanceof Date
                              ? event.date.toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })
                              : ""}
                            {!event.allDay && ` at ${event.startTime}`}
                          </div>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {pastEvents.length > 0 && (
                <div className="p-4">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 opacity-50">
                    Past Events
                  </h4>
                  <div className="space-y-2 opacity-60">
                    {pastEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className="p-2 rounded border border-border bg-muted/30 text-xs text-muted-foreground"
                      >
                        <div className="truncate font-medium">{event.title}</div>
                        <div>
                          {event.date instanceof Date
                            ? event.date.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })
                            : ""}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-4 text-center text-muted-foreground text-sm">No upcoming events</div>
          )}
        </div>
      )}
    </div>
  )
}
