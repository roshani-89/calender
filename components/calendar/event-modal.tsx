"use client"

import { useState, useEffect } from "react"
import type { CalendarEvent } from "@/hooks/use-calendar-state"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (eventData: Omit<CalendarEvent, "id">) => void
  onDelete?: () => void
  event?: CalendarEvent | null
  selectedDate: Date | null
}

export function EventModal({ isOpen, onClose, onSave, onDelete, event, selectedDate }: EventModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [startTime, setStartTime] = useState("09:00")
  const [endTime, setEndTime] = useState("10:00")
  const [allDay, setAllDay] = useState(false)
  const [color, setColor] = useState("bg-blue-500")

  const colors = ["bg-blue-500", "bg-red-500", "bg-green-500", "bg-purple-500", "bg-yellow-500", "bg-pink-500"]

  useEffect(() => {
    if (event) {
      setTitle(event.title)
      setDescription(event.description || "")
      setStartTime(event.startTime)
      setEndTime(event.endTime)
      setAllDay(event.allDay || false)
      setColor(event.color)
    } else {
      setTitle("")
      setDescription("")
      setStartTime("09:00")
      setEndTime("10:00")
      setAllDay(false)
      setColor("bg-blue-500")
    }
  }, [event, isOpen])

  const handleSave = () => {
    if (!title.trim()) return

    const eventData: Omit<CalendarEvent, "id"> = {
      title,
      description,
      date: selectedDate || new Date(),
      startTime,
      endTime,
      color,
      allDay,
    }

    onSave(eventData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-lg w-full max-w-sm border border-border">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">{event ? "Edit Event" : "New Event"}</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded transition-colors" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Event Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add event title..."
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground placeholder:text-muted-foreground"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add description..."
              className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground placeholder:text-muted-foreground resize-none"
              rows={3}
            />
          </div>

          {/* All Day Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="all-day"
              checked={allDay}
              onChange={(e) => setAllDay(e.target.checked)}
              className="w-4 h-4 rounded border-border"
            />
            <label htmlFor="all-day" className="text-sm font-medium text-foreground cursor-pointer">
              All Day
            </label>
          </div>

          {/* Time slots */}
          {!allDay && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Start Time</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">End Time</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                />
              </div>
            </div>
          )}

          {/* Color picker */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">Color</label>
            <div className="flex gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full ${c} ${color === c ? "ring-2 ring-offset-2 ring-foreground" : "opacity-70 hover:opacity-100"} transition-all`}
                  aria-label={`Color ${c}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t border-border">
          {event && onDelete && (
            <Button variant="destructive" onClick={onDelete} className="flex-1">
              Delete
            </Button>
          )}
          <div className="flex gap-2 flex-1">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!title.trim()} className="flex-1">
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
