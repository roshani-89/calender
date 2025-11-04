export function getDaysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

export function getFirstDayOfMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
}

export function getWeekDays(date: Date): Date[] {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day // adjust when day is Sunday

  const sunday = new Date(d.setDate(diff))
  const days: Date[] = []

  for (let i = 0; i < 7; i++) {
    const newDate = new Date(sunday)
    newDate.setDate(sunday.getDate() + i)
    days.push(newDate)
  }

  return days
}
