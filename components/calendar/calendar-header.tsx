"use client"

import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CalendarHeaderProps {
  currentDate: Date
  view: "month" | "week"
  onViewChange: (view: "month" | "week") => void
  onPrevMonth: () => void
  onNextMonth: () => void
  onToday: () => void
}

export function CalendarHeader({
  currentDate,
  view,
  onViewChange,
  onPrevMonth,
  onNextMonth,
  onToday,
}: CalendarHeaderProps) {
  const monthYear = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  return (
    <header className="border-b border-border bg-card sticky top-0 z-10">
      <div className="flex items-center justify-between p-4 sm:px-6">
        <div className="flex items-center gap-4">
          <h1 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
            <Calendar className="w-6 h-6" />
            Calendar
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onToday}
            className="text-sm bg-transparent"
            aria-label="Go to today"
          >
            Today
          </Button>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={onPrevMonth} aria-label="Go to previous month">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <span className="min-w-40 text-center font-medium text-foreground">{monthYear}</span>
            <Button variant="ghost" size="sm" onClick={onNextMonth} aria-label="Go to next month">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          <div className="border-l border-border pl-4 flex gap-2">
            <Button
              variant={view === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => onViewChange("month")}
              aria-label="Switch to month view"
              aria-pressed={view === "month"}
            >
              Month
            </Button>
            <Button
              variant={view === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => onViewChange("week")}
              aria-label="Switch to week view"
              aria-pressed={view === "week"}
            >
              Week
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
