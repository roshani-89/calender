"use client"

import { useState, useMemo } from "react"
import type { CalendarEvent } from "@/hooks/use-calendar-state"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"

interface EventSearchProps {
  events: CalendarEvent[]
  onSelectEvent: (event: CalendarEvent) => void
}

export function EventSearch({ events, onSelectEvent }: EventSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return []
    const query = searchQuery.toLowerCase()
    return events.filter(
      (event) => event.title.toLowerCase().includes(query) || event.description?.toLowerCase().includes(query),
    )
  }, [searchQuery, events])

  return (
    <div className="relative w-full max-w-sm">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-10 pr-10"
          aria-label="Search events"
          aria-autocomplete="list"
          aria-expanded={isOpen && filteredEvents.length > 0}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-muted rounded transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} aria-label="Close search" />

          {/* Results */}
          {filteredEvents.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
              <div className="divide-y divide-border">
                {filteredEvents.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => {
                      onSelectEvent(event)
                      setSearchQuery("")
                      setIsOpen(false)
                    }}
                    className="w-full text-left p-3 hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                    role="option"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 ${event.color}`} />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground truncate">{event.title}</div>
                        {event.description && (
                          <div className="text-xs text-muted-foreground truncate">{event.description}</div>
                        )}
                        <div className="text-xs text-muted-foreground mt-1">
                          {event.date instanceof Date
                            ? event.date.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : ""}{" "}
                          {!event.allDay && `at ${event.startTime}`}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {searchQuery && filteredEvents.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 p-3 text-center text-sm text-muted-foreground">
              No events found matching "{searchQuery}"
            </div>
          )}
        </>
      )}
    </div>
  )
}
