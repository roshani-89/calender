"use client"

import type React from "react"

import type { CalendarEvent } from "@/hooks/use-calendar-state"
import { getDaysInMonth, getFirstDayOfMonth } from "@/lib/calendar-utils"
import { EventBadge } from "./event-badge"
import { cn } from "@/lib/utils"

interface MonthViewProps {
  currentDate: Date
  events: CalendarEvent[]
  onDateClick: (date: Date) => void
  onEventClick: (e: React.MouseEvent, event: CalendarEvent) => void
  selectedDate: Date | null
}

export function MonthView({ currentDate, events, onDateClick, onEventClick, selectedDate }: MonthViewProps) {
  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days: (number | null)[] = Array(firstDay).fill(null)

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const getEventsForDate = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return events.filter((event) => {
      const eventDate = event.date instanceof Date ? event.date : new Date(event.date)
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      )
    })
  }

  const isToday = (day: number) => {
    const today = new Date()
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    )
  }

  const isSelected = (day: number) => {
    if (!selectedDate) return false
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    return (
      date.getFullYear() === selectedDate.getFullYear() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getDate() === selectedDate.getDate()
    )
  }

  return (
    <div className="p-4 sm:p-6 bg-background">
      <div className="rounded-lg border border-border overflow-hidden bg-card">
        {/* Week day headers */}
        <div className="grid grid-cols-7 border-b border-border bg-muted">
          {weekDays.map((day) => (
            <div key={day} className="p-3 text-center text-sm font-semibold text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => (
            <div
              key={index}
              className={cn(
                "min-h-32 border-r border-b border-border p-2 cursor-pointer transition-colors hover:bg-muted/50",
                day === null && "bg-muted/30",
                isToday(day) && "bg-blue-50 dark:bg-blue-950/30",
                isSelected(day) && "bg-blue-100 dark:bg-blue-900/50",
              )}
              onClick={() => day && onDateClick(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
            >
              {day && (
                <div className="h-full flex flex-col">
                  <span
                    className={cn(
                      "text-sm font-semibold mb-1",
                      isToday(day) && "text-blue-600 dark:text-blue-400",
                      day === null && "text-muted-foreground",
                    )}
                  >
                    {day}
                  </span>
                  <div className="space-y-1 flex-1 overflow-hidden">
                    {getEventsForDate(day)
                      .slice(0, 2)
                      .map((event) => (
                        <EventBadge key={event.id} event={event} onClick={(e) => onEventClick(e, event)} />
                      ))}
                    {getEventsForDate(day).length > 2 && (
                      <div className="text-xs text-muted-foreground px-2 py-1">
                        +{getEventsForDate(day).length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
