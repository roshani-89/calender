"use client"

import type React from "react"

import type { CalendarEvent } from "@/hooks/use-calendar-state"
import { getWeekDays } from "@/lib/calendar-utils"
import { EventBadge } from "./event-badge"
import { cn } from "@/lib/utils"

interface WeekViewProps {
  currentDate: Date
  events: CalendarEvent[]
  onDateClick: (date: Date) => void
  onEventClick: (e: React.MouseEvent, event: CalendarEvent) => void
  selectedDate: Date | null
}

export function WeekView({ currentDate, events, onDateClick, onEventClick, selectedDate }: WeekViewProps) {
  const weekDays = getWeekDays(currentDate)
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const getEventsForDateAndHour = (date: Date, hour: number) => {
    return events.filter((event) => {
      const eventDate = event.date instanceof Date ? event.date : new Date(event.date)
      const eventStartHour = Number.parseInt(event.startTime.split(":")[0])
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate() &&
        eventStartHour === hour
      )
    })
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    )
  }

  const isSelected = (date: Date) => {
    if (!selectedDate) return false
    return (
      date.getFullYear() === selectedDate.getFullYear() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getDate() === selectedDate.getDate()
    )
  }

  return (
    <div className="p-4 sm:p-6 bg-background overflow-x-auto">
      <div className="rounded-lg border border-border overflow-hidden bg-card min-w-full">
        {/* Header with days */}
        <div className="grid grid-cols-8 border-b border-border bg-muted sticky top-0 z-10">
          <div className="p-3 text-xs font-semibold text-muted-foreground border-r border-border">Time</div>
          {weekDays.map((date, index) => (
            <div
              key={index}
              className={cn(
                "p-3 text-center text-xs font-semibold border-r border-border",
                isToday(date) && "bg-blue-50 dark:bg-blue-950/30",
                isSelected(date) && "bg-blue-100 dark:bg-blue-900/50",
              )}
            >
              <div className="text-muted-foreground">{date.toLocaleDateString("en-US", { weekday: "short" })}</div>
              <div className="font-bold text-foreground">{date.getDate()}</div>
            </div>
          ))}
        </div>

        {/* Time slots */}
        <div className="divide-y divide-border">
          {hours.map((hour) => (
            <div key={hour} className="grid grid-cols-8 border-b border-border hover:bg-muted/50 transition-colors">
              <div className="p-3 text-xs font-semibold text-muted-foreground border-r border-border bg-muted/30">
                {hour.toString().padStart(2, "0")}:00
              </div>
              {weekDays.map((date, dayIndex) => (
                <div
                  key={`${hour}-${dayIndex}`}
                  className={cn(
                    "min-h-16 p-1 border-r border-border cursor-pointer transition-colors hover:bg-muted/50 relative",
                    isToday(date) && "bg-blue-50/50 dark:bg-blue-950/20",
                    isSelected(date) && "bg-blue-100/50 dark:bg-blue-900/30",
                  )}
                  onClick={() => {
                    const dateWithTime = new Date(date)
                    dateWithTime.setHours(hour)
                    onDateClick(dateWithTime)
                  }}
                >
                  {getEventsForDateAndHour(date, hour).map((event) => (
                    <EventBadge key={event.id} event={event} onClick={(e) => onEventClick(e, event)} compact />
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
