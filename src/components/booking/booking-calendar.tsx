'use client'

import { useState, useEffect } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isToday, isSameMonth } from 'date-fns'
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react'

interface TimeSlot {
  startTime: string
  endTime: string
  available: boolean
}

interface CalendarDay {
  date: string
  day: number
  isCurrentMonth: boolean
  isToday: boolean
  availableSlots: number
  slots: TimeSlot[]
}

interface BookingCalendarProps {
  doctorId: string
  onDateSelect?: (date: string, slots: TimeSlot[]) => void
  selectedDate?: string
}

export default function BookingCalendar({ doctorId, onDateSelect, selectedDate }: BookingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const weekDays = ['Ня', 'Да', 'Мя', 'Лх', 'Пү', 'Ба', 'Бя']

  const fetchCalendarData = async () => {
    try {
      setLoading(true)
      const monthStart = startOfMonth(currentMonth)
      const monthEnd = endOfMonth(monthStart)
      
      const response = await fetch(
        `/api/availability/${doctorId}?startDate=${format(monthStart, 'yyyy-MM-dd')}&endDate=${format(monthEnd, 'yyyy-MM-dd')}`
      )
      
      if (!response.ok) throw new Error('Failed to fetch calendar data')
      
      const data = await response.json()
      
      // Transform data to calendar days
      const days = eachDayOfInterval({ start: monthStart, end: monthEnd }).map(day => {
        const dateStr = format(day, 'yyyy-MM-dd')
        const dayData = data.find((d: any) => d.date === dateStr) || { slots: [] }
        
        return {
          date: dateStr,
          day: day.getDate(),
          isCurrentMonth: isSameMonth(day, monthStart),
          isToday: isToday(day),
          availableSlots: dayData.availableSlots || 0,
          slots: dayData.slots || []
        }
      })
      
      setCalendarDays(days)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (doctorId) {
      fetchCalendarData()
    }
  }, [doctorId, currentMonth])

  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  const handleDateClick = (day: CalendarDay) => {
    if (day.availableSlots > 0) {
      onDateSelect?.(day.date, day.slots)
    }
  }

  const monthStart = startOfMonth(currentMonth)
  const startDay = getDay(monthStart)

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-lg font-medium text-gray-900">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg mx-6 mt-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Week days header */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden mb-4">
          {weekDays.map(day => (
            <div key={day} className="bg-gray-50 p-2 text-center text-xs font-medium text-gray-700">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: startDay }).map((_, index) => (
            <div key={`empty-${index}`} className="bg-white p-2 h-20"></div>
          ))}

          {/* Actual calendar days */}
          {calendarDays.map((day) => (
            <div
              key={day.date}
              onClick={() => handleDateClick(day)}
              className={`
                bg-white p-2 h-20 cursor-pointer transition-colors relative
                ${!day.isCurrentMonth ? 'opacity-50' : ''}
                ${day.isToday ? 'bg-blue-50' : ''}
                ${day.availableSlots > 0 ? 'hover:bg-blue-50' : 'cursor-not-allowed opacity-60'}
                ${selectedDate === day.date ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
              `}
            >
              <div className="flex flex-col h-full">
                <span className={`
                  text-sm font-medium mb-1
                  ${day.isToday ? 'text-blue-600' : 'text-gray-900'}
                  ${!day.isCurrentMonth ? 'text-gray-400' : ''}
                `}>
                  {day.day}
                </span>
                
                {day.availableSlots > 0 ? (
                  <div className="flex-1 flex flex-col justify-end">
                    <div className="flex items-center gap-1 text-xs text-blue-600">
                      <Clock className="w-3 h-3" />
                      <span>{day.availableSlots} цаг</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-xs text-gray-400">Боломжгүй</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-6 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
            <span>Сонгогдсон өдөр</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>
            <span>Боломжтой цагтай өдөр</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-50 border border-gray-200 rounded opacity-60"></div>
            <span>Боломжгүй өдөр</span>
          </div>
        </div>
      </div>
    </div>
  )
}
