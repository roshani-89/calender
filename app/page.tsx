"use client"

import type React from "react"

import { useState } from "react"
import { CalendarHeader } from "@/components/calendar/calendar-header"
import { MonthView } from "@/components/calendar/month-view"
import { WeekView } from "@/components/calendar/week-view"
import { EventModal } from "@/components/calendar/event-modal"
import { EventList } from "@/components/calendar/event-list"
import { EventSearch } from "@/components/calendar/event-search"
import { useCalendarState } from "@/hooks/use-calendar-state"

export default function CalendarApp() {
  const [view, setView] = useState<"month" | "week">("month")
  const [currentDate, setCurrentDate] = useState(new Date(2024, 10, 15))
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<any>(null)

  const { events, addEvent, updateEvent, deleteEvent } = useCalendarState()

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setEditingEvent(null)
    setIsModalOpen(true)
  }

  const handleEventClick = (e: React.MouseEvent, event: any) => {
    e.stopPropagation()
    setEditingEvent(event)
    setSelectedDate(event.date)
    setIsModalOpen(true)
  }

  const handleSaveEvent = (eventData: any) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, eventData)
    } else {
      addEvent(eventData)
    }
    setIsModalOpen(false)
    setEditingEvent(null)
  }

  const handleDeleteEvent = (eventId: string) => {
    deleteEvent(eventId)
    setIsModalOpen(false)
    setEditingEvent(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onViewChange={setView}
        onPrevMonth={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
        onNextMonth={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
        onToday={() => setCurrentDate(new Date())}
      />

      <div className="flex gap-4 p-4">
        {/* Main calendar view */}
        <main className="flex-1 overflow-auto">
          {view === "month" ? (
            <MonthView
              currentDate={currentDate}
              events={events}
              onDateClick={handleDateClick}
              onEventClick={handleEventClick}
              selectedDate={selectedDate}
            />
          ) : (
            <WeekView
              currentDate={currentDate}
              events={events}
              onDateClick={handleDateClick}
              onEventClick={handleEventClick}
              selectedDate={selectedDate}
            />
          )}
        </main>

        {/* Sidebar with event management */}
        <aside className="hidden lg:flex flex-col gap-4 w-80">
          <EventSearch
            events={events}
            onSelectEvent={(event) => {
              handleEventClick(new MouseEvent("click") as any, event)
            }}
          />
          <EventList events={events} onEventClick={handleEventClick} selectedDate={selectedDate} />
        </aside>
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingEvent(null)
          setSelectedDate(null)
        }}
        onSave={handleSaveEvent}
        onDelete={editingEvent ? () => handleDeleteEvent(editingEvent.id) : undefined}
        event={editingEvent}
        selectedDate={selectedDate}
      />
    </div>
  )
}
