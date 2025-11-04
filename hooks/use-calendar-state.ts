"use client"

import { useState, useCallback } from "react"

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  date: Date
  startTime: string
  endTime: string
  color: string
  allDay?: boolean
}

export function useCalendarState() {
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "Team Standup",
      date: new Date(2024, 10, 15, 9, 0),
      startTime: "09:00",
      endTime: "09:30",
      color: "bg-blue-500",
      description: "Daily team sync",
    },
    {
      id: "2",
      title: "Design Review",
      date: new Date(2024, 10, 15, 14, 0),
      startTime: "14:00",
      endTime: "15:00",
      color: "bg-purple-500",
      description: "Review new designs",
    },
    {
      id: "3",
      title: "All Hands Meeting",
      date: new Date(2024, 10, 16),
      startTime: "10:00",
      endTime: "11:00",
      color: "bg-green-500",
      allDay: true,
    },
  ])

  const addEvent = useCallback((eventData: Omit<CalendarEvent, "id">) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: Date.now().toString(),
    }
    setEvents((prev) => [...prev, newEvent])
  }, [])

  const updateEvent = useCallback((id: string, eventData: Omit<CalendarEvent, "id">) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...eventData, id } : e)))
  }, [])

  const deleteEvent = useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }, [])

  return { events, addEvent, updateEvent, deleteEvent }
}
